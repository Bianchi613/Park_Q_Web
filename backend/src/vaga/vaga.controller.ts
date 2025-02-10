import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { VagaService } from './vaga.service';
import { Vaga } from './vaga.model';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Vagas') // Define a categoria "Vagas" no Swagger
@Controller('vagas')
export class VagaController {
  constructor(private readonly vagaService: VagaService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todas as vagas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de vagas retornada com sucesso.',
  })
  async findAll(): Promise<Vaga[]> {
    return this.vagaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma vaga pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da vaga' })
  @ApiResponse({ status: 200, description: 'Vaga encontrada.' })
  @ApiResponse({ status: 404, description: 'Vaga não encontrada.' })
  async findOne(@Param('id') id: number): Promise<Vaga> {
    return this.vagaService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma nova vaga' })
  @ApiResponse({ status: 201, description: 'Vaga criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiBody({
    schema: {
      example: {
        numero: 101,
        id_estacionamento: 1,
        status: 'disponivel',
        tipo: 'carro',
        reservada: false,
      },
    },
  })
  async create(@Body() vagaData: Partial<Vaga>): Promise<Vaga> {
    return this.vagaService.create(vagaData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza os dados de uma vaga' })
  @ApiParam({ name: 'id', description: 'ID da vaga' })
  @ApiResponse({ status: 200, description: 'Vaga atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Vaga não encontrada.' })
  @ApiBody({
    schema: {
      example: {
        numero: 102,
        id_estacionamento: 1,
        status: 'ocupada',
        tipo: 'moto',
        reservada: true,
      },
    },
  })
  async update(
    @Param('id') id: number,
    @Body() vagaData: Partial<Vaga>,
  ): Promise<Vaga> {
    return this.vagaService.update(id, vagaData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui uma vaga pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da vaga' })
  @ApiResponse({ status: 204, description: 'Vaga excluída com sucesso.' })
  @ApiResponse({ status: 404, description: 'Vaga não encontrada.' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.vagaService.remove(id);
  }

  @Post(':id/reservar')
  @ApiOperation({ summary: 'Reserva uma vaga pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da vaga' })
  @ApiResponse({ status: 200, description: 'Vaga reservada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Vaga não encontrada.' })
  async reservar(@Param('id') id: number): Promise<Vaga> {
    return this.vagaService.reservar(id);
  }

  @Post(':id/liberar')
  @ApiOperation({ summary: 'Libera uma vaga pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da vaga' })
  @ApiResponse({ status: 200, description: 'Vaga liberada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Vaga não encontrada.' })
  async liberar(@Param('id') id: number): Promise<Vaga> {
    return this.vagaService.liberar(id);
  }
}
