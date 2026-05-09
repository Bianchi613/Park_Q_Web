import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WhereOptions } from 'sequelize';
import { Usuario } from '../usuario/usuario.model';
import { Operacao, OperacaoTipo } from './operacao.model';

export interface OperacaoFilters {
  id_usuario?: number;
  tipo?: OperacaoTipo;
  entidade?: string;
  id_entidade?: number;
}

@Injectable()
export class OperacaoRepository {
  constructor(
    @InjectModel(Operacao)
    private readonly operacaoModel: typeof Operacao,
  ) {}

  async create(data: Partial<Operacao>): Promise<Operacao> {
    return this.operacaoModel.create(data);
  }

  async findAll(filters: OperacaoFilters = {}): Promise<Operacao[]> {
    const where: WhereOptions<Operacao> = {};

    if (filters.id_usuario) {
      where.id_usuario = filters.id_usuario;
    }

    if (filters.tipo) {
      where.tipo = filters.tipo;
    }

    if (filters.entidade) {
      where.entidade = filters.entidade;
    }

    if (filters.id_entidade) {
      where.id_entidade = filters.id_entidade;
    }

    return this.operacaoModel.findAll({
      where,
      include: [Usuario],
      order: [['id', 'DESC']],
    });
  }

  async findOne(id: number): Promise<Operacao> {
    const operacao = await this.operacaoModel.findByPk(id, {
      include: [Usuario],
    });

    if (!operacao) {
      throw new NotFoundException(`Operacao com ID ${id} nao encontrada.`);
    }

    return operacao;
  }

  async update(id: number, data: Partial<Operacao>): Promise<Operacao> {
    const operacao = await this.findOne(id);
    await operacao.update(data);
    return operacao;
  }

  async remove(id: number): Promise<void> {
    const operacao = await this.findOne(id);
    await operacao.destroy();
  }
}
