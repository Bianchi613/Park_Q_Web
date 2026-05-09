import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Reserva } from '../reserva/reserva.model';
import { Usuario } from '../usuario/usuario.model';
import { NotificacaoController } from './notificacao.controller';
import { Notificacao } from './notificacao.model';
import { NotificacaoRepository } from './notificacao.repository';
import { NotificacaoService } from './notificacao.service';

@Module({
  imports: [SequelizeModule.forFeature([Notificacao, Usuario, Reserva])],
  controllers: [NotificacaoController],
  providers: [NotificacaoService, NotificacaoRepository],
  exports: [NotificacaoService],
})
export class NotificacaoModule {}
