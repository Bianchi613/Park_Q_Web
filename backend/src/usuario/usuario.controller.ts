import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.model';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Usuários') // Define a categoria no Swagger
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiBody({
    schema: {
      example: {
        CPF: '12345678901',
        nome: 'Alan Bianchi',
        email: 'alan@bianchi.com',
        telefone: '11999999999',
        login: 'alanbianchi',
        senha: '12345',
        role: 'ADMIN',
        id_estacionamento: 1,
      },
    },
  })
  async create(@Body() data: Partial<Usuario>) {
    try {
      // Verifica se CLIENT ou VISITOR não possuem id_estacionamento
      if (data.role !== 'ADMIN') {
        data.id_estacionamento = null;
      }

      // Se for ADMIN, validar id_estacionamento
      if (data.role === 'ADMIN' && !data.id_estacionamento) {
        throw new BadRequestException('ADMIN precisa ter um id_estacionamento.');
      }

      return await this.usuarioService.create(data);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao criar usuário',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários retornada com sucesso.',
  })
  async findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.usuarioService.findOne(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao buscar usuário',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um usuário' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  @ApiBody({
    schema: {
      example: {
        CPF: '12345678901',
        nome: 'Alan Bianchi Atualizado',
        email: 'alan@bianchi.com',
        telefone: '11988888888',
        login: 'alanbianchi2',
        senha: '54321',
        role: 'CLIENT',
        id_estacionamento: null,
      },
    },
  })
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<Usuario>) {
    try {
      // Verifica se CLIENT ou VISITOR não possuem id_estacionamento
      if (data.role !== 'ADMIN') {
        data.id_estacionamento = null;
      }

      // Se for ADMIN, validar id_estacionamento
      if (data.role === 'ADMIN' && !data.id_estacionamento) {
        throw new BadRequestException('ADMIN precisa ter um id_estacionamento.');
      }

      return await this.usuarioService.update(id, data);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao atualizar usuário',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um usuário pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuário' })
  @ApiResponse({ status: 204, description: 'Usuário excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      return await this.usuarioService.delete(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erro ao excluir usuário',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
