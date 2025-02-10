import { Injectable } from '@nestjs/common';
import { PlanoTarifacaoRepository } from './plano-tarifacao.repository';
import { PlanoTarifacao } from './plano-tarifacao.model';

@Injectable()
export class PlanoTarifacaoService {
  constructor(
    private readonly planoTarifacaoRepository: PlanoTarifacaoRepository,
  ) {}

  async findAll(): Promise<PlanoTarifacao[]> {
    return this.planoTarifacaoRepository.findAll();
  }

  async findOne(id: number): Promise<PlanoTarifacao> {
    return this.planoTarifacaoRepository.findOne(id);
  }

  async create(
    planoTarifacaoData: Partial<PlanoTarifacao>,
  ): Promise<PlanoTarifacao> {
    return this.planoTarifacaoRepository.create(planoTarifacaoData);
  }

  async update(
    id: number,
    planoTarifacaoData: Partial<PlanoTarifacao>,
  ): Promise<PlanoTarifacao> {
    return this.planoTarifacaoRepository.update(id, planoTarifacaoData);
  }

  async remove(id: number): Promise<void> {
    return this.planoTarifacaoRepository.remove(id);
  }

  async calcularTarifa(
    tipoVaga: string,
    duracao: number,
    planoId: number,
  ): Promise<number> {
    return this.planoTarifacaoRepository.calcularTarifa(
      tipoVaga,
      duracao,
      planoId,
    );
  }
}
