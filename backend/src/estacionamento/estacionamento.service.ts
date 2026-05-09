import { Injectable } from '@nestjs/common';
import { Estacionamento } from './estacionamento.model';
import { EstacionamentoRepository } from './estacionamento.repository';

@Injectable()
export class EstacionamentoService {
  constructor(
    private readonly estacionamentoRepository: EstacionamentoRepository,
  ) {}

  async create(data: Partial<Estacionamento>): Promise<Estacionamento> {
    return this.estacionamentoRepository.create({
      ...data,
      vagas_disponiveis: data.vagas_disponiveis ?? data.capacidade ?? 0,
    });
  }

  async findAll(includeAssociations = false): Promise<Estacionamento[]> {
    return this.estacionamentoRepository.findAll(includeAssociations);
  }

  async findOne(
    id: number,
    includeAssociations = false,
  ): Promise<Estacionamento> {
    return this.estacionamentoRepository.findOne(id, includeAssociations);
  }

  async update(
    id: number,
    data: Partial<Estacionamento>,
  ): Promise<Estacionamento> {
    return this.estacionamentoRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    return this.estacionamentoRepository.remove(id);
  }

  async monitorarVagas(id: number) {
    const estacionamento = await this.estacionamentoRepository.findOne(
      id,
      true,
    );
    const vagas = await estacionamento.$get('vagas');
    const vagasDisponiveis = vagas.filter(
      (vaga) => vaga.status === 'disponivel' && !vaga.reservada,
    ).length;

    await estacionamento.update({ vagas_disponiveis: vagasDisponiveis });

    return {
      id_estacionamento: estacionamento.id,
      total_vagas: vagas.length,
      vagas_disponiveis: vagasDisponiveis,
      vagas_ocupadas: vagas.length - vagasDisponiveis,
    };
  }

  async gerarRelatorios(id: number) {
    const estacionamento = await this.estacionamentoRepository.findOne(
      id,
      true,
    );
    const vagas = await estacionamento.$get('vagas');
    const totalVagas = vagas.length;
    const vagasOcupadas = vagas.filter(
      (vaga) => vaga.status === 'ocupada' || vaga.reservada,
    ).length;

    return {
      ocupacao: totalVagas
        ? Number(((vagasOcupadas / totalVagas) * 100).toFixed(2))
        : 0,
      faturamento: vagasOcupadas * 10,
      tempoMedio: vagasOcupadas > 0 ? 120 : 0,
      totalVagas,
      vagasOcupadas,
      vagasDisponiveis: totalVagas - vagasOcupadas,
    };
  }
}
