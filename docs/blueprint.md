# 🏙️ CityMotion — Blueprint do Sistema

**Gestão Inteligente de Frotas para Administração Municipal**

---

## 📋 Visão Geral

CityMotion é um sistema completo de gestão de frotas desenvolvido para prefeituras e órgãos públicos. Ele unifica o controle de veículos, motoristas, manutenção, abastecimento, escalas de trabalho e solicitações de transporte em uma única plataforma.

---

## 🎯 Público-Alvo

- **Prefeituras Municipais** — Gestão da frota de secretarias (Obras, Saúde, Educação, etc.)
- **Empresas de Logística** — Frotas de veículos leves e pesados
- **Transportes Públicos** — Vans, ônibus escolares e frota administrativa

---

## 🏗️ Arquitetura Técnica

```
┌──────────────────────────────────────────────────┐
│                 Cliente (Navegador)               │
│  ┌────────────────────────────────────────────┐  │
│  │         SPA HTML/JS/CSS (public/)          │  │
│  │  Dashboard | Veículos | Funcionários | ... │  │
│  │  Toast Notifications | Socket.IO Client    │  │
│  └─────────────────────────┬──────────────────┘  │
└────────────────────────────┼─────────────────────┘
                             │ HTTP + WebSocket
┌────────────────────────────┼─────────────────────┐
│                Backend Fastify (Porta 3001)       │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Auth /   │ │ Data API │ │ Infrastructure   │ │
│  │ JWT      │ │ CRUD     │ │ Config / SMTP    │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│  ┌────────────────────────────────────────────┐  │
│  │ Socket.IO (Notificações em Tempo Real)     │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │ Drizzle ORM + SQLite / PostgreSQL          │  │
│  └────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| **Backend** | Node.js + Fastify + TypeScript |
| **ORM** | Drizzle ORM (type-safe, schema-first) |
| **Banco** | SQLite (padrão) / PostgreSQL (produção) |
| **Autenticação** | JWT via @fastify/jwt + bcryptjs |
| **WebSocket** | Socket.IO (notificações em tempo real) |
| **Rate Limiting** | @fastify/rate-limit |
| **Documentação API** | Swagger/OpenAPI via @fastify/swagger |
| **Frontend** | SPA vanilla HTML/JS/CSS (sem framework) |
| **Testes** | Vitest + jsdom (189+ testes) |
| **Container** | Docker multi-estágio |

---

## ⚙️ Funcionalidades Principais

### 1. 📊 Dashboard
- Visão geral da frota com KPIs (veículos ativos, motoristas, viagens do dia)
- Gráficos de atividade por período
- Cards de alerta (manutenções pendentes, abastecimentos)
- Atualização em tempo real via WebSocket

### 2. 🚗 Veículos
- Cadastro completo (modelo, placa, setor, quilometragem)
- Status visual (Disponível, Em Viagem, Manutenção)
- Histórico de manutenções e abastecimentos por veículo
- Filtro por setor e status

### 3. 👥 Funcionários
- Cadastro com matrícula, e-mail, cargo e setor
- Controle de permissões por cargo (RBAC)
- Soft delete + reativação
- Aceite de termos LGPD

### 4. 🛣️ Viagens
- Agendamento com origem, destino, motorista e veículo
- Check-in/check-out com registro de quilometragem
- Relatório de sinistro (incidentes)
- Exportação em PDF

### 5. 🔧 Manutenção
- Solicitação com descrição e prioridade
- Kanban visual (Pendente → Em Andamento → Concluído)
- Solicitação de peças vinculada

### 6. ⛽ Abastecimento
- Registro por veículo (litros, valor, tipo de combustível)
- Cálculo automático do valor total
- Histórico por veículo

### 7. 📅 Escalas
- Criação de escalas de trabalho por funcionário
- Tipos: Diária, Semanal, Mensal, Plantão
- Visualização em cards com período

### 8. 💬 Chat
- Mensagens diretas entre funcionários
- Filtro de contatos por setor
- Indicador de não lidas

### 9. 📈 Relatórios
- Estatísticas de viagens (concluídas, KM total, eficiência)
- Gráficos de telemetria com barras animadas
- Dados por período

### 10. ⚙️ Configurações
- **Operações**: Nome da unidade, prioridade padrão, regras de negócio
- **Infraestrutura**: Banco de dados, CORS, SMTP, segurança (acesso Dev/TI)

---

## 👥 Perfis de Usuário (RBAC)

| Perfil | Acesso |
| :--- | :--- |
| **Desenvolvedor Global** | Acesso total (sistema, terminal, infraestrutura) |
| **Administrador** | Configurações, relatórios, gestão de pessoas |
| **Gestor de Setor** | Dashboard do setor, solicitações, aprovações |
| **Motorista** | Viagens, checklists, crachá virtual |
| **Mecânico** | Manutenção, peças, ordens de serviço |
| **Funcionário** | Solicitar transporte, crachá virtual, perfil |

---

## 🚀 Deploy

### Local (Docker)
```bash
docker compose up citymotion
# Acessar: http://localhost:3001
```

### Local (Desenvolvimento)
```bash
cp .env.example .env
# Preencher JWT_SECRET
npm run dev
# Backend: http://localhost:3001
```

### Produção (Render)
```bash
# Blueprint em render.yaml — deploy automático via GitHub
```

---

## 🧪 Qualidade

- **189 testes unitários** (Vitest + jsdom)
- Cobertura: Store, API, WebSocket, App Router, Toast, 12 páginas SPA
- Código TypeScript com validação Zod em todas as rotas
