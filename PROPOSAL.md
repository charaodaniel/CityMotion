# 🚘 CityMotion — Inteligência em Gestão de Frotas e Mobilidade

**Solução Enterprise para Setor Público e Logística Corporativa.**

O **CityMotion** não é apenas um rastreador de veículos; é um sistema operacional completo para a logística da sua organização. Desenvolvido com **NexusOS**, nossa interface oferece telemetria em tempo real, controle rigoroso de custos e segurança jurídica total para gestores.

---

## 💎 Diferenciais Estratégicos

### 1. Interface de Alta Performance (NexusOS)
Visual focado em legibilidade técnica, utilizando estética de telemetria industrial dark-tech. Notificações em tempo real via **Toast System** elegante, substituindo alertas tradicionais por feedbacks visuais não-intrusivos.

### 2. Dual Engine (SQLite + PostgreSQL)
Suporte nativo a dois motores de banco de dados, configuráveis dinamicamente:
- **SQLite3** — Ideal para instalações locais, servidores municipais e ambientes sem internet constante
- **PostgreSQL** — Para produção em nuvem com alta concorrência (Render, Supabase, Neon)

### 3. Notificações em Tempo Real
**Socket.IO** integrado para comunicação instantânea:
- Notificações push quando uma solicitação é criada ou aprovada
- Atualização de dados sem refresh de página (entity-update)
- Chat interno entre funcionários com mensagens em tempo real
- Badge no sino com contagem de notificações não lidas

### 4. Segurança Nível Bancário
- **Criptografia Bcrypt:** Senhas nunca são armazenadas em texto claro.
- **Autenticação JWT:** Sessões seguras com expiração automática de 8 horas via @fastify/jwt.
- **Rate Limiting:** Proteção contra ataques brute force (100 req/15min global, 10 tentativas/login).
- **CORS Configurável:** Controle preciso de quais domínios podem acessar a API.
- **Zod Validation:** Schemas de validação em todas as rotas e variáveis de ambiente.
- **RBAC:** 6 níveis de permissão (Desenvolvedor Global → Colaborador).

### 5. Deploy Simplificado
- **Docker:** Container único (porta 3001) — API + WebSocket + Frontend SPA + Documentação
- **Render:** Blueprint com PostgreSQL automático + HTTPS
- **On-premise:** Node.js direto para servidores municipais

### 6. Qualidade Garantida
**189+ testes unitários automatizados** com Vitest + jsdom, cobrindo:
- Gerenciamento de estado (Store.js)
- Cliente HTTP (API.js)
- WebSocket (WS.js)
- App Router (roteamento SPA)
- Toast notifications
- Todas as 12 páginas do sistema
- Autenticação (backend)

---

## 🛠️ Módulos do Ecossistema

- **🚗 Gestão de Ativos:** Cadastro detalhado da frota com telemetria de quilometragem, status dinâmico (Disponível, Em Viagem, Manutenção) e filtro por setor.
- **⛽ Módulo de Abastecimento:** Controle de consumo por km/l, histórico por veículo, cálculo automático de valor total.
- **🔧 Manutenção & Peças:** Kanban visual com 3 colunas (Pendente → Em Andamento → Concluído), solicitação de peças vinculada, prioridades.
- **📅 Viagens e Missões:** Ciclo completo — solicitação → aprovação → check-in com KM inicial → check-out com KM final → auditoria.
- **👥 Gestão de Pessoas:** Cadastro completo com matrícula, cargo, setor, aceite LGPD, soft delete/reativação, controle de permissões RBAC.
- **💬 Chat:** Comunicação interna entre funcionários com filtro por setor e indicador de não lidas.
- **📈 Relatórios:** Estatísticas de viagens, gráficos de telemetria com Chart.js, eficiência da frota.
- **⚙️ Configurações:** Aba de Operações (regras de negócio) + Aba de Infraestrutura (DB, CORS, SMTP, segurança, modo demo).

---

## 🗺️ Roadmap de Evolução

### **Fase 1: Fundação & Persistência (Concluído)**
- [x] Motor de persistência dual (SQLite + PostgreSQL)
- [x] Segurança JWT/Bcrypt/Rate Limiting/CORS/Zod
- [x] 12 módulos funcionais (Dashboard, Frota, Pessoas, Viagens, Abastecimento, Manutenção, Escalas, Setores, Chat, Relatórios, Configurações, Terminal Dev)
- [x] Design System NexusOS (dark tech)
- [x] Documentação Swagger OpenAPI em /docs

### **Fase 2: Conectividade & Automação (Concluído)**
- [x] WebSockets com notificações em tempo real (Socket.IO)
- [x] Chat interno entre colaboradores
- [x] Toast notifications (42 alert() substituídos)
- [x] Relatórios com Chart.js e exportação html2pdf
- [x] 189+ testes unitários automatizados (Vitest + jsdom)

### **Fase 3: Inteligência Preditiva (2026)**
- [ ] IA Preditiva para manutenção antes de falhas
- [ ] BI Avançado com dashboards customizáveis
- [ ] Integração Google Maps para otimização de rotas
- [ ] Aplicativo mobile nativo (React Native)

---

## 🏗️ Especificações Técnicas

| Camada | Tecnologia |
| :--- | :--- |
| **Frontend** | SPA HTML/JS/CSS + Tailwind CSS + Chart.js + Lucide Icons |
| **Backend** | Fastify + TypeScript + Drizzle ORM (Porta 3001) |
| **Autenticação** | JWT (@fastify/jwt) + Bcrypt |
| **Segurança** | Rate Limiting + CORS + Zod Validation + RBAC |
| **Tempo Real** | Socket.IO (WebSockets) |
| **Banco Padrão** | SQLite3 via better-sqlite3 (portátil, offline) |
| **Banco Nuvem** | PostgreSQL via node-postgres |
| **Container** | Docker multi-estágio + Docker Compose |
| **Hospedagem** | Render Blueprint, Firebase Studio, On-premise |
| **Qualidade** | 189+ testes Vitest + jsdom |

### Arquitetura Simplificada

```
[Navegador] ← HTTP/WS → [Fastify :3001]
                             ├── API REST (/api/*)
                             ├── WebSocket (Socket.IO)
                             ├── Frontend SPA (/ → public/)
                             └── Documentação (/docs)
                                    │
                             [SQLite / PostgreSQL]
```

**Uma única porta (3001), uma única stack, deploy simplificado.**

---

## 🚀 Solicite uma Demonstração

O CityMotion é uma solução **White Label**, permitindo a aplicação das cores e marca da sua prefeitura ou empresa.

**CityMotion — Mobilidade, transparência e eficiência para a gestão moderna.**
