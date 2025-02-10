import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ClienteRepository } from './cliente.repository';
import { VagaRepository } from '../vaga/vaga.repository'; // Caminho correto para VagaRepository

@Injectable()
export class ClienteService {
  constructor(
    private readonly clienteRepository: ClienteRepository,
    private readonly vagaRepository: VagaRepository, // Injeção do VagaRepository
  ) {}

  // 🟢 **CRUD - Operações básicas de Cliente**

  async create(data: any) {
    return this.clienteRepository.create(data);
  }

  async findAll() {
    return this.clienteRepository.findAll();
  }

  async findOne(id: number) {
    const cliente = await this.clienteRepository.findOne(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return cliente;
  }

  async update(id: number, data: any) {
    await this.findOne(id); // Verificação se o cliente existe
    return this.clienteRepository.update(id, data);
  }

  async delete(id: number) {
    await this.findOne(id); // Verificação se o cliente existe
    return this.clienteRepository.delete(id);
  }

  // 🟢 **Método para Reservar Vaga**
  async reservarVaga(id: number, data: any) {
    // 1️⃣ **Verifica se o cliente existe**
    const cliente = await this.findOne(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    // 2️⃣ **Verifica se a vaga está disponível**
    const vaga = await this.vagaRepository.findById(data.id_vaga);
    if (!vaga) {
      throw new NotFoundException(`Vaga com ID ${data.id_vaga} não encontrada`);
    }

    if (vaga.status !== 'disponivel') {
      throw new ConflictException(
        `A vaga com ID ${data.id_vaga} não está disponível para reserva`,
      );
    }

    // 3️⃣ **Atualiza o status da vaga para "ocupada"**
    await this.vagaRepository.updateStatus(data.id_vaga, 'ocupada');

    // 4️⃣ **Cria a reserva**
    const reserva = {
      id_cliente: id,
      id_vaga: data.id_vaga,
      data_reserva: new Date(),
      status: 'reservada',
    };

    // 5️⃣ **Salva a reserva no banco**
    return this.clienteRepository.reservarVaga(reserva);
  }

  // 🟢 **Método para Cancelar Reserva**
  async cancelarReserva(id: number, data: any) {
    // 1️⃣ **Verifica se o cliente existe**
    const cliente = await this.findOne(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    // 2️⃣ **Verifica se a reserva existe**
    const reserva = await this.clienteRepository.findReserva(data.id_reserva);
    if (!reserva) {
      throw new NotFoundException(
        `Reserva com ID ${data.id_reserva} não encontrada`,
      );
    }

    // 3️⃣ **Remove a reserva no banco**
    await this.clienteRepository.cancelarReserva(data.id_reserva);

    // 4️⃣ **Atualiza o status da vaga para "disponivel"**
    await this.vagaRepository.updateStatus(reserva.id_vaga, 'disponivel');

    return `Reserva de ID ${data.id_reserva} foi cancelada com sucesso.`;
  }
}
