import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { OperacaoService } from './operacao.service';
import { Operacao } from './operacao.model';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Operações') // Define a categoria no Swagger
@Controller('operacoes')
export class OperacaoController {
  constructor(private readonly operacaoService: OperacaoService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova operação' })
  @ApiResponse({ status: 201, description: 'Operação criada com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  @ApiBody({
    schema: {
      example: {
        descricao: 'Operação de entrada',
        data_hora: '2024-12-15T10:00:00Z',
        id_usuario: 1,
      },
    },
  })
  async create(
    @Body('descricao') descricao: string,
    @Body('data_hora') data_hora: Date,
    @Body('id_usuario') id_usuario: number,
  ): Promise<Operacao> {
    try {
      return await this.operacaoService.create(
        descricao,
        data_hora,
        id_usuario,
      );
    } catch (error) {
      throw new Error(`Erro ao criar operação: ${error.message}`);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retorna todas as operações' })
  @ApiResponse({
    status: 200,
    description: 'Lista de operações retornada com sucesso.',
  })
  async findAll(): Promise<Operacao[]> {
    try {
      return await this.operacaoService.findAll();
    } catch (error) {
      throw new Error(`Erro ao recuperar as operações: ${error.message}`);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma operação pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da operação' })
  @ApiResponse({ status: 200, description: 'Operação encontrada.' })
  @ApiResponse({ status: 404, description: 'Operação não encontrada.' })
  async findOne(@Param('id') id: number): Promise<Operacao> {
    try {
      return await this.operacaoService.findOne(id);
    } catch (error) {
      throw new Error(`Erro ao recuperar operação: ${error.message}`);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza os dados de uma operação' })
  @ApiParam({ name: 'id', description: 'ID da operação' })
  @ApiResponse({ status: 200, description: 'Operação atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Operação não encontrada.' })
  @ApiBody({
    schema: {
      example: {
        descricao: 'Operação de saída',
        data_hora: '2024-12-15T12:00:00Z',
        id_usuario: 2,
      },
    },
  })
  async update(
    @Param('id') id: number,
    @Body('descricao') descricao: string,
    @Body('data_hora') data_hora: Date,
    @Body('id_usuario') id_usuario: number,
  ): Promise<Operacao> {
    try {
      return await this.operacaoService.update(
        id,
        descricao,
        data_hora,
        id_usuario,
      );
    } catch (error) {
      throw new Error(`Erro ao atualizar operação: ${error.message}`);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Exclui uma operação pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da operação' })
  @ApiResponse({ status: 204, description: 'Operação excluída com sucesso.' })
  @ApiResponse({ status: 404, description: 'Operação não encontrada.' })
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.operacaoService.remove(id);
    } catch (error) {
      throw new Error(`Erro ao deletar operação: ${error.message}`);
    }
  }
}
