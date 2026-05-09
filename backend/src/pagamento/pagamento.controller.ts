import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Pagamento } from './pagamento.model';
import { PagamentoService } from './pagamento.service';

@ApiTags('Pagamentos')
@Controller('pagamentos')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo pagamento' })
  @ApiResponse({ status: 201, description: 'Pagamento criado com sucesso.' })
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
    return this.pagamentoService.createPagamento(data);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todos os pagamentos' })
  async findAll(): Promise<Pagamento[]> {
    return this.pagamentoService.getAllPagamentos();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um pagamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  async findById(@Param('id', ParseIntPipe) id: number): Promise<Pagamento> {
    return this.pagamentoService.getPagamentoById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um pagamento' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Pagamento>,
  ): Promise<Pagamento> {
    return this.pagamentoService.updatePagamento(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um pagamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.pagamentoService.deletePagamento(id);
    return { message: 'Pagamento removido com sucesso.' };
  }
}
