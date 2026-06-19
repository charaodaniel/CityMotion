
# 🚀 CityMotion Backend - Referência da API

Este documento descreve os endpoints, a estrutura de dados e os mecanismos de funcionamento do servidor Express que sustenta o ecossistema CityMotion.

---

## 🛠️ Arquitetura Técnica

- **Runtime:** Node.js
- **Framework:** Express.js
- **Banco de Dados:** SQLite3 (baseado em arquivo: `/database/citymotion.db`)
- **Autenticação:** JWT (JSON Web Tokens)
- **Integração:** Servido via **NexusBridge** no frontend.

---

## 🔐 Autenticação

O sistema utiliza tokens JWT para proteger rotas sensíveis.

### Login
- **Endpoint:** `POST /api/login`
- **Payload:**
  ```json
  {
    "email": "admin@citymotion.com",
    "password": "..."
  }
  ```
- **Resposta:** Retorna um `token` e o objeto `user` com permissões decodificadas.

---

## 📊 Endpoints de Dados

### Busca Consolidada (Initial Load)
- **Endpoint:** `GET /api/data`
- **Descrição:** Retorna todos os dados necessários para o dashboard (viagens, solicitações, veículos, funcionários, escalas).
- **Nota:** Faz o parse automático de campos JSON armazenados como string no SQLite (ex: setores, passageiros, checklists).

### Funcionários
- **GET /api/employees:** Lista todos os colaboradores.
- **POST /api/employees:** Cadastra um novo colaborador.
  - Campos: `name`, `email`, `role`, `sector` (JSON), `status`.

### Veículos
- **GET /api/vehicles:** Lista toda a frota municipal.
- **Campos Especiais:** `lastRefuelingDate` (armazena a data do último abastecimento registrado).

---

## 🖥️ Endpoints de Sistema (Admin Console)

Estes endpoints são consumidos principalmente pelo **Terminal de Desenvolvedor** do frontend.

### Monitor de Recursos (btop style)
- **Endpoint:** `GET /api/system/resources`
- **Retorno:**
  - `uptime`: Tempo de atividade do processo.
  - `memory`: Uso de RAM (Total, Usada, Porcentagem).
  - `cpu`: Modelo do processador e carga (load avg).
  - `platform`: Sistema operacional do servidor.

### Reset de Fábrica (Hard Reset)
- **Endpoint:** `POST /api/maintenance/reset`
- **Descrição:** Executa o script `init_db.js`, apagando o arquivo `.db` atual e recriando todas as tabelas com os dados originais do arquivo `database.sql`.

---

## 🗄️ Estrutura do Banco de Dados (SQLite)

As principais tabelas são:
1. `employees`: Dados funcionais e credenciais.
2. `vehicles`: Cadastro da frota e status.
3. `sectors`: Organização departamental.
4. `trips`: Registro histórico e em tempo real de viagens.
5. `vehicle_requests`: Solicitações pendentes de aprovação.
6. `work_schedules`: Escalas e plantões.
7. `maintenance_requests`: Chamados para oficina.

---

## 🚀 Como testar localmente

Se o servidor estiver rodando na porta 3001, você pode testar via cURL ou Postman:

```bash
# Testar saúde do sistema
curl http://localhost:3001/api/system/resources

# Listar veículos diretamente
curl http://localhost:3001/api/vehicles
```
