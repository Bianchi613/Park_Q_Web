import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { NotificacaoTipo } from '../notificacao.model';

export class CreateNotificacaoDto {
  @IsOptional()
  @IsIn([
    'CADASTRO',
    'RESERVA',
    'PAGAMENTO',
    'CANCELAMENTO',
    'EXPIRACAO',
    'SISTEMA',
  ])
  tipo?: NotificacaoTipo;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  titulo: string;

  @IsString()
  @IsNotEmpty()
  mensagem: string;

  @Type(() => Number)
  @IsInt()
  id_usuario: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id_reserva?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  chave?: string;
}
