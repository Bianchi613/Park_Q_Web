# Park Q Web

Park Q Web e uma aplicacao para gerenciamento e reserva de vagas de estacionamento. O projeto possui frontend em React/Vite e backend em NestJS, usando PostgreSQL como banco de dados.

## Sumario

- [Sobre o projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Configuracao](#configuracao)
- [Como executar](#como-executar)
- [Funcionalidades](#funcionalidades)
- [Mapa de classes](#mapa-de-classes)
- [Melhorias implementadas](#melhorias-implementadas)
- [Principais endpoints da API](#principais-endpoints-da-api)
- [Banco de dados](#banco-de-dados)
- [Scripts uteis](#scripts-uteis)
- [Observacoes](#observacoes)

## Sobre o projeto

O Park Q centraliza o gerenciamento de estacionamentos rotativos. Usuarios clientes podem encontrar estacionamentos, escolher vagas, criar reservas e pagar a estadia. Usuarios administradores podem acompanhar vagas, monitorar ocupacao, gerar relatorios e gerenciar o estacionamento.

Fluxo principal:

1. O usuario cria conta ou faz login.
2. Usuarios com `role = CLIENT` consultam estacionamentos disponiveis.
3. O cliente escolhe estacionamento, vaga, periodo e plano de tarifacao.
4. A reserva e criada, o valor pode ser calculado automaticamente e a vaga e marcada como ocupada/reservada.
5. O pagamento e registrado, gerando notificacao e operacao de auditoria.
6. Usuarios com `role = ADMIN` monitoram ocupacao, reservas e relatorios.

## Tecnologias

Frontend:

- React
- Vite
- React Router
- Axios
- React Leaflet
- Styled Components
- Tailwind CSS

Backend:

- NestJS
- TypeScript
- Sequelize
- Sequelize Typescript
- PostgreSQL
- JWT
- Passport
- Swagger

Ferramentas:

- Node.js
- npm ou Yarn
- Concurrently

## Estrutura de pastas

```text
park-q-web/
  backend/
    src/
      auth/
      estacionamento/
      notificacao/
      operacao/
      pagamento/
      plano-tarifacao/
      reserva/
      usuario/
      vaga/
    config/
    migrations/
    parkq.sql

  frontend/
    src/
      assets/
      components/
      services/

  README.md
  package.json
```

## Configuracao

Crie `backend/.env` com:

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

TEST_USER_PASSWORD=12345

GEOCODING_PROVIDER=nominatim
GEOCODING_USER_AGENT=park-q-web/1.0
GEOCODING_TIMEOUT_MS=5000
```

Com `GEOCODING_PROVIDER=nominatim`, ao cadastrar ou editar um estacionamento com `localizacao` e sem coordenadas, o backend tenta preencher `latitude` e `longitude` automaticamente. Para desligar isso, use `GEOCODING_PROVIDER=disabled`.

## Como executar

Instale as dependencias na raiz:

```bash
npm install
```

Instale tambem dentro de cada app, se necessario:

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

Para iniciar frontend e backend juntos pela raiz:

```bash
npm start
```

Por padrao:

- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`
- Frontend: `http://localhost:5173`

## Funcionalidades

Usuario `CLIENT`:

- Cadastro e login
- Busca/listagem de estacionamentos
- Visualizacao de vagas
- Reserva de vaga
- Calculo automatico do valor da reserva
- Registro de pagamento
- Consulta de historico de reservas
- Recebimento de notificacoes

Usuario `VISITOR`:

- Login/cadastro com perfil limitado
- Consulta de estacionamentos
- Consulta de vagas disponiveis
- Consulta de planos de tarifacao
- Calculo de tarifa
- Nao pode reservar, pagar ou cancelar reservas

Usuario `ADMIN`:

- Dashboard administrativo
- Cadastro e edicao de estacionamentos
- Cadastro e edicao de vagas
- Cadastro e edicao de planos de tarifacao
- Monitoramento de ocupacao
- Monitoramento de tempo restante das reservas
- Relatorios de ocupacao e faturamento

## Mapa de classes

No codigo NestJS, os metodos de negocio ficam nos `Services`. Os `Models` representam atributos, relacionamentos e estrutura de banco.

| Classe | Entidades / atributos | Metodos / responsabilidades |
| --- | --- | --- |
| `Estacionamento` | `id`, `nome`, `localizacao`, `latitude`, `longitude`, `capacidade`, `vagas_disponiveis`, `categoria`, `imagemUrl`, `usuarios`, `vagas` | `monitorarVagas()`, `gerarRelatorios()`, `findNearby()`, geocoding automatico por endereco |
| `Vaga` | `id`, `numero`, `id_estacionamento`, `status`, `tipo`, `reservada`, `id_reserva`, `estacionamento`, `reserva` | `reservar()`, `liberar()`, `syncVagasDisponiveis()`, CRUD de vagas |
| `Usuario` | `id`, `CPF`, `nome`, `email`, `telefone`, `login`, `senha`, `role`, `preferencias`, `cargo`, `privilegios`, `id_estacionamento`, `reservas`, `operacoes`, `notificacoes` | `reservarVaga()`, `cancelarReserva()`, `historicoReservas()`, `adicionarVaga()`, `removerVaga()`, `monitorarOcupacao()`, `gerarRelatorio()` |
| `Administrador` | Nao existe como tabela separada. E um `Usuario` com `role = ADMIN`, `cargo`, `privilegios` e `id_estacionamento` | Usa as acoes administrativas do `UsuarioService` |
| `Cliente` | Nao existe como tabela separada. E um `Usuario` com `role = CLIENT` | Reserva vaga, cancela reserva, consulta historico e realiza pagamento |
| `Visitante` | Nao existe como tabela separada. E um `Usuario` com `role = VISITOR` | Consulta estacionamentos, vagas e tarifas, mas nao realiza reserva nem pagamento |
| `PlanoTarifacao` | `id`, `descricao`, `data_vigencia`, `taxa_base`, `taxa_hora`, `taxa_diaria`, `reservas` | `calcularTarifa()`, `calcularTarifaDetalhada()`, `calcularDuracaoHoras()` |
| `Reserva` | `id`, `data_reserva`, `data_fim`, `valor`, `status`, `id_usuario`, `id_vaga`, `id_plano`, `usuario`, `vaga`, `plano`, `notificacoes` | `createReserva()`, `updateReserva()`, `cancelarReserva()`, `monitorarTempo()`, `monitorarReservas()`, calculo automatico de valor |
| `Pagamento` | `id`, `id_reserva`, `metodo_pagamento`, `valor_pago`, `data_hora`, `reserva` | `registrarPagamento()`, `validarPagamento()`, CRUD de pagamentos |
| `Notificacao` | `id`, `tipo`, `titulo`, `mensagem`, `lida`, `data_hora`, `chave`, `id_usuario`, `id_reserva`, `usuario`, `reserva` | `notificarCadastro()`, `notificarReservaCriada()`, `notificarPagamentoConfirmado()`, `notificarReservaExpirando()`, `marcarComoLida()` |
| `Operacao` | `id`, `tipo`, `descricao`, `data_hora`, `entidade`, `id_entidade`, `dados`, `resultado`, `id_usuario`, `usuario` | Auditoria automatica de login, reservas, cancelamentos, pagamentos, vagas, monitoramento e relatorios |

## Melhorias implementadas

- `Cliente` e `Administrador` foram consolidados em `Usuario.role`.
- `id` e o identificador unico oficial; campos conceituais chamados `codigo` equivalem ao `id`.
- `Estacionamento` ganhou `latitude`, `longitude`, `categoria` e `imagemUrl`.
- O backend pode geocodificar `localizacao` para preencher coordenadas.
- `GET /estacionamentos/proximos` calcula distancia por latitude/longitude.
- `Reserva` ganhou `status`: `ATIVA`, `CANCELADA`, `FINALIZADA`, `EXPIRADA`.
- `ReservaService` calcula `valor` automaticamente quando recebe `id_plano`, `id_vaga`, `data_reserva` e `data_fim`.
- `PlanoTarifacaoService` calcula tarifa por duracao real, cobra diaria acima de 24h e aplica desconto para moto.
- `PagamentoService` registra pagamentos e dispara auditoria/notificacao.
- `Operacao` virou trilha de auditoria real do sistema.
- `Notificacao` foi adicionada para mensagens de cadastro, reserva, pagamento, cancelamento e expiracao.
- `monitorarTempo()` foi implementado para reservas; reservas expiradas podem ser marcadas como `EXPIRADA` e ter a vaga liberada.
- Rotas sensiveis foram protegidas com JWT e `role` (`ADMIN` ou `CLIENT`).
- Clientes autenticados so podem acessar seus proprios usuarios, reservas, pagamentos e notificacoes; administradores possuem acesso de gestao.
- Controllers usam DTOs com `class-validator` e `ValidationPipe` global para validar payloads, converter tipos e bloquear campos desconhecidos.

## Principais endpoints da API

Autenticacao:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `POST` | `/auth/login` | Realiza login e retorna token JWT |

Rotas protegidas usam Bearer token:

```http
Authorization: Bearer seu_token_jwt
```

Rotas de escrita administrativa exigem `role = ADMIN`. Rotas de reserva/pagamento/notificacao do cliente exigem `role = CLIENT` e validam o dono do recurso quando aplicavel. `VISITOR` pode consultar dados publicos do app, como estacionamentos, vagas disponiveis, planos e calculo de tarifa.

Usuarios:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `POST` | `/usuarios` | Cria usuario `CLIENT`, `ADMIN` ou `VISITOR` |
| `GET` | `/usuarios` | Lista usuarios |
| `GET` | `/usuarios/:id` | Busca usuario por ID |
| `PUT` | `/usuarios/:id` | Atualiza usuario |
| `DELETE` | `/usuarios/:id` | Remove usuario |
| `POST` | `/usuarios/:id/reservar-vaga` | Reserva vaga para usuario `CLIENT` |
| `POST` | `/usuarios/:id/cancelar-reserva` | Cancela reserva de usuario `CLIENT` |
| `GET` | `/usuarios/:id/reservas` | Lista historico de reservas do usuario |
| `POST` | `/usuarios/:id/adicionar-vaga` | Adiciona vaga como usuario `ADMIN` |
| `DELETE` | `/usuarios/:id/remover-vaga/:vagaId` | Remove vaga como usuario `ADMIN` |
| `GET` | `/usuarios/:id/monitorar-ocupacao` | Monitora ocupacao como usuario `ADMIN` |
| `GET` | `/usuarios/:id/relatorio` | Gera relatorio como usuario `ADMIN` |

Estacionamentos:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `POST` | `/estacionamentos` | Cria estacionamento |
| `GET` | `/estacionamentos` | Lista estacionamentos |
| `GET` | `/estacionamentos/proximos?lat=-23.55&lng=-46.63` | Lista estacionamentos ordenados por distancia |
| `GET` | `/estacionamentos/:id` | Busca estacionamento por ID |
| `PUT` | `/estacionamentos/:id` | Atualiza estacionamento |
| `DELETE` | `/estacionamentos/:id` | Remove estacionamento |
| `GET` | `/estacionamentos/:id/monitorar` | Monitora vagas |
| `GET` | `/estacionamentos/:id/relatorio` | Gera relatorio |

Vagas:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `GET` | `/vagas` | Lista vagas, opcionalmente por estacionamento |
| `GET` | `/vagas/:id` | Busca vaga por ID |
| `POST` | `/vagas` | Cria vaga |
| `PATCH` | `/vagas/:id` | Atualiza vaga |
| `DELETE` | `/vagas/:id` | Remove vaga |
| `POST` | `/vagas/:id/reservar` | Reserva vaga |
| `POST` | `/vagas/:id/liberar` | Libera vaga |

Reservas:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `POST` | `/reservas` | Cria reserva |
| `GET` | `/reservas` | Lista reservas |
| `GET` | `/reservas/monitoramento` | Monitora tempo restante das reservas |
| `GET` | `/reservas/monitoramento?id_estacionamento=1` | Monitora reservas de um estacionamento |
| `GET` | `/reservas/:id/monitorar-tempo` | Monitora tempo restante de uma reserva |
| `GET` | `/reservas/:id` | Busca reserva por ID |
| `PUT` | `/reservas/:id` | Atualiza reserva |
| `DELETE` | `/reservas/:id` | Remove reserva |

Planos de tarifacao:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `GET` | `/planos-tarifacao` | Lista planos |
| `GET` | `/planos-tarifacao/:id` | Busca plano por ID |
| `POST` | `/planos-tarifacao` | Cria plano |
| `PATCH` | `/planos-tarifacao/:id` | Atualiza plano |
| `DELETE` | `/planos-tarifacao/:id` | Remove plano |
| `POST` | `/planos-tarifacao/:id/calcular-tarifa` | Calcula tarifa detalhada por `tipoVaga` e `duracaoHoras` |

Pagamentos:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `POST` | `/pagamentos` | Cria pagamento, operacao de auditoria e notificacao |
| `GET` | `/pagamentos` | Lista pagamentos |
| `GET` | `/pagamentos/:id` | Busca pagamento por ID |
| `PUT` | `/pagamentos/:id` | Atualiza pagamento |
| `DELETE` | `/pagamentos/:id` | Remove pagamento |

Notificacoes:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `POST` | `/notificacoes` | Cria notificacao manual |
| `GET` | `/notificacoes` | Lista notificacoes, com filtros opcionais por `id_usuario`, `tipo` e `lida` |
| `GET` | `/notificacoes/usuario/:id` | Lista notificacoes de um usuario |
| `PATCH` | `/notificacoes/:id/lida` | Marca notificacao como lida |
| `PATCH` | `/notificacoes/usuario/:id/lidas` | Marca todas as notificacoes do usuario como lidas |
| `DELETE` | `/notificacoes/:id` | Remove notificacao |

Operacoes:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `POST` | `/operacoes` | Cria operacao manual de auditoria |
| `GET` | `/operacoes` | Lista operacoes, com filtros opcionais por `id_usuario`, `tipo`, `entidade` e `id_entidade` |
| `GET` | `/operacoes/:id` | Busca operacao por ID |
| `PUT` | `/operacoes/:id` | Atualiza operacao |
| `DELETE` | `/operacoes/:id` | Remove operacao |

## Banco de dados

O backend usa PostgreSQL com Sequelize. A conexao principal fica em `backend/src/app.module.ts`. O arquivo `backend/config/config.js` existe para compatibilidade com Sequelize CLI/migrations.

Arquivos relacionados:

- `backend/parkq.sql`
- `backend/migrations/`
- `backend/config/config.js`

Em desenvolvimento, `synchronize` fica ativo quando `NODE_ENV` nao e `production`, entao o Sequelize pode criar/ajustar tabelas automaticamente. O arquivo `parkq.sql` serve como referencia/manual do schema.

## Scripts uteis

Raiz:

```bash
npm start
```

Backend:

```bash
npm run db:create
npm run start
npm run start:dev
npm run build
npm run lint
npm run test
npm run test:e2e
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Observacoes

- Swagger fica em `http://localhost:3000/api/docs`.
- O backend cria o banco `parkq` via `npm run db:create` antes de iniciar nos scripts `start` e `start:dev`.
- Payloads invalidos retornam erro `400` por causa do `ValidationPipe` global.
- Algumas telas do frontend esperam `token`, `userId` e `id_estacionamento` no `localStorage`.
- Os arquivos em `frontend/src/services/` existem, mas parte da integracao HTTP ainda esta dentro dos componentes.
- Em producao, prefira migrations em vez de `synchronize`.
