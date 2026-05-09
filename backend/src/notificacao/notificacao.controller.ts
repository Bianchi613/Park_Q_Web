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
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Notificacao, NotificacaoTipo } from './notificacao.model';
import { NotificacaoService } from './notificacao.service';

@ApiTags('Notificacoes')
@Controller('notificacoes')
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma notificacao manual' })
  async create(@Body() data: any): Promise<Notificacao> {
    return this.notificacaoService.criar(data);
  }

  @Get()
  @ApiOperation({ summary: 'Lista notificacoes' })
  @ApiQuery({ name: 'id_usuario', required: false, example: 1 })
  @ApiQuery({ name: 'tipo', required: false, example: 'PAGAMENTO' })
  @ApiQuery({ name: 'lida', required: false, example: false })
  async findAll(
    @Query('id_usuario') idUsuario?: string,
    @Query('tipo') tipo?: NotificacaoTipo,
    @Query('lida') lida?: string,
  ): Promise<Notificacao[]> {
    return this.notificacaoService.listar({
      id_usuario: idUsuario ? Number(idUsuario) : undefined,
      tipo,
      lida: lida === undefined ? undefined : lida === 'true',
    });
  }

  @Get('usuario/:id')
  @ApiOperation({ summary: 'Lista notificacoes de um usuario' })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  async findByUsuario(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Notificacao[]> {
    return this.notificacaoService.listarPorUsuario(id);
  }

  @Patch(':id/lida')
  @ApiOperation({ summary: 'Marca uma notificacao como lida' })
  @ApiParam({ name: 'id', description: 'ID da notificacao' })
  async marcarComoLida(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Notificacao> {
    return this.notificacaoService.marcarComoLida(id);
  }

  @Patch('usuario/:id/lidas')
  @ApiOperation({
    summary: 'Marca todas as notificacoes do usuario como lidas',
  })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  async marcarTodasComoLidas(@Param('id', ParseIntPipe) id: number) {
    return this.notificacaoService.marcarTodasComoLidas(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma notificacao' })
  @ApiParam({ name: 'id', description: 'ID da notificacao' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.notificacaoService.remove(id);
    return { message: 'Notificacao removida com sucesso.' };
  }
}
