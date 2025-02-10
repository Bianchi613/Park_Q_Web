import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Usuario } from './usuario.model';

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectModel(Usuario)
    private readonly usuarioModel: typeof Usuario,
  ) {}

  /**
   * Cria um novo usuário no banco de dados
   * @param data Dados do usuário
   */
  async create(data: any): Promise<Usuario> {
    return await this.usuarioModel.create(data);
  }

  /**
   * Retorna todos os usuários do banco de dados
   */
  async findAll(): Promise<Usuario[]> {
    return await this.usuarioModel.findAll();
  }

  /**
   * Busca um usuário pelo ID
   * @param id ID do usuário
   */
  async findOne(id: number): Promise<Usuario> {
    return await this.usuarioModel.findByPk(id);
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
   */
  async update(id: number, data: any): Promise<[number, Usuario[]]> {
    return await this.usuarioModel.update(data, {
      where: { id },
      returning: true,
    });
  }

  /**
   * Exclui um usuário do banco de dados
   * @param id ID do usuário
   */
  async delete(id: number): Promise<void> {
    const usuario = await this.usuarioModel.findByPk(id);
    if (usuario) {
      await usuario.destroy();
    }
  }
}
