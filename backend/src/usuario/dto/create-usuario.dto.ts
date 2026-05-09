import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ example: '12345678900' })
  @IsString()
  @IsNotEmpty()
  CPF: string;

  @ApiProperty({ example: 'Maria Silva' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'maria@parkq.local' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '(11) 90000-0000' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({ example: 'maria' })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @IsNotEmpty()
  senha: string;

  @ApiPropertyOptional({
    enum: ['ADMIN', 'CLIENT', 'VISITOR'],
    example: 'CLIENT',
  })
  @IsOptional()
  @IsIn(['ADMIN', 'CLIENT', 'VISITOR'])
  role?: string;

  @ApiPropertyOptional({ example: 'vaga_carro' })
  @IsOptional()
  @IsString()
  preferencias?: string;

  @ApiPropertyOptional({ example: 'Gerente' })
  @IsOptional()
  @IsString()
  cargo?: string;

  @ApiPropertyOptional({ example: 'gerenciar_estacionamento' })
  @IsOptional()
  @IsString()
  privilegios?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Obrigatorio para ADMIN.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_estacionamento?: number;
}
