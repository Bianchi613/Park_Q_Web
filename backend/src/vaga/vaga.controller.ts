import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
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
import { Vaga } from './vaga.model';
import { VagaService } from './vaga.service';

@ApiTags('Vagas')
@Controller('vagas')
export class VagaController {
  constructor(private readonly vagaService: VagaService) {}

  @Get()
  @ApiOperation({
    summary: 'Retorna vagas, opcionalmente por estacionamento',
    description:
      'Consulta publica para CLIENT, VISITOR ou usuario nao autenticado visualizar disponibilidade.',
  })
  @ApiResponse({ status: 200, description: 'Lista de vagas retornada.' })
  async findAll(
    @Query('id_estacionamento') idEstacionamento?: string,
    @Query('estacionamentoId') estacionamentoId?: string,
  ): Promise<Vaga[]> {
    const rawId = idEstacionamento ?? estacionamentoId;
    return this.vagaService.findAll(rawId ? Number(rawId) : undefined);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retorna uma vaga pelo ID',
    description:
      'Consulta publica. A reserva da vaga continua restrita a usuarios CLIENT.',
  })
  @ApiParam({ name: 'id', description: 'ID da vaga' })
  @ApiResponse({ status: 200, description: 'Vaga encontrada.' })
  @ApiResponse({ status: 404, description: 'Vaga nao encontrada.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Vaga> {
    return this.vagaService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria uma nova vaga' })
  @ApiResponse({ status: 201, description: 'Vaga criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados invalidos.' })
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza os dados de uma vaga' })
  @ApiParam({ name: 'id', description: 'ID da vaga' })
  @ApiResponse({ status: 200, description: 'Vaga atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Vaga nao encontrada.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() vagaData: Partial<Vaga>,
  ): Promise<Vaga> {
    return this.vagaService.update(id, vagaData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exclui uma vaga pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da vaga' })
  @ApiResponse({ status: 200, description: 'Vaga excluida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Vaga nao encontrada.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.vagaService.remove(id);
  }

  @Post(':id/reservar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reserva uma vaga pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da vaga' })
  @ApiResponse({ status: 200, description: 'Vaga reservada com sucesso.' })
  async reservar(
    @Param('id', ParseIntPipe) id: number,
    @Body('id_reserva') idReserva?: number,
  ): Promise<Vaga> {
    return this.vagaService.reservar(id, idReserva);
  }

  @Post(':id/liberar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Libera uma vaga pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da vaga' })
  @ApiResponse({ status: 200, description: 'Vaga liberada com sucesso.' })
  async liberar(@Param('id', ParseIntPipe) id: number): Promise<Vaga> {
    return this.vagaService.liberar(id);
  }
}
