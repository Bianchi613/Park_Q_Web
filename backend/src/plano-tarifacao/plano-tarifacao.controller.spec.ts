import { Test, TestingModule } from '@nestjs/testing';
import { PlanoTarifacaoController } from './plano-tarifacao.controller';
import { PlanoTarifacaoService } from './plano-tarifacao.service';

describe('PlanoTarifacaoController', () => {
  let controller: PlanoTarifacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanoTarifacaoController],
      providers: [{ provide: PlanoTarifacaoService, useValue: {} }],
    }).compile();

    controller = module.get<PlanoTarifacaoController>(PlanoTarifacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
