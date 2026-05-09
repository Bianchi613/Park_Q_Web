import { PartialType } from '@nestjs/swagger';
import { CreateEstacionamentoDto } from './create-estacionamento.dto';

export class UpdateEstacionamentoDto extends PartialType(
  CreateEstacionamentoDto,
) {}
