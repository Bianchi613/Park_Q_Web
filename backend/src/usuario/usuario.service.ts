import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EstacionamentoService } from '../estacionamento/estacionamento.service';
import { NotificacaoService } from '../notificacao/notificacao.service';
import { OperacaoService } from '../operacao/operacao.service';
import { Reserva } from '../reserva/reserva.model';
import { ReservaService } from '../reserva/reserva.service';
import { Vaga } from '../vaga/vaga.model';
import { VagaService } from '../vaga/vaga.service';
import { Usuario } from './usuario.model';
import { UsuarioRepository } from './usuario.repository';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly reservaService: ReservaService,
    private readonly vagaService: VagaService,
    private readonly estacionamentoService: EstacionamentoService,
    private readonly operacaoService: OperacaoService,
    private readonly notificacaoService: NotificacaoService,
  ) {}

  async create(data: Partial<Usuario>): Promise<Usuario> {
    await this.ensureEmailAvailable(data.email);
    this.normalizeRoleAndParking(data);

    if (!data.senha) {
      throw new BadRequestException('Senha e obrigatoria.');
    }

    data.senha = await bcrypt.hash(data.senha, 10);
    const usuario = await this.usuarioRepository.create(data);
    await this.notificacaoService.notificarCadastro({
      id: usuario.id,
      nome: usuario.nome,
    });
    return usuario;
  }

  async findAll(idEstacionamento?: number): Promise<Usuario[]> {
    if (idEstacionamento === undefined) {
      return this.usuarioRepository.findAll();
    }

    const parsedId = Number(idEstacionamento);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      throw new BadRequestException('id_estacionamento invalido.');
    }

    return this.usuarioRepository.findAll(parsedId);
  }

  async findOne(id: number): Promise<Usuario> {
    return this.usuarioRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    if (!email) {
      return null;
    }

    return this.usuarioRepository.findByEmail(email);
  }

  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    await this.usuarioRepository.findOne(id);
    this.normalizeRoleAndParking(data);

    if (data.email) {
      const existingUser = await this.usuarioRepository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('O e-mail ja esta em uso.');
      }
    }

    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    return this.usuarioRepository.update(id, data);
  }

  async delete(id: number): Promise<{ message: string }> {
    await this.usuarioRepository.delete(id);
    return { message: 'Usuario deletado com sucesso.' };
  }

  async reservarVaga(id: number, data: any): Promise<Reserva> {
    const usuario = await this.findOne(id);
    this.ensureClient(usuario);

    const idVaga = Number(data.id_vaga ?? data.idVaga);

    if (!idVaga) {
      throw new BadRequestException('id_vaga e obrigatorio.');
    }

    const vaga = await this.vagaService.findOne(idVaga);

    if (vaga.status !== 'disponivel' || vaga.reservada) {
      throw new BadRequestException(
        `A vaga com ID ${idVaga} nao esta disponivel.`,
      );
    }

    const reservaPayload = {
      id_usuario: usuario.id,
      id_vaga: vaga.id,
      id_plano: data.id_plano ?? data.plano_id,
      data_reserva:
        data.data_reserva ?? data.dataReserva ?? data.dataInicio ?? new Date(),
      data_fim: data.data_fim ?? data.dataFim ?? null,
      ...(data.valor !== undefined && data.valor !== null
        ? { valor: data.valor }
        : {}),
    };

    return this.reservaService.createReserva(reservaPayload);
  }

  async cancelarReserva(id: number, data: any): Promise<{ message: string }> {
    const usuario = await this.findOne(id);
    this.ensureClient(usuario);

    const idReserva = Number(data.id_reserva ?? data.idReserva);
    const reserva = await this.reservaService.findReservaById(idReserva);

    if (reserva.id_usuario !== usuario.id) {
      throw new ForbiddenException('Esta reserva nao pertence ao usuario.');
    }

    await this.reservaService.cancelarReserva(reserva.id);
    await this.vagaService.liberar(reserva.id_vaga);

    return { message: `Reserva de ID ${idReserva} cancelada com sucesso.` };
  }

  async historicoReservas(id: number): Promise<Reserva[]> {
    const usuario = await this.findOne(id);
    this.ensureClient(usuario);
    return this.reservaService.findReservasByUsuario(usuario.id);
  }

  async adicionarVaga(id: number, data: Partial<Vaga>): Promise<Vaga> {
    const usuario = await this.findOne(id);
    this.ensureAdmin(usuario);

    const vaga = await this.vagaService.create({
      id_estacionamento: data.id_estacionamento ?? usuario.id_estacionamento,
      numero: data.numero,
      tipo: data.tipo ?? 'carro',
      status: data.status ?? 'disponivel',
      reservada: data.reservada ?? false,
    });

    await this.operacaoService.registrar({
      tipo: 'VAGA',
      descricao: `Vaga ${vaga.id} adicionada.`,
      id_usuario: usuario.id,
      entidade: 'Vaga',
      id_entidade: vaga.id,
      dados: {
        numero: vaga.numero,
        tipo: vaga.tipo,
        id_estacionamento: vaga.id_estacionamento,
      },
    });

    return vaga;
  }

  async removerVaga(id: number, vagaId: number): Promise<{ message: string }> {
    const usuario = await this.findOne(id);
    this.ensureAdmin(usuario);

    const vaga = await this.vagaService.findOne(vagaId);
    await this.vagaService.remove(vagaId);
    await this.operacaoService.registrar({
      tipo: 'VAGA',
      descricao: `Vaga ${vagaId} removida.`,
      id_usuario: usuario.id,
      entidade: 'Vaga',
      id_entidade: vagaId,
      dados: {
        numero: vaga.numero,
        tipo: vaga.tipo,
        id_estacionamento: vaga.id_estacionamento,
      },
    });

    return { message: `Vaga com ID ${vagaId} removida com sucesso.` };
  }

  async monitorarOcupacao(id: number) {
    const usuario = await this.findOne(id);
    this.ensureAdmin(usuario);
    const monitoramento = await this.estacionamentoService.monitorarVagas(
      usuario.id_estacionamento,
    );

    await this.operacaoService.registrar({
      tipo: 'ESTACIONAMENTO',
      descricao: `Ocupacao do estacionamento ${usuario.id_estacionamento} monitorada.`,
      id_usuario: usuario.id,
      entidade: 'Estacionamento',
      id_entidade: usuario.id_estacionamento,
      dados: monitoramento,
    });

    return monitoramento;
  }

  async gerarRelatorio(id: number) {
    const usuario = await this.findOne(id);
    this.ensureAdmin(usuario);
    const relatorio = await this.estacionamentoService.gerarRelatorios(
      usuario.id_estacionamento,
    );

    await this.operacaoService.registrar({
      tipo: 'RELATORIO',
      descricao: `Relatorio do estacionamento ${usuario.id_estacionamento} gerado.`,
      id_usuario: usuario.id,
      entidade: 'Estacionamento',
      id_entidade: usuario.id_estacionamento,
      dados: relatorio,
    });

    return relatorio;
  }

  private async ensureEmailAvailable(email?: string): Promise<void> {
    if (!email) {
      throw new BadRequestException('E-mail e obrigatorio.');
    }

    const existingUser = await this.usuarioRepository.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('O e-mail ja esta em uso.');
    }
  }

  private normalizeRoleAndParking(data: Partial<Usuario>): void {
    if (data.role && data.role !== 'ADMIN') {
      data.id_estacionamento = null;
      data.cargo = null;
      data.privilegios = null;
    }

    if (data.role === 'ADMIN' && !data.id_estacionamento) {
      throw new BadRequestException('ADMIN precisa ter um id_estacionamento.');
    }
  }

  private ensureClient(usuario: Usuario): void {
    if (usuario.role !== 'CLIENT') {
      throw new ForbiddenException(
        'Apenas usuarios CLIENT podem realizar esta acao.',
      );
    }
  }

  private ensureAdmin(usuario: Usuario): void {
    if (usuario.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Apenas usuarios ADMIN podem realizar esta acao.',
      );
    }

    if (!usuario.id_estacionamento) {
      throw new BadRequestException(
        'ADMIN precisa estar associado a um estacionamento.',
      );
    }
  }
}
