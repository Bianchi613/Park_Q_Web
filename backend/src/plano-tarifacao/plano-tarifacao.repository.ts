import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PlanoTarifacao } from './plano-tarifacao.model';

@Injectable()
export class PlanoTarifacaoRepository {
  constructor(
    @InjectModel(PlanoTarifacao)
    private readonly planoTarifacaoModel: typeof PlanoTarifacao,
  ) {}

  async findAll(): Promise<PlanoTarifacao[]> {
    return this.planoTarifacaoModel.findAll({ order: [['id', 'ASC']] });
  }

  async findOne(id: number): Promise<PlanoTarifacao> {
    const plano = await this.planoTarifacaoModel.findByPk(id);

    if (!plano) {
      throw new NotFoundException(
        `Plano de tarifacao com ID ${id} nao encontrado.`,
      );
    }

    return plano;
  }

  async create(data: Partial<PlanoTarifacao>): Promise<PlanoTarifacao> {
    return this.planoTarifacaoModel.create(data);
  }

  async update(
    id: number,
    data: Partial<PlanoTarifacao>,
  ): Promise<PlanoTarifacao> {
    const plano = await this.findOne(id);
    await plano.update(data);
    return plano;
  }

  async remove(id: number): Promise<void> {
    const plano = await this.findOne(id);
    await plano.destroy();
  }

  async calcularTarifa(
    tipoVaga: string,
    duracao: number,
    planoId: number,
  ): Promise<number> {
    const plano = await this.findOne(planoId);
    const taxaBase = Number(plano.taxa_base ?? 0);
    const taxaHora = Number(plano.taxa_hora ?? 0);
    const taxaDiaria = Number(plano.taxa_diaria ?? 0);

    if (tipoVaga === 'moto') {
      return taxaBase + taxaHora * duracao;
    }

    if (tipoVaga === 'carro') {
      return taxaBase + taxaDiaria;
    }

    return taxaBase;
  }
}
