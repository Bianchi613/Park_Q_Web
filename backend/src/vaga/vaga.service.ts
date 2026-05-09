import { Injectable } from '@nestjs/common';
import { Vaga } from './vaga.model';
import { VagaRepository } from './vaga.repository';

@Injectable()
export class VagaService {
  constructor(private readonly vagaRepository: VagaRepository) {}

  async findAll(idEstacionamento?: number): Promise<Vaga[]> {
    return this.vagaRepository.findAll(idEstacionamento);
  }

  async findOne(id: number): Promise<Vaga> {
    return this.vagaRepository.findById(id);
  }

  async create(vagaData: Partial<Vaga>): Promise<Vaga> {
    return this.vagaRepository.create(vagaData);
  }

  async update(id: number, vagaData: Partial<Vaga>): Promise<Vaga> {
    return this.vagaRepository.update(id, vagaData);
  }

  async remove(id: number): Promise<void> {
    return this.vagaRepository.remove(id);
  }

  async reservar(id: number, idReserva?: number): Promise<Vaga> {
    return this.vagaRepository.reservar(id, idReserva);
  }

  async liberar(id: number): Promise<Vaga> {
    return this.vagaRepository.liberar(id);
  }

  async syncVagasDisponiveis(idEstacionamento: number): Promise<void> {
    return this.vagaRepository.syncVagasDisponiveis(idEstacionamento);
  }
}
