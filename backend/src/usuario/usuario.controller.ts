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
import { Usuario } from './usuario.model';
import { UsuarioService } from './usuario.service';

@ApiTags('Usuarios')
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados invalidos.' })
  @ApiBody({
    schema: {
      example: {
        CPF: '12345678901',
        nome: 'Alan Bianchi',
        email: 'alan@bianchi.com',
        telefone: '11999999999',
        login: 'alanbianchi',
        senha: '12345',
        role: 'ADMIN',
        id_estacionamento: 1,
        cargo: 'Gerente',
        privilegios: 'Gerenciar vagas e planos',
      },
    },
  })
  async create(@Body() data: Partial<Usuario>) {
    const usuario = await this.usuarioService.create(data);
    return this.serialize(usuario);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todos os usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios retornada com sucesso.',
  })
  async findAll() {
    const usuarios = await this.usuarioService.findAll();
    return usuarios.map((usuario) => this.serialize(usuario));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um usuario pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 404, description: 'Usuario nao encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const usuario = await this.usuarioService.findOne(id);
    return this.serialize(usuario);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um usuario' })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  @ApiResponse({ status: 200, description: 'Usuario atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuario nao encontrado.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Usuario>,
  ) {
    const usuario = await this.usuarioService.update(id, data);
    return this.serialize(usuario);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um usuario pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  @ApiResponse({ status: 200, description: 'Usuario excluido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuario nao encontrado.' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.delete(id);
  }

  @Post(':id/reservar-vaga')
  @ApiOperation({ summary: 'Reserva uma vaga para um usuario CLIENT' })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  @ApiBody({
    schema: {
      example: {
        id_vaga: 1,
        id_plano: 1,
        valor: 50,
        dataInicio: '2024-12-15T08:00:00Z',
        dataFim: '2024-12-15T18:00:00Z',
      },
    },
  })
  async reservarVaga(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.usuarioService.reservarVaga(id, data);
  }

  @Post(':id/cancelar-reserva')
  @ApiOperation({ summary: 'Cancela uma reserva de um usuario CLIENT' })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  @ApiBody({
    schema: {
      example: {
        id_reserva: 1,
      },
    },
  })
  async cancelarReserva(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.usuarioService.cancelarReserva(id, data);
  }

  @Get(':id/reservas')
  @ApiOperation({
    summary: 'Retorna o historico de reservas do usuario CLIENT',
  })
  @ApiParam({ name: 'id', description: 'ID do usuario' })
  async historicoReservas(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.historicoReservas(id);
  }

  @Post(':id/adicionar-vaga')
  @ApiOperation({ summary: 'Adiciona uma vaga como usuario ADMIN' })
  @ApiParam({ name: 'id', description: 'ID do usuario admin' })
  @ApiBody({
    schema: {
      example: {
        numero: 101,
        tipo: 'carro',
        status: 'disponivel',
      },
    },
  })
  async adicionarVaga(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.usuarioService.adicionarVaga(id, data);
  }

  @Delete(':id/remover-vaga/:vagaId')
  @ApiOperation({ summary: 'Remove uma vaga como usuario ADMIN' })
  @ApiParam({ name: 'id', description: 'ID do usuario admin' })
  @ApiParam({ name: 'vagaId', description: 'ID da vaga' })
  async removerVaga(
    @Param('id', ParseIntPipe) id: number,
    @Param('vagaId', ParseIntPipe) vagaId: number,
  ) {
    return this.usuarioService.removerVaga(id, vagaId);
  }

  @Get(':id/monitorar-ocupacao')
  @ApiOperation({ summary: 'Monitora a ocupacao como usuario ADMIN' })
  @ApiParam({ name: 'id', description: 'ID do usuario admin' })
  async monitorarOcupacao(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.monitorarOcupacao(id);
  }

  @Get(':id/relatorio')
  @ApiOperation({ summary: 'Gera relatorio como usuario ADMIN' })
  @ApiParam({ name: 'id', description: 'ID do usuario admin' })
  async gerarRelatorio(@Param('id', ParseIntPipe) id: number) {
    return this.usuarioService.gerarRelatorio(id);
  }

  private serialize(usuario: Usuario) {
    const plain = usuario.get ? usuario.get({ plain: true }) : usuario;
    delete plain.senha;
    return plain;
  }
}
