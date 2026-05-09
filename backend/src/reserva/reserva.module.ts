import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Reserva } from './reserva.model';
import { ReservaController } from './reserva.controller';
import { ReservaService } from './reserva.service';
import { ReservaRepository } from './reserva.repository';
import { OperacaoModule } from '../operacao/operacao.module';
import { NotificacaoModule } from '../notificacao/notificacao.module';
import { PlanoTarifacaoModule } from '../plano-tarifacao/plano-tarifacao.module';
import { VagaModule } from '../vaga/vaga.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Reserva]), // Registra o modelo Reserva no Sequelize
    OperacaoModule,
    NotificacaoModule,
    PlanoTarifacaoModule,
    VagaModule,
  ],
  controllers: [ReservaController], // Define o controller para as rotas relacionadas à Reserva
  providers: [
    ReservaService, // Serviço para lógica de negócios
    ReservaRepository, // Repositório para operações diretas no banco de dados
  ],
  exports: [
    ReservaService, // Torna o serviço disponível para outros módulos
    ReservaRepository, // Torna o repositório disponível para outros módulos, se necessário
  ],
})
export class ReservaModule {}
