# 🛠️ Ferramentas de Administração e Manutenção — CityMotion

O CityMotion oferece uma suíte de ferramentas avançadas para usuários de nível técnico (**Desenvolvedores, TI e Administradores**).

---

## 🏗️ Painel de Configurações

Acesse via **Configurações → Infraestrutura** (visível apenas para Desenvolvedor Global e Administrador).

### Aba: Operações
- **Nome da Unidade:** Identificação visual do sistema
- **Prioridade Padrão:** Prioridade atribuída a novas solicitações
- **Exigir Destino:** Toggle para obrigatoriedade de destino nas viagens
- **Tempo de Check-in:** Janela em minutos para check-in antecipado

### Aba: Infraestrutura

#### 1. Banco de Dados
- **Seletor de Motor:** SQLite (padrão) ou PostgreSQL
- **URL de Conexão:** Campo para connection string do PostgreSQL
- **Teste de Conexão:** Valida a conexão antes de salvar
- **Status:** Card informativo com motor ativo e porta

#### 2. Proxy & CORS
- **Origens Permitidas:** Textarea para lista de domínios (separados por vírgula)
- **Rate Limiting:** Card com status da proteção (global 100 req/15min, login 10 req/15min)

#### 3. SMTP (E-mail)
- **Configuração:** Host, porta, usuário, senha (com toggle de visibilidade) e TLS
- **Teste SMTP:** Verifica as credenciais no servidor
- **Uso:** Envio de e-mails de recuperação de senha e notificações

#### 4. Servidor & Segurança
- **Porta:** Porta do backend Fastify (padrão 3001)
- **Modo Demonstração:** Toggle com aviso de segurança (reset diário dos dados)
- **Status Cards:** JWT, CORS, Rate Limiting com indicadores visuais

---

## 🖥️ Terminal de Desenvolvimento (NexusOS Shell)

Acessível pelo botão `>_` no cabeçalho ou via rota `/dev-terminal`. Implementado em `public/js/dev-terminal.js`.

### Comandos

| Comando | Nível | Descrição |
| :--- | :--- | :--- |
| `help` | Público | Lista todos os comandos disponíveis |
| `clear` | Público | Limpa o terminal |
| `info` | Público | Exibe dados do kernel, versão, operador |
| `health` | Público | Diagnóstico de integridade do sistema |
| `db-stats` | Público | Contagem de registros por tabela |
| `users` | Público | Lista usuários ativos |
| `log` | TI/Admin | Últimas entradas de auditoria |
| `db-reset` | **ROOT** | ⚠️ Apaga e recria o banco de dados |

### Comando Crítico: `db-reset`

O comando `db-reset` exige:
1. Confirmação explícita (`y/n`)
2. Senha do usuário logado (validação via bcrypt no backend)
3. Executa `DELETE` em todas as tabelas + re-seed

---

## 🔔 Notificações em Tempo Real

O sistema utiliza **Socket.IO** para notificações instantâneas:

- **Evento `notification`:** Nova solicitação, atualização de status, mensagem recebida
- **Evento `entity-update`:** Atualiza dados na página sem refresh (create, update, delete)
- **Sino de Notificações:** Badge com contagem de não lidas + dropdown com lista
- **Toast Notifications:** Feedback visual não-intrusivo para ações do usuário

---

## 🗄️ Gerenciamento do Banco de Dados

### SQLite (Padrão)
- Arquivo: `database/citymotion.db`
- Inicialização: `cd backend && npx tsx src/db/seed.ts`
- Portátil: ideal para totens, instalações locais e desenvolvimento

### PostgreSQL (Nuvem)
- Ativado via variável `DATABASE_URL`
- Suporte a conexões SSL (Render, Supabase, Neon)
- Backup automático (Render Blueprint)
- Migrations: `cd backend && npm run db:migrate`

### Drizzle ORM
- Type-safe: schemas definidos em TypeScript com inferência automática
- CLI: `drizzle-kit generate` (gera SQL de migrações)
- CLI: `drizzle-kit migrate` (aplica migrações)
- Studio: `drizzle-kit studio` (interface gráfica para o banco)

---

## 🧪 Testes e Qualidade

O projeto possui **189+ testes unitários** que podem ser executados:

```bash
# Testes do backend (vitest)
cd backend && npm test

# Testes do frontend SPA
npm run test:frontend

# Modo watch
npm run test:frontend:watch
```

### Cobertura de Testes

| Módulo | Arquivos | Testes |
| :--- | :---: | :---: |
| Store (estado global) | 1 | 15 |
| API Client | 1 | 17 |
| WebSocket Client | 1 | 16 |
| App Router | 1 | 11 |
| Toast Notifications | 1 | 39 |
| Páginas SPA (12) | 12 | 83 |
| Auth (backend) | 1 | 8+ |
| **Total** | **18** | **189+** |

---

## 🔒 Resumo de Segurança

| Recurso | Descrição |
| :--- | :--- |
| **JWT** | Tokens com expiração de 8 horas, assinados com @fastify/jwt |
| **Bcrypt** | Hashing de senhas com salt 10 |
| **Rate Limiting** | 100 req/15min (global), 10 tentativas/15min (login) |
| **CORS** | Origens permitidas configuráveis via `.env` |
| **SQL Injection** | Prevenção via Drizzle ORM (queries parametrizadas) |
| **Zod Validation** | Schemas de validação em todas as rotas e env vars |
| **RBAC** | Controle de acesso baseado em cargo (6 perfis) |
| **WebSocket** | Canal segregado por setor (`join-sector`) |
