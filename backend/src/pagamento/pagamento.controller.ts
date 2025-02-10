import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { PagamentoService } from './pagamento.service';
import { Pagamento } from './pagamento.model';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Pagamentos') // Define a categoria no Swagger
@Controller('pagamentos')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo pagamento' })
  @ApiResponse({ status: 201, description: 'Pagamento criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiBody({
    schema: {
      example: {
        id_reserva: 1,
        metodo_pagamento: 'PIX',
        valor_pago: 50.75,
        data_hora: '2024-12-15T10:00:00Z',
      },
    },
  })
  async create(@Body() data: Partial<Pagamento>): Promise<Pagamento> {
    try {
      return await this.pagamentoService.createPagamento(data);
    } catch (error) {
      throw new Error('Error creating Pagamento: ' + error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todos os pagamentos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pagamentos retornada com sucesso.',
  })
  async findAll(): Promise<Pagamento[]> {
    try {
      return await this.pagamentoService.getAllPagamentos();
    } catch (error) {
      throw new Error('Error retrieving Pagamentos: ' + error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um pagamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({ status: 200, description: 'Pagamento encontrado.' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado.' })
  async findById(@Param('id') id: number): Promise<Pagamento> {
    try {
      return await this.pagamentoService.getPagamentoById(id);
    } catch (error) {
      throw new Error('Error retrieving Pagamento by ID: ' + error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um pagamento' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({
    status: 200,
    description: 'Pagamento atualizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado.' })
  @ApiBody({
    schema: {
      example: {
        id_reserva: 1,
        metodo_pagamento: 'Cartão de Crédito',
        valor_pago: 100.5,
        data_hora: '2024-12-15T12:00:00Z',
      },
    },
  })
  async update(
    @Param('id') id: number,
    @Body() data: Partial<Pagamento>,
  ): Promise<Pagamento> {
    try {
      return await this.pagamentoService.updatePagamento(id, data);
    } catch (error) {
      throw new Error('Error updating Pagamento: ' + error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um pagamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  @ApiResponse({ status: 204, description: 'Pagamento excluído com sucesso.' })
  @ApiResponse({ status: 404, description: 'Pagamento não encontrado.' })
  async delete(@Param('id') id: number): Promise<void> {
    try {
      await this.pagamentoService.deletePagamento(id);
    } catch (error) {
      throw new Error('Error deleting Pagamento: ' + error.message);
    }
  }
}
