import { Test, TestingModule } from '@nestjs/testing';
import { NotificacaoService } from '../notificacao/notificacao.service';
import { OperacaoService } from '../operacao/operacao.service';
import { ReservaService } from '../reserva/reserva.service';
import { PagamentoRepository } from './pagamento.repository';
import { PagamentoService } from './pagamento.service';

describe('PagamentoService', () => {
  let service: PagamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagamentoService,
        { provide: PagamentoRepository, useValue: {} },
        { provide: ReservaService, useValue: {} },
        {
          provide: OperacaoService,
          useValue: { registrarPagamentoConfirmado: jest.fn() },
        },
        {
          provide: NotificacaoService,
          useValue: { notificarPagamentoConfirmado: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<PagamentoService>(PagamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
