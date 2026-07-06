# 🚘 CityMotion
## **Sistema de Gestão Inteligente de Frota e Mobilidade Corporativa**

---

> **Apresentação Comercial**  
> *Julho de 2026*  
> *Solução White Label · SaaS · Enterprise*

---

## 📌 Slide 1 — Capa

```
╔══════════════════════════════════════════════════════╗
║                                                      ║
║                    🚘 CityMotion                     ║
║                                                      ║
║    SISTEMA DE GESTÃO INTELIGENTE DE FROTA           ║
║              E MOBILIDADE CORPORATIVA               ║
║                                                      ║
║    ───────────────────────────────────────────       ║
║                                                      ║
║    Solução White Label · SaaS · Enterprise           ║
║                                                      ║
║    Julho de 2026                                     ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```

---

## 📌 Slide 2 — O Problema

### 🚨 Desafios na Gestão de Frotas

| Desafio | Impacto |
| :--- | :--- |
| 🔍 **Falta de visibilidade** | Você sabe onde estão seus veículos AGORA? |
| 📋 **Processos manuais** | Planilhas, papéis e retrabalho |
| ⛽ **Consumo sem controle** | Gastos com combustível sem rastreabilidade |
| 🔧 **Manutenção reativa** | Veículos quebram quando mais precisam |
| 📊 **Relatórios atrasados** | Decisões baseadas em dados desatualizados |
| 🔒 **Segurança frágil** | Dados sensíveis expostos |
| ⚖️ **LGPD** | Não conformidade — riscos legais |

### 💰 O Custo da Ineficiência

> **40%** do custo operacional de frotas vem de **ineficiências evitáveis**:
> - Combustível desperdiçado
> - Rotas mal planejadas
> - Manutenções emergenciais
> - Veículos parados sem necessidade

---

## 📌 Slide 3 — A Solução

### ✅ CityMotion: Tudo que você precisa em um só lugar

```
┌─────────────────────────────────────────────────────┐
│                   CityMotion                         │
│                                                      │
│  📊  🚗  👥  🗺️  ⛽  🔧  💬  📈  ⚙️             │
│  Dash Frota Pessoas Viagens Abast Manut Chat Relat  │
│                                                      │
│  ───────────  Uma plataforma. Todas as funções. ─── │
└─────────────────────────────────────────────────────┘
```

### 🎯 Para quem é o CityMotion?

| Segmento | Como usamos |
| :--- | :--- |
| 🏛️ **Prefeituras** | Frota pública transparente e eficiente |
| 🚚 **Logística e Transportes** | Otimização de rotas e entregas |
| 🏥 **Saúde** | Ambulâncias e transporte de pacientes |
| 🏗️ **Construção Civil** | Veículos pesados e manutenção |
| 🚌 **Transporte Escolar** | Segurança com checklists obrigatórios |

---

## 📌 Slide 4 — Diferenciais

### 💎 Por que o CityMotion é Único?

```
🏆 DIFERENCIAIS COMPETITIVOS
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║  🎨 White Label          → Sua marca, seu sistema    ║
║                                                       ║
║  🗄️ SQLite + PostgreSQL → Local ou nuvem            ║
║                                                       ║
║  🛡️ Segurança Enterprise → JWT + Bcrypt + Rate Limit║
║                                                       ║
║  🔔 Tempo Real           → Socket.IO + Notificações  ║
║                                                       ║
║  🐳 Docker + Render      → Deploy em 1 comando       ║
║                                                       ║
║  🧪 189+ Testes          → Qualidade garantida       ║
║                                                       ║
║  ⚖️ LGPD Nativa          → Conformidade integrada    ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

---

## 📌 Slide 5 — Módulos do Sistema

### 📦 Ecossistema Completo

| Módulo | Função | Quem Usa |
| :--- | :--- | :--- |
| **📊 Dashboard** | KPIs da frota, gráficos, alertas | Todos |
| **🚗 Frota** | Cadastro de veículos, status, histórico | Admin, Gestor, Motorista |
| **👥 Funcionários** | Colaboradores, cargos, permissões | Admin, Gestor |
| **🗺️ Viagens** | Solicitação → Check-in → Check-out | Todos |
| **⛽ Abastecimento** | Controle de consumo (km/l) | Admin, Gestor, Motorista |
| **🔧 Manutenção** | Kanban visual (Pendente → Em Andamento → Concluído) | Admin, Gestor, Mecânico |
| **📅 Escalas** | Agenda de trabalho e plantões | Admin, Gestor |
| **💬 Chat** | Comunicação interna em tempo real | Todos |
| **📈 Relatórios** | Estatísticas e gráficos de telemetria | Admin, Gestor |
| **⚙️ Configurações** | Regras de negócio + Infraestrutura | Dev/Admin |

---

## 📌 Slide 6 — O Fluxo de Trabalho

### 🔄 Do Pedido à Viagem

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│COLABORADOR│    │ GESTOR  │    │MOTORISTA│    │ CHECKLIST│
│  Solicita │───▶│  Avalia  │───▶│ Executa  │───▶│  Finaliza│
│ Transporte│    │ Aprova   │    │  Viagem  │    │  Registro│
└─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │
     ▼              ▼              ▼              ▼
  Pedido      Notificação      Check-in       Auditoria
  no App      (Socket.IO)      + KM Inicial   Concluída
```

### 🎯 Exemplo Prático

> **Maria** (Colaboradora) precisa ir a uma reunião em outro prédio.
>
> 1. Ela abre o CityMotion, clica em **"Pedir Transporte"**
> 2. **João** (Gestor) recebe notificação em tempo real e **aprova** em 1 clique
> 3. **Carlos** (Motorista) vê a missão no painel, faz **check-in** com KM inicial e inicia o trajeto
> 4. Ao chegar, Carlos registra o **check-out** com KM final
> 5. **Tudo registrado** — auditoria completa, combustível controlado, KM rastreado

---

## 📌 Slide 7 — Segurança

### 🛡️ Proteção em Múltiplas Camadas

```
╔═══════════════════════════════════════════════════════╗
║                   SEGURANÇA                           ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  🔐 JWT ─── Tokens seguros com expiração de 8h      ║
║                                                       ║
║  🔒 Bcrypt ─── Senhas criptografadas (nunca texto)  ║
║                                                       ║
║  🚫 Rate Limiting ─── Bloqueio anti-brute force      ║
║                                                       ║
║  🌐 CORS ─── Origens autorizadas (whitelist)         ║
║                                                       ║
║  ✅ Zod ─── Validação de dados em todas as rotas     ║
║                                                       ║
║  ⚖️ LGPD ─── Conformidade com Lei 13.709/2018       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

### 👥 Controle de Acesso (RBAC)

```
👑 Desenvolvedor ─── Acesso total + infraestrutura
    │
    ├── 👤 Administrador ─── Gestão completa
    │       │
    │       ├── 👔 Gestor ─── Seu setor
    │       │       │
    │       │       ├── 🚗 Motorista ─── Viagens e checklists
    │       │       └── 🔧 Mecânico ─── OS e peças
    │       │
    │       └── 👤 Colaborador ─── Solicitar transporte
    │
    └── 🖥️ Dev/TI ─── Terminal + Infraestrutura
```

---

## 📌 Slide 8 — Infraestrutura e Tecnologia

### 🏗️ Stack Tecnológica

| Componente | Tecnologia |
| :--- | :--- |
| 🎨 **Frontend** | SPA HTML/JS/CSS + Tailwind + Chart.js |
| ⚙️ **Backend** | Fastify + TypeScript + Drizzle ORM |
| 🗄️ **Banco Padrão** | SQLite3 (local, portátil) |
| ☁️ **Banco Nuvem** | PostgreSQL (Render, Supabase, Neon) |
| 🔔 **Tempo Real** | Socket.IO (WebSockets) |
| 🔐 **Autenticação** | JWT + Bcrypt + Rate Limiting |
| 📚 **Documentação** | Swagger OpenAPI (/docs) |
| 🐳 **Container** | Docker + Docker Compose |
| 🚀 **Deploy** | Render Blueprint, Servidor Próprio |
| 🧪 **Qualidade** | 189+ testes automatizados (Vitest) |

### 🔌 Única Porta, Tudo Integrado

```
O CityMotion roda em uma única porta (3001):
  • API REST → /api/*
  • WebSocket → Socket.IO
  • Frontend SPA → servido via Fastify Static
  • Documentação → /docs (Swagger UI)
```

---

## 📌 Slide 9 — Roadmap

### 🗺️ O Futuro do CityMotion

```
FASE 1 ✅ (Concluída)
╔═══════════════════════════════════════════════════════╗
║  ✔ Motor dual SQLite + PostgreSQL                     ║
║  ✔ Segurança JWT/Bcrypt/Rate Limiting/CORS            ║
║  ✔ Dashboard adaptativo por perfil                    ║
║  ✔ Módulos: Frota, Viagens, Abastecimento, Manutenção║
║  ✔ Painel de Configurações + Terminal Dev             ║
║  ✔ 12 páginas SPA funcionais                          ║
╚═══════════════════════════════════════════════════════╝

FASE 2 ✅ (Concluída)
╔═══════════════════════════════════════════════════════╗
║  ✔ WebSockets e notificações em tempo real            ║
║  ✔ Chat interno entre colaboradores                   ║
║  ✔ Toast notifications (42 alert() substituídos)     ║
║  ✔ Relatórios e gráficos (Chart.js)                   ║
║  ✔ 189+ testes unitários                              ║
╚═══════════════════════════════════════════════════════╝

FASE 3 🔜 (Próximos 12 meses)
╔═══════════════════════════════════════════════════════╗
║  🔮 IA Preditiva para manutenção                      ║
║  🔮 BI Avançado com dashboards customizáveis          ║
║  🔮 Integração Google Maps / Otimização de Rotas      ║
║  🔮 Aplicativo Mobile Nativo (React Native)           ║
╚═══════════════════════════════════════════════════════╝
```

---

## 📌 Slide 10 — Modelo de Negócio

### 💼 Planos e Investimento

| Característica | 🟢 Basic | 🔵 Pro | ⭐ Enterprise |
| :--- | :---: | :---: | :---: |
| **Veículos** | Até 5 | Até 20 | Ilimitado |
| **Usuários** | Até 10 | Até 50 | Ilimitado |
| **Módulos Completos** | ✅ | ✅ | ✅ |
| **Relatórios** | ✅ | ✅ | ✅ |
| **White Label** | ❌ | ❌ | ✅ |
| **Suporte** | Email | Email + Chat | Dedicado 24/7 |
| **SLA** | 99% | 99.5% | 99.9% |
| **Treinamento** | ❌ | Online | Presencial |

---

## 📌 Slide 11 — Próximos Passos

### 🚀 Como Começar

```
1️⃣  AGENDAR DEMONSTRAÇÃO
    ─────────────────────
    → Apresentação personalizada de 30 min
    → Foco nas necessidades da sua organização
    → Tire todas as dúvidas técnicas e comerciais

2️⃣  PERÍODO DE TESTE
    ─────────────────
    → Acesso completo ao sistema por 7 dias
    → Dados de demonstração pré-carregados
    → Reset automático diário (modo demo)

3️⃣  IMPLANTAÇÃO
    ───────────────
    → Setup do ambiente (nuvem ou local)
    → Migração de dados
    → Treinamento da equipe
    → Suporte dedicado na ativação

4️⃣  ACOMPANHAMENTO
    ──────────────────
    → Monitoramento contínuo
    → Atualizações regulares
    → Suporte técnico especializado
```

---

## 📌 Slide 12 — Contato

### 📞 Fale Conosco

```
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║                   🚘 CityMotion                       ║
║                                                       ║
║    🌐 citymotion.com                                  ║
║    📧 contato@citymotion.com                          ║
║    📱 (11) 99999-9999                                 ║
║                                                       ║
║    ─────────────────────────────────────              ║
║                                                       ║
║    \"Mobilidade, transparência e eficiência           ║
║     para a gestão moderna.\"                          ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

---

## 📋 Checklist de Apresentação

### Para o Apresentador:

- [ ] **Slide 1:** Aguardar todos entrarem na sala
- [ ] **Slide 2:** Perguntar sobre dores atuais da gestão de frota
- [ ] **Slide 3:** Validar se o segmento está correto
- [ ] **Slide 4:** Destacar White Label (se aplicável)
- [ ] **Slide 5:** Perguntar qual módulo mais interessa
- [ ] **Slide 6:** Mostrar demo ao vivo se possível
- [ ] **Slide 7:** Enfatizar LGPD e segurança
- [ ] **Slide 8:** Destacar: tudo em uma única porta (3001)
- [ ] **Slide 9:** Alinhar expectativas de roadmap
- [ ] **Slide 10:** Personalizar planos conforme necessidade
- [ ] **Slide 11:** Agendar demonstração ao vivo
- [ ] **Slide 12:** Coletar contatos

---

**CityMotion — Inteligência em mobilidade para a gestão corporativa moderna.**
