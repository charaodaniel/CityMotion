
# 🚀 CityMotion Backend - Referência da API Completa

Este documento detalha todos os endpoints disponíveis no servidor Express do CityMotion, descrevendo como eles alimentam o frontend, o Terminal de Desenvolvedor e a arquitetura NexusBridge.

---

## 🛠️ Arquitetura Técnica

- **Runtime:** Node.js
- **Framework:** Express.js
- **Banco de Dados:** SQLite3 (Persistência em arquivo `/database/citymotion.db`)
- **Ponte de Integração:** NexusBridge (Roteamento virtual e transformação)

---

## 🔐 Autenticação (JWT)

O sistema utiliza tokens JWT para proteger rotas sensíveis e identificar permissões.

### Login
- **Endpoint:** `POST /api/login`
- **Payload:** `{ "email": "...", "password": "..." }`
- **Retorno:** Token de acesso e objeto do usuário com permissões (Admin, Gestor, etc).

---

## 📊 Endpoints de Dados (Core)

### Busca Consolidada (Initial Load)
- **Endpoint:** `GET /api/data`
- **Descrição:** Retorna todos os dados para o carregamento inicial (viagens, veículos, funcionários, setores).

### Funcionários (Employees)
- **GET /api/employees:** Lista todos os funcionários.
- **POST /api/employees:** Cria um novo registro.
- **PUT /api/employees/:id:** Atualiza dados de um colaborador existente.
- **DELETE /api/employees/:id:** Remove um colaborador do banco.

### Veículos (Fleet)
- **GET /api/vehicles:** Lista toda a frota.

---

## 🖥️ Endpoints de Sistema e Testes (Admin Console)

### Monitor de Recursos (estilo btop)
- **Endpoint:** `GET /api/system/resources`
- **Métricas:** `uptime`, `memory` (uso real), `cpu` (modelo e carga).

### Manutenção e Reset
- **Endpoint:** `POST /api/maintenance/reset`
- **Descrição:** Executa o script de reinicialização, apagando o banco atual e restaurando os dados originais.

---

## 🌉 Integração com NexusBridge (Endpoints Virtuais)

A API permite chamadas dinâmicas incluindo IDs:

| Path Virtual | Método | Alvo Real (Backend) | Função |
| :--- | :--- | :--- | :--- |
| `test/db-employees` | GET | `/api/employees` | Listar funcionários |
| `test/db-employees` | POST | `/api/employees` | Criar funcionário |
| `test/db-employees/:id` | PUT | `/api/employees/:id` | Editar funcionário via Terminal |
| `test/db-employees/:id` | DELETE | `/api/employees/:id` | Deletar registro |
| `system/resources` | GET | `/api/system/resources` | Monitorar hardware |
| `maintenance/db-reset` | POST | `/api/maintenance/reset` | Restaurar estado de fábrica |

---

## 🚀 Teste de Emergência (CLI)

Se a interface web estiver indisponível, utilize o CLI de máquina:
```bash
node nexus-cli.js test/db-employees
```
