import { Test, TestingModule } from '@nestjs/testing';
import { PlanoTarifacaoRepository } from './plano-tarifacao.repository';
import { PlanoTarifacaoService } from './plano-tarifacao.service';

describe('PlanoTarifacaoService', () => {
  let service: PlanoTarifacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanoTarifacaoService,
        { provide: PlanoTarifacaoRepository, useValue: {} },
      ],
    }).compile();

    service = module.get<PlanoTarifacaoService>(PlanoTarifacaoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
