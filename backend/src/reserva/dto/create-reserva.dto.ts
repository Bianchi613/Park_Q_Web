import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateReservaDto {
  @IsOptional()
  @IsDateString()
  data_reserva?: string;

  @IsOptional()
  @IsDateString()
  dataReserva?: string;

  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @IsOptional()
  @IsDateString()
  data_fim?: string;

  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @IsOptional()
  @IsDateString()
  dataFinal?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valor?: number;

  @IsOptional()
  @IsIn(['ATIVA', 'CANCELADA', 'FINALIZADA', 'EXPIRADA'])
  status?: string;

  @IsOptional()
  @IsIn(['ATIVA', 'CANCELADA', 'FINALIZADA', 'EXPIRADA'])
  statusReserva?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_usuario?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idUsuario?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_vaga?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idVaga?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_plano?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  plano_id?: number;
}
