import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Autenticação') // Define a categoria no Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Faz login e retorna o token JWT' }) // Descrição do endpoint
  @ApiResponse({
    status: 200, // 🔹 Correção do status para 200 OK
    description: 'Login bem-sucedido. Retorna o token JWT, o ID e o perfil do usuário.',
    schema: {
      example: {
        id: 1, // ✅ Agora o ID do usuário aparece primeiro
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        role: 'ADMIN', // Inclui o role do usuário
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Credenciais inválidas.',
        error: 'Unauthorized',
      },
    },
  })
  @ApiBody({
    schema: {
      example: {
        email: 'alan@bianchi.com',
        senha: '12345',
      },
    },
  })
  async login(@Body() data: any) {
    // Chama o service para validar o usuário e a senha
    const user = await this.authService.validateUser(data.email, data.senha);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // Gera o token JWT e retorna os dados necessários
    const authResult = await this.authService.login(user);

    // ✅ Agora incluímos o ID na resposta
    return {
      id: user.id, 
      access_token: authResult.access_token,
      role: authResult.role
    };
  }
}
