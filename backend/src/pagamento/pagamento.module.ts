import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pagamento } from './pagamento.model';
import { PagamentoRepository } from './pagamento.repository';
import { PagamentoService } from './pagamento.service';
import { PagamentoController } from './pagamento.controller';

@Module({
  imports: [SequelizeModule.forFeature([Pagamento])],
  controllers: [PagamentoController],
  providers: [PagamentoService, PagamentoRepository],
  exports: [PagamentoService],
})
export class PagamentoModule {}
