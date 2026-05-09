import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Estacionamento } from '../estacionamento/estacionamento.model';
import { Vaga } from './vaga.model';

@Injectable()
export class VagaRepository {
  constructor(
    @InjectModel(Vaga)
    private readonly vagaModel: typeof Vaga,
    @InjectModel(Estacionamento)
    private readonly estacionamentoModel: typeof Estacionamento,
  ) {}

  async findAll(idEstacionamento?: number): Promise<Vaga[]> {
    return this.vagaModel.findAll({
      where: idEstacionamento ? { id_estacionamento: idEstacionamento } : {},
      order: [
        ['id_estacionamento', 'ASC'],
        ['numero', 'ASC'],
      ],
    });
  }

  async findById(id: number): Promise<Vaga> {
    const vaga = await this.vagaModel.findByPk(id);

    if (!vaga) {
      throw new NotFoundException(`Vaga com ID ${id} nao encontrada.`);
    }

    return vaga;
  }

  async create(vagaData: Partial<Vaga>): Promise<Vaga> {
    const vaga = await this.vagaModel.create({
      status: 'disponivel',
      reservada: false,
      ...vagaData,
    });
    await this.syncVagasDisponiveis(vaga.id_estacionamento);
    return vaga;
  }

  async update(id: number, vagaData: Partial<Vaga>): Promise<Vaga> {
    const vaga = await this.findById(id);
    const previousEstacionamentoId = vaga.id_estacionamento;

    await vaga.update(vagaData);
    await this.syncVagasDisponiveis(previousEstacionamentoId);

    if (vaga.id_estacionamento !== previousEstacionamentoId) {
      await this.syncVagasDisponiveis(vaga.id_estacionamento);
    }

    return vaga;
  }

  async remove(id: number): Promise<void> {
    const vaga = await this.findById(id);
    const estacionamentoId = vaga.id_estacionamento;
    await vaga.destroy();
    await this.syncVagasDisponiveis(estacionamentoId);
  }

  async reservar(id: number, idReserva?: number): Promise<Vaga> {
    const vaga = await this.findById(id);

    if (vaga.reservada || vaga.status !== 'disponivel') {
      throw new ConflictException(`A vaga com ID ${id} nao esta disponivel.`);
    }

    await vaga.update({
      reservada: true,
      status: 'ocupada',
      id_reserva: idReserva ?? vaga.id_reserva,
    });
    await this.syncVagasDisponiveis(vaga.id_estacionamento);
    return vaga;
  }

  async liberar(id: number): Promise<Vaga> {
    const vaga = await this.findById(id);

    if (!vaga.reservada && vaga.status === 'disponivel') {
      return vaga;
    }

    await vaga.update({
      reservada: false,
      status: 'disponivel',
      id_reserva: null,
    });
    await this.syncVagasDisponiveis(vaga.id_estacionamento);
    return vaga;
  }

  async updateStatus(id: number, status: string): Promise<Vaga> {
    const reservada = status !== 'disponivel';
    return this.update(id, { status, reservada });
  }

  async syncVagasDisponiveis(idEstacionamento: number): Promise<void> {
    if (!idEstacionamento) {
      return;
    }

    const estacionamento =
      await this.estacionamentoModel.findByPk(idEstacionamento);

    if (!estacionamento) {
      return;
    }

    const vagasDisponiveis = await this.vagaModel.count({
      where: {
        id_estacionamento: idEstacionamento,
        status: 'disponivel',
        reservada: false,
      },
    });

    await estacionamento.update({ vagas_disponiveis: vagasDisponiveis });
  }
}
