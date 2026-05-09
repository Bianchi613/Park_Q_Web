import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CalcularTarifaDto } from './dto/calcular-tarifa.dto';
import { CreatePlanoTarifacaoDto } from './dto/create-plano-tarifacao.dto';
import { UpdatePlanoTarifacaoDto } from './dto/update-plano-tarifacao.dto';
import { PlanoTarifacao } from './plano-tarifacao.model';
import { PlanoTarifacaoService } from './plano-tarifacao.service';

@ApiTags('Planos de Tarifacao')
@Controller('planos-tarifacao')
export class PlanoTarifacaoController {
  constructor(private readonly planoTarifacaoService: PlanoTarifacaoService) {}

  @Get()
  @ApiOperation({
    summary: 'Retorna todos os planos de tarifacao',
    description:
      'Consulta publica para visitantes e clientes avaliarem os valores antes de reservar.',
  })
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
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
    @Body() planoTarifacaoData: CreatePlanoTarifacaoDto,
  ): Promise<PlanoTarifacao> {
    return this.planoTarifacaoService.create(planoTarifacaoData);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualiza um plano de tarifacao' })
  @ApiParam({ name: 'id', description: 'ID do plano de tarifacao' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() planoTarifacaoData: UpdatePlanoTarifacaoDto,
  ): Promise<PlanoTarifacao> {
    return this.planoTarifacaoService.update(id, planoTarifacaoData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exclui um plano de tarifacao pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do plano de tarifacao' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.planoTarifacaoService.remove(id);
    return { message: 'Plano de tarifacao removido com sucesso.' };
  }

  @Post(':id/calcular-tarifa')
  @ApiOperation({
    summary: 'Calcula a tarifa pela duracao e tipo de vaga',
    description:
      'Rota publica. VISITOR pode simular preco, mas nao pode efetivar reserva ou pagamento.',
  })
  @ApiParam({ name: 'id', description: 'ID do plano de tarifacao' })
  @ApiBody({
    schema: {
      example: {
        tipoVaga: 'carro',
        duracaoHoras: 3,
      },
    },
  })
  async calcularTarifa(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    { tipoVaga, duracao, duracaoHoras }: CalcularTarifaDto,
  ) {
    return this.planoTarifacaoService.calcularTarifaDetalhada(
      tipoVaga,
      Number(duracaoHoras ?? duracao),
      id,
    );
  }
}
