import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional } from 'class-validator';

export class CreateVagaDto {
  @Type(() => Number)
  @IsInt()
  numero: number;

  @Type(() => Number)
  @IsInt()
  id_estacionamento: number;

  @IsOptional()
  @IsIn(['disponivel', 'ocupada'])
  status?: string;

  @IsIn(['carro', 'moto'])
  tipo: string;

  @IsOptional()
  @IsBoolean()
  reservada?: boolean;
}
