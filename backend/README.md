# Backend Park Q

API NestJS do Park Q Web. Ela gerencia usuarios, estacionamentos, vagas, reservas, planos de tarifacao, pagamentos, notificacoes e operacoes de auditoria.

## Stack

- NestJS
- TypeScript
- Sequelize / sequelize-typescript
- PostgreSQL
- JWT / Passport
- Swagger

## Configuracao

Crie `backend/.env`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=12345
DATABASE_NAME=parkq
DATABASE_MAINTENANCE_DB=postgres

NODE_ENV=development
PORT=3000

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=1d

GEOCODING_PROVIDER=nominatim
GEOCODING_USER_AGENT=park-q-web/1.0
GEOCODING_TIMEOUT_MS=5000
```

## Execucao

```bash
npm install
npm run db:create
npm run start:dev
```

URLs:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`

## Autenticacao e permissoes

O login retorna um JWT em `/auth/login`. Rotas protegidas devem receber:

```http
Authorization: Bearer seu_token_jwt
```

Perfis:

- `ADMIN`: gerencia usuarios, vagas, estacionamentos, relatorios, operacoes e notificacoes.
- `CLIENT`: cria/cancela reservas, registra pagamentos e consulta seus proprios dados.
- `VISITOR`: visitante esporadico/logado; consulta estacionamentos, vagas e tarifas, mas nao reserva nem paga.

## Modulos

| Modulo | Responsabilidade |
| --- | --- |
| `auth` | Login JWT |
| `usuario` | Usuarios `CLIENT`, `ADMIN` e `VISITOR` |
| `estacionamento` | Cadastro, geocoding, relatorios e monitoramento de vagas |
| `vaga` | Cadastro, reserva e liberacao de vagas |
| `reserva` | Criacao, cancelamento, calculo de valor e monitoramento de tempo |
| `plano-tarifacao` | Regras de tarifa por hora/diaria/tipo de vaga |
| `pagamento` | Registro e validacao de pagamentos |
| `notificacao` | Mensagens ao usuario |
| `operacao` | Auditoria de acoes do sistema |

## DTOs e validacao

Os controllers usam DTOs com `class-validator` e `ValidationPipe` global. O backend valida campos obrigatorios, tipos, enums e rejeita campos desconhecidos antes de chamar os services.

## Scripts

```bash
npm run db:create
npm run start
npm run start:dev
npm run build
npm run lint
npm run test
npm run test:e2e
```

## Banco

O schema de referencia fica em `backend/parkq.sql`. Em desenvolvimento, o Sequelize usa `synchronize` quando `NODE_ENV` nao e `production`.

Para producao, use migrations e mantenha `NODE_ENV=production`.
