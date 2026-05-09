import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OperacaoService } from '../operacao/operacao.service';
import { UsuarioService } from '../usuario/usuario.service';

type AuthenticatedUser = {
  id: number;
  email: string;
  role: string;
  id_estacionamento?: number;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
    private readonly operacaoService: OperacaoService,
  ) {}

  async validateUser(email: string, senha: string): Promise<AuthenticatedUser> {
    const user = await this.usuarioService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais invalidas.');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      id_estacionamento: user.id_estacionamento,
    };
  }

  async login(user: AuthenticatedUser) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      id_estacionamento: user.id_estacionamento,
    };

    await this.operacaoService.registrar({
      tipo: 'USUARIO',
      descricao: `Usuario ${user.id} realizou login.`,
      id_usuario: user.id,
      entidade: 'Usuario',
      id_entidade: user.id,
      dados: {
        email: user.email,
        role: user.role,
        id_estacionamento: user.id_estacionamento,
      },
    });

    return {
      id: user.id,
      access_token: this.jwtService.sign(payload),
      role: user.role,
      id_estacionamento: user.id_estacionamento,
    };
  }
}
