import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { Usuario } from './usuario.model';

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectModel(Usuario)
    private readonly usuarioModel: typeof Usuario,
  ) {}

  async create(
    data: Partial<Usuario>,
    transaction?: Transaction,
  ): Promise<Usuario> {
    return this.usuarioModel.create(data, { transaction });
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.findAll({
      attributes: { exclude: ['senha'] },
      order: [['id', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioModel.findByPk(id, {
      attributes: { exclude: ['senha'] },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario com ID ${id} nao encontrado.`);
    }

    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioModel.findOne({ where: { email } });
  }

  async update(
    id: number,
    data: Partial<Usuario>,
    transaction?: Transaction,
  ): Promise<Usuario> {
    const usuario = await this.usuarioModel.findByPk(id, { transaction });

    if (!usuario) {
      throw new NotFoundException(`Usuario com ID ${id} nao encontrado.`);
    }

    await usuario.update(data, { transaction });
    return this.findOne(id);
  }

  async delete(id: number, transaction?: Transaction): Promise<void> {
    const usuario = await this.usuarioModel.findByPk(id, { transaction });

    if (!usuario) {
      throw new NotFoundException(`Usuario com ID ${id} nao encontrado.`);
    }

    await usuario.destroy({ transaction });
  }
}
