import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Vaga } from './vaga.model';

@Injectable()
export class VagaRepository {
  constructor(
    @InjectModel(Vaga) // Verifica se o caminho está correto
    private readonly vagaModel: typeof Vaga,
  ) {}

  // 🔍 **Encontrar Todas as Vagas**
  async findAll(): Promise<Vaga[]> {
    return this.vagaModel.findAll();
  }

  // 🔍 **Encontrar uma Vaga por ID**
  async findById(id: number): Promise<Vaga> {
    const vaga = await this.vagaModel.findByPk(id);
    if (!vaga) {
      throw new NotFoundException(`Vaga com id ${id} não encontrada`);
    }
    return vaga;
  }

  // 🟢 **Criar Nova Vaga**
  async create(vagaData: Partial<Vaga>): Promise<Vaga> {
    return this.vagaModel.create(vagaData);
  }

  // 🟡 **Atualizar Vaga**
  async update(id: number, vagaData: Partial<Vaga>): Promise<Vaga> {
    const vaga = await this.findById(id); // Verifica se a vaga existe
    await vaga.update(vagaData); // Atualiza os campos da vaga
    return vaga;
  }

  // 🔴 **Remover Vaga**
  async remove(id: number): Promise<void> {
    const vaga = await this.findById(id); // Verifica se a vaga existe
    await vaga.destroy(); // Exclui a vaga
  }

  // 🔵 **Reservar uma Vaga**
  async reservar(id: number): Promise<Vaga> {
    const vaga = await this.findById(id); // Verifica se a vaga existe
    if (vaga.reservada) {
      throw new ConflictException(`A vaga com ID ${id} já está reservada`);
    }
    await vaga.update({ reservada: true, status: 'ocupada' }); // Atualiza a vaga para "ocupada"
    return vaga;
  }

  // 🟠 **Liberar uma Vaga**
  async liberar(id: number): Promise<Vaga> {
    const vaga = await this.findById(id); // Verifica se a vaga existe
    if (vaga.status !== 'ocupada') {
      throw new ConflictException(
        `A vaga com ID ${id} não pode ser liberada porque não está ocupada`,
      );
    }
    await vaga.update({ reservada: false, status: 'disponivel' }); // Atualiza a vaga para "disponivel"
    return vaga;
  }

  // 🟣 **Atualizar Status de uma Vaga**
  async updateStatus(id: number, status: string): Promise<void> {
    const vaga = await this.findById(id); // Verifica se a vaga existe
    await vaga.update({ status }); // Atualiza o status da vaga
  }

  // 🔍 **Buscar Vaga por ID**
  async findOne(id: number): Promise<Vaga> {
    return this.findById(id); // Alias para findById()
  }
}
