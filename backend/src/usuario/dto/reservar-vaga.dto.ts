import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class ReservarVagaDto {
  @ApiProperty({ example: 1, description: 'ID da vaga desejada.' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_vaga?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Alias aceito para id_vaga.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idVaga?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_plano?: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'Alias aceito para id_plano.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  plano_id?: number;

  @ApiPropertyOptional({ example: '2026-05-09T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  data_reserva?: string;

  @ApiPropertyOptional({ example: '2026-05-09T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  dataReserva?: string;

  @ApiPropertyOptional({ example: '2026-05-09T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional({ example: '2026-05-09T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  data_fim?: string;

  @ApiPropertyOptional({ example: '2026-05-09T12:00:00Z' })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiPropertyOptional({
    example: 21,
    description:
      'Valor manual. Se omitido, o backend calcula pelo plano de tarifacao.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valor?: number;
}
