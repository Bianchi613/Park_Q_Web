import { Test, TestingModule } from '@nestjs/testing';
import { EstacionamentoRepository } from './estacionamento.repository';
import { EstacionamentoService } from './estacionamento.service';
import { GeocodingService } from './geocoding.service';

describe('EstacionamentoService', () => {
  let service: EstacionamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstacionamentoService,
        { provide: EstacionamentoRepository, useValue: {} },
        { provide: GeocodingService, useValue: { geocode: jest.fn() } },
      ],
    }).compile();

    service = module.get<EstacionamentoService>(EstacionamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
