import { Test, TestingModule } from '@nestjs/testing';
import { OperacaoService } from './operacao.service';

describe('OperacaoService', () => {
  let service: OperacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OperacaoService],
    }).compile();

    service = module.get<OperacaoService>(OperacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
