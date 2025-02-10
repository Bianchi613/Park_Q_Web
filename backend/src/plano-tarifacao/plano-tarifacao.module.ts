import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PlanoTarifacao } from './plano-tarifacao.model';
import { PlanoTarifacaoService } from './plano-tarifacao.service';
import { PlanoTarifacaoRepository } from './plano-tarifacao.repository';
import { PlanoTarifacaoController } from './plano-tarifacao.controller';

@Module({
  imports: [SequelizeModule.forFeature([PlanoTarifacao])],
  providers: [PlanoTarifacaoService, PlanoTarifacaoRepository],
  controllers: [PlanoTarifacaoController],
})
export class PlanoTarifacaoModule {}
