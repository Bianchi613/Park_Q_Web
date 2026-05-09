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
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReservaService } from './reserva.service';

@ApiTags('Reservas')
@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova reserva' })
  @ApiResponse({ status: 201, description: 'Reserva criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados invalidos.' })
  @ApiBody({
    schema: {
      example: {
        dataReserva: '2024-12-15T10:00:00Z',
        dataFim: '2024-12-15T18:00:00Z',
        valor: 50.75,
        status: 'ATIVA',
        id_usuario: 1,
        id_vaga: 2,
        plano_id: 1,
      },
    },
  })
  async createReserva(@Body() data: any) {
    return this.reservaService.createReserva(data);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todas as reservas' })
  async findAllReservas() {
    return this.reservaService.findAllReservas();
  }

  @Get('monitoramento')
  @ApiOperation({
    summary: 'Monitora tempo restante das reservas ativas ou expiradas',
  })
  async monitorarReservas(
    @Query('id_estacionamento') idEstacionamento?: string,
  ) {
    return this.reservaService.monitorarReservas(
      idEstacionamento ? Number(idEstacionamento) : undefined,
    );
  }

  @Get(':id/monitorar-tempo')
  @ApiOperation({ summary: 'Monitora o tempo restante de uma reserva' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  async monitorarTempo(@Param('id', ParseIntPipe) id: number) {
    return this.reservaService.monitorarTempo(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma reserva pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  async findReservaById(@Param('id', ParseIntPipe) id: number) {
    return this.reservaService.findReservaById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de uma reserva' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  async updateReserva(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.reservaService.updateReserva(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui uma reserva pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  async deleteReserva(@Param('id', ParseIntPipe) id: number) {
    await this.reservaService.deleteReserva(id);
    return { message: 'Reserva deletada com sucesso.' };
  }
}
