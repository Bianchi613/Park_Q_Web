import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Notificacao, NotificacaoTipo } from './notificacao.model';
import { NotificacaoService } from './notificacao.service';

@ApiTags('Notificacoes')
@Controller('notificacoes')
export class NotificacaoController {
  constructor(private readonly notificacaoService: NotificacaoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria uma notificacao manual' })
  async create(@Body() data: any): Promise<Notificacao> {
    return this.notificacaoService.criar(data);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista notificacoes de um usuario' })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  async findByUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<Notificacao[]> {
    this.ensureSelfOrAdmin(id, req.user);
    return this.notificacaoService.listarPorUsuario(id);
  }

  @Patch(':id/lida')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marca uma notificacao como lida' })
  @ApiParam({ name: 'id', description: 'ID da notificacao' })
  async marcarComoLida(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<Notificacao> {
    return this.notificacaoService.marcarComoLidaAutorizada(id, req.user);
  }

  @Patch('usuario/:id/lidas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CLIENT', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Marca todas as notificacoes do usuario como lidas',
  })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  async marcarTodasComoLidas(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    return this.notificacaoService.marcarTodasComoLidasAutorizada(id, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove uma notificacao' })
  @ApiParam({ name: 'id', description: 'ID da notificacao' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.notificacaoService.remove(id);
    return { message: 'Notificacao removida com sucesso.' };
  }

  private ensureSelfOrAdmin(id: number, user: any): void {
    if (user?.role === 'ADMIN' || user?.id === id) {
      return;
    }

    throw new ForbiddenException('Acesso negado para este usuario.');
  }
}
