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
  @Type(() => Number)
  @IsInt()
  id_reserva: number;

  @IsIn([
    'cartao_credito',
    'cartao',
    'cartao de credito',
    'PIX',
    'pix',
    'boleto',
  ])
  metodo_pagamento: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  valor_pago: number;

  @IsOptional()
  @IsDateString()
  data_hora?: string;
}
