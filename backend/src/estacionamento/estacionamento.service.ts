import { Injectable } from '@nestjs/common';
import { Estacionamento } from './estacionamento.model';
import { EstacionamentoRepository } from './estacionamento.repository';
import { GeocodingService } from './geocoding.service';

type EstacionamentoComDistancia = Estacionamento & { distanciaKm: number };

@Injectable()
export class EstacionamentoService {
  constructor(
    private readonly estacionamentoRepository: EstacionamentoRepository,
    private readonly geocodingService: GeocodingService,
  ) {}

  async create(data: Partial<Estacionamento>): Promise<Estacionamento> {
    const payload = await this.withGeocodedCoordinates(data);

    return this.estacionamentoRepository.create({
      ...payload,
      vagas_disponiveis: data.vagas_disponiveis ?? data.capacidade ?? 0,
    });
  }

  async findAll(includeAssociations = false): Promise<Estacionamento[]> {
    return this.estacionamentoRepository.findAll(includeAssociations);
  }

  async findOne(
    id: number,
    includeAssociations = false,
  ): Promise<Estacionamento> {
    return this.estacionamentoRepository.findOne(id, includeAssociations);
  }

  async update(
    id: number,
    data: Partial<Estacionamento>,
  ): Promise<Estacionamento> {
    const current = await this.estacionamentoRepository.findOne(id);
    const payload = await this.withGeocodedCoordinates(data, current);

    return this.estacionamentoRepository.update(id, payload);
  }

  async remove(id: number): Promise<void> {
    return this.estacionamentoRepository.remove(id);
  }

  async monitorarVagas(id: number) {
    const estacionamento = await this.estacionamentoRepository.findOne(
      id,
      true,
    );
    const vagas = await estacionamento.$get('vagas');
    const vagasDisponiveis = vagas.filter(
      (vaga) => vaga.status === 'disponivel' && !vaga.reservada,
    ).length;

    await estacionamento.update({ vagas_disponiveis: vagasDisponiveis });

    return {
      id_estacionamento: estacionamento.id,
      total_vagas: vagas.length,
      vagas_disponiveis: vagasDisponiveis,
      vagas_ocupadas: vagas.length - vagasDisponiveis,
    };
  }

  async gerarRelatorios(id: number) {
    const estacionamento = await this.estacionamentoRepository.findOne(
      id,
      true,
    );
    const vagas = await estacionamento.$get('vagas');
    const totalVagas = vagas.length;
    const vagasOcupadas = vagas.filter(
      (vaga) => vaga.status === 'ocupada' || vaga.reservada,
    ).length;

    return {
      ocupacao: totalVagas
        ? Number(((vagasOcupadas / totalVagas) * 100).toFixed(2))
        : 0,
      faturamento: vagasOcupadas * 10,
      tempoMedio: vagasOcupadas > 0 ? 120 : 0,
      totalVagas,
      vagasOcupadas,
      vagasDisponiveis: totalVagas - vagasOcupadas,
    };
  }

  async findNearby(
    latitude: number,
    longitude: number,
  ): Promise<EstacionamentoComDistancia[]> {
    const estacionamentos = await this.estacionamentoRepository.findAll();

    return estacionamentos
      .filter(
        (estacionamento) =>
          estacionamento.latitude !== null && estacionamento.longitude !== null,
      )
      .map((estacionamento) => {
        const plain = estacionamento.get({ plain: true }) as Estacionamento;
        const distanciaKm = this.calculateDistanceKm(
          latitude,
          longitude,
          Number(estacionamento.latitude),
          Number(estacionamento.longitude),
        );

        return {
          ...plain,
          distanciaKm: Number(distanciaKm.toFixed(2)),
        } as EstacionamentoComDistancia;
      })
      .sort((a, b) => a.distanciaKm - b.distanciaKm);
  }

  private async withGeocodedCoordinates(
    data: Partial<Estacionamento>,
    current?: Estacionamento,
  ): Promise<Partial<Estacionamento>> {
    const payload = { ...data };
    const address = payload.localizacao ?? current?.localizacao;
    const hasLatitude =
      payload.latitude !== undefined && payload.latitude !== null;
    const hasLongitude =
      payload.longitude !== undefined && payload.longitude !== null;

    if (!address || (hasLatitude && hasLongitude)) {
      return payload;
    }

    const coordinates = await this.geocodingService.geocode(address);

    if (!coordinates) {
      return payload;
    }

    return {
      ...payload,
      latitude: hasLatitude ? payload.latitude : coordinates.latitude,
      longitude: hasLongitude ? payload.longitude : coordinates.longitude,
    };
  }

  private calculateDistanceKm(
    originLatitude: number,
    originLongitude: number,
    destinationLatitude: number,
    destinationLongitude: number,
  ): number {
    const earthRadiusKm = 6371;
    const latitudeDistance = this.toRadians(
      destinationLatitude - originLatitude,
    );
    const longitudeDistance = this.toRadians(
      destinationLongitude - originLongitude,
    );
    const originLatitudeInRadians = this.toRadians(originLatitude);
    const destinationLatitudeInRadians = this.toRadians(destinationLatitude);

    const haversine =
      Math.sin(latitudeDistance / 2) ** 2 +
      Math.cos(originLatitudeInRadians) *
        Math.cos(destinationLatitudeInRadians) *
        Math.sin(longitudeDistance / 2) ** 2;

    return (
      2 *
      earthRadiusKm *
      Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
    );
  }

  private toRadians(value: number): number {
    return (value * Math.PI) / 180;
  }
}
