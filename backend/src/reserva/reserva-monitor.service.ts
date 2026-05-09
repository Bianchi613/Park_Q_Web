import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReservaService } from './reserva.service';

@Injectable()
export class ReservaMonitorService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ReservaMonitorService.name);
  private interval?: NodeJS.Timeout;
  private running = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly reservaService: ReservaService,
  ) {}

  onModuleInit(): void {
    const enabled =
      this.configService.get<string>('RESERVA_MONITOR_ENABLED') !== 'false' &&
      this.configService.get<string>('NODE_ENV') !== 'test';

    if (!enabled) {
      return;
    }

    const intervalMs = Number(
      this.configService.get<string>('RESERVA_MONITOR_INTERVAL_MS') ?? 60000,
    );

    this.interval = setInterval(() => {
      void this.monitorarReservas();
    }, intervalMs);

    this.logger.log(`Monitoramento de reservas ativo a cada ${intervalMs}ms.`);
  }

  onModuleDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private async monitorarReservas(): Promise<void> {
    if (this.running) {
      return;
    }

    this.running = true;

    try {
      const resultado = await this.reservaService.monitorarReservas();
      const expiradas = resultado.filter((reserva) => reserva.expirada).length;
      const notificadas = resultado.filter(
        (reserva) => reserva.deveNotificar,
      ).length;

      if (expiradas || notificadas) {
        this.logger.log(
          `Monitoramento processado: ${expiradas} expiradas, ${notificadas} perto do fim.`,
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Falha ao monitorar reservas: ${message}`);
    } finally {
      this.running = false;
    }
  }
}
