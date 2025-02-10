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

    // Se o usuário não for encontrado, lança uma exceção
    if (!user) {
      console.log('❌ Usuário não encontrado.');
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    console.log(`✅ Usuário encontrado: ${user.email}`);
    console.log(`🔐 Senha armazenada no banco: ${user.senha}`);
    console.log(`🔑 Senha digitada pelo usuário: ${senha}`);

    // Verifica se a senha está criptografada corretamente
    if (!user.senha || !user.senha.startsWith('$2b$')) {
      console.log('❌ Senha não está criptografada corretamente.');
      throw new UnauthorizedException('Erro interno na autenticação.');
    }

    // Comparando a senha digitada com a armazenada
    console.log('🛠️ Testando bcrypt.compare()...');
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    console.log(`🔍 Resultado de bcrypt.compare(): ${isPasswordValid ? '✅ Senha correta' : '❌ Senha inválida'}`);

    // Caso a senha não seja válida
    if (!isPasswordValid) {
      console.log('❌ Senha inválida.');
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    console.log('✅ Senha correta. Login autorizado.');

    // Retorna o usuário com o role, que será usado no login
    return {
      id: user.id,
      email: user.email,
      role: user.role,  // Garantir que o role do usuário seja retornado
    };
  }

  // Função para gerar o token JWT e retornar junto com o role do usuário
  async login(user: { id: number; email: string; role: string }): Promise<{ access_token: string; role: string }> {
    // Gerando o payload com id, email e role
    const payload = { id: user.id, email: user.email, role: user.role };

    // Gerando o token com o payload
    const access_token = this.jwtService.sign(payload);
    
    // Retorna o token e o role
    return {
      access_token,
      role: user.role,  // Incluindo o role na resposta do login
    };
  }
}
