# Park Q Web

Park Q Web e uma aplicacao para gerenciamento e reserva de vagas de estacionamento. O projeto possui um frontend em React/Vite e um backend em NestJS, usando PostgreSQL como banco de dados.

## Sumario

- [Sobre o projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Pre-requisitos](#pre-requisitos)
- [Configuracao](#configuracao)
- [Como executar](#como-executar)
- [Funcionalidades](#funcionalidades)
- [Modelo de dominio](#modelo-de-dominio)
- [Rotas do frontend](#rotas-do-frontend)
- [Principais endpoints da API](#principais-endpoints-da-api)
- [Banco de dados](#banco-de-dados)
- [Scripts uteis](#scripts-uteis)
- [Observacoes](#observacoes)

## Sobre o projeto

O Park Q permite que usuarios com perfil de cliente encontrem estacionamentos, escolham uma vaga, selecionem um plano de tarifacao e realizem uma reserva com pagamento. Usuarios com perfil de administrador podem acompanhar vagas, visualizar relatorios e gerenciar estacionamentos e planos.

Fluxo principal:

1. O usuario cria uma conta ou faz login.
2. Usuarios com `role = CLIENT` acessam uma lista de estacionamentos disponiveis.
3. O cliente escolhe um estacionamento, seleciona uma vaga e um plano de tarifacao.
4. A reserva e criada, o pagamento e registrado e a vaga e marcada como reservada.
5. Usuarios com `role = ADMIN` acompanham vagas, informacoes do estacionamento e relatorios.

## Tecnologias

Frontend:

- React
- Vite
- React Router
- Axios
- React Leaflet
- React Slick
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

Ferramentas gerais:

- Node.js
- npm ou Yarn
- Concurrently

## Estrutura de pastas

```text
park-q-web/
  backend/              API NestJS
    src/
      auth/
      estacionamento/
      operacao/
      pagamento/
      plano-tarifacao/
      reserva/
      usuario/
      vaga/
    config/
    migrations/
    parkq.sql

  frontend/             Aplicacao React/Vite
    src/
      components/
      services/
      assets/

  package.json          Scripts da raiz
```

## Pre-requisitos

Antes de executar o projeto, instale:

- Node.js
- npm ou Yarn
- PostgreSQL

Tambem e necessario ter um banco PostgreSQL criado para a aplicacao.

## Configuracao

Crie um arquivo `.env` dentro da pasta `backend/` com as variaveis abaixo:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=12345
DATABASE_NAME=parkq
NODE_ENV=development
JWT_SECRET=sua_chave_secreta
GEOCODING_PROVIDER=nominatim
GEOCODING_USER_AGENT=park-q-web/1.0
GEOCODING_TIMEOUT_MS=5000
```

Os valores acima seguem os padroes usados no codigo, mas podem ser alterados conforme o ambiente local.
Com `GEOCODING_PROVIDER=nominatim`, ao cadastrar/editar um estacionamento com `localizacao` e sem coordenadas, o backend tenta preencher `latitude` e `longitude` automaticamente. Se quiser informar as coordenadas manualmente ou desligar a busca externa, use `GEOCODING_PROVIDER=disabled`.

## Como executar

Instale as dependencias na raiz:

```bash
npm install
```

Instale tambem as dependencias do frontend e do backend, se necessario:

```bash
cd frontend
npm install
```

```bash
cd backend
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

Usuario CLIENT:

- Cadastro de usuario
- Login
- Busca/listagem de estacionamentos
- Visualizacao de vagas por estacionamento
- Selecao de plano de tarifacao
- Reserva de vaga
- Registro de pagamento
- Edicao de perfil

Usuario ADMIN:

- Dashboard administrativo
- Visualizacao de vagas do estacionamento
- Relatorio de ocupacao e faturamento
- Cadastro e edicao de estacionamentos
- Cadastro e edicao de vagas
- Cadastro e edicao de planos de tarifacao

## Modelo de dominio

O backend usa `id` como identificador unico das entidades. Na documentacao conceitual, qualquer campo chamado `codigo` pode ser entendido como o proprio `id` gerado pelo Sequelize.

| Entidade | Principais atributos | Regras/metodos no backend |
| --- | --- | --- |
| `Usuario` | `CPF`, `nome`, `email`, `telefone`, `login`, `senha`, `role`, `preferencias`, `cargo`, `privilegios`, `id_estacionamento` | Usuarios com `role = CLIENT` reservam/cancelam vagas e consultam historico. Usuarios com `role = ADMIN` gerenciam vagas e relatorios. |
| `Estacionamento` | `nome`, `localizacao`, `latitude`, `longitude`, `capacidade`, `vagas_disponiveis`, `categoria`, `imagemUrl` | `EstacionamentoService` monitora vagas, gera relatorios, preenche coordenadas por geocoding quando possivel e calcula distancia por latitude/longitude. |
| `Vaga` | `numero`, `status`, `tipo`, `reservada`, `id_estacionamento`, `id_reserva` | `VagaService` reserva e libera vagas. |
| `PlanoTarifacao` | `descricao`, `data_vigencia`, `taxa_base`, `taxa_hora`, `taxa_diaria` | `PlanoTarifacaoService` calcula tarifas. |
| `Reserva` | `data_reserva`, `data_fim`, `valor`, `status`, `id_usuario`, `id_vaga`, `id_plano` | `ReservaService` cria, atualiza, cancela e consulta reservas. Status: `ATIVA`, `CANCELADA`, `FINALIZADA`, `EXPIRADA`. |
| `Pagamento` | `metodo_pagamento`, `valor_pago`, `data_hora`, `id_reserva` | `PagamentoService` registra e valida pagamentos. Metodos: `PIX`, `cartao_credito`, `boleto`. |
| `Operacao` | `descricao`, `data_hora`, `id_usuario` | `OperacaoService` registra operacoes do sistema. |

Os metodos de negocio ficam nos services do NestJS, nao nos models Sequelize. Os models representam a estrutura dos dados e os relacionamentos.

## Rotas do frontend

| Rota | Descricao |
| --- | --- |
| `/` | Pagina inicial |
| `/register` | Cadastro de usuario |
| `/login` | Login |
| `/forgot-password` | Recuperacao de senha |
| `/client-dashboard` | Dashboard do cliente |
| `/admin-dashboard` | Dashboard do administrador |
| `/perfil/:id` | Configuracoes de perfil |
| `/reservation/:id` | Reserva de vaga por estacionamento |
| `/payment` | Pagamento |
| `/estacionamento` | Gerenciamento de estacionamentos |
| `/tariff-plan` | Gerenciamento de planos de tarifacao |

## Principais endpoints da API

Autenticacao:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `POST` | `/auth/login` | Realiza login e retorna token JWT |

Usuarios:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `POST` | `/usuarios` | Cria usuario CLIENT, ADMIN ou VISITOR |
| `GET` | `/usuarios` | Lista usuarios |
| `GET` | `/usuarios/:id` | Busca usuario por ID |
| `PUT` | `/usuarios/:id` | Atualiza usuario |
| `DELETE` | `/usuarios/:id` | Remove usuario |
| `POST` | `/usuarios/:id/reservar-vaga` | Reserva vaga para usuario CLIENT |
| `POST` | `/usuarios/:id/cancelar-reserva` | Cancela reserva de usuario CLIENT |
| `GET` | `/usuarios/:id/reservas` | Lista historico de reservas do usuario CLIENT |
| `POST` | `/usuarios/:id/adicionar-vaga` | Adiciona vaga como usuario ADMIN |
| `DELETE` | `/usuarios/:id/remover-vaga/:vagaId` | Remove vaga como usuario ADMIN |
| `GET` | `/usuarios/:id/monitorar-ocupacao` | Monitora ocupacao como usuario ADMIN |
| `GET` | `/usuarios/:id/relatorio` | Gera relatorio como usuario ADMIN |

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
| `GET` | `/vagas` | Lista vagas |
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
| `GET` | `/reservas/:id` | Busca reserva por ID |
| `PUT` | `/reservas/:id` | Atualiza reserva |
| `DELETE` | `/reservas/:id` | Remove reserva |

Pagamentos:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `POST` | `/pagamentos` | Cria pagamento |
| `GET` | `/pagamentos` | Lista pagamentos |
| `GET` | `/pagamentos/:id` | Busca pagamento por ID |
| `PUT` | `/pagamentos/:id` | Atualiza pagamento |
| `DELETE` | `/pagamentos/:id` | Remove pagamento |

Planos de tarifacao:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `GET` | `/planos-tarifacao` | Lista planos |
| `GET` | `/planos-tarifacao/:id` | Busca plano por ID |
| `POST` | `/planos-tarifacao` | Cria plano |
| `PATCH` | `/planos-tarifacao/:id` | Atualiza plano |
| `DELETE` | `/planos-tarifacao/:id` | Remove plano |
| `POST` | `/planos-tarifacao/:id/calcular-tarifa` | Calcula tarifa |

## Banco de dados

O backend usa PostgreSQL com Sequelize. A conexao e configurada em `backend/src/app.module.ts` e tambem possui configuracao em `backend/config/config.js`.

Arquivos relacionados:

- `backend/parkq.sql`
- `backend/migrations/`
- `backend/config/config.js`

Em ambiente de desenvolvimento, o Sequelize esta configurado com `synchronize` ativo quando `NODE_ENV` nao e `production`.

## Scripts uteis

Raiz:

```bash
npm start
```

Backend:

```bash
npm run start
npm run start:dev
npm run build
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

- As chamadas HTTP do frontend atualmente estao principalmente dentro dos componentes.
- Os arquivos em `frontend/src/services/` existem, mas ainda nao concentram a integracao com a API.
- O backend expoe documentacao Swagger em `/api/docs`.
- Algumas telas esperam dados especificos no `localStorage`, como `token`, `userId` e `id_estacionamento`.
- Caso o dashboard do administrador nao encontre `id_estacionamento`, verifique se o login esta retornando e salvando esse valor corretamente.
- A rota `/success` e usada apos pagamento, mas precisa existir no roteamento do frontend para funcionar corretamente.
