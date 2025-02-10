import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AdministradorService } from './administrador.service';

@Controller('administradores')
export class AdministradorController {
  constructor(private readonly administradorService: AdministradorService) {}

  // CRUD

  @Post()
  async create(@Body() data: any) {
    try {
      return await this.administradorService.create(data);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.administradorService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      return await this.administradorService.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() data: any) {
    try {
      return await this.administradorService.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    try {
      return await this.administradorService.delete(id);
    } catch (error) {
      throw error;
    }
  }

  // Métodos Específicos

  @Post(':id/adicionarVaga')
  async adicionarVaga(@Param('id') id: number, @Body() data: any) {
    try {
      return await this.administradorService.adicionarVaga(id, data);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id/removerVaga/:vagaId')
  async removerVaga(@Param('id') id: number, @Param('vagaId') vagaId: number) {
    try {
      return await this.administradorService.removerVaga(vagaId);
    } catch (error) {
      throw error;
    }
  }
}
