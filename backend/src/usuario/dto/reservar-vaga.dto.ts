import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class ReservarVagaDto {
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
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valor?: number;
}
