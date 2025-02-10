import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VagaService } from './vaga.service';
import { VagaController } from './vaga.controller';
import { Vaga } from './vaga.model';
import { VagaRepository } from './vaga.repository'; // Certifique-se de importar o repositório

@Module({
  imports: [SequelizeModule.forFeature([Vaga])], // Certifique-se de que o modelo Vaga está registrado
  controllers: [VagaController],
  providers: [VagaService, VagaRepository], // Certifique-se de registrar o VagaRepository
  exports: [VagaService, VagaRepository], // Exporte VagaService e VagaRepository
})
export class VagaModule {}
