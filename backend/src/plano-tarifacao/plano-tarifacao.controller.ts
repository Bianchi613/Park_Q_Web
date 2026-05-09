import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PlanoTarifacao } from './plano-tarifacao.model';
import { PlanoTarifacaoService } from './plano-tarifacao.service';

@ApiTags('Planos de Tarifacao')
@Controller('planos-tarifacao')
export class PlanoTarifacaoController {
  constructor(private readonly planoTarifacaoService: PlanoTarifacaoService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todos os planos de tarifacao' })
  async findAll(): Promise<PlanoTarifacao[]> {
    return this.planoTarifacaoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna um plano de tarifacao pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do plano de tarifacao' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PlanoTarifacao> {
    return this.planoTarifacaoService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Cria um novo plano de tarifacao' })
  @ApiResponse({ status: 201, description: 'Plano criado com sucesso.' })
  @ApiBody({
    schema: {
      example: {
        descricao: 'Plano horario',
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
    return this.planoTarifacaoService.create(planoTarifacaoData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um plano de tarifacao' })
  @ApiParam({ name: 'id', description: 'ID do plano de tarifacao' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() planoTarifacaoData: Partial<PlanoTarifacao>,
  ): Promise<PlanoTarifacao> {
    return this.planoTarifacaoService.update(id, planoTarifacaoData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui um plano de tarifacao pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do plano de tarifacao' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.planoTarifacaoService.remove(id);
    return { message: 'Plano de tarifacao removido com sucesso.' };
  }

  @Post(':id/calcular-tarifa')
  @ApiOperation({ summary: 'Calcula a tarifa pela duracao e tipo de vaga' })
  @ApiParam({ name: 'id', description: 'ID do plano de tarifacao' })
  @ApiBody({
    schema: {
      example: {
        tipoVaga: 'carro',
        duracao: 3,
      },
    },
  })
  async calcularTarifa(
    @Param('id', ParseIntPipe) id: number,
    @Body() { tipoVaga, duracao }: { tipoVaga: string; duracao: number },
  ): Promise<{ valor: number }> {
    const valor = await this.planoTarifacaoService.calcularTarifa(
      tipoVaga,
      Number(duracao),
      id,
    );

    return { valor };
  }
}
