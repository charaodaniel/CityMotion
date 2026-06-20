
# 🚀 CityMotion Backend - Referência da API Completa

Este documento detalha os endpoints disponíveis no servidor Express do CityMotion, protegidos por JWT e conectados ao banco SQLite3.

---

## 🛠️ Especificações Técnicas

- **Runtime:** Node.js
- **Framework:** Express.js
- **Segurança:** JWT (Token de 8 horas) + Bcrypt (Hashing de Senha)
- **Banco de Dados:** SQLite3 (`/database/citymotion.db`)
- **Porta Padrão:** 3001

---

## 🔐 Autenticação

### Login
- **Endpoint:** `POST /api/login`
- **Payload:** `{ "email": "...", "password": "..." }`
- **Nota:** Suporta e-mail ou número de matrícula.
- **Retorno:** Token JWT e objeto do usuário (sem senha).

---

## 📊 Endpoints de Dados (Protegidos)

Todos os endpoints abaixo exigem o header `Authorization: Bearer <token>`.

### Sincronização Global
- **GET /api/data:** Retorna o ecossistema completo (viagens, veículos, funcionários, setores). Ideal para carregamento inicial do dashboard.

### Funcionários (Employees)
- **GET /api/employees:** Lista todos os colaboradores.
- **POST /api/employees:** Cria novo registro (Hash Bcrypt automático).
- **PUT /api/employees/:id:** Atualiza dados.
- **DELETE /api/employees/:id:** Soft-Delete (marca como desativado) ou Hard-Delete (se usuário for ROOT).

### Veículos e Frota
- **GET /api/vehicles:** Lista toda a frota e status de telemetria.

---

## 🖥️ Endpoints de Sistema (Acesso Restrito: DEV/TI)

### Monitor de Recursos
- **GET /api/system/resources:** Retorna uso de CPU, RAM, Uptime e versão do Node do servidor.

### Auditoria e Logs
- **GET /api/system/audit-logs:** Lista as últimas 100 alterações realizadas no banco de dados, identificando o autor via JWT.

### Manutenção e Reset
- **POST /api/maintenance/reset:** Executa o script de inicialização completa. **Requer privilégio ROOT e confirmação de senha.**

---

## 🌉 Integração NexusBridge

A ponte no frontend mapeia caminhos virtuais para estes alvos reais:

| Path Virtual | Método | Alvo Real |
| :--- | :--- | :--- |
| `sync-all` | GET | `/api/data` |
| `auth/login` | POST | `/api/login` |
| `test/db-employees` | GET/POST/PUT | `/api/employees` |
| `maintenance/db-reset` | POST | `/api/maintenance/reset` |

---

## 🛡️ Códigos de Resposta

- `200 OK`: Sucesso.
- `401 Unauthorized`: Token ausente ou inválido.
- `403 Forbidden`: Token válido, mas cargo insuficiente para a ação.
- `503 Service Unavailable`: Backend offline.
