import { Test, TestingModule } from '@nestjs/testing';
import { PlanoTarifacaoService } from './plano-tarifacao.service';

describe('PlanoTarifacaoService', () => {
  let service: PlanoTarifacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanoTarifacaoService],
    }).compile();

    service = module.get<PlanoTarifacaoService>(PlanoTarifacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
