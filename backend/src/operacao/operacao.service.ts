import { Injectable } from '@nestjs/common';
import { Operacao } from './operacao.model';
import { OperacaoRepository } from './operacao.repository';

@Injectable()
export class OperacaoService {
  constructor(private readonly operacaoRepository: OperacaoRepository) {}

  async create(data: Partial<Operacao>): Promise<Operacao> {
    return this.operacaoRepository.create(data);
  }

  async findAll(): Promise<Operacao[]> {
    return this.operacaoRepository.findAll();
  }

  async findOne(id: number): Promise<Operacao> {
    return this.operacaoRepository.findOne(id);
  }

  async update(id: number, data: Partial<Operacao>): Promise<Operacao> {
    return this.operacaoRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    return this.operacaoRepository.remove(id);
  }
}
