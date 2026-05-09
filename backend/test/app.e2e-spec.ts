import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { EstacionamentoController } from '../src/estacionamento/estacionamento.controller';
import { EstacionamentoService } from '../src/estacionamento/estacionamento.service';

describe('Estacionamentos (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [EstacionamentoController],
      providers: [
        {
          provide: EstacionamentoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                id: 1,
                nome: 'Estacionamento Central',
                localizacao: 'Rua Principal, 123',
                capacidade: 50,
                vagas_disponiveis: 50,
              },
            ]),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/estacionamentos (GET)', () => {
    return request(app.getHttpServer())
      .get('/estacionamentos')
      .expect(200)
      .expect([
        {
          id: 1,
          nome: 'Estacionamento Central',
          localizacao: 'Rua Principal, 123',
          capacidade: 50,
          vagas_disponiveis: 50,
        },
      ]);
  });
});
