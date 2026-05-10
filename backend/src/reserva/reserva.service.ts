import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Transaction } from 'sequelize';
import { NotificacaoService } from '../notificacao/notificacao.service';
import { OperacaoService } from '../operacao/operacao.service';
import { PlanoTarifacaoService } from '../plano-tarifacao/plano-tarifacao.service';
import { VagaService } from '../vaga/vaga.service';
import { Reserva } from './reserva.model';
import { ReservaRepository } from './reserva.repository';

export interface MonitoramentoReserva {
  id_reserva: number;
  id_usuario: number;
  id_vaga: number;
  status: string;
  data_reserva: Date;
  data_fim: Date;
  tempoRestanteMinutos: number;
  expirada: boolean;
  deveNotificar: boolean;
}

@Injectable()
export class ReservaService {
  constructor(
    private readonly reservaRepository: ReservaRepository,
    private readonly operacaoService: OperacaoService,
    private readonly notificacaoService: NotificacaoService,
    private readonly planoTarifacaoService: PlanoTarifacaoService,
    private readonly vagaService: VagaService,
  ) {}

  async createReserva(data: any): Promise<Reserva> {
    const normalized = this.normalizePayload(data);
    await this.preencherValorAutomaticamente(normalized);

    let idEstacionamento: number | undefined;
    const reserva = await this.reservaRepository.runInTransaction(
      async (transaction) => {
        const vaga = await this.reservaRepository.findVagaForUpdate(
          Number(normalized.id_vaga),
          transaction,
        );

        this.reservaRepository.ensureVagaDisponivel(vaga);
        await this.checkConflito(normalized, undefined, transaction);

        const createdReserva = await this.reservaRepository.createReserva(
          normalized,
          transaction,
        );

        await this.reservaRepository.ocuparVaga(
          vaga,
          createdReserva.id,
          transaction,
        );
        idEstacionamento = vaga.id_estacionamento;

        return createdReserva;
      },
    );

    if (idEstacionamento) {
      await this.vagaService.syncVagasDisponiveis(idEstacionamento);
    }

    await this.operacaoService.registrarReservaCriada({
      id: reserva.id,
      id_usuario: reserva.id_usuario,
      id_vaga: reserva.id_vaga,
      id_plano: reserva.id_plano,
      valor: reserva.valor,
      data_reserva: reserva.data_reserva,
      data_fim: reserva.data_fim,
    });
    await this.notificacaoService.notificarReservaCriada({
      id: reserva.id,
      id_usuario: reserva.id_usuario,
      id_vaga: reserva.id_vaga,
      data_fim: reserva.data_fim,
    });
    return reserva;
  }

  async findAllReservas(): Promise<Reserva[]> {
    return this.reservaRepository.findAllReservas();
  }

  async findReservasByUsuario(idUsuario: number): Promise<Reserva[]> {
    return this.reservaRepository.findReservasByUsuario(idUsuario);
  }

  async findReservaById(id: number): Promise<Reserva> {
    return this.reservaRepository.findReservaById(id);
  }

  async updateReserva(id: number, data: any): Promise<Reserva> {
    const reserva = await this.reservaRepository.findReservaById(id);
    this.ensureReservaAberta(reserva, 'atualizar');

    const normalized = this.normalizePayload(data, false);
    const merged = { ...reserva.get({ plain: true }), ...normalized };
    const shouldRecalculateValue =
      normalized.valor === undefined &&
      ['data_reserva', 'data_fim', 'id_plano', 'id_vaga'].some(
        (field) => field in normalized,
      );

    await this.preencherValorAutomaticamente(
      merged,
      normalized.valor !== undefined,
      shouldRecalculateValue,
    );
    await this.checkConflito(merged, id);

    return this.reservaRepository.updateReserva(id, {
      ...normalized,
      valor: merged.valor,
    });
  }

  async deleteReserva(id: number): Promise<void> {
    const reserva = await this.reservaRepository.findReservaById(id);
    this.ensureReservaAberta(reserva, 'excluir');
    await this.reservaRepository.deleteReserva(id);
  }

  async cancelarReserva(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findReservaById(id);
    this.ensureReservaAberta(reserva, 'cancelar');

    const reservaCancelada = await this.reservaRepository.updateReserva(id, {
      status: 'CANCELADA',
      data_fim: reserva.data_fim ?? new Date(),
    });
    await this.operacaoService.registrarReservaCancelada({
      id: reservaCancelada.id,
      id_usuario: reservaCancelada.id_usuario,
      id_vaga: reservaCancelada.id_vaga,
    });
    await this.notificacaoService.notificarReservaCancelada({
      id: reservaCancelada.id,
      id_usuario: reservaCancelada.id_usuario,
    });

    return reservaCancelada;
  }

  async monitorarTempo(id: number): Promise<MonitoramentoReserva> {
    const reserva = await this.reservaRepository.findReservaById(id);
    return this.monitorarReserva(reserva);
  }

  async monitorarReservas(
    idEstacionamento?: number,
  ): Promise<MonitoramentoReserva[]> {
    const reservas =
      await this.reservaRepository.findReservasParaMonitoramento(
        idEstacionamento,
      );

    const monitoramentos: MonitoramentoReserva[] = [];

    for (const reserva of reservas) {
      monitoramentos.push(await this.monitorarReserva(reserva));
    }

    return monitoramentos;
  }

  private normalizePayload(
    data: any,
    requireRequiredFields = true,
  ): Partial<Reserva> {
    const normalized: Partial<Reserva> = {
      ...data,
      data_reserva: data.data_reserva ?? data.dataReserva ?? data.dataInicio,
      data_fim: data.data_fim ?? data.dataFim ?? data.dataFinal,
      id_plano: data.id_plano ?? data.plano_id,
      id_usuario: data.id_usuario ?? data.idUsuario,
      id_vaga: data.id_vaga ?? data.idVaga,
      status: data.status ?? data.statusReserva,
    };

    delete (normalized as any).dataReserva;
    delete (normalized as any).dataFim;
    delete (normalized as any).dataInicio;
    delete (normalized as any).dataFinal;
    delete (normalized as any).plano_id;
    delete (normalized as any).idUsuario;
    delete (normalized as any).idVaga;
    delete (normalized as any).statusReserva;

    if (requireRequiredFields) {
      if (!normalized.id_usuario) {
        throw new BadRequestException('id_usuario e obrigatorio.');
      }

      if (!normalized.id_vaga) {
        throw new BadRequestException('id_vaga e obrigatorio.');
      }

      this.ensureValorOrCalculationFields(normalized);
    }

    return normalized;
  }

  private ensureValorOrCalculationFields(data: Partial<Reserva>): void {
    if (data.valor !== undefined && data.valor !== null) {
      return;
    }

    if (!data.data_fim) {
      throw new BadRequestException(
        'data_fim e obrigatoria para calcular o valor da reserva.',
      );
    }
  }

  private async preencherValorAutomaticamente(
    data: Partial<Reserva>,
    manterValorInformado = false,
    recalcularMesmoComValor = false,
  ): Promise<void> {
    if (
      manterValorInformado ||
      (!recalcularMesmoComValor &&
        data.valor !== undefined &&
        data.valor !== null)
    ) {
      return;
    }

    if (!data.id_vaga || !data.data_reserva || !data.data_fim) {
      return;
    }

    const vaga = await this.vagaService.findOne(data.id_vaga);
    const plano = data.id_plano
      ? await this.planoTarifacaoService.ensurePlanoDoEstacionamento(
          data.id_plano,
          vaga.id_estacionamento,
        )
      : await this.planoTarifacaoService.findDefaultByEstacionamento(
          vaga.id_estacionamento,
        );
    const duracaoHoras = this.planoTarifacaoService.calcularDuracaoHoras(
      data.data_reserva,
      data.data_fim,
    );
    const tarifa = await this.planoTarifacaoService.calcularTarifaDetalhada(
      vaga.tipo,
      duracaoHoras,
      plano.id,
    );

    data.id_plano = plano.id;
    data.valor = tarifa.valor;
  }

  private async checkConflito(
    data: Partial<Reserva>,
    reservaId?: number,
    transaction?: Transaction,
  ) {
    if (!data.id_vaga || !data.data_reserva || !data.data_fim) {
      return;
    }

    const dataInicio = new Date(data.data_reserva);
    const dataFim = new Date(data.data_fim);

    if (dataFim <= dataInicio) {
      throw new BadRequestException(
        'data_fim deve ser maior que data_reserva.',
      );
    }

    const conflito = await this.reservaRepository.checkHorarioConflitante(
      data.id_vaga,
      dataInicio,
      dataFim,
      reservaId,
      transaction,
    );

    if (conflito) {
      throw new ForbiddenException(
        'A vaga ja esta reservada nesse intervalo de tempo.',
      );
    }
  }

  private async monitorarReserva(
    reserva: Reserva,
  ): Promise<MonitoramentoReserva> {
    const dataFim = reserva.data_fim ? new Date(reserva.data_fim) : null;
    const agora = new Date();
    const tempoRestanteMinutos = dataFim
      ? Math.ceil((dataFim.getTime() - agora.getTime()) / (1000 * 60))
      : 0;
    const expirada = !!dataFim && tempoRestanteMinutos <= 0;
    const deveNotificar =
      reserva.status === 'ATIVA' &&
      !!dataFim &&
      tempoRestanteMinutos > 0 &&
      tempoRestanteMinutos <= 15;

    if (expirada && reserva.status === 'ATIVA') {
      const reservaExpirada = await this.reservaRepository.updateReserva(
        reserva.id,
        {
          status: 'EXPIRADA',
        },
      );
      await this.vagaService.liberar(reserva.id_vaga);
      await this.notificacaoService.notificarReservaExpirada({
        id: reservaExpirada.id,
        id_usuario: reservaExpirada.id_usuario,
      });

      reserva = reservaExpirada;
    } else if (deveNotificar) {
      await this.notificacaoService.notificarReservaExpirando({
        id: reserva.id,
        id_usuario: reserva.id_usuario,
        minutosRestantes: tempoRestanteMinutos,
      });
    }

    return {
      id_reserva: reserva.id,
      id_usuario: reserva.id_usuario,
      id_vaga: reserva.id_vaga,
      status: reserva.status,
      data_reserva: reserva.data_reserva,
      data_fim: reserva.data_fim,
      tempoRestanteMinutos,
      expirada,
      deveNotificar,
    };
  }

  private ensureReservaAberta(reserva: Reserva, action: string): void {
    if (['CANCELADA', 'FINALIZADA', 'EXPIRADA'].includes(reserva.status)) {
      throw new ForbiddenException(
        `Nao e possivel ${action} uma reserva com status ${reserva.status}.`,
      );
    }

    if (!reserva.data_fim) {
      return;
    }

    if (new Date(reserva.data_fim) < new Date()) {
      throw new ForbiddenException(
        `Nao e possivel ${action} uma reserva ja finalizada.`,
      );
    }
  }
}
