import { Logger } from '@nestjs/common';
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

  const config = new DocumentBuilder()
    .setTitle('API Park Q')
    .setDescription(
      'API para gerenciamento de estacionamentos, vagas, reservas, pagamentos e autenticacao JWT.',
    )
    .setVersion('1.0')
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
