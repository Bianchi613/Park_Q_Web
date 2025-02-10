import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EstacionamentoService } from './estacionamento/estacionamento.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  

  // Ativando CORS para permitir requisições de outros domínios
  app.enableCors();

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Estacionamento') // Título da documentação Swagger
    .setDescription(
      'Documentação da API para gerenciamento de estacionamentos, com autenticação e autorização JWT.',
    ) // Descrição
    .setVersion('1.0') // Versão da API
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Insira o token JWT para acessar as rotas protegidas',
    }) // Suporte para autenticação Bearer
    .build();

  // Criação do documento Swagger
  const document = SwaggerModule.createDocument(app, config);

  // Configuração da rota da documentação (http://localhost:3000/api/docs)
  SwaggerModule.setup('api/docs', app, document); // 🔥 Corrigida a URL para /api/docs

  await app.listen(3000, () => {
    console.log(`🚀 Servidor rodando em http://localhost:3000/`);
    console.log(
      `📚 Documentação do Swagger disponível em http://localhost:3000/api/docs`,
    );
  });
}
bootstrap();
