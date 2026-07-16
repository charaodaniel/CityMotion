# 🏗️ Guia de Implementação do Backend — Fastify + Drizzle + Socket.IO

Este guia detalha a arquitetura, segurança e manutenção do backend CityMotion.

---

## 📁 Estrutura de Diretórios

```
backend/
├── src/                        # Código-fonte JavaScript (ESM)
│   ├── index.js                # Ponto de entrada (carrega .env, inicia server)
│   ├── app.js                  # Factory do Fastify + plugins + rotas
│   ├── config/
│   │   └── env.js              # Validação Zod das variáveis de ambiente
│   ├── db/
│   │   ├── index.js            # Conexão multi-engine (SQLite / PostgreSQL)
│   │   ├── pg-schema.js        # Schema Drizzle para PostgreSQL
│   │   ├── sqlite-schema.js    # Schema Drizzle para SQLite
│   │   └── seed.js             # Popula banco com dados iniciais
│   ├── plugins/
│   │   ├── auth-supabase.js    # Plugin de autenticação (dual: Supabase + JWT fallback)
│   │   └── websocket.js        # Socket.IO server
│   ├── routes/
│   │   ├── auth.js             # Login, forgot/reset password
│   │   ├── data.js             # Employees, vehicles, trips, messages, refuelings, etc.
│   │   ├── infrastructure.js   # Config, DB test, SMTP test
│   │   └── report-templates.js # Templates de relatório personalizados
│   ├── schemas/
│   │   └── index.js            # Schemas Zod compartilhados
│   ├── supabase/
│   │   ├── client.js           # Clientes Supabase (admin, user, RLS)
│   │   └── rls-helper.js       # withRlsFallback() para rotas com RLS
│   ├── utils/
│   │   ├── role.js             # hasRole() e hasInfraAccess() centralizados
│   │   ├── employee.js         # stripPassword() para remover senha de objetos
│   │   └── sector.js           # sanitizeSector() para parse de JSON de setores
│   └── tests/
│       ├── setup.js            # Setup de testes vitest
│       ├── auth.test.js        # Testes de autenticação
│       └── sector.test.js      # Testes do helper sanitizeSector
├── scripts/
│   ├── migrate.js              # Migrações cirúrgicas (ex: ADD COLUMN supabase_user_id)
│   └── init-db.cjs             # Script legado de inicialização SQLite
├── drizzle/
│   └── migrations/             # Migrações Drizzle geradas
├── drizzle.config.js           # Configuração Drizzle Kit
├── vitest.config.js            # Configuração de testes
└── package.json
```

---

## 1. 🔐 Segurança

### 1.1 Autenticação Dual (Supabase + JWT fallback)

O Fastify utiliza `auth-supabase.js` com modo dual:
- **Supabase Auth:** Quando `SUPABASE_URL` está configurado, usa `@supabase/server` para verificar tokens
- **JWT manual:** Fallback com `jsonwebtoken` quando Supabase não está disponível

```javascript
// plugins/auth-supabase.js
import fp from "fastify-plugin";
import { verifyAuth } from "@supabase/server/core";
import jwt from "jsonwebtoken";

async function supabaseAuthPlugin(fastify) {
  const useSupabase = isSupabaseEnabled();

  fastify.decorate("authenticate", async (request, reply) => {
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return reply.status(401).send({ message: "Token não fornecido." });

    try {
      if (useSupabase) {
        // Verifica token no Supabase
        const { data: authData } = await verifyAuth(webRequest, { auth: "user" });
        // Busca employee pelo email
        request.user = { ... };
      } else {
        // Fallback JWT manual
        const decoded = jwt.verify(token, getEnv().JWT_SECRET);
        request.user = decoded;
      }
    } catch (err) {
      return reply.status(403).send({ message: "Token inválido." });
    }
  });
}
```

### 1.2 Senhas com Bcrypt

```typescript
import bcrypt from 'bcryptjs';

// Hash (cadastro)
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

// Verificação (login)
const isMatch = bcrypt.compareSync(providedPassword, storedHash);
```

### 1.3 RBAC (Controle de Acesso)

Cada rota verifica o perfil do usuário extraído do JWT:

```typescript
app.get('/api/admin-only', {
  preHandler: [app.authenticate],
}, async (request, reply) => {
  const user = request.user as any;
  if (user.role !== 'Desenvolvedor Global') {
    return reply.status(403).send({ message: 'Acesso negado.' });
  }
  // Lógica administrativa...
});
```

---

## 2. 🌐 Variáveis de Ambiente

Validadas com Zod em `config/env.ts`:

| Variável | Obrigatória | Padrão | Descrição |
| :--- | :---: | :--- | :--- |
| `JWT_SECRET` | ✅ | — | Chave secreta JWT (mín. 32 caracteres) |
| `PORT` | ❌ | `3001` | Porta do servidor Fastify |
| `DATABASE_URL` | ❌ | `''` | URL PostgreSQL (vazio = SQLite) |
| `CORS_ORIGIN` | ❌ | `http://localhost:3001` | Origens permitidas |
| `DEMO_MODE` | ❌ | `false` | Reset diário automático |
| `NODE_ENV` | ❌ | `development` | environment |
| `SMTP_HOST` | ❌ | `''` | Servidor SMTP |
| `SMTP_PORT` | ❌ | `587` | Porta SMTP |
| `SMTP_USER` | ❌ | `''` | Usuário SMTP |
| `SMTP_PASS` | ❌ | `''` | Senha SMTP |
| `SMTP_SECURE` | ❌ | `false` | TLS/SSL |
| `SUPABASE_URL` | ❌ | `''` | URL do projeto Supabase |
| `SUPABASE_ANON_KEY` | ❌ | `''` | Chave anônima Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | `''` | Chave de serviço Supabase (admin) |
| `SUPABASE_JWKS_URL` | ❌ | `''` | JWKS URL para verificação de tokens |

```bash
# Gerar JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 3. 🗄️ Banco de Dados — Drizzle ORM

### 3.1 Multi-Engine (SQLite / PostgreSQL)

O sistema suporta dois motores com o mesmo código graças ao Drizzle ORM:

```typescript
// db/index.ts
export function getDb() {
  if (isPostgresEnabled()) {
    const pool = new Pool({ connectionString: env.DATABASE_URL });
    return drizzle(pool, { schema: pgSchema });
  } else {
    const sqliteDb = new Database('database/citymotion.db');
    return drizzle(sqliteDb, { schema: sqliteSchema });
  }
}
```

### 3.2 Schemas

Definidos em arquivos separados por engine, com tipos correspondentes:

- **SQLite:** `db/sqlite-schema.ts` (12 tabelas: employees, vehicles, trips, etc.)
- **PostgreSQL:** `db/pg-schema.ts` (mesma estrutura, adaptada para PG)

### 3.3 Seed

```bash
cd backend && npx tsx src/db/seed.ts
```

Popula:
- 4 usuários (dev root, admin, motorista, demo)
- 3 organizações
- Setores padrão

---

## 4. 🔄 WebSocket — Notificações em Tempo Real

### 4.1 Servidor (Socket.IO)

Configurado em `plugins/websocket.ts`:

```typescript
import { Server } from 'socket.io';

export function setupWebSocket(app: FastifyInstance) {
  const io = new Server(app.server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    socket.on('join-sector', (sector) => {
      socket.join(`sector:${sector}`);
    });
  });

  return io;
}
```

### 4.2 Emissão de Eventos

O backend emite notificações quando dados são criados:

```typescript
io.to(`sector:${record.sector}`).emit('notification', {
  title: 'Novo veículo cadastrado',
  message: `${record.vehicle_model} — ${record.license_plate}`,
  type: 'vehicle',
  timestamp: new Date().toISOString(),
});

io.emit('entity-update', {
  type: 'vehicles',
  action: 'create',
  data: record,
});
```

---

## 5. 🚦 Rate Limiting

```typescript
import rateLimit from '@fastify/rate-limit';

await app.register(rateLimit, {
  global: true,
  max: 100,
  timeWindow: '15 minutes',
});

// Rota de login: 10 tentativas por IP
app.post('/api/login', {
  config: { rateLimit: { max: 10, timeWindow: '15 minutes' } },
}, loginHandler);
```

---

## 6. 🌍 CORS

```typescript
import cors from '@fastify/cors';

await app.register(cors, {
  origin: env.CORS_ORIGIN
    ? env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:3001', 'http://127.0.0.1:3001'],
  credentials: true,
});
```

---

## 7. 📚 Documentação da API (Swagger)

```typescript
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

await app.register(swagger, { openapi: { info: { title: 'CityMotion API', version: '1.0.0' } } });
await app.register(swaggerUi, { routePrefix: '/docs' });
```

Acesse `http://localhost:3001/docs` para a interface Swagger UI.

---

## 8. 🧪 Testes

O backend usa **Vitest** para testes unitários:

```bash
cd backend
npm test              # Executa uma vez
npm run test:watch    # Modo watch
```

### Testes Existentes

| Arquivo | Descrição |
| :--- | :--- |
| `src/tests/auth.test.ts` | Login, token inválido, rotas protegidas |
| `src/tests/setup.ts` | Setup global (env vars de teste) |

### Testes do Frontend SPA (189 testes)

```bash
npm run test:frontend
```

Cobrem Store, API, WebSocket, App Router, Toast e 12 páginas.

---

## 9. 🚀 Execução

### Desenvolvimento
```bash
cd backend && npm run dev
# tsx watch src/index.ts — reload automático
```

### Produção
```bash
cd backend && npx tsx src/index.ts
# Ou via Docker
```

### Health Check
```bash
curl http://localhost:3001/api/health
# { "status": "operational", "kernel": "Nexus-Dual", "uptime": 123.45 }
```

---

## 10. 📡 Rotas da API

### Autenticação
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| POST | `/api/login` | Login (email + senha) |
| POST | `/api/forgot-password` | Solicitar recuperação |
| POST | `/api/reset-password` | Resetar senha |

### Dados
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| GET | `/api/data` | Sync all (employees, vehicles, trips, etc.) |
| POST | `/api/requests` | Criar solicitação |
| GET | `/api/requests` | Listar solicitações |

### Infraestrutura
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| GET | `/api/infrastructure/config` | Config atual (senhas mascaradas) |
| POST | `/api/infrastructure/test-db` | Testar conexão DB |
| POST | `/api/infrastructure/save` | Salvar configuração |
| POST | `/api/infrastructure/test-smtp` | Testar SMTP |

### Sistema
| Método | Rota | Descrição |
| :--- | :--- | :--- |
| GET | `/api/health` | Health check |
| GET | `/docs` | Swagger UI |
| GET | `/api/sync-all` | Redirect → `/api/data` |

---

## 🛠️ Manutenção

### Reset do Banco
```bash
cd backend && npx tsx src/db/seed.ts
```

### Executar Testes
```bash
npm run test              # Backend
npm run test:frontend     # Frontend SPA
```

### Type Check
```bash
cd backend && npx tsc --noEmit
```
