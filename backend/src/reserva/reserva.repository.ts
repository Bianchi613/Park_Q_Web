import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Reserva } from './reserva.model';

@Injectable()
export class ReservaRepository {
  constructor(
    @InjectModel(Reserva)
    private readonly reservaModel: typeof Reserva,
  ) {}

  async createReserva(data: any): Promise<Reserva> {
    return await this.reservaModel.create(data);
  }

  async findAllReservas(): Promise<Reserva[]> {
    return await this.reservaModel.findAll({ include: ['usuario', 'vaga'] });
  }

  async findReservaById(id: number): Promise<Reserva> {
    return await this.reservaModel.findByPk(id, {
      include: ['usuario', 'vaga'],
    });
  }

  async updateReserva(id: number, data: any): Promise<Reserva> {
    const reserva = await this.findReservaById(id);
    if (!reserva) throw new Error('Reserva não encontrada.');
    return await reserva.update(data);
  }

  async deleteReserva(id: number): Promise<void> {
    const reserva = await this.findReservaById(id);
    if (!reserva) throw new Error('Reserva não encontrada.');
    await reserva.destroy();
  }

  async checkHorarioConflitante(
    idVaga: number,
    dataInicio: Date,
    dataFim: Date,
  ): Promise<boolean> {
    const conflito = await this.reservaModel.findOne({
      where: {
        id_vaga: idVaga,
        data_fim: { $gt: dataInicio },
        data_reserva: { $lt: dataFim },
      },
    });
    return !!conflito;
  }
}
