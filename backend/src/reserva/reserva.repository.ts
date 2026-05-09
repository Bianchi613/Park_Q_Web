import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Vaga } from '../vaga/vaga.model';
import { Reserva } from './reserva.model';

@Injectable()
export class ReservaRepository {
  constructor(
    @InjectModel(Reserva)
    private readonly reservaModel: typeof Reserva,
    @InjectModel(Vaga)
    private readonly vagaModel: typeof Vaga,
    private readonly sequelize: Sequelize,
  ) {}

  async runInTransaction<T>(
    callback: (transaction: Transaction) => Promise<T>,
  ): Promise<T> {
    return this.sequelize.transaction(callback);
  }

  async createReserva(
    data: Partial<Reserva>,
    transaction?: Transaction,
  ): Promise<Reserva> {
    return this.reservaModel.create(data, { transaction });
  }

  async findVagaForUpdate(id: number, transaction: Transaction): Promise<Vaga> {
    const vaga = await this.vagaModel.findByPk(id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!vaga) {
      throw new NotFoundException(`Vaga com ID ${id} nao encontrada.`);
    }

    return vaga;
  }

  ensureVagaDisponivel(vaga: Vaga): void {
    if (vaga.reservada || vaga.status !== 'disponivel') {
      throw new ConflictException(
        `A vaga com ID ${vaga.id} nao esta disponivel.`,
      );
    }
  }

  async ocuparVaga(
    vaga: Vaga,
    idReserva: number,
    transaction: Transaction,
  ): Promise<void> {
    await vaga.update(
      {
        reservada: true,
        status: 'ocupada',
        id_reserva: idReserva,
      },
      { transaction },
    );
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

  async findReservasParaMonitoramento(
    idEstacionamento?: number,
  ): Promise<Reserva[]> {
    return this.reservaModel.findAll({
      where: {
        status: { [Op.in]: ['ATIVA', 'EXPIRADA'] },
      },
      include: [
        'usuario',
        {
          association: 'vaga',
          ...(idEstacionamento
            ? { where: { id_estacionamento: idEstacionamento } }
            : {}),
        },
        'plano',
      ],
      order: [['data_fim', 'ASC']],
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
    transaction?: Transaction,
  ): Promise<boolean> {
    const conflito = await this.reservaModel.findOne({
      where: {
        ...(reservaId ? { id: { [Op.ne]: reservaId } } : {}),
        id_vaga: idVaga,
        status: { [Op.notIn]: ['CANCELADA', 'FINALIZADA', 'EXPIRADA'] },
        data_fim: { [Op.gt]: dataInicio },
        data_reserva: { [Op.lt]: dataFim },
      },
      transaction,
      lock: transaction ? transaction.LOCK.UPDATE : undefined,
    });

    return !!conflito;
  }
}
