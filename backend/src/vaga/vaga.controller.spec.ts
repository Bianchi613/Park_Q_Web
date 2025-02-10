import { Test, TestingModule } from '@nestjs/testing';
import { VagaController } from './vaga.controller';

describe('VagaController', () => {
  let controller: VagaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VagaController],
    }).compile();

    controller = module.get<VagaController>(VagaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
