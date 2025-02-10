import { Test, TestingModule } from '@nestjs/testing';
import { PlanoTarifacaoController } from './plano-tarifacao.controller';

describe('PlanoTarifacaoController', () => {
  let controller: PlanoTarifacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanoTarifacaoController],
    }).compile();

    controller = module.get<PlanoTarifacaoController>(PlanoTarifacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
