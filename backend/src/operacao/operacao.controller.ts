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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateOperacaoDto } from './dto/create-operacao.dto';
import { UpdateOperacaoDto } from './dto/update-operacao.dto';
import { Operacao, OperacaoTipo } from './operacao.model';
import { OperacaoService } from './operacao.service';

@ApiTags('Operacoes')
@Controller('operacoes')
export class OperacaoController {
  constructor(private readonly operacaoService: OperacaoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria uma nova operacao' })
  @ApiResponse({ status: 201, description: 'Operacao criada com sucesso.' })
  @ApiBody({
    schema: {
      example: {
        tipo: 'RESERVA',
        descricao: 'Reserva criada',
        data_hora: '2024-12-15T10:00:00Z',
        entidade: 'Reserva',
        id_entidade: 1,
        resultado: 'SUCESSO',
        id_usuario: 1,
      },
    },
  })
  async create(@Body() data: CreateOperacaoDto): Promise<Operacao> {
    return this.operacaoService.create(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna todas as operacoes' })
  @ApiQuery({ name: 'id_usuario', required: false, example: 1 })
  @ApiQuery({ name: 'tipo', required: false, example: 'RESERVA' })
  @ApiQuery({ name: 'entidade', required: false, example: 'Reserva' })
  @ApiQuery({ name: 'id_entidade', required: false, example: 1 })
  async findAll(
    @Query('id_usuario') idUsuario?: string,
    @Query('tipo') tipo?: OperacaoTipo,
    @Query('entidade') entidade?: string,
    @Query('id_entidade') idEntidade?: string,
  ): Promise<Operacao[]> {
    return this.operacaoService.findAll({
      id_usuario: idUsuario ? Number(idUsuario) : undefined,
      tipo,
      entidade,
      id_entidade: idEntidade ? Number(idEntidade) : undefined,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna uma operacao pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da operacao' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Operacao> {
    return this.operacaoService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza os dados de uma operacao' })
  @ApiParam({ name: 'id', description: 'ID da operacao' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateOperacaoDto,
  ): Promise<Operacao> {
    return this.operacaoService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exclui uma operacao pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da operacao' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.operacaoService.remove(id);
    return { message: 'Operacao removida com sucesso.' };
  }
}
