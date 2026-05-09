import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateEstacionamentoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  localizacao: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  capacidade: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  vagas_disponiveis?: number;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsUrl()
  imagemUrl?: string;
}
