import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Estacionamento } from './estacionamento.model';
import { Usuario } from '../usuario/usuario.model';
import { Vaga } from '../vaga/vaga.model';

@Injectable()
export class EstacionamentoRepository {
  constructor(
    @InjectModel(Estacionamento)
    private readonly estacionamentoModel: typeof Estacionamento,
  ) {}

  // Cria um novo estacionamento
  async create(createEstacionamentoDto: any): Promise<Estacionamento> {
    return this.estacionamentoModel.create(createEstacionamentoDto);
  }

  // Retorna todos os estacionamentos, sem as associações
  async findAll(includeAssociations: boolean = false): Promise<Estacionamento[]> {
    // Se incluir as associações, busca Usuario e Vaga
    if (includeAssociations) {
      return this.estacionamentoModel.findAll({ include: [Usuario, Vaga] });
    }
    // Caso contrário, retorna apenas os dados de Estacionamento
    return this.estacionamentoModel.findAll();
  }

  // Retorna um estacionamento específico, com ou sem as associações
  async findOne(id: number, includeAssociations: boolean = false): Promise<Estacionamento> {
    if (includeAssociations) {
      return this.estacionamentoModel.findOne({
        where: { id },
        include: [Usuario, Vaga],
      });
    }
    return this.estacionamentoModel.findOne({ where: { id } });
  }

  // Atualiza um estacionamento específico
  async update(
    id: number,
    updateEstacionamentoDto: any,
  ): Promise<Estacionamento> {
    const estacionamento = await this.findOne(id);
    if (estacionamento) {
      return estacionamento.update(updateEstacionamentoDto);
    }
    throw new Error('Estacionamento não encontrado');
  }

  // Exclui um estacionamento pelo ID
  async remove(id: number): Promise<void> {
    const estacionamento = await this.findOne(id);
    if (estacionamento) {
      await estacionamento.destroy();
    } else {
      throw new Error('Estacionamento não encontrado');
    }
  }
}
