import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pagamento } from './pagamento.model';

@Injectable()
export class PagamentoRepository {
  constructor(
    @InjectModel(Pagamento)
    private readonly pagamentoModel: typeof Pagamento,
  ) {}

  async create(data: Partial<Pagamento>): Promise<Pagamento> {
    return this.pagamentoModel.create(data);
  }

  async findAll(idEstacionamento?: number): Promise<Pagamento[]> {
    return this.pagamentoModel.findAll({
      include: [
        {
          association: 'reserva',
          include: [
            {
              association: 'vaga',
              ...(idEstacionamento
                ? { where: { id_estacionamento: idEstacionamento } }
                : {}),
              required: !!idEstacionamento,
            },
          ],
          required: !!idEstacionamento,
        },
      ],
      order: [['id', 'DESC']],
    });
  }

  async findById(id: number): Promise<Pagamento> {
    const pagamento = await this.pagamentoModel.findByPk(id, {
      include: ['reserva'],
    });

    if (!pagamento) {
      throw new NotFoundException(`Pagamento com ID ${id} nao encontrado.`);
    }

    return pagamento;
  }

  async update(id: number, data: Partial<Pagamento>): Promise<Pagamento> {
    const pagamento = await this.findById(id);
    await pagamento.update(data);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const pagamento = await this.findById(id);
    await pagamento.destroy();
  }
}
