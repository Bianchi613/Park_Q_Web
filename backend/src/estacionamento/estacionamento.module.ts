// src/estacionamento/estacionamento.module.ts
import { Module } from '@nestjs/common';
import { EstacionamentoService } from './estacionamento.service';
import { EstacionamentoController } from './estacionamento.controller';
import { EstacionamentoRepository } from './estacionamento.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Estacionamento } from './estacionamento.model';
import { Vaga } from '../vaga/vaga.model';

@Module({
  imports: [SequelizeModule.forFeature([Estacionamento, Vaga])],
  controllers: [EstacionamentoController],
  providers: [EstacionamentoService, EstacionamentoRepository],
})
export class EstacionamentoModule {}
