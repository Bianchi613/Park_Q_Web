import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Park Q Centro' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'Av. Paulista, 1000 - Sao Paulo, SP' })
  @IsString()
  @IsNotEmpty()
  localizacao: string;

  @ApiPropertyOptional({ example: -23.563099 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: -46.6544 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: 120 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  capacidade: number;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  vagas_disponiveis?: number;

  @ApiPropertyOptional({ example: 'Centro comercial' })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiPropertyOptional({
    example: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a',
  })
  @IsOptional()
  @IsUrl()
  imagemUrl?: string;
}
