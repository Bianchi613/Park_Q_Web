import { Test, TestingModule } from '@nestjs/testing';
import { EstacionamentoService } from './estacionamento.service';

describe('EstacionamentoService', () => {
  let service: EstacionamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstacionamentoService],
    }).compile();

    service = module.get<EstacionamentoService>(EstacionamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
