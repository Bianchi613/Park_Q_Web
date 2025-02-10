import { Injectable, NotFoundException } from '@nestjs/common';
import { Pagamento } from './pagamento.model';
import { PagamentoRepository } from './pagamento.repository';

@Injectable()
export class PagamentoService {
  constructor(private readonly pagamentoRepository: PagamentoRepository) {}

  async createPagamento(data: Partial<Pagamento>): Promise<Pagamento> {
    return this.pagamentoRepository.create(data);
  }

  async getAllPagamentos(): Promise<Pagamento[]> {
    return this.pagamentoRepository.findAll();
  }

  async getPagamentoById(id: number): Promise<Pagamento> {
    const pagamento = await this.pagamentoRepository.findById(id);
    if (!pagamento) {
      throw new NotFoundException(`Pagamento with ID ${id} not found.`);
    }
    return pagamento;
  }

  async updatePagamento(
    id: number,
    data: Partial<Pagamento>,
  ): Promise<Pagamento> {
    const [rowsUpdated, [updatedPagamento]] =
      await this.pagamentoRepository.update(id, data);
    if (rowsUpdated === 0) {
      throw new NotFoundException(`Pagamento with ID ${id} not found.`);
    }
    return updatedPagamento;
  }

  async deletePagamento(id: number): Promise<void> {
    const pagamento = await this.pagamentoRepository.findById(id);
    if (!pagamento) {
      throw new NotFoundException(`Pagamento with ID ${id} not found.`);
    }
    await this.pagamentoRepository.delete(id);
  }
}
