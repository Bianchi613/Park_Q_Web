import { Test, TestingModule } from '@nestjs/testing';
import { EstacionamentoController } from './estacionamento.controller';
import { EstacionamentoService } from './estacionamento.service';

describe('EstacionamentoController', () => {
  let controller: EstacionamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstacionamentoController],
      providers: [{ provide: EstacionamentoService, useValue: {} }],
    }).compile();

    controller = module.get<EstacionamentoController>(EstacionamentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
