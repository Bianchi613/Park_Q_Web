import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePlanoTarifacaoDto {
  @ApiPropertyOptional({ example: 'Plano padrao' })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({ example: '2026-05-09T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  data_vigencia?: string;

  @ApiPropertyOptional({
    example: '2026-05-09T00:00:00Z',
    description: 'Alias aceito para data_vigencia.',
  })
  @IsOptional()
  @IsDateString()
  dataVigencia?: string;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxa_base?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'Alias aceito para taxa_base.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxaBase?: number;

  @ApiPropertyOptional({ example: 8 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxa_hora?: number;

  @ApiPropertyOptional({
    example: 8,
    description: 'Alias aceito para taxa_hora.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxaHora?: number;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxa_diaria?: number;

  @ApiPropertyOptional({
    example: 60,
    description: 'Alias aceito para taxa_diaria.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxaDiaria?: number;
}
