import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, Min } from 'class-validator';

export class CalcularTarifaDto {
  @IsIn(['carro', 'moto'])
  tipoVaga: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  duracao?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  duracaoHoras?: number;
}
