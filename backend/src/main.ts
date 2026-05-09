import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = Number(configService.get<string>('PORT') ?? 3000);
  const logger = new Logger('Bootstrap');

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Park Q')
    .setDescription(
      'API para gerenciamento de estacionamentos, vagas, reservas, pagamentos e autenticacao JWT.',
    )
    .setVersion('1.0')
    .addTag('Auth', 'Login e emissao de token JWT')
    .addTag('Usuarios', 'Clientes, administradores e visitantes')
    .addTag('Estacionamentos', 'Cadastro, geocoding, vagas e relatorios')
    .addTag('Vagas', 'Cadastro, reserva e liberacao de vagas')
    .addTag('Reservas', 'Reservas, cancelamento e monitoramento de tempo')
    .addTag('Pagamentos', 'Registro e validacao de pagamentos')
    .addTag('Notificacoes', 'Mensagens enviadas aos usuarios')
    .addTag('Operacoes', 'Auditoria de acoes do sistema')
    .addServer(`http://localhost:${port}`, 'Servidor local')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Informe o token JWT no formato Bearer.',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);

  logger.log(`Servidor rodando em http://localhost:${port}/`);
  logger.log(`Swagger disponivel em http://localhost:${port}/api/docs`);
}

bootstrap();
