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

export class CreatePagamentoDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  id_reserva: number;

  @ApiProperty({
    enum: [
      'cartao_credito',
      'cartao',
      'cartao de credito',
      'PIX',
      'pix',
      'boleto',
    ],
    example: 'PIX',
  })
  @IsIn([
    'cartao_credito',
    'cartao',
    'cartao de credito',
    'PIX',
    'pix',
    'boleto',
  ])
  metodo_pagamento: string;

  @ApiProperty({ example: 21 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valor_pago: number;

  @ApiPropertyOptional({ example: '2026-05-09T12:05:00Z' })
  @IsOptional()
  @IsDateString()
  data_hora?: string;
}
