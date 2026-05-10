import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Transaction, literal } from 'sequelize';
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

  async findAll(idEstacionamento?: number): Promise<Usuario[]> {
    const where: any = {};

    if (idEstacionamento) {
      where[Op.or] = [
        { id_estacionamento: idEstacionamento },
        literal(`
          EXISTS (
            SELECT 1
            FROM "Reservas" r
            INNER JOIN "Vagas" v ON v."id" = r."id_vaga"
            WHERE r."id_usuario" = "Usuario"."id"
              AND v."id_estacionamento" = ${idEstacionamento}
          )
        `),
      ];
    }

    return this.usuarioModel.findAll({
      where,
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
