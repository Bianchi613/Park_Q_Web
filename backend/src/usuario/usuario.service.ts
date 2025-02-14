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
    console.log(`🛠️ Tentando criar usuário: ${data.email}`);
    const existingUser = await this.usuarioRepository.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestException('O e-mail já está em uso.');
    }

    // 🔥 Verifica se há senha e gera o hash antes de salvar
    if (data.senha) {
      console.log(`🔑 Senha original: ${data.senha}`);
      const hashedPassword = await bcrypt.hash(data.senha, 10);
      console.log(`✅ Hash gerado para ${data.email}: ${hashedPassword}`);
      data.senha = hashedPassword;
    }

    // 🔥 Inserindo no banco
    console.log(`🗄️ Salvando usuário ${data.email} no banco...`);
    const newUser = await this.usuarioRepository.create(data);

    // ✅ Confirmação de criação
    console.log(`🎉 Usuário criado com ID: ${newUser.id}`);
    return newUser;
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
    console.log(`🔍 Usuário encontrado por ID ${id}:`, user);
    return user;
  }

  /**
   * Busca um usuário pelo e-mail e exibe o hash armazenado
   * @param email E-mail do usuário
   */
  async findByEmail(email: string) {
    console.log(`🔍 Buscando usuário com email: ${email}`);
    const user = await this.usuarioRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    console.log(`✅ Usuário encontrado: ${email}`);
    console.log(`🔑 Hash armazenado no banco: ${user.senha}`);
    return user;
  }

  /**
   * Atualiza os dados de um usuário
   * @param id ID do usuário
   * @param data Dados a serem atualizados
   */
  async update(id: number, data: any) {
    console.log(`🔄 Tentando atualizar usuário ID: ${id}`);
    const user = await this.usuarioRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    // 🔥 Se for alterar a senha, verifica se já é um hash antes de criptografar
    if (data.senha && !data.senha.startsWith('$2b$')) {
      console.log(`🔑 Nova senha recebida, gerando hash...`);
      const hashedPassword = await bcrypt.hash(data.senha, 10);
      console.log(`✅ Novo hash gerado para usuário ${id}: ${hashedPassword}`);
      data.senha = hashedPassword;
    }

    // 🔥 Atualizando no banco
    const updatedUser = await this.usuarioRepository.update(id, data);
    console.log(`✅ Usuário ${id} atualizado`);
    return updatedUser;
  }

  /**
   * Exclui um usuário do sistema
   * @param id ID do usuário
   */
  async delete(id: number) {
    console.log(`🗑️ Tentando deletar usuário ID: ${id}`);
    const user = await this.usuarioRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    await this.usuarioRepository.delete(id);
    console.log(`❌ Usuário ${id} deletado`);
    return { message: 'Usuário deletado com sucesso' };
  }
}