import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Reserva } from './reserva.model';
import { ReservaController } from './reserva.controller';
import { ReservaService } from './reserva.service';
import { ReservaRepository } from './reserva.repository';

@Module({
  imports: [SequelizeModule.forFeature([Reserva])], // Certifique-se de que o modelo está registrado no Sequelize
  controllers: [ReservaController], // Adiciona o controller para a rota de Reservas
  providers: [ReservaService, ReservaRepository], // Certifique-se de que o ReservaService e o ReservaRepository estão listados como providers
  exports: [ReservaService, ReservaRepository], // Exporta tanto o ReservaService quanto o ReservaRepository
})
export class ReservaModule {}
