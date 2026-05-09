import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Estacionamento } from '../estacionamento/estacionamento.model';
import { VagaController } from './vaga.controller';
import { Vaga } from './vaga.model';
import { VagaRepository } from './vaga.repository';
import { VagaService } from './vaga.service';

@Module({
  imports: [SequelizeModule.forFeature([Vaga, Estacionamento])],
  controllers: [VagaController],
  providers: [VagaService, VagaRepository],
  exports: [VagaService, VagaRepository],
})
export class VagaModule {}
