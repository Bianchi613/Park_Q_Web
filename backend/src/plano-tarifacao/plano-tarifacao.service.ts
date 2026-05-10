import { BadRequestException, Injectable } from '@nestjs/common';
import { PlanoTarifacaoRepository } from './plano-tarifacao.repository';
import { PlanoTarifacao } from './plano-tarifacao.model';

export interface TarifaCalculada {
  planoId: number;
  tipoVaga: string;
  duracaoHoras: number;
  diasCobrados: number;
  taxaBase: number;
  subtotalUso: number;
  descontoTipoVaga: number;
  valor: number;
}

@Injectable()
export class PlanoTarifacaoService {
  constructor(
    private readonly planoTarifacaoRepository: PlanoTarifacaoRepository,
  ) {}

  async findAll(idEstacionamento?: number): Promise<PlanoTarifacao[]> {
    const normalizedId =
      idEstacionamento === undefined
        ? undefined
        : this.normalizeEstacionamentoId(idEstacionamento);

    return this.planoTarifacaoRepository.findAll(normalizedId);
  }

  async findOne(id: number): Promise<PlanoTarifacao> {
    return this.planoTarifacaoRepository.findOne(id);
  }

  async findDefaultByEstacionamento(
    idEstacionamento: number,
  ): Promise<PlanoTarifacao> {
    return this.planoTarifacaoRepository.findDefaultByEstacionamento(
      this.normalizeEstacionamentoId(idEstacionamento),
    );
  }

  async ensurePlanoDoEstacionamento(
    planoId: number,
    idEstacionamento: number,
  ): Promise<PlanoTarifacao> {
    return this.planoTarifacaoRepository.ensurePlanoDoEstacionamento(
      Number(planoId),
      this.normalizeEstacionamentoId(idEstacionamento),
    );
  }

  async create(planoTarifacaoData: any): Promise<PlanoTarifacao> {
    return this.planoTarifacaoRepository.create(
      this.normalizePayload(planoTarifacaoData),
    );
  }

  async update(id: number, planoTarifacaoData: any): Promise<PlanoTarifacao> {
    return this.planoTarifacaoRepository.update(
      id,
      this.normalizePayload(planoTarifacaoData, false),
    );
  }

  async remove(id: number): Promise<void> {
    return this.planoTarifacaoRepository.remove(id);
  }

  async calcularTarifa(
    tipoVaga: string,
    duracao: number,
    planoId: number,
  ): Promise<number> {
    const tarifa = await this.calcularTarifaDetalhada(
      tipoVaga,
      duracao,
      planoId,
    );
    return tarifa.valor;
  }

  async calcularTarifaDetalhada(
    tipoVaga: string,
    duracaoHoras: number,
    planoId: number,
  ): Promise<TarifaCalculada> {
    return this.planoTarifacaoRepository.calcularTarifaDetalhada(
      tipoVaga,
      duracaoHoras,
      planoId,
    );
  }

  calcularDuracaoHoras(
    dataInicio: Date | string,
    dataFim: Date | string,
  ): number {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diferencaMs = fim.getTime() - inicio.getTime();

    if (Number.isNaN(diferencaMs) || diferencaMs <= 0) {
      return 0;
    }

    return Math.ceil(diferencaMs / (1000 * 60 * 60));
  }

  private normalizePayload(
    data: Partial<PlanoTarifacao> & Record<string, any>,
    requireTaxaBase = true,
  ): Partial<PlanoTarifacao> {
    const normalized: Partial<PlanoTarifacao> = {
      ...data,
      data_vigencia: data.data_vigencia ?? data.dataVigencia,
      id_estacionamento:
        data.id_estacionamento ??
        data.idEstacionamento ??
        data.estacionamento_id,
      taxa_base: data.taxa_base ?? data.taxaBase,
      taxa_hora: data.taxa_hora ?? data.taxaHora,
      taxa_diaria: data.taxa_diaria ?? data.taxaDiaria,
    };

    delete (normalized as any).dataVigencia;
    delete (normalized as any).idEstacionamento;
    delete (normalized as any).estacionamento_id;
    delete (normalized as any).taxaBase;
    delete (normalized as any).taxaHora;
    delete (normalized as any).taxaDiaria;

    if (
      normalized.id_estacionamento !== undefined &&
      normalized.id_estacionamento !== null
    ) {
      normalized.id_estacionamento = this.normalizeEstacionamentoId(
        normalized.id_estacionamento,
      );
    }

    if (requireTaxaBase && !normalized.id_estacionamento) {
      throw new BadRequestException(
        'id_estacionamento e obrigatorio para vincular o plano ao estacionamento.',
      );
    }

    if (
      requireTaxaBase &&
      (normalized.taxa_base === undefined || normalized.taxa_base === null)
    ) {
      throw new BadRequestException('taxa_base ou taxaBase e obrigatoria.');
    }

    return normalized;
  }

  private normalizeEstacionamentoId(value: number | string): number {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      throw new BadRequestException('id_estacionamento invalido.');
    }

    return parsed;
  }
}
