import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFloatPipe,
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
import { CreateEstacionamentoDto } from './dto/create-estacionamento.dto';
import { UpdateEstacionamentoDto } from './dto/update-estacionamento.dto';
import { EstacionamentoService } from './estacionamento.service';

@ApiTags('Estacionamentos')
@Controller('estacionamentos')
export class EstacionamentoController {
  constructor(private readonly estacionamentoService: EstacionamentoService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cria um novo estacionamento' })
  @ApiResponse({ status: 201, description: 'Estacionamento criado.' })
  @ApiBody({
    schema: {
      example: {
        nome: 'Estacionamento Central',
        localizacao: 'Rua Principal, 123',
        latitude: -23.55052,
        longitude: -46.633308,
        capacidade: 50,
        categoria: 'Coberto',
        imagemUrl: 'https://exemplo.com/estacionamento.jpg',
      },
    },
  })
  async create(@Body() body: CreateEstacionamentoDto) {
    return this.estacionamentoService.create(body);
  }

  @Get()
  @ApiOperation({
    summary: 'Lista todos os estacionamentos disponiveis para visitantes',
  })
  async findAll() {
    return this.estacionamentoService.findAll();
  }

  @Get('proximos')
  @ApiOperation({
    summary: 'Lista estacionamentos proximos de uma coordenada',
    description:
      'Rota publica para CLIENT, VISITOR ou usuario nao autenticado consultar estacionamentos por distancia.',
  })
  @ApiQuery({
    name: 'lat',
    example: -23.55052,
    description: 'Latitude atual do usuario',
  })
  @ApiQuery({
    name: 'lng',
    example: -46.633308,
    description: 'Longitude atual do usuario',
  })
  @ApiQuery({
    name: 'raioKm',
    required: false,
    example: 5,
    description: 'Raio maximo de busca em quilometros',
  })
  async findNearby(
    @Query('lat', ParseFloatPipe) latitude: number,
    @Query('lng', ParseFloatPipe) longitude: number,
    @Query('raioKm') raioKm?: string,
  ) {
    return this.estacionamentoService.findNearby(
      latitude,
      longitude,
      raioKm === undefined ? undefined : Number(raioKm),
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retorna um estacionamento pelo ID',
    description:
      'Consulta publica usada por visitantes e clientes antes de uma reserva.',
  })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estacionamentoService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza os dados de um estacionamento' })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEstacionamentoDto,
  ) {
    return this.estacionamentoService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exclui um estacionamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.estacionamentoService.remove(id);
    return { message: 'Estacionamento removido com sucesso.' };
  }

  @Get(':id/monitorar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Monitora as vagas do estacionamento' })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  async monitorarVagas(@Param('id', ParseIntPipe) id: number) {
    return this.estacionamentoService.monitorarVagas(id);
  }

  @Get(':id/relatorio')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gera relatorio de ocupacao e faturamento' })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  async gerarRelatorios(@Param('id', ParseIntPipe) id: number) {
    return this.estacionamentoService.gerarRelatorios(id);
  }
}
