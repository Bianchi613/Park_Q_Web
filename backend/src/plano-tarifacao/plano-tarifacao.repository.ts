import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PlanoTarifacao } from './plano-tarifacao.model';
import type { TarifaCalculada } from './plano-tarifacao.service';

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
    const plano = await this.findOne(planoId);
    const normalizedTipo = this.normalizeTipoVaga(tipoVaga);
    const normalizedDuracao = Number(duracaoHoras);

    if (!Number.isFinite(normalizedDuracao) || normalizedDuracao <= 0) {
      throw new BadRequestException('duracao deve ser maior que zero.');
    }

    const taxaBase = Number(plano.taxa_base ?? 0);
    const taxaHora = Number(plano.taxa_hora ?? 0);
    const taxaDiaria = Number(plano.taxa_diaria ?? 0);
    const diasCobrados = Math.ceil(normalizedDuracao / 24);
    const valorPorUso =
      normalizedDuracao <= 24 || taxaDiaria <= 0
        ? taxaHora * normalizedDuracao
        : taxaDiaria * diasCobrados;
    const descontoTipoVaga = normalizedTipo === 'moto' ? 0.3 : 0;
    const subtotal = taxaBase + valorPorUso;
    const valor = subtotal * (1 - descontoTipoVaga);

    return {
      planoId: plano.id,
      tipoVaga: normalizedTipo,
      duracaoHoras: normalizedDuracao,
      diasCobrados,
      taxaBase,
      subtotalUso: Number(valorPorUso.toFixed(2)),
      descontoTipoVaga,
      valor: Number(valor.toFixed(2)),
    };
  }

  private normalizeTipoVaga(tipoVaga: string): string {
    const normalized = String(tipoVaga ?? '')
      .toLowerCase()
      .trim();

    if (!['carro', 'moto'].includes(normalized)) {
      throw new BadRequestException('tipoVaga deve ser carro ou moto.');
    }

    return normalized;
  }
}
