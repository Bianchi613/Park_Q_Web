import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { EstacionamentoModule } from './estacionamento/estacionamento.module';
import { OperacaoModule } from './operacao/operacao.module';
import { PagamentoModule } from './pagamento/pagamento.module';
import { PlanoTarifacaoModule } from './plano-tarifacao/plano-tarifacao.module';
import { ReservaModule } from './reserva/reserva.module';
import { UsuarioModule } from './usuario/usuario.module';
import { VagaModule } from './vaga/vaga.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'backend/.env'],
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.getOrThrow<string>('DATABASE_HOST'),
        port: parseInt(configService.getOrThrow<string>('DATABASE_PORT'), 10),
        username: configService.getOrThrow<string>('DATABASE_USER'),
        password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
        database: configService.getOrThrow<string>('DATABASE_NAME'),
        autoLoadModels: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging:
          configService.get<string>('NODE_ENV') !== 'production'
            ? console.log
            : false,
      }),
    }),
    EstacionamentoModule,
    UsuarioModule,
    PlanoTarifacaoModule,
    VagaModule,
    ReservaModule,
    OperacaoModule,
    PagamentoModule,
    AuthModule,
  ],
})
export class AppModule {}
