import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ReservaRepository } from './reserva.repository';

@Injectable()
export class ReservaService {
  constructor(private readonly reservaRepository: ReservaRepository) {}

  // Função auxiliar para verificar conflito de horários
  private async checkConflito(idVaga: number, dataInicio: Date, dataFim: Date): Promise<void> {
    const conflito = await this.reservaRepository.checkHorarioConflitante(
      idVaga,
      dataInicio,
      dataFim,
    );
    if (conflito) {
      throw new ForbiddenException(
        'A vaga já está reservada nesse intervalo de tempo.',
      );
    }
  }

  // Função para criar uma nova reserva
  async createReserva(data: any) {
    // Removendo as validações de obrigatoriedade
    if (data.dataInicio && data.dataFim) {
      await this.checkConflito(data.idVaga, data.dataInicio, data.dataFim);
    }

    return await this.reservaRepository.createReserva(data);
  }

  // Função para buscar todas as reservas
  async findAllReservas() {
    return await this.reservaRepository.findAllReservas();
  }

  // Função para buscar uma reserva pelo ID
  async findReservaById(id: number) {
    const reserva = await this.reservaRepository.findReservaById(id);
    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada.');
    }
    return reserva;
  }

  // Função para atualizar uma reserva
  async updateReserva(id: number, data: any) {
    const reserva = await this.reservaRepository.findReservaById(id);
    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada.');
    }

    // Verificando se a reserva já expirou
    if (new Date(reserva.data_fim) < new Date()) {
      throw new ForbiddenException(
        'Não é possível atualizar uma reserva que já expirou.',
      );
    }

    return await this.reservaRepository.updateReserva(id, data);
  }

  // Função para excluir uma reserva
  async deleteReserva(id: number) {
    const reserva = await this.reservaRepository.findReservaById(id);
    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada.');
    }

    // Verificando se a reserva já expirou
    if (new Date(reserva.data_fim) < new Date()) {
      throw new ForbiddenException(
        'Não é possível excluir uma reserva que já foi finalizada.',
      );
    }

    await this.reservaRepository.deleteReserva(id);
  }
}
