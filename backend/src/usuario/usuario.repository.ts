import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Usuario } from './usuario.model';
import { Transaction } from 'sequelize';

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectModel(Usuario)
    private readonly usuarioModel: typeof Usuario,
  ) {}

  /**
   * Cria um novo usuário no banco de dados
   * @param data Dados do usuário
   * @param transaction Transação opcional
   */
  async create(data: Partial<Usuario>, transaction?: Transaction): Promise<Usuario> {
    return await this.usuarioModel.create(data, { transaction });
  }

  /**
   * Retorna todos os usuários do banco de dados
   */
  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarioModel.findAll({
      attributes: { exclude: ['senha'] }, // Exclui a senha do retorno
    });
    return usuarios;
  }

  /**
   * Busca um usuário pelo ID
   * @param id ID do usuário
   */
  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioModel.findByPk(id, {
      attributes: { exclude: ['senha'] }, // Exclui a senha do retorno
    });
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    return usuario;
  }

  /**
   * Busca um usuário pelo e-mail
   * @param email E-mail do usuário
   */
  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioModel.findOne({
      where: { email },
    });
  }

  /**
   * Atualiza os dados de um usuário
   * @param id ID do usuário
   * @param data Dados a serem atualizados
   * @param transaction Transação opcional
   */
  async update(
    id: number,
    data: Partial<Usuario>,
    transaction?: Transaction,
  ): Promise<Usuario> {
    const usuario = await this.usuarioModel.findByPk(id, { transaction });
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    await usuario.update(data, { transaction });
    return usuario;
  }

  /**
   * Exclui um usuário do banco de dados
   * @param id ID do usuário
   * @param transaction Transação opcional
   */
  async delete(id: number, transaction?: Transaction): Promise<boolean> {
    const usuario = await this.usuarioModel.findByPk(id, { transaction });
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    await usuario.destroy({ transaction });
    return true;
  }
}