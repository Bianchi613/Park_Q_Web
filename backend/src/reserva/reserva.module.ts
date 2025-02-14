import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Reserva } from './reserva.model';
import { ReservaController } from './reserva.controller';
import { ReservaService } from './reserva.service';
import { ReservaRepository } from './reserva.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([Reserva]), // Registra o modelo Reserva no Sequelize
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
