import { Test, TestingModule } from '@nestjs/testing';
import { EstacionamentoController } from './estacionamento.controller';

describe('EstacionamentoController', () => {
  let controller: EstacionamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstacionamentoController],
    }).compile();

    controller = module.get<EstacionamentoController>(EstacionamentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
