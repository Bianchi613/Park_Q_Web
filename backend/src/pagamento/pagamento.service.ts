import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificacaoService } from '../notificacao/notificacao.service';
import { OperacaoService } from '../operacao/operacao.service';
import { ReservaService } from '../reserva/reserva.service';
import { Pagamento } from './pagamento.model';
import { PagamentoRepository } from './pagamento.repository';

@Injectable()
export class PagamentoService {
  constructor(
    private readonly pagamentoRepository: PagamentoRepository,
    private readonly reservaService: ReservaService,
    private readonly operacaoService: OperacaoService,
    private readonly notificacaoService: NotificacaoService,
  ) {}

  async createPagamento(data: Partial<Pagamento>): Promise<Pagamento> {
    return this.registrarPagamento(data);
  }

  async registrarPagamento(data: Partial<Pagamento>): Promise<Pagamento> {
    const payload = this.normalizePayload(data);
    const reserva = await this.reservaService.findReservaById(
      payload.id_reserva,
    );
    const pagamento = await this.pagamentoRepository.create(payload);

    await this.operacaoService.registrarPagamentoConfirmado({
      id_pagamento: pagamento.id,
      id_reserva: pagamento.id_reserva,
      id_usuario: reserva.id_usuario,
      metodo_pagamento: pagamento.metodo_pagamento,
      valor_pago: Number(pagamento.valor_pago),
    });
    await this.notificacaoService.notificarPagamentoConfirmado({
      id_pagamento: pagamento.id,
      id_reserva: pagamento.id_reserva,
      id_usuario: reserva.id_usuario,
      valor_pago: Number(pagamento.valor_pago),
    });

    return pagamento;
  }

  validarPagamento(data: Partial<Pagamento>): Partial<Pagamento> {
    return this.normalizePayload(data);
  }

  async getAllPagamentos(): Promise<Pagamento[]> {
    return this.pagamentoRepository.findAll();
  }

  async getPagamentoById(id: number): Promise<Pagamento> {
    return this.pagamentoRepository.findById(id);
  }

  async updatePagamento(
    id: number,
    data: Partial<Pagamento>,
  ): Promise<Pagamento> {
    return this.pagamentoRepository.update(
      id,
      this.normalizePayload(data, false),
    );
  }

  async deletePagamento(id: number): Promise<void> {
    await this.pagamentoRepository.delete(id);
  }

  private normalizePayload(
    data: Partial<Pagamento>,
    validateRequired = true,
  ): Partial<Pagamento> {
    const normalized = {
      ...data,
      metodo_pagamento: data.metodo_pagamento
        ? this.normalizeMetodoPagamento(data.metodo_pagamento)
        : data.metodo_pagamento,
    };

    if (validateRequired) {
      if (!normalized.id_reserva) {
        throw new BadRequestException('id_reserva e obrigatorio.');
      }

      if (!normalized.metodo_pagamento) {
        throw new BadRequestException('metodo_pagamento e obrigatorio.');
      }

      if (
        normalized.valor_pago === undefined ||
        normalized.valor_pago === null
      ) {
        throw new BadRequestException('valor_pago e obrigatorio.');
      }
    }

    return normalized;
  }

  private normalizeMetodoPagamento(metodo: string): string {
    const normalized = metodo
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

    const map: Record<string, string> = {
      pix: 'PIX',
      boleto: 'boleto',
      'boleto bancario': 'boleto',
      cartao: 'cartao_credito',
      'cartao de credito': 'cartao_credito',
      cartao_credito: 'cartao_credito',
    };

    const value = map[normalized];

    if (!value) {
      throw new BadRequestException('Metodo de pagamento invalido.');
    }

    return value;
  }
}
