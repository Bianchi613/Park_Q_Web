import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pagamento } from './pagamento.model';
import { PagamentoRepository } from './pagamento.repository';
import { PagamentoService } from './pagamento.service';
import { PagamentoController } from './pagamento.controller';
import { NotificacaoModule } from '../notificacao/notificacao.module';
import { OperacaoModule } from '../operacao/operacao.module';
import { ReservaModule } from '../reserva/reserva.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Pagamento]),
    ReservaModule,
    OperacaoModule,
    NotificacaoModule,
  ],
  controllers: [PagamentoController],
  providers: [PagamentoService, PagamentoRepository],
  exports: [PagamentoService],
})
export class PagamentoModule {}
