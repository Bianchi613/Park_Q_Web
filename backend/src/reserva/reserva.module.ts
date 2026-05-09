import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificacaoModule } from '../notificacao/notificacao.module';
import { OperacaoModule } from '../operacao/operacao.module';
import { PlanoTarifacaoModule } from '../plano-tarifacao/plano-tarifacao.module';
import { VagaModule } from '../vaga/vaga.module';
import { ReservaController } from './reserva.controller';
import { Reserva } from './reserva.model';
import { ReservaMonitorService } from './reserva-monitor.service';
import { ReservaRepository } from './reserva.repository';
import { ReservaService } from './reserva.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Reserva]),
    OperacaoModule,
    NotificacaoModule,
    PlanoTarifacaoModule,
    VagaModule,
  ],
  controllers: [ReservaController],
  providers: [ReservaService, ReservaRepository, ReservaMonitorService],
  exports: [ReservaService, ReservaRepository],
})
export class ReservaModule {}
