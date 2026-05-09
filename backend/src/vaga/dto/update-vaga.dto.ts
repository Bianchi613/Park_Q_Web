import { PartialType } from '@nestjs/swagger';
import { CreateVagaDto } from './create-vaga.dto';

export class UpdateVagaDto extends PartialType(CreateVagaDto) {}
