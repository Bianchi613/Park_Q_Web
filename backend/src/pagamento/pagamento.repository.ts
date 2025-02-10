import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Pagamento } from './pagamento.model';

@Injectable()
export class PagamentoRepository {
  constructor(
    @InjectModel(Pagamento) private readonly pagamentoModel: typeof Pagamento,
  ) {}

  async create(data: Partial<Pagamento>): Promise<Pagamento> {
    return await this.pagamentoModel.create(data);
  }

  async findAll(): Promise<Pagamento[]> {
    return await this.pagamentoModel.findAll({ include: { all: true } });
  }

  async findById(id: number): Promise<Pagamento | null> {
    return await this.pagamentoModel.findByPk(id, { include: { all: true } });
  }

  async update(
    id: number,
    data: Partial<Pagamento>,
  ): Promise<[number, Pagamento[]]> {
    return await this.pagamentoModel.update(data, {
      where: { id },
      returning: true,
    });
  }

  async delete(id: number): Promise<void> {
    const pagamento = await this.findById(id);
    if (pagamento) {
      await pagamento.destroy();
    }
  }
}
