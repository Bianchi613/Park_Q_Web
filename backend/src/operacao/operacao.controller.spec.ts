import { Test, TestingModule } from '@nestjs/testing';
import { OperacaoController } from './operacao.controller';

describe('OperacaoController', () => {
  let controller: OperacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperacaoController],
    }).compile();

    controller = module.get<OperacaoController>(OperacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
