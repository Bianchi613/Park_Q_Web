import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Reserva } from './reserva.model';

@Injectable()
export class ReservaRepository {
  constructor(
    @InjectModel(Reserva)
    private readonly reservaModel: typeof Reserva,
  ) {}

  async createReserva(data: Partial<Reserva>): Promise<Reserva> {
    return this.reservaModel.create(data);
  }

  async findAllReservas(): Promise<Reserva[]> {
    return this.reservaModel.findAll({
      include: ['usuario', 'vaga', 'plano'],
      order: [['id', 'DESC']],
    });
  }

  async findReservasByUsuario(idUsuario: number): Promise<Reserva[]> {
    return this.reservaModel.findAll({
      where: { id_usuario: idUsuario },
      include: ['vaga', 'plano'],
      order: [['id', 'DESC']],
    });
  }

  async findReservaById(id: number): Promise<Reserva> {
    const reserva = await this.reservaModel.findByPk(id, {
      include: ['usuario', 'vaga', 'plano'],
    });

    if (!reserva) {
      throw new NotFoundException(`Reserva com ID ${id} nao encontrada.`);
    }

    return reserva;
  }

  async updateReserva(id: number, data: Partial<Reserva>): Promise<Reserva> {
    const reserva = await this.findReservaById(id);
    await reserva.update(data);
    return this.findReservaById(id);
  }

  async deleteReserva(id: number): Promise<void> {
    const reserva = await this.findReservaById(id);
    await reserva.destroy();
  }

  async checkHorarioConflitante(
    idVaga: number,
    dataInicio: Date,
    dataFim: Date,
    reservaId?: number,
  ): Promise<boolean> {
    const conflito = await this.reservaModel.findOne({
      where: {
        ...(reservaId ? { id: { [Op.ne]: reservaId } } : {}),
        id_vaga: idVaga,
        status: { [Op.notIn]: ['CANCELADA', 'FINALIZADA', 'EXPIRADA'] },
        data_fim: { [Op.gt]: dataInicio },
        data_reserva: { [Op.lt]: dataFim },
      },
    });

    return !!conflito;
  }
}
