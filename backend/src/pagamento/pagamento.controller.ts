import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreatePagamentoDto } from './dto/create-pagamento.dto';
import { UpdatePagamentoDto } from './dto/update-pagamento.dto';
import { Pagamento } from './pagamento.model';
import { PagamentoService } from './pagamento.service';

@ApiTags('Pagamentos')
@Controller('pagamentos')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  @ApiBearerAuth()
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
  async create(
    @Body() data: CreatePagamentoDto,
    @Req() req: any,
  ): Promise<Pagamento> {
    return this.pagamentoService.createPagamentoAutorizado(data, req.user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna pagamentos, opcionalmente por estacionamento' })
  async findAll(
    @Query('id_estacionamento') idEstacionamento?: string,
  ): Promise<Pagamento[]> {
    return this.pagamentoService.getAllPagamentos(
      idEstacionamento ? Number(idEstacionamento) : undefined,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna um pagamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  async findById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<Pagamento> {
    return this.pagamentoService.getPagamentoByIdAutorizado(id, req.user);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza os dados de um pagamento' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdatePagamentoDto,
  ): Promise<Pagamento> {
    return this.pagamentoService.updatePagamento(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exclui um pagamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pagamento' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.pagamentoService.deletePagamento(id);
    return { message: 'Pagamento removido com sucesso.' };
  }
}
