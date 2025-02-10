import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cliente } from './cliente.model';
import { ReservaRepository } from '../reserva/reserva.repository'; // Importação do ReservaRepository

@Injectable()
export class ClienteRepository {
  constructor(
    private readonly reservaRepository: ReservaRepository, // Injeção do ReservaRepository
    @InjectModel(Cliente)
    private readonly clienteModel: typeof Cliente,
  ) {}

  // CRUD

  async create(data: any) {
    return this.clienteModel.create(data); // Utiliza o clienteModel para criar o cliente
  }

  async findAll() {
    return this.clienteModel.findAll(); // Utiliza o clienteModel para buscar todos os clientes
  }

  async findOne(id: number) {
    const cliente = await this.clienteModel.findByPk(id);
    if (!cliente) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }
    return cliente;
  }

  async update(id: number, data: any) {
    const cliente = await this.findOne(id);
    await cliente.update(data);
    return cliente;
  }

  async delete(id: number) {
    const cliente = await this.findOne(id);
    await cliente.destroy();
  }

  // Métodos Específicos para Reservas

  async reservarVaga(data: any) {
    return this.reservaRepository.createReserva(data); // Agora utiliza o método do ReservaRepository
  }

  async cancelarReserva(id_reserva: number) {
    const reserva = await this.reservaRepository.findReservaById(id_reserva);
    if (!reserva) {
      throw new NotFoundException(
        `Reserva com ID ${id_reserva} não encontrada`,
      );
    }
    await this.reservaRepository.deleteReserva(id_reserva); // Agora utiliza o método do ReservaRepository
  }

  async findReserva(id_reserva: number) {
    return this.reservaRepository.findReservaById(id_reserva); // Agora utiliza o método do ReservaRepository
  }
}
