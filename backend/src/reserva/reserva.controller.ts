import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ReservaService } from './reserva.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Reservas') // Define a categoria "Reservas" no Swagger
@Controller('reservas')
export class ReservaController {
  constructor(private readonly reservaService: ReservaService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova reserva' })
  @ApiResponse({ status: 201, description: 'Reserva criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiBody({
    schema: {
      example: {
        dataReserva: '2024-12-15T10:00:00Z',
        dataFim: '2024-12-15T18:00:00Z',
        valor: 50.75,
        id_usuario: 1,
        id_vaga: 2,
      },
    },
  })
  async createReserva(@Body() data: any) {
    try {
      // Removendo a validação de obrigatoriedade de datas
      return await this.reservaService.createReserva(data);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todas as reservas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas retornada com sucesso.',
  })
  async findAllReservas() {
    try {
      return await this.reservaService.findAllReservas();
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma reserva pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ status: 200, description: 'Reserva encontrada.' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada.' })
  async findReservaById(@Param('id') id: number) {
    try {
      if (!Number.isInteger(id) || id <= 0) {
        throw new HttpException(
          'O ID da reserva deve ser um número inteiro positivo.',
          HttpStatus.BAD_REQUEST,
        );
      }
      return await this.reservaService.findReservaById(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de uma reserva' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ status: 200, description: 'Reserva atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada.' })
  @ApiBody({
    schema: {
      example: {
        dataReserva: '2024-12-15T10:00:00Z',
        dataFim: '2024-12-15T18:00:00Z',
        valor: 70.0,
        id_usuario: 1,
        id_vaga: 3,
      },
    },
  })
  async updateReserva(@Param('id') id: number, @Body() data: any) {
    try {
      // Removendo a validação de obrigatoriedade de datas
      return await this.reservaService.updateReserva(id, data);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui uma reserva pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ status: 204, description: 'Reserva excluída com sucesso.' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada.' })
  async deleteReserva(@Param('id') id: number) {
    try {
      await this.reservaService.deleteReserva(id);
      return { message: 'Reserva deletada com sucesso.' };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
