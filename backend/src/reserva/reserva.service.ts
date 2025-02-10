import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ReservaRepository } from './reserva.repository';

@Injectable()
export class ReservaService {
  constructor(private readonly reservaRepository: ReservaRepository) {}

  async createReserva(data: any) {
    if (!data.dataInicio || !data.dataFim) {
      throw new BadRequestException('Data de início e fim são obrigatórias.');
    }

    if (new Date(data.dataInicio) >= new Date(data.dataFim)) {
      throw new BadRequestException(
        'A data de início deve ser anterior à data de fim.',
      );
    }

    const conflito = await this.reservaRepository.checkHorarioConflitante(
      data.idVaga,
      data.dataInicio,
      data.dataFim,
    );
    if (conflito) {
      throw new ForbiddenException(
        'A vaga já está reservada nesse intervalo de tempo.',
      );
    }

    return await this.reservaRepository.createReserva(data);
  }

  async findAllReservas() {
    return await this.reservaRepository.findAllReservas();
  }

  async findReservaById(id: number) {
    const reserva = await this.reservaRepository.findReservaById(id);
    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada.');
    }
    return reserva;
  }

  async updateReserva(id: number, data: any) {
    const reserva = await this.reservaRepository.findReservaById(id);
    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada.');
    }

    if (new Date(reserva.data_fim) < new Date()) {
      throw new ForbiddenException(
        'Não é possível atualizar uma reserva que já expirou.',
      );
    }

    return await this.reservaRepository.updateReserva(id, data);
  }

  async deleteReserva(id: number) {
    const reserva = await this.reservaRepository.findReservaById(id);
    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada.');
    }

    if (new Date(reserva.data_fim) < new Date()) {
      throw new ForbiddenException(
        'Não é possível excluir uma reserva que já foi finalizada.',
      );
    }

    await this.reservaRepository.deleteReserva(id);
  }
}
