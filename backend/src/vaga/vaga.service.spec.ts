import { Test, TestingModule } from '@nestjs/testing';
import { VagaRepository } from './vaga.repository';
import { VagaService } from './vaga.service';

describe('VagaService', () => {
  let service: VagaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VagaService, { provide: VagaRepository, useValue: {} }],
    }).compile();

    service = module.get<VagaService>(VagaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
