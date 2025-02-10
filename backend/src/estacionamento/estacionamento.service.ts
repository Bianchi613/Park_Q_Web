import { Injectable } from '@nestjs/common';
import { EstacionamentoRepository } from './estacionamento.repository';
import { Estacionamento } from './estacionamento.model';

@Injectable()
export class EstacionamentoService {
  constructor(
    private readonly estacionamentoRepository: EstacionamentoRepository,
  ) {}

  async create(createEstacionamentoDto: any): Promise<Estacionamento> {
    return this.estacionamentoRepository.create(createEstacionamentoDto);
  }

  async findAll(includeAssociations: boolean = false): Promise<Estacionamento[]> {
    return this.estacionamentoRepository.findAll(includeAssociations);
  }

  async findOne(id: number, includeAssociations: boolean = false): Promise<Estacionamento> {
    return this.estacionamentoRepository.findOne(id, includeAssociations);
  }

  async update(
    id: number,
    updateEstacionamentoDto: any,
  ): Promise<Estacionamento> {
    return this.estacionamentoRepository.update(id, updateEstacionamentoDto);
  }

  async remove(id: number): Promise<void> {
    return this.estacionamentoRepository.remove(id);
  }

  // Monitorar as vagas
  async monitorarVagas(id: number): Promise<void> {
    const estacionamento = await this.estacionamentoRepository.findOne(id, true); // Inclui as associações
    if (estacionamento) {
      const vagasOcupadas = await estacionamento.$get('vagas');
      const vagasDisponiveis = vagasOcupadas.filter(
        (vaga) => vaga.status === 'disponivel',
      ).length;
      await estacionamento.update({ vagas_disponiveis: vagasDisponiveis });
    }
  }

  // Gerar relatórios de ocupação e faturamento
  async gerarRelatorios(id: number): Promise<any> {
    const estacionamento = await this.estacionamentoRepository.findOne(id, true); // Inclui as associações
    if (!estacionamento) return { error: 'Estacionamento não encontrado' };

    const vagas = await estacionamento.$get('vagas');
    const totalVagas = vagas.length;
    const vagasOcupadas = vagas.filter(
      (vaga) => vaga.status === 'ocupada',
    ).length;

    // Calculando o faturamento (ajuste conforme necessário)
    const faturamento = vagasOcupadas * 10; // considerando o custo por vaga

    // Tempo médio de permanência (ajuste conforme necessário)
    const tempoMedio = vagasOcupadas > 0 ? 120 : 0; // Exemplo, considerando 120 minutos por vaga ocupada

    return {
      ocupacao: (vagasOcupadas / totalVagas) * 100, // Cálculo de taxa de ocupação
      faturamento,
      tempoMedio,
    };
  }
}
