import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsuarioRepository } from './usuario.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  /**
   * Cria um novo usuário no sistema
   * @param data Dados do usuário (nome, email, senha, role)
   */
  async create(data: any) {
    // Valida se o e-mail já está em uso
    const existingUser = await this.usuarioRepository.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('O e-mail já está em uso.');
    }

    // Criptografa a senha antes de salvar
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    return this.usuarioRepository.create(data);
  }

  /**
   * Retorna todos os usuários cadastrados
   */
  async findAll() {
    return this.usuarioRepository.findAll();
  }

  /**
   * Busca um usuário pelo ID
   * @param id ID do usuário
   */
  async findOne(id: number) {
    const user = await this.usuarioRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  /**
   * Busca um usuário pelo e-mail
   * @param email E-mail do usuário
   */
  async findByEmail(email: string) {
    const user = await this.usuarioRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  /**
   * Atualiza os dados de um usuário
   * @param id ID do usuário
   * @param data Dados a serem atualizados
   */
  async update(id: number, data: any) {
    const user = await this.usuarioRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    // Se for alterar a senha, criptografa a nova senha
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    return this.usuarioRepository.update(id, data);
  }

  /**
   * Exclui um usuário do sistema
   * @param id ID do usuário
   */
  async delete(id: number) {
    const user = await this.usuarioRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return this.usuarioRepository.delete(id);
  }
}
