import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class CancelarReservaDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_reserva?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idReserva?: number;
}
