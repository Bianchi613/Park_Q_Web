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
import { Operacao } from './operacao.model';
import { OperacaoService } from './operacao.service';

@ApiTags('Operacoes')
@Controller('operacoes')
export class OperacaoController {
  constructor(private readonly operacaoService: OperacaoService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova operacao' })
  @ApiResponse({ status: 201, description: 'Operacao criada com sucesso.' })
  @ApiBody({
    schema: {
      example: {
        descricao: 'Operacao de entrada',
        data_hora: '2024-12-15T10:00:00Z',
        id_usuario: 1,
      },
    },
  })
  async create(@Body() data: Partial<Operacao>): Promise<Operacao> {
    return this.operacaoService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todas as operacoes' })
  async findAll(): Promise<Operacao[]> {
    return this.operacaoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma operacao pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da operacao' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Operacao> {
    return this.operacaoService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de uma operacao' })
  @ApiParam({ name: 'id', description: 'ID da operacao' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Operacao>,
  ): Promise<Operacao> {
    return this.operacaoService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui uma operacao pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da operacao' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.operacaoService.remove(id);
    return { message: 'Operacao removida com sucesso.' };
  }
}
