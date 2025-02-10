import { Injectable } from '@nestjs/common';
import { OperacaoRepository } from './operacao.repository';
import { Operacao } from './operacao.model';

@Injectable()
export class OperacaoService {
  constructor(private readonly operacaoRepository: OperacaoRepository) {}

  async create(
    descricao: string,
    data_hora: Date,
    id_usuario: number,
  ): Promise<Operacao> {
    try {
      return await this.operacaoRepository.create(
        descricao,
        data_hora,
        id_usuario,
      );
    } catch (error) {
      throw new Error(`Erro ao criar operação: ${error.message}`);
    }
  }

  async findAll(): Promise<Operacao[]> {
    try {
      return await this.operacaoRepository.findAll();
    } catch (error) {
      throw new Error(`Erro ao recuperar as operações: ${error.message}`);
    }
  }

  async findOne(id: number): Promise<Operacao> {
    try {
      return await this.operacaoRepository.findOne(id);
    } catch (error) {
      throw new Error(`Erro ao recuperar operação: ${error.message}`);
    }
  }

  async update(
    id: number,
    descricao: string,
    data_hora: Date,
    id_usuario: number,
  ): Promise<Operacao> {
    try {
      return await this.operacaoRepository.update(
        id,
        descricao,
        data_hora,
        id_usuario,
      );
    } catch (error) {
      throw new Error(`Erro ao atualizar operação: ${error.message}`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.operacaoRepository.remove(id);
    } catch (error) {
      throw new Error(`Erro ao deletar operação: ${error.message}`);
    }
  }
}
