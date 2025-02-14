import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Reserva } from './reserva.model';
import { Op } from 'sequelize';  // Certifique-se de importar o Op do Sequelize
@Injectable()
export class ReservaRepository {
  constructor(
    @InjectModel(Reserva)
    private readonly reservaModel: typeof Reserva,
  ) {}

  // Criação de uma nova reserva
  async createReserva(data: any): Promise<Reserva> {
    try {
      return await this.reservaModel.create(data);
    } catch (error) {
      throw new Error(`Erro ao criar a reserva: ${error.message}`);
    }
  }

  // Encontrar todas as reservas
  async findAllReservas(): Promise<Reserva[]> {
    try {
      return await this.reservaModel.findAll({
        include: ['usuario', 'vaga'],
      });
    } catch (error) {
      throw new Error(`Erro ao buscar as reservas: ${error.message}`);
    }
  }

  // Encontrar uma reserva por ID
  async findReservaById(id: number): Promise<Reserva> {
    const reserva = await this.reservaModel.findByPk(id, {
      include: ['usuario', 'vaga'],
    });

    if (!reserva) {
      throw new NotFoundException('Reserva não encontrada');
    }

    return reserva;
  }

  // Atualizar uma reserva
  async updateReserva(id: number, data: any): Promise<Reserva> {
    const reserva = await this.findReservaById(id);
    return reserva.update(data);
  }

  // Excluir uma reserva
  async deleteReserva(id: number): Promise<void> {
    const reserva = await this.findReservaById(id);
    await reserva.destroy();
  }

  // Verificar se há conflito de horário para a vaga
  async checkHorarioConflitante(
    idVaga: number,
    dataInicio: Date,
    dataFim: Date,
  ): Promise<boolean> {
    const conflito = await this.reservaModel.findOne({
      where: {
        id_vaga: idVaga,
        data_fim: { [Op.gt]: dataInicio },  // Usando Op para a comparação no Sequelize
        data_reserva: { [Op.lt]: dataFim },
      },
    });
    return !!conflito;
  }
}
