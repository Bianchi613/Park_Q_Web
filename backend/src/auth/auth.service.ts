import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from '../usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  // Função de validação de usuário (com a senha e role)
  async validateUser(email: string, senha: string): Promise<{ id: number; email: string; role: string } | null> {
    console.log(`🔍 Buscando usuário com email: ${email}`);
    const user = await this.usuarioService.findByEmail(email);

    if (!user) {
      console.log('❌ Usuário não encontrado.');
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    console.log(`✅ Usuário encontrado: ${user.email}`);

    // 🚀 Comparando a senha usando `comparePassword()` da model!
    console.log('🛠️ Testando user.comparePassword()...');
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    console.log(`🔍 Resultado: ${isPasswordValid ? '✅ Senha correta' : '❌ Senha inválida'}`);

    if (!isPasswordValid) {
      console.log('❌ Senha inválida.');
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    console.log('✅ Senha correta. Login autorizado.');

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  // Função para gerar o token JWT e retornar junto com o role do usuário
  async login(user: { id: number; email: string; role: string }): Promise<{ access_token: string; role: string }> {
    const payload = { id: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      role: user.role,
    };
  }
}
