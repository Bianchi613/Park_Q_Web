import { BadRequestException, Injectable } from '@nestjs/common';
import {
  Operacao,
  OPERACAO_TIPOS,
  OperacaoResultado,
  OperacaoTipo,
} from './operacao.model';
import { OperacaoFilters, OperacaoRepository } from './operacao.repository';

export interface RegistrarOperacaoInput {
  tipo?: OperacaoTipo;
  descricao: string;
  id_usuario: number;
  entidade?: string;
  id_entidade?: number;
  dados?: Record<string, unknown>;
  resultado?: OperacaoResultado;
}

@Injectable()
export class OperacaoService {
  constructor(private readonly operacaoRepository: OperacaoRepository) {}

  async create(data: any): Promise<Operacao> {
    return this.registrar({
      tipo: data.tipo,
      descricao: data.descricao,
      id_usuario: data.id_usuario,
      entidade: data.entidade,
      id_entidade: data.id_entidade,
      dados: data.dados,
      resultado: data.resultado,
    });
  }

  async registrar(data: RegistrarOperacaoInput): Promise<Operacao> {
    if (!data.id_usuario) {
      throw new BadRequestException('id_usuario e obrigatorio.');
    }

    if (!data.descricao?.trim()) {
      throw new BadRequestException('descricao e obrigatoria.');
    }

    return this.operacaoRepository.create({
      tipo: this.normalizeTipo(data.tipo),
      descricao: data.descricao.trim(),
      data_hora: new Date(),
      id_usuario: data.id_usuario,
      entidade: data.entidade,
      id_entidade: data.id_entidade,
      dados: data.dados,
      resultado: data.resultado ?? 'SUCESSO',
    });
  }

  async registrarReservaCriada(reserva: {
    id: number;
    id_usuario: number;
    id_vaga: number;
    id_plano?: number;
    valor?: number;
    data_reserva?: Date;
    data_fim?: Date;
  }): Promise<Operacao> {
    return this.registrar({
      tipo: 'RESERVA',
      descricao: `Reserva ${reserva.id} criada.`,
      id_usuario: reserva.id_usuario,
      entidade: 'Reserva',
      id_entidade: reserva.id,
      dados: {
        id_vaga: reserva.id_vaga,
        id_plano: reserva.id_plano,
        valor: reserva.valor,
        data_reserva: reserva.data_reserva,
        data_fim: reserva.data_fim,
      },
    });
  }

  async registrarReservaCancelada(reserva: {
    id: number;
    id_usuario: number;
    id_vaga: number;
  }): Promise<Operacao> {
    return this.registrar({
      tipo: 'CANCELAMENTO',
      descricao: `Reserva ${reserva.id} cancelada.`,
      id_usuario: reserva.id_usuario,
      entidade: 'Reserva',
      id_entidade: reserva.id,
      dados: {
        id_vaga: reserva.id_vaga,
      },
    });
  }

  async registrarPagamentoConfirmado(data: {
    id_pagamento: number;
    id_reserva: number;
    id_usuario: number;
    metodo_pagamento: string;
    valor_pago: number;
  }): Promise<Operacao> {
    return this.registrar({
      tipo: 'PAGAMENTO',
      descricao: `Pagamento ${data.id_pagamento} registrado.`,
      id_usuario: data.id_usuario,
      entidade: 'Pagamento',
      id_entidade: data.id_pagamento,
      dados: {
        id_reserva: data.id_reserva,
        metodo_pagamento: data.metodo_pagamento,
        valor_pago: data.valor_pago,
      },
    });
  }

  async findAll(filters: OperacaoFilters = {}): Promise<Operacao[]> {
    return this.operacaoRepository.findAll(filters);
  }

  async findOne(id: number): Promise<Operacao> {
    return this.operacaoRepository.findOne(id);
  }

  async update(id: number, data: any): Promise<Operacao> {
    return this.operacaoRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    return this.operacaoRepository.remove(id);
  }

  private normalizeTipo(tipo?: OperacaoTipo): OperacaoTipo {
    if (!tipo) {
      return 'SISTEMA';
    }

    if (!OPERACAO_TIPOS.includes(tipo)) {
      throw new BadRequestException('tipo de operacao invalido.');
    }

    return tipo;
  }
}
