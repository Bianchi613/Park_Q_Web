import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reserva } from './reserva.model';
import { ReservaRepository } from './reserva.repository';

@Injectable()
export class ReservaService {
  constructor(private readonly reservaRepository: ReservaRepository) {}

  async createReserva(data: any): Promise<Reserva> {
    const normalized = this.normalizePayload(data);
    await this.checkConflito(normalized);
    return this.reservaRepository.createReserva(normalized);
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
    await this.checkConflito(
      { ...reserva.get({ plain: true }), ...normalized },
      id,
    );

    return this.reservaRepository.updateReserva(id, normalized);
  }

  async deleteReserva(id: number): Promise<void> {
    const reserva = await this.reservaRepository.findReservaById(id);
    this.ensureReservaAberta(reserva, 'excluir');
    await this.reservaRepository.deleteReserva(id);
  }

  async cancelarReserva(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findReservaById(id);
    this.ensureReservaAberta(reserva, 'cancelar');

    return this.reservaRepository.updateReserva(id, {
      status: 'CANCELADA',
      data_fim: reserva.data_fim ?? new Date(),
    });
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

      if (normalized.valor === undefined || normalized.valor === null) {
        throw new BadRequestException('valor e obrigatorio.');
      }
    }

    return normalized;
  }

  private async checkConflito(data: Partial<Reserva>, reservaId?: number) {
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
    );

    if (conflito) {
      throw new ForbiddenException(
        'A vaga ja esta reservada nesse intervalo de tempo.',
      );
    }
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
