import { Injectable } from '@nestjs/common';

@Injectable()
export class AdministradorRepository {
  // CRUD

  async create(data: any) {
    // Simula criação no banco
    return { id: Math.random(), ...data };
  }

  async findAll() {
    // Simula busca de todos os administradores
    return [
      { id: 1, nome: 'Admin 1' },
      { id: 2, nome: 'Admin 2' },
    ];
  }

  async findOne(id: number) {
    // Simula busca por ID no banco
    if (id === 1) {
      return { id: 1, nome: 'Admin 1' };
    }
    return null;
  }

  async update(id: number, data: any) {
    // Simula atualização no banco
    return { id, ...data };
  }

  async delete(id: number) {
    // Simula exclusão no banco
    return { message: `Administrador com ID ${id} deletado` };
  }

  // Métodos Específicos

  async adicionarVaga(data: any) {
    // Simula criação de uma vaga no banco
    return { id: Math.random(), ...data };
  }

  async removerVaga(vagaId: number) {
    // Simula a remoção de uma vaga no banco
    return { message: `Vaga com ID ${vagaId} removida` };
  }
}
