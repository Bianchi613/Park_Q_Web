import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('Autenticacao')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Faz login e retorna o token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido.',
    schema: {
      example: {
        id: 1,
        access_token: 'jwt...',
        role: 'ADMIN',
        id_estacionamento: 1,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciais invalidas.' })
  @ApiBody({
    schema: {
      example: {
        email: 'alan@bianchi.com',
        senha: '12345',
      },
    },
  })
  async login(@Body() data: { email: string; senha: string }) {
    const user = await this.authService.validateUser(data.email, data.senha);
    return this.authService.login(user);
  }
}
