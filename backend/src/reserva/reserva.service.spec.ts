import { Test, TestingModule } from '@nestjs/testing';
import { NotificacaoService } from '../notificacao/notificacao.service';
import { OperacaoService } from '../operacao/operacao.service';
import { PlanoTarifacaoService } from '../plano-tarifacao/plano-tarifacao.service';
import { VagaService } from '../vaga/vaga.service';
import { ReservaRepository } from './reserva.repository';
import { ReservaService } from './reserva.service';

describe('ReservaService', () => {
  let service: ReservaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservaService,
        { provide: ReservaRepository, useValue: {} },
        {
          provide: OperacaoService,
          useValue: {
            registrarReservaCriada: jest.fn(),
            registrarReservaCancelada: jest.fn(),
          },
        },
        {
          provide: NotificacaoService,
          useValue: {
            notificarReservaCriada: jest.fn(),
            notificarReservaCancelada: jest.fn(),
            notificarReservaExpirando: jest.fn(),
            notificarReservaExpirada: jest.fn(),
          },
        },
        {
          provide: PlanoTarifacaoService,
          useValue: {
            calcularDuracaoHoras: jest.fn(),
            calcularTarifaDetalhada: jest.fn(),
          },
        },
        { provide: VagaService, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    service = module.get<ReservaService>(ReservaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
