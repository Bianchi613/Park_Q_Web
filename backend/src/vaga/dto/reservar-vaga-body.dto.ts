import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class ReservarVagaBodyDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_reserva?: number;
}
