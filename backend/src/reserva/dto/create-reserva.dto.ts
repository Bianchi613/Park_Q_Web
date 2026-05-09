import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiPropertyOptional({
    example: '2026-05-09T10:00:00Z',
    description: 'Inicio da reserva no formato ISO.',
  })
  @IsOptional()
  @IsDateString()
  data_reserva?: string;

  @ApiPropertyOptional({
    example: '2026-05-09T10:00:00Z',
    description: 'Alias aceito para data_reserva.',
  })
  @IsOptional()
  @IsDateString()
  dataReserva?: string;

  @ApiPropertyOptional({
    example: '2026-05-09T10:00:00Z',
    description: 'Alias aceito para data_reserva.',
  })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiPropertyOptional({
    example: '2026-05-09T12:00:00Z',
    description: 'Fim previsto da reserva no formato ISO.',
  })
  @IsOptional()
  @IsDateString()
  data_fim?: string;

  @ApiPropertyOptional({
    example: '2026-05-09T12:00:00Z',
    description: 'Alias aceito para data_fim.',
  })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiPropertyOptional({
    example: '2026-05-09T12:00:00Z',
    description: 'Alias aceito para data_fim.',
  })
  @IsOptional()
  @IsDateString()
  dataFinal?: string;

  @ApiPropertyOptional({
    example: 21,
    description:
      'Valor da reserva. Se omitido, o backend calcula com o plano de tarifacao.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valor?: number;

  @ApiPropertyOptional({
    enum: ['ATIVA', 'CANCELADA', 'FINALIZADA', 'EXPIRADA'],
    example: 'ATIVA',
  })
  @IsOptional()
  @IsIn(['ATIVA', 'CANCELADA', 'FINALIZADA', 'EXPIRADA'])
  status?: string;

  @ApiPropertyOptional({
    enum: ['ATIVA', 'CANCELADA', 'FINALIZADA', 'EXPIRADA'],
    example: 'ATIVA',
    description: 'Alias aceito para status.',
  })
  @IsOptional()
  @IsIn(['ATIVA', 'CANCELADA', 'FINALIZADA', 'EXPIRADA'])
  statusReserva?: string;

  @ApiPropertyOptional({
    example: 2,
    description:
      'Usuario dono da reserva. Para CLIENT autenticado, o token prevalece.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_usuario?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Alias aceito para id_usuario.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idUsuario?: number;

  @ApiProperty({
    example: 1,
    description: 'ID da vaga a ser reservada.',
  })
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

  @ApiPropertyOptional({
    example: 1,
    description: 'Plano usado para calcular a tarifa quando valor for omitido.',
  })
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
}
