import { Test, TestingModule } from '@nestjs/testing';
import { OperacaoController } from './operacao.controller';
import { OperacaoService } from './operacao.service';

describe('OperacaoController', () => {
  let controller: OperacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperacaoController],
      providers: [{ provide: OperacaoService, useValue: {} }],
    }).compile();

    controller = module.get<OperacaoController>(OperacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
