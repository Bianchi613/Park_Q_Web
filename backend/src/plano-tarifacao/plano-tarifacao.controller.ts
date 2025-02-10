import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
} from '@nestjs/common';
import { PlanoTarifacaoService } from './plano-tarifacao.service';
import { PlanoTarifacao } from './plano-tarifacao.model';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Planos de Tarifação') // Define a categoria no Swagger
@Controller('planos-tarifacao')
export class PlanoTarifacaoController {
  constructor(private readonly planoTarifacaoService: PlanoTarifacaoService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todos os planos de tarifação' })
  @ApiResponse({
    status: 200,
    description: 'Lista de planos de tarifação retornada com sucesso.',
  })
  async findAll(): Promise<PlanoTarifacao[]> {
    try {
      return await this.planoTarifacaoService.findAll();
    } catch (error) {
      throw new Error(
        'Erro ao listar os planos de tarifação: ' + error.message,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um plano de tarifação pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do plano de tarifação' })
  @ApiResponse({ status: 200, description: 'Plano de tarifação encontrado.' })
  @ApiResponse({
    status: 404,
    description: 'Plano de tarifação não encontrado.',
  })
  async findOne(@Param('id') id: number): Promise<PlanoTarifacao> {
    try {
      return await this.planoTarifacaoService.findOne(id);
    } catch (error) {
      throw new Error('Plano de tarifação não encontrado: ' + error.message);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo plano de tarifação' })
  @ApiResponse({
    status: 201,
    description: 'Plano de tarifação criado com sucesso.',
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiBody({
    schema: {
      example: {
        descricao: 'Plano de Tarifação Horária',
        data_vigencia: '2024-12-15',
        taxa_base: 10.0,
        taxa_hora: 5.0,
        taxa_diaria: 50.0,
      },
    },
  })
  async create(
    @Body() planoTarifacaoData: Partial<PlanoTarifacao>,
  ): Promise<PlanoTarifacao> {
    try {
      return await this.planoTarifacaoService.create(planoTarifacaoData);
    } catch (error) {
      throw new Error('Erro ao criar plano de tarifação: ' + error.message);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um plano de tarifação' })
  @ApiParam({ name: 'id', description: 'ID do plano de tarifação' })
  @ApiResponse({
    status: 200,
    description: 'Plano de tarifação atualizado com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Plano de tarifação não encontrado.',
  })
  @ApiBody({
    schema: {
      example: {
        descricao: 'Plano de Tarifação Diário',
        data_vigencia: '2024-12-20',
        taxa_base: 15.0,
        taxa_hora: 3.0,
        taxa_diaria: 100.0,
      },
    },
  })
  async update(
    @Param('id') id: number,
    @Body() planoTarifacaoData: Partial<PlanoTarifacao>,
  ): Promise<PlanoTarifacao> {
    try {
      return await this.planoTarifacaoService.update(id, planoTarifacaoData);
    } catch (error) {
      throw new Error('Erro ao atualizar plano de tarifação: ' + error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um plano de tarifação pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do plano de tarifação' })
  @ApiResponse({
    status: 204,
    description: 'Plano de tarifação excluído com sucesso.',
  })
  @ApiResponse({
    status: 404,
    description: 'Plano de tarifação não encontrado.',
  })
  async remove(@Param('id') id: number): Promise<void> {
    try {
      return await this.planoTarifacaoService.remove(id);
    } catch (error) {
      throw new Error('Erro ao remover plano de tarifação: ' + error.message);
    }
  }

  @Post(':id/calcular-tarifa')
  @ApiOperation({
    summary: 'Calcula a tarifa com base na duração e no tipo de vaga',
  })
  @ApiParam({ name: 'id', description: 'ID do plano de tarifação' })
  @ApiResponse({ status: 200, description: 'Tarifa calculada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiBody({
    schema: {
      example: {
        tipoVaga: 'carro',
        duracao: 3,
      },
    },
  })
  async calcularTarifa(
    @Param('id') id: number,
    @Body() { tipoVaga, duracao }: { tipoVaga: string; duracao: number },
  ): Promise<number> {
    try {
      return await this.planoTarifacaoService.calcularTarifa(
        tipoVaga,
        duracao,
        id,
      );
    } catch (error) {
      throw new Error('Erro ao calcular tarifa: ' + error.message);
    }
  }
}
