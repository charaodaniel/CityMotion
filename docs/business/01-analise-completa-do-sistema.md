# 🚘 CityMotion — Análise Completa do Sistema

**Sistema SaaS de Gestão Inteligente de Frota e Mobilidade Corporativa**

> **Data:** Julho de 2026  
> **Versão:** 2.0.0  
> **Empresa:** CityMotion Tecnologia  
> **Modelo:** Software como Serviço (SaaS) — White Label

---

## 📋 Sumário Executivo

O **CityMotion** é uma plataforma SaaS modular de gestão de frotas veiculares, desenvolvida para atender organizações de qualquer porte — desde prefeituras e órgãos públicos até empresas privadas de logística, transporte e serviços. O sistema centraliza o controle de veículos, colaboradores, viagens, manutenções e abastecimento em uma única interface moderna e de alta segurança.

---

## 🏗️ 1. Arquitetura do Sistema

### 1.1 Visão Geral da Arquitetura

```
┌──────────────────────────────────────────────────────┐
│              FRONTEND SPA (Servido pelo Backend)       │
│    HTML/JS/CSS vanilla · Socket.IO Client · Chart.js  │
│    Tailwind CSS · Lucide Icons · Toast Notifications  │
│    NexusOS Design System (dark tech theme)            │
└──────────────────────┬───────────────────────────────┘
                       │ HTTP + WebSocket
┌──────────────────────▼───────────────────────────────┐
│                BACKEND FASTIFY (Porta 3001)             │
│    TypeScript · Drizzle ORM · Socket.IO · Zod         │
│    • @fastify/jwt — Autenticação JWT                  │
│    • @fastify/cors — CORS configurável                │
│    • @fastify/rate-limit — Proteção anti-brute force  │
│    • @fastify/swagger — Documentação OpenAPI          │
│    • @fastify/static — Serve o frontend SPA           │
│    Rotas: Auth, Data, Infrastructure                  │
└──────────────────────┬───────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────┐
│              CAMADA DE DADOS (Dual Engine)             │
│   ┌─────────────────┐  ┌─────────────────┐           │
│   │   SQLite3       │  │   PostgreSQL    │           │
│   │  (Local/Padrão) │  │  (Nuvem/Render) │           │
│   │  better-sqlite3 │  │  node-postgres  │           │
│   └─────────────────┘  └─────────────────┘           │
│              Drizzle ORM (type-safe)                   │
└──────────────────────────────────────────────────────┘
```

### 1.2 Tecnologias Utilizadas

| Camada | Tecnologia | Versão |
| :--- | :--- | :---: |
| **Frontend** | SPA HTML/JS/CSS vanilla | — |
| **Estilização** | Tailwind CSS (via CDN) | 3.4+ |
| **Ícones** | Lucide Icons | latest |
| **Gráficos** | Chart.js | 4.x |
| **PDF** | html2pdf.js | — |
| **WebSocket Client** | Socket.IO Client | 4.8+ |
| **Backend** | Fastify | 5.9+ |
| **ORM** | Drizzle ORM | 0.39+ |
| **Autenticação** | JWT + Bcrypt | — |
| **Validação** | Zod | 3.25+ |
| **Banco Padrão** | SQLite3 via better-sqlite3 | 11.7+ |
| **Banco Nuvem** | PostgreSQL | — |
| **WebSockets** | Socket.IO | 4.8+ |
| **Documentação API** | Swagger/OpenAPI | — |
| **Container** | Docker + Docker Compose | — |
| **Hospedagem** | Render / Firebase Studio | — |
| **Testes** | Vitest + jsdom | 4.1+ |

---

## 🎯 2. Funcionalidades do Sistema

### 2.1 Módulos Principais

| # | Módulo | Descrição | Perfis |
| :-: | :--- | :--- | :--- |
| 1 | **📊 Dashboard** | KPIs da frota, gráficos de atividade, alertas | Todos |
| 2 | **🚗 Veículos (Frota)** | Cadastro, status, telemetria e histórico | Admin, Manager, Driver |
| 3 | **👥 Funcionários** | Gestão de colaboradores, cargos, permissões | Admin, Manager |
| 4 | **🗺️ Viagens** | Ciclo completo: solicitação → check-in → checklist → check-out | Todos |
| 5 | **⛽ Abastecimento** | Controle de consumo, histórico por veículo, valor total | Admin, Manager, Driver |
| 6 | **🔧 Manutenção** | Kanban visual (Pendente/Em Andamento/Concluído), peças | Admin, Manager, Mechanic |
| 7 | **📅 Escalas** | Agenda de trabalho, plantões, tipo (diária/semanal/mensal) | Admin, Manager |
| 8 | **🏢 Setores** | Estrutura organizacional e alocação de recursos | Admin |
| 9 | **💬 Chat** | Comunicação interna entre funcionários | Todos |
| 10 | **📈 Relatórios** | Estatísticas, telemetria, gráficos de barras | Admin, Manager |
| 11 | **⚙️ Configurações** | Operações (regras de negócio) + Infraestrutura (DB, CORS, SMTP) | Dev/Admin |
| 12 | **🖥️ Terminal Dev** | Console de administração (estilo TTY/Kernel Shell) | Dev/Admin |

### 2.2 Fluxo Completo de uma Viagem

```
Solicitante (Employee)
    │
    ▼
Solicita Transporte via Formulário Rápido
    │
    ▼
Gestor (Manager) analisa e aprova/rejeita
    │
    ▼ (Aprovado)
Motorista recebe notificação (Socket.IO) e visualiza missão
    │
    ▼
Início da Viagem → Registro de KM Inicial
    │
    ▼
Registro de Abastecimento (opcional)
    │
    ▼
Finalização → Registro de KM Final → Checklist
    │
    ▼
Registro em Auditoria + Notificação ao Solicitante
```

### 2.3 Fluxo de Autenticação e Segurança

```
Usuário → Login (email + senha)
    → Rate Limiter (10 tentativas/15min)
    → Bcrypt.compare() valida hash
    → JWT gerado via @fastify/jwt (expiração: 8h)
    → Token armazenado no LocalStorage
    → CORS verifica origem
    → RBAC verifica permissão da rota
    → Resposta JSON com token + dados do usuário
```

---

## 🛡️ 3. Segurança

### 3.1 Camadas de Proteção

| Recurso | Status | Descrição |
| :--- | :---: | :--- |
| **JWT** | ✅ | Tokens com expiração de 8 horas, @fastify/jwt |
| **Bcrypt** | ✅ | Hash de senhas com salt (10 rounds) |
| **CORS** | ✅ | Configurável via .env (whitelist de origens) |
| **Rate Limiting** | ✅ | Global (100 req/15min) + Login (10 tentativas/15min) |
| **SQL Injection** | ✅ | Prevenção via Drizzle ORM (queries parametrizadas) |
| **Zod Validation** | ✅ | Schemas de validação em todas as rotas e env vars |
| **RBAC** | ✅ | 6 níveis de permissão (Desenvolvedor → Colaborador) |
| **Soft Delete** | ✅ | Registros desativados, nunca excluídos |
| **LGPD** | ✅ | Banner de consentimento e privacidade |

### 3.2 Hierarquia de Perfis (RBAC)

```
👑 Desenvolvedor Global (Root)
    ├── Acesso total ao sistema
    ├── Painel de infraestrutura
    ├── Terminal Dev
    └── Gestão de configurações
    
👤 Administrador
    ├── CRUD completo de todos os recursos
    ├── Configurações operacionais
    ├── Relatórios e estatísticas
    └── Gestão de frotas e funcionários
    
👔 Gestor de Setor
    ├── Visão restrita ao seu setor
    ├── Aprovação de solicitações
    └── Gestão local de recursos
    
🔧 Mecânico
    ├── Ordens de serviço de manutenção
    ├── Pedidos de peças
    └── Status de veículos na oficina

🚗 Motorista
    ├── Visualização de viagens atribuídas
    ├── Check-in/check-out com KM
    └── Registro de abastecimento

👤 Colaborador/Funcionário
    ├── Solicitar transporte
    ├── Acompanhar solicitações
    └── Perfil
```

---

## 🎨 4. Design System — NexusOS

### 4.1 Identidade Visual

- **Tema:** Dark Tech (High contrast, telemetria industrial)
- **Background:** Zinc-950 (profundidade), Zinc-900 (cards)
- **Primary:** Blue-500 (ações principais)
- **Sidebar:** Zinc-950/80 backdrop-blur-xl
- **Status:** Verde (Disponível), Azul (Em Viagem), Laranja (Manutenção), Amarelo (Pendente), Vermelho (Crítico)
- **Tipografia:** Monoespaçada para dados técnicos
- **Animações:** Fade-in de páginas, slide-in de toasts

### 4.2 Sistema de Notificações

| Tipo | Gatilho | Canal |
| :--- | :--- | :--- |
| **Toast** | Ação do usuário (salvar, erro, validação) | DOM overlay |
| **Notificação WebSocket** | Evento de outro usuário (nova solicitação, atualização) | Socket.IO + Sino |
| **Badge (Sino)** | Contagem de notificações não lidas | Header |

---

## 🔄 5. Integrações e Conectividade

### 5.1 Bancos de Dados Suportados

| Motor | Indicação | Configuração |
| :--- | :--- | :--- |
| **SQLite3** | Desenvolvimento, instalações locais, Docker | Automático (padrão) |
| **PostgreSQL** | Produção em nuvem, alta concorrência | DATABASE_URL |

### 5.2 WebSockets (Socket.IO)

Eventos em tempo real:
- `join-sector` — Notificações segregadas por setor
- `notification` — Nova solicitação, atualização de status
- `entity-update` — Atualização de dados sem refresh (create, update, delete)

### 5.3 APIs

- **Documentação:** Swagger UI em `/docs`
- **Health Check:** `/api/health`
- **Autenticação:** `/api/login`, `/api/forgot-password`, `/api/reset-password`
- **Dados:** `/api/data` (sync completo), `/api/requests` (solicitações)
- **Infraestrutura:** `/api/infrastructure/config`, `/api/infrastructure/test-db`, `/api/infrastructure/save`

---

## 📁 6. Estrutura do Projeto

```
citymotion/
├── public/                     # Frontend SPA (servido pelo Fastify)
│   ├── app.html                # Shell da aplicação
│   ├── index.html              # Página de login
│   ├── css/styles.css          # Estilos NexusOS
│   └── js/
│       ├── app.js              # Roteador SPA
│       ├── store.js            # Gerenciamento de estado
│       ├── api.js              # Cliente HTTP
│       ├── ws.js               # Socket.IO client
│       ├── toast.js            # Sistema de notificações
│       └── pages/              # Páginas da aplicação
│           ├── dashboard.js, veiculos.js, funcionarios.js, ...
│           └── settings.js     # Configurações + Infraestrutura
├── backend/                    # Backend Fastify
│   ├── src/
│   │   ├── index.ts            # Entry point
│   │   ├── app.ts              # Factory Fastify
│   │   ├── config/env.ts       # Validação Zod das env vars
│   │   ├── db/                 # Schemas Drizzle + seed
│   │   ├── plugins/            # auth.ts, websocket.ts
│   │   ├── routes/             # auth.ts, data.ts, infrastructure.ts
│   │   └── tests/              # Vitest tests
│   ├── scripts/                # Scripts auxiliares
│   └── drizzle.config.ts       # Config Drizzle Kit
├── database/                   # SQLite persistente
├── docs/                       # Documentação
│   └── business/               # Documentos de negócio
├── tests/                      # Testes do frontend SPA (Vitest)
└── Dockerfile, docker-compose.yml, render.yaml
```

---

## 🚀 7. Guia de Implantação

### 7.1 Requisitos Mínimos

- **Node.js:** 20+ (LTS)
- **RAM:** 256 MB (SQLite) / 512 MB (PostgreSQL)
- **Armazenamento:** 100 MB + banco de dados
- **SO:** Linux, macOS, Windows (via Docker)

### 7.2 Opções de Deployment

| Opção | Descrição | Ideal para |
| :--- | :--- | :--- |
| **Docker** | Container único (porta 3001) | Servidores dedicados |
| **Render** | PaaS gerenciado com Blueprint | Nuvem rápida |
| **Firebase Studio** | Ambiente gerenciado | Desenvolvimento |
| **Servidor Próprio** | Node.js direto | On-premise |

### 7.3 Modo Demonstração

O sistema possui um modo **DEMO** que:
- Reinicia os dados automaticamente a cada 24h
- Cria usuários de demonstração pré-configurados
- Permite avaliação completa sem riscos

---

## ✅ 8. Roadmap e Próximos Passos

### Fase 1 — Fundação ✅ (Concluída)
- [x] Motor de persistência dual (SQLite + PostgreSQL)
- [x] Segurança JWT/Bcrypt/Rate Limiting/CORS
- [x] Módulos: Frota, Funcionários, Viagens, Abastecimento, Manutenção
- [x] Dashboard adaptativo por perfil
- [x] Painel de Configurações (Operações + Infraestrutura)
- [x] Terminal Dev (Console TTY)
- [x] Design System NexusOS

### Fase 2 — Conectividade ✅ (Concluída)
- [x] WebSockets para notificações em tempo real
- [x] Chat interno entre colaboradores
- [x] Relatórios e gráficos (Chart.js)
- [x] Exportação de relatórios via html2pdf
- [x] Toast notifications (substituiu alert() em 42 lugares)
- [x] 189+ testes unitários (Vitest + jsdom)

### Fase 3 — Inteligência (2026)
- [ ] IA Preditiva para manutenção
- [ ] BI Avançado com dashboards customizáveis
- [ ] Integração Google Maps e otimização de rotas
- [ ] Aplicativo mobile nativo (React Native)

### Fase 4 — Expansão (2027)
- [ ] Marketplace de integrações
- [ ] API pública para terceiros
- [ ] Multi-idioma (EN, ES)
- [ ] Compliance regulatório

---

## 📊 9. Análise de Mercado

### 9.1 Segmentos-Alvo

| Segmento | Necessidade | Adequação |
| :--- | :--- | :---: |
| 🏛️ **Prefeituras** | Gestão de frota pública, transparência | ⭐⭐⭐⭐⭐ |
| 🚚 **Logística** | Rastreamento, eficiência de rotas | ⭐⭐⭐⭐ |
| 🏥 **Saúde** | Ambulâncias, transporte de pacientes | ⭐⭐⭐⭐⭐ |
| 🏗️ **Construção Civil** | Veículos pesados, manutenção | ⭐⭐⭐⭐ |
| 🚌 **Transporte Escolar** | Segurança, checklists | ⭐⭐⭐⭐ |
| 🛒 **Varejo** | Entregas, frotas leves | ⭐⭐⭐ |

### 9.2 Diferenciais Competitivos

| Característica | CityMotion | Concorrentes Típicos |
| :--- | :--- | :--- |
| **Dual Engine (SQLite + PG)** | ✅ Nativo | ❌ Apenas 1 banco |
| **White Label** | ✅ Marca do cliente | ❌ Marca própria |
| **Offline-first** | ✅ SQLite local | ❌ Dependência de nuvem |
| **RBAC Avançado** | ✅ 6 níveis hierárquicos | ❌ 2-3 níveis |
| **WebSocket Real-time** | ✅ Notificações instantâneas | ❌ Polling HTTP |
| **LGPD** | ✅ Conformidade integrada | ❌ Separado |
| **Código Aberto** | ⬜ Sob consulta | ❌ Fechado |
| **189+ Testes Automatizados** | ✅ Pipeline de qualidade | ❌ Sem garantia |

---

## 📈 10. Métricas e KPIs

| KPI | Como o CityMotion Ajuda |
| :--- | :--- |
| **Redução de Custos Operacionais** | Controle de consumo por km/l |
| **Aumento de Disponibilidade da Frota** | Manutenção preventiva via Kanban |
| **Redução de Tempo Ocioso** | Escalas e otimização de viagens |
| **Transparência** | Auditoria completa e relatórios |
| **Conformidade LGPD** | Central de privacidade integrada |
| **Satisfação dos Usuários** | Chat, notificações, toast feedback |

---

## 📄 11. Licenciamento e Modelo de Negócio

**CityMotion** é uma solução proprietária disponível nos planos:

| Plano | Ideal para | Recursos |
| :--- | :--- | :--- |
| **Basic** | Pequenas frotas (até 5 veículos) | Funcionalidades essenciais |
| **Pro** | Médias empresas (até 20 veículos) | Todos os módulos + relatórios |
| **Enterprise** | Grandes organizações (ilimitado) | White Label + suporte dedicado |

---

**CityMotion — Inteligência em mobilidade para a gestão corporativa moderna.**

---

*Documento gerado em Julho de 2026 | CityMotion Tecnologia*
