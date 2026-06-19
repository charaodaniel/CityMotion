
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
- **Processamento:** Realiza o parse automático de campos JSON no SQLite (ex: arrays de setores).

### Funcionários (Employees)
- **GET /api/employees:** Lista todos os funcionários.
- **POST /api/employees:** Cria um novo registro.
- **PUT /api/employees/:id:** Atualiza dados de um colaborador existente.
- **DELETE /api/employees/:id:** Remove um colaborador do banco.

### Veículos (Fleet)
- **GET /api/vehicles:** Lista toda a frota.
- **Campos Especiais:** `lastRefuelingDate` (data do último abastecimento registrado).

---

## 🖥️ Endpoints de Sistema e Testes (Admin Console)

Estes endpoints são projetados para serem consumidos pelo **Terminal de Desenvolvedor** e pelo **NexusBridge Control**.

### Monitor de Recursos (estilo btop)
- **Endpoint:** `GET /api/system/resources`
- **Descrição:** Extrai métricas reais de hardware do servidor.
- **Métricas:** 
  - `uptime`: Tempo de atividade do processo.
  - `memory`: Uso de RAM (Total, Usado, Porcentagem).
  - `cpu`: Modelo e carga atual (load avg).

### Manutenção e Reset
- **Endpoint:** `POST /api/maintenance/reset`
- **Descrição:** Executa o script de reinicialização "Hard Reset", apagando o banco atual e restaurando os dados originais do `database.sql`.

---

## 🌉 Integração com NexusBridge

A API está mapeada no arquivo `nexus-settings.json` do frontend, permitindo chamadas virtuais:

| Path Virtual | Método | Alvo Real (Backend) | Função |
| :--- | :--- | :--- | :--- |
| `test/db-employees` | GET | `/api/employees` | Listar funcionários via SQLite |
| `test/db-employees` | POST | `/api/employees` | Criar funcionário via Terminal |
| `system/resources` | GET | `/api/system/resources` | Monitorar hardware no Terminal |
| `maintenance/db-reset` | POST | `/api/maintenance/reset` | Restaurar estado de fábrica |

---

## 🚀 Teste de Emergência (CLI)

Se a interface web estiver indisponível, utilize o CLI de máquina:
```bash
node nexus-cli.js test/db-employees
```
