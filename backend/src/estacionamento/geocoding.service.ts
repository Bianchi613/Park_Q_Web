import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

interface NominatimResult {
  lat: string;
  lon: string;
}

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);

  constructor(private readonly configService: ConfigService) {}

  async geocode(address: string): Promise<Coordinates | null> {
    if (!address?.trim()) {
      return null;
    }

    const provider = this.configService.get<string>('GEOCODING_PROVIDER');
    const normalizedProvider = provider?.toLowerCase() ?? 'nominatim';

    if (normalizedProvider === 'disabled') {
      return null;
    }

    if (normalizedProvider !== 'nominatim') {
      this.logger.warn(
        `Provedor de geocoding "${provider}" nao configurado. Usando coordenadas manuais.`,
      );
      return null;
    }

    return this.geocodeWithNominatim(address);
  }

  private async geocodeWithNominatim(
    address: string,
  ): Promise<Coordinates | null> {
    try {
      const baseUrl =
        this.configService.get<string>('GEOCODING_NOMINATIM_URL') ??
        'https://nominatim.openstreetmap.org/search';
      const userAgent =
        this.configService.get<string>('GEOCODING_USER_AGENT') ??
        'park-q-web/1.0';
      const timeoutMs = Number(
        this.configService.get<string>('GEOCODING_TIMEOUT_MS') ?? 5000,
      );

      const url = new URL(baseUrl);
      url.searchParams.set('q', address);
      url.searchParams.set('format', 'json');
      url.searchParams.set('limit', '1');
      url.searchParams.set('addressdetails', '0');

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
          'User-Agent': userAgent,
        },
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        this.logger.warn(
          `Geocoding falhou para "${address}" com status ${response.status}.`,
        );
        return null;
      }

      const results = (await response.json()) as NominatimResult[];
      const firstResult = results[0];

      if (!firstResult) {
        return null;
      }

      const latitude = Number(firstResult.lat);
      const longitude = Number(firstResult.lon);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return null;
      }

      return { latitude, longitude };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Nao foi possivel geocodificar "${address}": ${message}`,
      );
      return null;
    }
  }
}
