import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereOptions } from 'sequelize';
import { Reserva } from '../reserva/reserva.model';
import { Usuario } from '../usuario/usuario.model';
import { Notificacao, NotificacaoTipo } from './notificacao.model';

export interface NotificacaoFilters {
  id_usuario?: number;
  tipo?: NotificacaoTipo;
  lida?: boolean;
}

@Injectable()
export class NotificacaoRepository {
  constructor(
    @InjectModel(Notificacao)
    private readonly notificacaoModel: typeof Notificacao,
  ) {}

  async create(data: Partial<Notificacao>): Promise<Notificacao> {
    return this.notificacaoModel.create(data);
  }

  async findAll(filters: NotificacaoFilters = {}): Promise<Notificacao[]> {
    const where: WhereOptions<Notificacao> = {};

    if (filters.id_usuario) {
      where.id_usuario = filters.id_usuario;
    }

    if (filters.tipo) {
      where.tipo = filters.tipo;
    }

    if (filters.lida !== undefined) {
      where.lida = filters.lida;
    }

    return this.notificacaoModel.findAll({
      where,
      include: [Usuario, Reserva],
      order: [['id', 'DESC']],
    });
  }

  async findById(id: number): Promise<Notificacao> {
    const notificacao = await this.notificacaoModel.findByPk(id, {
      include: [Usuario, Reserva],
    });

    if (!notificacao) {
      throw new NotFoundException(`Notificacao com ID ${id} nao encontrada.`);
    }

    return notificacao;
  }

  async findByChave(chave: string): Promise<Notificacao | null> {
    return this.notificacaoModel.findOne({ where: { chave } });
  }

  async marcarComoLida(id: number): Promise<Notificacao> {
    const notificacao = await this.findById(id);
    await notificacao.update({ lida: true });
    return notificacao;
  }

  async marcarTodasComoLidas(idUsuario: number): Promise<void> {
    await this.notificacaoModel.update(
      { lida: true },
      { where: { id_usuario: idUsuario, lida: false } },
    );
  }

  async remove(id: number): Promise<void> {
    const notificacao = await this.findById(id);
    await notificacao.destroy();
  }
}
