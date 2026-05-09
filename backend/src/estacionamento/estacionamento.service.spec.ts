import { Test, TestingModule } from '@nestjs/testing';
import { EstacionamentoRepository } from './estacionamento.repository';
import { EstacionamentoService } from './estacionamento.service';

describe('EstacionamentoService', () => {
  let service: EstacionamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstacionamentoService,
        { provide: EstacionamentoRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<EstacionamentoService>(EstacionamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
