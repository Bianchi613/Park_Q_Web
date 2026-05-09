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
SEQUELIZE_SYNCHRONIZE=false

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=1d

TEST_USER_PASSWORD=12345
SEED_ADMIN_PASSWORD=admin123
SEED_CLIENT_PASSWORD=cliente123
SEED_VISITOR_PASSWORD=visitor123

GEOCODING_PROVIDER=nominatim
GEOCODING_USER_AGENT=park-q-web/1.0
GEOCODING_TIMEOUT_MS=5000

RESERVA_MONITOR_ENABLED=true
RESERVA_MONITOR_INTERVAL_MS=60000
```

## Execucao

```bash
npm install
npm run db:create
npm run db:migrate
npm run db:seed
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
npm run db:migrate
npm run db:setup
npm run db:seed
npm run db:seed:undo
npm run build
npm run lint
npm run test
npm run test:e2e
```

## Banco

As migrations em `backend/migrations/` sao a fonte oficial do schema. O arquivo `backend/parkq.sql` fica apenas como referencia/manual.

Por padrao, `synchronize` fica desligado mesmo em desenvolvimento. Para ligar temporariamente, use `SEQUELIZE_SYNCHRONIZE=true`. Para producao, use migrations e mantenha `NODE_ENV=production` e `SEQUELIZE_SYNCHRONIZE=false`.

Comandos:

```bash
npm run db:migrate
npm run db:migrate:undo
npm run db:migrate:undo:all
npm run db:setup
npm run db:seed
npm run db:seed:undo
```

`npm run db:setup` cria o banco, aplica migrations e roda os seeders. O seeder inicial cria:

| Perfil | Email | Senha |
| --- | --- | --- |
| `ADMIN` | `admin@parkq.local` | `admin123` |
| `CLIENT` | `cliente@parkq.local` | `cliente123` |
| `VISITOR` | `visitor@parkq.local` | `visitor123` |

As senhas podem ser sobrescritas por `SEED_ADMIN_PASSWORD`, `SEED_CLIENT_PASSWORD` e `SEED_VISITOR_PASSWORD`.

## Concorrencia em reservas

Ao criar uma reserva, o backend usa transacao no PostgreSQL e trava a linha da vaga antes de gravar. A sequencia e: travar vaga, confirmar disponibilidade, verificar conflito de horario, criar reserva e marcar a vaga como ocupada. Isso evita que duas requisicoes simultaneas reservem a mesma vaga.

## Swagger

Swagger fica em `http://localhost:3000/api/docs`. Os principais DTOs possuem exemplos, enums e descricoes para facilitar testes manuais pela propria documentacao.

## Monitoramento automatico

`ReservaMonitorService` executa periodicamente `ReservaService.monitorarReservas()`. Ele envia notificacoes de reservas perto do fim, marca reservas vencidas como `EXPIRADA` e libera a vaga relacionada.

Configuracao:

- `RESERVA_MONITOR_ENABLED=true`
- `RESERVA_MONITOR_INTERVAL_MS=60000`
