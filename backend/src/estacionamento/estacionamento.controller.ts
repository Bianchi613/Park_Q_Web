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
import { EstacionamentoService } from './estacionamento.service';

@ApiTags('Estacionamentos')
@Controller('estacionamentos')
export class EstacionamentoController {
  constructor(private readonly estacionamentoService: EstacionamentoService) {}

  @Post()
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
  async create(@Body() body: any) {
    return this.estacionamentoService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os estacionamentos' })
  async findAll() {
    return this.estacionamentoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um estacionamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estacionamentoService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um estacionamento' })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.estacionamentoService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um estacionamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.estacionamentoService.remove(id);
    return { message: 'Estacionamento removido com sucesso.' };
  }

  @Get(':id/monitorar')
  @ApiOperation({ summary: 'Monitora as vagas do estacionamento' })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  async monitorarVagas(@Param('id', ParseIntPipe) id: number) {
    return this.estacionamentoService.monitorarVagas(id);
  }

  @Get(':id/relatorio')
  @ApiOperation({ summary: 'Gera relatorio de ocupacao e faturamento' })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  async gerarRelatorios(@Param('id', ParseIntPipe) id: number) {
    return this.estacionamentoService.gerarRelatorios(id);
  }
}
