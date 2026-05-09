import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { OperacaoResultado, OperacaoTipo } from '../operacao.model';

export class CreateOperacaoDto {
  @IsOptional()
  @IsIn([
    'RESERVA',
    'CANCELAMENTO',
    'PAGAMENTO',
    'VAGA',
    'ESTACIONAMENTO',
    'RELATORIO',
    'USUARIO',
    'SISTEMA',
  ])
  tipo?: OperacaoTipo;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsOptional()
  @IsDateString()
  data_hora?: string;

  @IsOptional()
  @IsString()
  entidade?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_entidade?: number;

  @IsOptional()
  @IsObject()
  dados?: Record<string, unknown>;

  @IsOptional()
  @IsIn(['SUCESSO', 'FALHA'])
  resultado?: OperacaoResultado;

  @Type(() => Number)
  @IsInt()
  id_usuario: number;
}
