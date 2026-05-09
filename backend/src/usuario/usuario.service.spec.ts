import { Test, TestingModule } from '@nestjs/testing';
import { EstacionamentoService } from '../estacionamento/estacionamento.service';
import { ReservaService } from '../reserva/reserva.service';
import { VagaService } from '../vaga/vaga.service';
import { UsuarioRepository } from './usuario.repository';
import { UsuarioService } from './usuario.service';

describe('UsuarioService', () => {
  let service: UsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        { provide: UsuarioRepository, useValue: {} },
        { provide: ReservaService, useValue: {} },
        { provide: VagaService, useValue: {} },
        { provide: EstacionamentoService, useValue: {} },
      ],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
