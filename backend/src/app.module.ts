import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EstacionamentoModule } from './estacionamento/estacionamento.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PlanoTarifacaoModule } from './plano-tarifacao/plano-tarifacao.module';
import { VagaModule } from './vaga/vaga.module';
import { ReservaModule } from './reserva/reserva.module';
import { OperacaoModule } from './operacao/operacao.module';
import { PagamentoModule } from './pagamento/pagamento.module';
import { ClienteModule } from './cliente/cliente.module';
import { AdministradorModule } from './administrador/administrador.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1️ Carregar variáveis de ambiente do arquivo .env
    ConfigModule.forRoot({
      isGlobal: true, // As variáveis de ambiente estarão disponíveis globalmente
      envFilePath: '.env', // Caminho do arquivo .env
    }),

    // 2️ Configurar o Sequelize para conectar ao banco de dados PostgreSQL
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres', // Banco de dados PostgreSQL
        host: configService.get<string>('DATABASE_HOST', 'localhost'), // Variável de ambiente para o host
        port: parseInt(configService.get<string>('DATABASE_PORT', '5432'), 10), // Porta do banco de dados
        username: configService.get<string>('DATABASE_USER', 'postgres'), // Usuário do banco
        password: configService.get<string>('DATABASE_PASSWORD', '12345'), // Senha do banco
        database: configService.get<string>('DATABASE_NAME', 'parkq'), // Nome do banco de dados
        autoLoadModels: true, // Carregamento automático dos models
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // Não sincronizar em produção
        logging:
          configService.get<string>('NODE_ENV') !== 'production'
            ? console.log
            : false, // Desabilitar logs de SQL no modo produção
      }),
    }),

    // 3️ Importação dos módulos principais
    EstacionamentoModule,
    UsuarioModule,
    PlanoTarifacaoModule,
    VagaModule,
    ReservaModule,
    OperacaoModule,
    PagamentoModule,
    ClienteModule,
    AdministradorModule,
    AuthModule, // Importação do módulo de autenticação
  ],
})
export class AppModule {}
