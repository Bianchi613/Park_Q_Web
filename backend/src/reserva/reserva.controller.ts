import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { CreateReservaDto } from './dto/create-reserva.dto';
import { UpdateReservaDto } from './dto/update-reserva.dto';
import { ReservaService } from './reserva.service';

@ApiTags('Reservas')
@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  @ApiBearerAuth()
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
  async createReserva(@Body() data: CreateReservaDto, @Req() req: any) {
    if (req.user?.role === 'CLIENT') {
      data.id_usuario = req.user.id;
      data.idUsuario = req.user.id;
    }

    return this.reservaService.createReserva(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna todas as reservas' })
  async findAllReservas() {
    return this.reservaService.findAllReservas();
  }

  @Get('monitoramento')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'CLIENT')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Monitora o tempo restante de uma reserva' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  async monitorarTempo(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    await this.ensureReservaOwnerOrAdmin(id, req.user);
    return this.reservaService.monitorarTempo(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'CLIENT')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna uma reserva pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  async findReservaById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    await this.ensureReservaOwnerOrAdmin(id, req.user);
    return this.reservaService.findReservaById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'CLIENT')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza os dados de uma reserva' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  async updateReserva(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateReservaDto,
    @Req() req: any,
  ) {
    await this.ensureReservaOwnerOrAdmin(id, req.user);
    return this.reservaService.updateReserva(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exclui uma reserva pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  async deleteReserva(@Param('id', ParseIntPipe) id: number) {
    await this.reservaService.deleteReserva(id);
    return { message: 'Reserva deletada com sucesso.' };
  }

  private async ensureReservaOwnerOrAdmin(
    id: number,
    user: any,
  ): Promise<void> {
    if (user?.role === 'ADMIN') {
      return;
    }

    const reserva = await this.reservaService.findReservaById(id);

    if (reserva.id_usuario === user?.id) {
      return;
    }

    throw new ForbiddenException('Acesso negado para esta reserva.');
  }
}
