//administrador.model.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AdministradorController } from './administrador.controller';
import { AdministradorService } from './administrador.service';
import { AdministradorRepository } from './administrador.repository';
import { Administrador } from './administrador.model';

@Module({
  imports: [SequelizeModule.forFeature([Administrador])],
  controllers: [AdministradorController],
  providers: [AdministradorService, AdministradorRepository],
  exports: [AdministradorService],
})
export class AdministradorModule {}
