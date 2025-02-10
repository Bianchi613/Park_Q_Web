import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Clientes') // Define a categoria no Swagger
@Controller('clientes')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  // CRUD

  @Post()
  @ApiOperation({ summary: 'Cria um novo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiBody({
    schema: {
      example: {
        nome: 'Alan Bianchi',
        email: 'alan@bianchi.com',
        senha: '12345',
        telefone: '11999999999',
      },
    },
  })
  async create(@Body() data: any) {
    try {
      return await this.clienteService.create(data);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todos os clientes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clientes retornada com sucesso.',
  })
  async findAll() {
    try {
      return await this.clienteService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um cliente pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  async findOne(@Param('id') id: number) {
    try {
      return await this.clienteService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 200, description: 'Cliente atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  @ApiBody({
    schema: {
      example: {
        nome: 'Alan Bianchi Atualizado',
        email: 'alan@bianchi.com',
        telefone: '11988888888',
      },
    },
  })
  async update(@Param('id') id: number, @Body() data: any) {
    try {
      return await this.clienteService.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um cliente pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({ status: 204, description: 'Cliente excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado.' })
  async delete(@Param('id') id: number) {
    try {
      return await this.clienteService.delete(id);
    } catch (error) {
      throw error;
    }
  }

  // Métodos Específicos

  @Post(':id/reservarVaga')
  @ApiOperation({ summary: 'Reserva uma vaga para o cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({
    status: 201,
    description: 'Reserva de vaga criada com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiBody({
    schema: {
      example: {
        idVaga: 5,
        dataInicio: '2024-12-15T08:00:00Z',
        dataFim: '2024-12-15T18:00:00Z',
      },
    },
  })
  async reservarVaga(@Param('id') id: number, @Body() data: any) {
    try {
      return await this.clienteService.reservarVaga(id, data);
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/cancelarReserva')
  @ApiOperation({ summary: 'Cancela uma reserva de vaga para o cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente' })
  @ApiResponse({
    status: 200,
    description: 'Reserva de vaga cancelada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada.' })
  @ApiBody({
    schema: {
      example: {
        idReserva: 10,
      },
    },
  })
  async cancelarReserva(@Param('id') id: number, @Body() data: any) {
    try {
      return await this.clienteService.cancelarReserva(id, data);
    } catch (error) {
      throw error;
    }
  }
}
