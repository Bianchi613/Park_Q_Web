# Segurança e configuração de produção do Park Q Web

**Atualizado em 2026-11-03.** Documento relacionado ao [PR #1](https://github.com/Bianchi613/Park_Q_Web/pull/1), mesclado à `main`. Mudanças verificadas por inspeção do código; **não houve execução de build/testes** neste atendimento.

## Correção aplicada: CORS

Em `backend/src/main.ts`, a chamada `app.enableCors()` sem restrições foi substituída por uma allowlist de origens. O backend lê a variável `CORS_ORIGINS`, separada por vírgulas. Quando `NODE_ENV=production`, a aplicação exige ao menos uma origem configurada e interrompe a inicialização se a lista estiver vazia. Para desenvolvimento, o padrão é `http://localhost:5173` e `http://127.0.0.1:5173`. A opção `credentials` está desativada.

Exemplo **ilustrativo** do ambiente de produção:

```dotenv
NODE_ENV=production
CORS_ORIGINS=https://painel.exemplo.com,https://app.exemplo.com
JWT_SECRET=<segredo_aleatorio_seguro>
SEQUELIZE_SYNCHRONIZE=false
```

Substitua os domínios por endereços verdadeiros. A origem deve ter protocolo, host e porta (quando não padrão), mas **não deve conter caminho ou barra final**. Use somente origens controladas por você, nunca `*` em produção. `backend/.env.example` mostra a variável.

## Como testar

No diretório `backend`:

```bash
npm install
npm run build
npm run test
```

No diretório `frontend`:

```bash
npm install
npm run build
```

Teste com as versões realmente implantadas:

1. Em ambiente de produção sem `CORS_ORIGINS`, a inicialização deve falhar com mensagem de configuração.
2. Um navegador servido por origem autorizada deve acessar normalmente o backend.
3. A resposta a preflight com `Origin` não autorizado não deve conceder essa origem no cabeçalho `Access-Control-Allow-Origin`.
4. Login JWT, reservas, pagamentos registrados e notificações devem continuar funcionando após o ajuste.
5. Confirme que a URL do painel, incluindo esquema HTTPS e eventual porta, coincide exatamente com a allowlist.

**Observação:** a política CORS é aplicada pelo navegador. Não autentica usuários, não substitui autorização nas rotas e não impede chamadas diretas por `curl` ou clientes HTTP. Autenticação e escopo de acesso dos usuários continuam obrigatórios.

## Itens não resolvidos por este PR

- `node_modules` e dependências instaladas aparecem entre os arquivos versionados; planeje higienização do repositório sem apagar código ou locks necessários.
- A implementação examinada **registra** pagamentos em banco; não foi comprovada conciliação com uma processadora real de pagamentos.
- Confirme autorização por estacionamento/locatário e proteção de dados de clientes em todos os endpoints.
- Revise exposição do Swagger em produção, limites de requisição e monitoramento.
- Mantenha `SEQUELIZE_SYNCHRONIZE=false` em produção e aplique migrations controladas.

## Histórico

[PR #1: restringir CORS por origens configuradas](https://github.com/Bianchi613/Park_Q_Web/pull/1). Se a interface deixar de acessar a API após o update, **corrija primeiro `CORS_ORIGINS`**, em vez de voltar ao CORS irrestrito.