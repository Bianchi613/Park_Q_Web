import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PlanoTarifacao } from './plano-tarifacao.model';

@Injectable()
export class PlanoTarifacaoRepository {
  constructor(
    @InjectModel(PlanoTarifacao)
    private planoTarifacaoModel: typeof PlanoTarifacao,
  ) {}

  async findAll(): Promise<PlanoTarifacao[]> {
    return this.planoTarifacaoModel.findAll();
  }

  async findOne(id: number): Promise<PlanoTarifacao> {
    const plano = await this.planoTarifacaoModel.findByPk(id);
    if (!plano) {
      throw new NotFoundException(
        `Plano de tarifação com ID ${id} não encontrado.`,
      );
    }
    return plano;
  }

  async create(
    planoTarifacaoData: Partial<PlanoTarifacao>,
  ): Promise<PlanoTarifacao> {
    return this.planoTarifacaoModel.create(planoTarifacaoData);
  }

  async update(
    id: number,
    planoTarifacaoData: Partial<PlanoTarifacao>,
  ): Promise<PlanoTarifacao> {
    const plano = await this.findOne(id);
    await plano.update(planoTarifacaoData);
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
    let tarifa = plano.taxa_base;

    if (tipoVaga === 'moto') {
      tarifa += plano.taxa_hora ? plano.taxa_hora * duracao : 0;
    } else if (tipoVaga === 'carro') {
      tarifa += plano.taxa_diaria ? plano.taxa_diaria : 0;
    }

    return tarifa;
  }
}
