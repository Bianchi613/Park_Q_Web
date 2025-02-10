import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { VagaRepository } from './vaga.repository';
import { Vaga } from './vaga.model';

@Injectable()
export class VagaService {
  constructor(private readonly vagaRepository: VagaRepository) {}

  async findAll(): Promise<Vaga[]> {
    return this.vagaRepository.findAll();
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

  async reservar(id: number): Promise<Vaga> {
    return this.vagaRepository.reservar(id);
  }

  async liberar(id: number): Promise<Vaga> {
    return this.vagaRepository.liberar(id);
  }
}
