# 🚘 CityMotion — Gestão Inteligente de Frotas

**Sistema SaaS de gestão de frotas veiculares para prefeituras, logística e mobilidade corporativa.**

<p align="center">
  <img src="screenshots/02-dashboard.png" alt="Dashboard" width="800"/>
</p>

---

## 📸 Visão Geral do Sistema

| Tela | Preview |
| :--- | :--- |
| **🔐 Login** | <img src="screenshots/01-login.png" alt="Login" width="400"/> |
| **📊 Dashboard** — KPIs, gráficos e alertas da frota | <img src="screenshots/02-dashboard.png" alt="Dashboard" width="400"/> |
| **🗺️ Viagens** — Agendamento, check-in/check-out, incidentes | <img src="screenshots/03-viagens.png" alt="Viagens" width="400"/> |
| **🚗 Veículos** — Cadastro, status, telemetria | <img src="screenshots/04-veiculos.png" alt="Veículos" width="400"/> |
| **👥 Funcionários** — Gestão de pessoas, cargos, permissões | <img src="screenshots/05-funcionarios.png" alt="Funcionários" width="400"/> |
| **🏢 Setores** — Estrutura organizacional | <img src="screenshots/06-setores.png" alt="Setores" width="400"/> |
| **⛽ Abastecimento** — Controle de consumo | <img src="screenshots/07-abastecimento.png" alt="Abastecimento" width="400"/> |
| **🔧 Manutenção** — Kanban visual de OS | <img src="screenshots/08-manutencao.png" alt="Manutenção" width="400"/> |
| **📅 Escalas** — Agenda de trabalho | <img src="screenshots/09-escalas.png" alt="Escalas" width="400"/> |
| **💬 Chat** — Comunicação interna | <img src="screenshots/10-chat.png" alt="Chat" width="400"/> |
| **📈 Relatórios** — Estatísticas e gráficos | <img src="screenshots/11-relatorios.png" alt="Relatórios" width="400"/> |
| **👤 Perfil** — Informações do usuário | <img src="screenshots/12-perfil.png" alt="Perfil" width="400"/> |
| **⚙️ Configurações** — Operações + Infraestrutura | <img src="screenshots/13-settings.png" alt="Configurações" width="400"/> |

---

## ✨ Funcionalidades

| Módulo | Descrição | Perfis |
| :--- | :--- | :--- |
| **📊 Dashboard** | KPIs da frota, gráficos de atividade, alertas | Todos |
| **🚗 Veículos** | Cadastro, status (Disponível/Em Viagem/Manutenção), histórico | Admin, Gestor, Motorista |
| **👥 Funcionários** | Cadastro com matrícula, cargo, setor, soft delete, LGPD | Admin, Gestor |
| **🗺️ Viagens** | Ciclo completo: solicitação → check-in → check-out → auditoria | Todos |
| **⛽ Abastecimento** | Controle de consumo (km/l), valor total, histórico | Admin, Gestor, Motorista |
| **🔧 Manutenção** | Kanban 3 colunas, solicitação de peças, prioridades | Admin, Gestor, Mecânico |
| **📅 Escalas** | Agenda de trabalho diária/semanal/mensal/plantão | Admin, Gestor |
| **🏢 Setores** | Estrutura organizacional e alocação | Admin |
| **💬 Chat** | Mensagens internas com filtro por setor | Todos |
| **📈 Relatórios** | Estatísticas, gráficos de telemetria (Chart.js) | Admin, Gestor |
| **⚙️ Configurações** | Operações (regras) + Infraestrutura (DB, CORS, SMTP) | Dev/Admin |
| **🖥️ Terminal Dev** | Console TTY para diagnóstico | Dev |

---

## 🏗️ Arquitetura Técnica

```
[Navegador] ← HTTP + WebSocket → [Fastify :3001]
                                    ├── API REST (/api/*)
                                    ├── Socket.IO (tempo real)
                                    ├── SPA Frontend (servido em /)
                                    └── Swagger (/docs)
                                           │
                                    [SQLite / PostgreSQL]
                                           │
                                    Drizzle ORM (type-safe)
```

### Stack

| Camada | Tecnologia |
| :--- | :--- |
| **Frontend** | SPA HTML/JS/CSS + Tailwind + Chart.js + Lucide Icons |
| **Backend** | Fastify + TypeScript + Drizzle ORM |
| **Autenticação** | JWT (@fastify/jwt) + Bcrypt |
| **Segurança** | Rate Limiting + CORS + Zod Validation + RBAC (6 níveis) |
| **Tempo Real** | Socket.IO (WebSockets + notificações) |
| **Banco Padrão** | SQLite3 (better-sqlite3) — portátil, offline |
| **Banco Nuvem** | PostgreSQL — produção escalável |
| **Container** | Docker multi-estágio + Docker Compose |
| **Hospedagem** | Render Blueprint, On-premise |
| **Qualidade** | 189+ testes (Vitest + jsdom) |

---

## 🚀 Como Executar

### Local (Desenvolvimento)

```bash
cp .env.example .env
# Preencha JWT_SECRET (gere com: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

cd backend && npm install
npx tsx src/index.ts
# → http://localhost:3001
```

### Docker

```bash
docker compose up citymotion
# → http://localhost:3001
```

### Render (Produção)

```bash
# 1. Push para o GitHub
# 2. Render Dashboard → New + → Blueprint
# 3. Selecione o repositório
# 4. Configure CORS_ORIGIN após o deploy
```

---

## 🔐 Credenciais de Teste

| Perfil | E-mail | Senha |
| :--- | :--- | :--- |
| 👑 Desenvolvedor Root | `dev@dev.com` | `123456789` |
| 👤 Administrador | `admin@citymotion.com` | `123456` |
| 🚗 Motorista | `driver@citymotion.com` | `123456` |
| 🧪 Demonstração | `demo@citymotion.com` | `nexus2024` |

---

## 🧪 Testes

```bash
# Testes do frontend SPA (189 testes)
npm run test:frontend

# Testes do backend
cd backend && npm test
```

---

## 📚 Documentação

- [📊 Diagramas de Arquitetura](./docs/DIAGRAMS.md)
- [🏗️ Guia do Backend](./docs/BACKEND_GUIDE.md)
- [🎨 Design System NexusOS](./docs/UI_LAYOUT_GUIDE.md)
- [🛠️ Ferramentas de Administração](./docs/ADMIN_TOOLS.md)
- [📋 Blueprint do Sistema](./docs/blueprint.md)
- [📝 Proposta Comercial](./PROPOSAL.md)
- [📊 Apresentação para Clientes](./docs/business/02-apresentacao-cliente.md)
- [📋 Plano de Negócios](./docs/business/03-plano-de-negocios.md)

---

## 🗺️ Roadmap

### ✅ Fase 1 — Fundação
Motor dual SQLite/PostgreSQL, segurança JWT/Bcrypt/Rate Limiting/CORS, 12 módulos, dashboard adaptativo, painel de configurações, terminal dev.

### ✅ Fase 2 — Conectividade
WebSockets (Socket.IO), notificações em tempo real, chat interno, toast notifications (42 alert() substituídos), relatórios Chart.js, 189+ testes.

### 🔜 Fase 3 — Inteligência
IA preditiva para manutenção, BI avançado, Google Maps, app mobile nativo.

---

**CityMotion — Mobilidade, transparência e eficiência para a gestão moderna.**
