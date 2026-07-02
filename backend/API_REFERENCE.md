# 🚀 CityMotion Backend - Referência da API

**Stack:** Fastify • Drizzle ORM • Zod • PostgreSQL/SQLite • Swagger • Pino • Vitest

---

## 🛠️ Especificações Técnicas

- **Runtime:** Node.js 20+
- **Framework:** Fastify 5.x
- **Linguagem:** TypeScript
- **ORM:** Drizzle ORM (PostgreSQL em produção / SQLite em desenvolvimento)
- **Validação:** Zod (schemas de entrada/saída)
- **Autenticação:** JWT (Token 8h) + Bcrypt
- **Logs:** Pino (integrado ao Fastify)
- **Documentação:** Swagger/OpenAPI (`/docs`)
- **Testes:** Vitest
- **Rate Limiting:** 100 req/15min global | 10 tentativas/15min login
- **CORS:** Configurável via `.env`
- **Porta Padrão:** 3001

---

## 📖 Documentação Interativa (Swagger)

Com o servidor rodando, acesse:

```
http://localhost:3001/docs
```

Interface Swagger UI com todos os endpoints documentados e testáveis.

---

## 🔐 Autenticação

### POST /api/login
- **Rate Limit:** 10 tentativas/15min
- **Payload:** `{ "email": "...", "password": "..." }`
- **Suporta:** e-mail, matrícula ou telefone
- **Retorno:** `{ token, user }`

### POST /api/forgot-password
- **Payload:** `{ "email": "..." }`

### POST /api/reset-password
- **Payload:** `{ "token": "...", "password": "..." }`

---

## 📊 Endpoints de Dados (Protegidos)

Header obrigatório: `Authorization: Bearer <token>`

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| GET | `/api/data` | Sincronização global do ecossistema |
| GET | `/api/employees` | Listar funcionários |
| POST | `/api/employees` | Criar funcionário |
| PUT | `/api/employees/:id` | Atualizar funcionário |
| DELETE | `/api/employees/:id` | Soft/Hard delete |
| GET | `/api/vehicles` | Listar veículos |
| POST | `/api/vehicles` | Criar veículo |
| GET | `/api/refuelings` | Listar abastecimentos |
| POST | `/api/refuelings` | Registrar abastecimento |
| GET | `/api/messages` | Listar mensagens do usuário |
| POST | `/api/messages` | Enviar mensagem |
| POST | `/api/requests` | Solicitar veículo (emite WebSocket) |
| GET | `/api/analytics/telemetry` | Dados de telemetria |

---

## 🖥️ Endpoints de Sistema (DEV/TI)

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| GET | `/api/system/db-info` | Contagem de registros por tabela |
| GET | `/api/system/audit-logs` | Últimos 100 logs de auditoria |
| POST | `/api/maintenance/reset` | Reset completo (requer ROOT) |
| GET | `/api/health` | Health check |

---

## 🏗️ Endpoints de Infraestrutura (DEV/TI)

| Método | Rota | Descrição |
| :--- | :--- | :--- |
| GET | `/api/infrastructure/config` | Config `.env` (senhas mascaradas) |
| POST | `/api/infrastructure/test-db` | Testar conexão com banco |
| POST | `/api/infrastructure/save` | Salvar config no `.env` |
| POST | `/api/infrastructure/test-smtp` | Testar conexão SMTP |
| GET | `/api/infrastructure/nexus-config` | Config NexusBridge |
| POST | `/api/infrastructure/nexus-config` | Atualizar NexusBridge |

---

## 🐳 Docker

```bash
# Construir e iniciar (frontend + backend)
docker compose up -d

# Apenas PostgreSQL para desenvolvimento
docker compose up -d postgres

# Build personalizado
docker build -t citymotion .
docker run -p 9002:9002 -p 3001:3001 --env-file .env citymotion
```

---

## ☁️ Render (Deploy)

O arquivo `render.yaml` na raiz do projeto define o blueprint:

1. Cria um banco PostgreSQL automaticamente
2. Faz deploy do backend como Web Service
3. Injeta `DATABASE_URL`, `PORT` e `JWT_SECRET` automaticamente

```bash
# Push para o GitHub e conecte no Render Dashboard
# Render detectará o render.yaml e configurará tudo
```

---

## 🛡️ Códigos de Resposta

| Código | Significado |
| :--- | :--- |
| `200 OK` | Sucesso |
| `400 Bad Request` | Dados inválidos (Zod validation) |
| `401 Unauthorized` | Token ausente |
| `403 Forbidden` | Sem permissão |
| `404 Not Found` | Recurso não encontrado |
| `429 Too Many Requests` | Rate limit excedido |
| `500 Internal Server Error` | Erro interno |
