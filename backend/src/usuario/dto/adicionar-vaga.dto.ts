import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional } from 'class-validator';

export class AdicionarVagaDto {
  @Type(() => Number)
  @IsInt()
  numero: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_estacionamento?: number;

  @IsOptional()
  @IsIn(['disponivel', 'ocupada'])
  status?: string;

  @IsOptional()
  @IsIn(['carro', 'moto'])
  tipo?: string;

  @IsOptional()
  @IsBoolean()
  reservada?: boolean;
}
