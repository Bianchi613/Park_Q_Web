import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Usuario } from '../usuario/usuario.model';
import { Operacao } from './operacao.model';

@Injectable()
export class OperacaoRepository {
  constructor(
    @InjectModel(Operacao)
    private readonly operacaoModel: typeof Operacao,
  ) {}

  async create(data: Partial<Operacao>): Promise<Operacao> {
    return this.operacaoModel.create(data);
  }

  async findAll(): Promise<Operacao[]> {
    return this.operacaoModel.findAll({
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
