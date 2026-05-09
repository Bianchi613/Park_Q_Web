import { PartialType } from '@nestjs/swagger';
import { CreatePlanoTarifacaoDto } from './create-plano-tarifacao.dto';

export class UpdatePlanoTarifacaoDto extends PartialType(
  CreatePlanoTarifacaoDto,
) {}
