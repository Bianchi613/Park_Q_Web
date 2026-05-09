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
  @IsString()
  @IsNotEmpty()
  CPF: string;

  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  senha: string;

  @IsOptional()
  @IsIn(['ADMIN', 'CLIENT', 'VISITOR'])
  role?: string;

  @IsOptional()
  @IsString()
  preferencias?: string;

  @IsOptional()
  @IsString()
  cargo?: string;

  @IsOptional()
  @IsString()
  privilegios?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_estacionamento?: number;
}
