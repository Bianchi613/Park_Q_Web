// File: src/usuario/usuario.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './usuario.model';
import { UsuarioRepository } from './usuario.repository';

@Module({
  imports: [SequelizeModule.forFeature([Usuario])],
  providers: [UsuarioService, UsuarioRepository],
  controllers: [UsuarioController],
  exports: [UsuarioService],
})
export class UsuarioModule {}
