import { Injectable, NotFoundException } from '@nestjs/common';
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
  async create(data: Usuario): Promise<Usuario> {
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
    const usuario = await this.usuarioModel.findByPk(id);
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
   */
  async update(id: number, data: Partial<Usuario>): Promise<Usuario> {
    const usuario = await this.findOne(id); // Garante que o usuário existe antes de atualizar
    await usuario.update(data);
    return usuario;
  }

  /**
   * Exclui um usuário do banco de dados
   * @param id ID do usuário
   */
  async delete(id: number): Promise<boolean> {
    const usuario = await this.usuarioModel.findByPk(id);
    if (!usuario) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }
    await usuario.destroy();
    return true;
  }
}
