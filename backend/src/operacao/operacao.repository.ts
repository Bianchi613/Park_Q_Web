import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Operacao } from './operacao.model';
import { Usuario } from '../usuario/usuario.model';

@Injectable()
export class OperacaoRepository {
  constructor(
    @InjectModel(Operacao)
    private operacaoModel: typeof Operacao,
  ) {}

  async create(
    descricao: string,
    data_hora: Date,
    id_usuario: number,
  ): Promise<Operacao> {
    return this.operacaoModel.create({ descricao, data_hora, id_usuario });
  }

  async findAll(): Promise<Operacao[]> {
    return this.operacaoModel.findAll({
      include: [Usuario],
    });
  }

  async findOne(id: number): Promise<Operacao> {
    return this.operacaoModel.findOne({
      where: { id },
      include: [Usuario],
    });
  }

  async update(
    id: number,
    descricao: string,
    data_hora: Date,
    id_usuario: number,
  ): Promise<Operacao> {
    const operacao = await this.operacaoModel.findByPk(id);
    if (operacao) {
      operacao.descricao = descricao;
      operacao.data_hora = data_hora;
      operacao.id_usuario = id_usuario;
      return operacao.save();
    }
    return null;
  }

  async remove(id: number): Promise<void> {
    const operacao = await this.operacaoModel.findByPk(id);
    if (operacao) {
      await operacao.destroy();
    }
  }
}
