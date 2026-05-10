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

  async findAll(idEstacionamento?: number): Promise<PlanoTarifacao[]> {
    return this.planoTarifacaoModel.findAll({
      where: idEstacionamento
        ? { id_estacionamento: idEstacionamento }
        : undefined,
      include: ['estacionamento'],
      order: [
        ['id_estacionamento', 'ASC'],
        ['data_vigencia', 'DESC'],
        ['id', 'DESC'],
      ],
    });
  }

  async findOne(id: number): Promise<PlanoTarifacao> {
    const plano = await this.planoTarifacaoModel.findByPk(id, {
      include: ['estacionamento'],
    });

    if (!plano) {
      throw new NotFoundException(
        `Plano de tarifacao com ID ${id} nao encontrado.`,
      );
    }

    return plano;
  }

  async findDefaultByEstacionamento(
    idEstacionamento: number,
  ): Promise<PlanoTarifacao> {
    const plano = await this.planoTarifacaoModel.findOne({
      where: { id_estacionamento: idEstacionamento },
      include: ['estacionamento'],
      order: [
        ['data_vigencia', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    if (!plano) {
      throw new NotFoundException(
        `Nenhum plano de tarifacao vinculado ao estacionamento ${idEstacionamento}.`,
      );
    }

    return plano;
  }

  async ensurePlanoDoEstacionamento(
    planoId: number,
    idEstacionamento: number,
  ): Promise<PlanoTarifacao> {
    const plano = await this.findOne(planoId);

    if (Number(plano.id_estacionamento) !== Number(idEstacionamento)) {
      throw new BadRequestException(
        'O plano de tarifacao nao pertence ao estacionamento da vaga selecionada.',
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
