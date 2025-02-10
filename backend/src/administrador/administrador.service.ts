import { Injectable } from '@nestjs/common';
import { AdministradorRepository } from './administrador.repository';

@Injectable()
export class AdministradorService {
  constructor(
    private readonly administradorRepository: AdministradorRepository,
  ) {}

  // CRUD

  async create(data: any) {
    return this.administradorRepository.create(data);
  }

  async findAll() {
    return this.administradorRepository.findAll();
  }

  async findOne(id: number) {
    return this.administradorRepository.findOne(id);
  }

  async update(id: number, data: any) {
    return this.administradorRepository.update(id, data);
  }

  async delete(id: number) {
    return this.administradorRepository.delete(id);
  }

  // Métodos Específicos

  async adicionarVaga(id: number, data: any) {
    const administrador = await this.findOne(id);
    if (!administrador) {
      throw new Error(`Administrador com ID ${id} não encontrado`);
    }

    // Lógica para adicionar uma vaga
    const vaga = {
      id_estacionamento: data.id_estacionamento,
      numero: data.numero,
      status: 'disponivel',
    };

    // Simula salvar no banco
    return this.administradorRepository.adicionarVaga(vaga);
  }

  async removerVaga(vagaId: number) {
    // Lógica para remover uma vaga
    return this.administradorRepository.removerVaga(vagaId);
  }
}
