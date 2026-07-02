# 🚀 CityMotion Backend - Referência da API Completa

Este documento detalha os endpoints disponíveis no servidor Express do CityMotion, protegidos por JWT e conectados ao banco de dados.

---

## 🛠️ Especificações Técnicas

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Segurança:** JWT (Token de 8h) + Bcrypt + Rate Limiting + CORS Configurável
- **Banco de Dados:** SQLite3 (local) ou PostgreSQL/MongoDB/Supabase (nuvem)
- **Porta Padrão:** 3001
- **Variáveis de Ambiente:** Configuradas via arquivo `.env` (ver `.env.example`)

---

## 🔒 Segurança

### Rate Limiting
| Endpoint | Limite | Janela |
| :--- | :--- | :--- |
| Global (`/api/*`) | 100 requisições | 15 minutos |
| Login (`/api/login`) | 10 tentativas | 15 minutos |

### CORS
Origens permitidas configuradas via variável `CORS_ORIGIN` no `.env`. Padrão: `http://localhost:9002`.

---

## 🔐 Autenticação

### Login
- **Endpoint:** `POST /api/login`
- **Rate Limit:** 10 tentativas/15min
- **Payload:** `{ "email": "...", "password": "..." }`
- **Nota:** Suporta e-mail, matrícula ou telefone.
- **Retorno:** Token JWT (expira em 8h) e objeto do usuário (sem senha).

### Resposta de Erro
```json
{ "message": "Muitas tentativas de login. Tente novamente mais tarde." }
```

---

## 📊 Endpoints de Dados (Protegidos)

Todos os endpoints abaixo exigem o header `Authorization: Bearer <token>`.

### Sincronização Global
- **GET /api/data:** Retorna o ecossistema completo (viagens, veículos, funcionários, setores, etc).

### Funcionários (Employees)
- **GET /api/employees:** Lista todos os colaboradores.
- **POST /api/employees:** Cria novo registro (Hash Bcrypt automático).
- **PUT /api/employees/:id:** Atualiza dados.
- **DELETE /api/employees/:id:** Soft-Delete (marca como desativado) ou Hard-Delete (se ROOT).

### Veículos e Frota
- **GET /api/vehicles:** Lista toda a frota e status de telemetria.

### Mensagens (Chat)
- **GET /api/messages:** Lista mensagens do usuário logado.
- **POST /api/messages:** Envia nova mensagem.

### Abastecimentos
- **GET /api/refuelings:** Lista registros de abastecimento.
- **POST /api/refuelings:** Registra novo abastecimento.

### Solicitações de Veículo
- **POST /api/requests:** Cria nova solicitação (emite evento WebSocket).

### Analytics
- **GET /api/analytics/telemetry:** Dados de telemetria para gráficos.

---

## 🖥️ Endpoints de Sistema (Acesso Restrito: DEV/TI)

### Monitor de Recursos
- **GET /api/system/resources:** Uso de CPU, RAM, Uptime e versão do Node.

### Auditoria e Logs
- **GET /api/system/audit-logs:** Últimas 100 alterações no banco de dados.

### Informações do Banco
- **GET /api/system/db-info:** Contagem de registros por tabela.

### Integridade
- **GET /api/system/db-integrity:** Verificação PRAGMA do SQLite.

### Manutenção e Reset
- **POST /api/maintenance/reset:** Reset completo do banco. **Requer ROOT + confirmação de senha.**

---

## 🏗️ Endpoints de Infraestrutura (Acesso Restrito: DEV/TI)

### Configuração Atual
- **GET /api/infrastructure/config:** Retorna configuração do `.env` (senhas mascaradas).

### Teste de Conexão DB
- **POST /api/infrastructure/test-db:** Testa conexão com banco de dados.
  - **Payload:** `{ "type": "sqlite|postgresql|mongodb|supabase", "url": "..." }`
  - **Retorno:** `{ "success": true, "message": "...", "details": {...} }`

### Salvar Configuração
- **POST /api/infrastructure/save:** Salva configurações no `.env`.
  - **Payload:** `{ "section": "database|proxy|smtp|server", "config": {...} }`
  - **Nota:** Reinicie o servidor para aplicar.

### Teste SMTP
- **POST /api/infrastructure/test-smtp:** Verifica credenciais de servidor de e-mail.
  - **Payload:** `{ "host": "...", "port": 587, "user": "...", "pass": "...", "secure": false }`

### NexusBridge Config
- **GET /api/infrastructure/nexus-config:** Retorna configuração de roteamento.
- **POST /api/infrastructure/nexus-config:** Atualiza configuração de roteamento.

---

## 🌉 Integração NexusBridge

A ponte no frontend mapeia caminhos virtuais para estes alvos reais:

| Path Virtual | Método | Alvo Real |
| :--- | :--- | :--- |
| `sync-all` | GET | `/api/data` |
| `auth/login` | POST | `/api/login` |
| `test/db-employees` | GET/POST/PUT | `/api/employees` |
| `maintenance/db-reset` | POST | `/api/maintenance/reset` |
| `system/audit-logs` | GET | `/api/system/audit-logs` |
| `system/db-info` | GET | `/api/system/db-info` |
| `refuelings` | GET/POST | `/api/refuelings` |
| `chat/messages` | GET/POST | `/api/messages` |
| `infrastructure/config` | GET | `/api/infrastructure/config` |
| `infrastructure/test-db` | POST | `/api/infrastructure/test-db` |
| `infrastructure/save` | POST | `/api/infrastructure/save` |
| `infrastructure/test-smtp` | POST | `/api/infrastructure/test-smtp` |
| `infrastructure/nexus-config` | GET/POST | `/api/infrastructure/nexus-config` |

---

## 🛡️ Códigos de Resposta

| Código | Significado |
| :--- | :--- |
| `200 OK` | Sucesso |
| `400 Bad Request` | Parâmetros obrigatórios ausentes |
| `401 Unauthorized` | Token ausente ou inválido |
| `403 Forbidden` | Cargo insuficiente para a ação |
| `404 Not Found` | Endpoint ou recurso não encontrado |
| `429 Too Many Requests` | Rate limit excedido |
| `500 Internal Server Error` | Erro interno no servidor |
| `503 Service Unavailable` | Backend offline |
