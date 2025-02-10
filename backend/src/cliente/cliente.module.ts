import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { ClienteRepository } from './cliente.repository';
import { Cliente } from './cliente.model';
import { VagaModule } from '../vaga/vaga.module'; // Importando o VagaModule
import { ReservaModule } from '../reserva/reserva.module'; // 🔥 Importando o ReservaModule

@Module({
  imports: [
    SequelizeModule.forFeature([Cliente]),
    VagaModule, // Importando o VagaModule
    ReservaModule, // 🔥 Agora o ClienteModule tem acesso ao ReservaRepository
  ],
  controllers: [ClienteController],
  providers: [ClienteService, ClienteRepository],
  exports: [ClienteService], // ClienteService está sendo exportado corretamente
})
export class ClienteModule {}
