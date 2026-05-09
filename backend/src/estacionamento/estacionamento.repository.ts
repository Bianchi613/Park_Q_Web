import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Usuario } from '../usuario/usuario.model';
import { Vaga } from '../vaga/vaga.model';
import { Estacionamento } from './estacionamento.model';

@Injectable()
export class EstacionamentoRepository {
  constructor(
    @InjectModel(Estacionamento)
    private readonly estacionamentoModel: typeof Estacionamento,
  ) {}

  async create(data: Partial<Estacionamento>): Promise<Estacionamento> {
    return this.estacionamentoModel.create(data);
  }

  async findAll(includeAssociations = false): Promise<Estacionamento[]> {
    return this.estacionamentoModel.findAll({
      include: includeAssociations ? [Usuario, Vaga] : [],
      order: [['id', 'ASC']],
    });
  }

  async findOne(
    id: number,
    includeAssociations = false,
  ): Promise<Estacionamento> {
    const estacionamento = await this.estacionamentoModel.findByPk(id, {
      include: includeAssociations ? [Usuario, Vaga] : [],
    });

    if (!estacionamento) {
      throw new NotFoundException(
        `Estacionamento com ID ${id} nao encontrado.`,
      );
    }

    return estacionamento;
  }

  async update(
    id: number,
    data: Partial<Estacionamento>,
  ): Promise<Estacionamento> {
    const estacionamento = await this.findOne(id);
    await estacionamento.update(data);
    return estacionamento;
  }

  async remove(id: number): Promise<void> {
    const estacionamento = await this.findOne(id);
    await estacionamento.destroy();
  }
}
