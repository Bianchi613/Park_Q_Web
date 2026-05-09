import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional } from 'class-validator';

export class CreateVagaDto {
  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  numero: number;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  id_estacionamento: number;

  @ApiPropertyOptional({
    enum: ['disponivel', 'ocupada'],
    example: 'disponivel',
  })
  @IsOptional()
  @IsIn(['disponivel', 'ocupada'])
  status?: string;

  @ApiProperty({ enum: ['carro', 'moto'], example: 'carro' })
  @IsIn(['carro', 'moto'])
  tipo: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  reservada?: boolean;
}
