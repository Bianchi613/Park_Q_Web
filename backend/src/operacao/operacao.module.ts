import { Module } from '@nestjs/common';
import { OperacaoService } from './operacao.service';
import { OperacaoController } from './operacao.controller';
import { OperacaoRepository } from './operacao.repository';
import { SequelizeModule } from '@nestjs/sequelize';
import { Operacao } from './operacao.model';
import { Usuario } from '../usuario/usuario.model';

@Module({
  imports: [SequelizeModule.forFeature([Operacao, Usuario])],
  controllers: [OperacaoController],
  providers: [OperacaoService, OperacaoRepository],
})
export class OperacaoModule {}
