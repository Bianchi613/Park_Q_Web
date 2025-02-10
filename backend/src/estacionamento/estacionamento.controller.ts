import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { EstacionamentoService } from './estacionamento.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Estacionamentos') // Define a categoria "Estacionamentos" no Swagger
@Controller('estacionamentos')
export class EstacionamentoController {
  constructor(private readonly estacionamentoService: EstacionamentoService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo estacionamento' })
  @ApiResponse({
    status: 201,
    description: 'Estacionamento criado com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiBody({
    schema: {
      example: {
        nome: 'Estacionamento Central',
        localizacao: 'Rua Principal, 123',
        capacidade: 50,
      },
    },
  })
  async create(@Body() body: any) {
    try {
      return await this.estacionamentoService.create(body);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os estacionamentos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de estacionamentos encontrada.',
  })
  @ApiResponse({ status: 404, description: 'Nenhum estacionamento encontrado.' })
  async findAll() {
    try {
      return await this.estacionamentoService.findAll();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um estacionamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  @ApiResponse({ status: 200, description: 'Estacionamento encontrado.' })
  @ApiResponse({ status: 404, description: 'Estacionamento não encontrado.' })
  async findOne(@Param('id') id: number) {
    try {
      return await this.estacionamentoService.findOne(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de um estacionamento' })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  @ApiResponse({
    status: 200,
    description: 'Estacionamento atualizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Estacionamento não encontrado.' })
  @ApiBody({
    schema: {
      example: {
        nome: 'Estacionamento Atualizado',
        localizacao: 'Avenida Nova, 456',
        capacidade: 60,
      },
    },
  })
  async update(@Param('id') id: number, @Body() body: any) {
    try {
      return await this.estacionamentoService.update(id, body);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um estacionamento pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  @ApiResponse({
    status: 204,
    description: 'Estacionamento excluído com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Estacionamento não encontrado.' })
  async remove(@Param('id') id: number) {
    try {
      await this.estacionamentoService.remove(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Get(':id/monitorar')
  @ApiOperation({ summary: 'Monitora as vagas do estacionamento' })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  @ApiResponse({
    status: 200,
    description: 'Monitoramento de vagas realizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Estacionamento não encontrado.' })
  async monitorarVagas(@Param('id') id: number) {
    try {
      return await this.estacionamentoService.monitorarVagas(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Get(':id/relatorio')
  @ApiOperation({ summary: 'Gera relatórios de ocupação e faturamento' })
  @ApiParam({ name: 'id', description: 'ID do estacionamento' })
  @ApiResponse({ status: 200, description: 'Relatório gerado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Estacionamento não encontrado.' })
  async gerarRelatorios(@Param('id') id: number) {
    try {
      return await this.estacionamentoService.gerarRelatorios(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
