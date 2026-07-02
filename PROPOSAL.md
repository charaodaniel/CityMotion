# 🚘 CityMotion — Inteligência em Gestão de Frotas e Mobilidade

**Solução Enterprise para Setor Público e Logística Corporativa.**

O **CityMotion** não é apenas um rastreador de veículos; é um sistema operacional completo para a logística da sua organização. Desenvolvido com o **NexusOS V2**, nossa interface oferece telemetria em tempo real, controle rigoroso de custos e segurança jurídica total para gestores.

---

## 💎 Diferenciais Estratégicos

### 1. Interface de Alta Performance (NexusOS)
Visual focado em legibilidade técnica, utilizando estética de telemetria industrial. Reduz a curva de aprendizado enquanto fornece dados densos de forma organizada para tomadas de decisão rápidas.

### 2. Arquitetura NexusBridge
Tecnologia exclusiva de adaptação que permite ao frontend se conectar a múltiplos bancos de dados de forma transparente. Ideal para organizações que precisam integrar sistemas legados ou rodar em ambientes isolados (como servidores municipais).

### 3. Segurança Nível Bancário
- **Criptografia Bcrypt:** Senhas nunca são armazenadas em texto claro.
- **Autenticação JWT:** Sessões seguras com expiração automática de 8 horas.
- **Rate Limiting:** Proteção contra ataques brute force no login e endpoints sensíveis.
- **CORS Configurável:** Controle preciso de quais domínios podem acessar a API.
- **Auditoria Total:** Cada clique e alteração no sistema é registrado na trilha de auditoria, garantindo transparência para órgãos de controle.

### 4. Multi-Banco de Dados
Suporte nativo para múltiplos motores de persistência, configuráveis diretamente pelo painel de infraestrutura:
- **SQLite3** — Ideal para instalações locais e pendrives.
- **PostgreSQL** — Para produção em nuvem com alta concorrência.
- **MongoDB** — Para dados flexíveis e não estruturados.
- **Supabase** — PostgreSQL gerenciado com API automática.

### 5. Identidade Digital Inviolável
O **Crachá Virtual CityMotion** elimina custos com cartões plásticos. Cada colaborador possui um QR Code dinâmico que valida sua identidade e autorização de condução em tempo real.

---

## 🛠️ Módulos do Ecossistema

- **🛡️ Gestão de Ativos:** Cadastro detalhado da frota com telemetria de quilometragem e status dinâmico (Disponível, Em Viagem, Manutenção).
- **⛽ Módulo de Abastecimento:** Controle fino de consumo por km/l, histórico de postos e integração com financeiro.
- **🔧 Oficina & Manutenção:** Gestão de Ordens de Serviço, pedidos de peças e histórico de revisões preventivas.
- **📅 Escalas e Missões:** Ciclo de vida completo da viagem, desde a solicitação do colaborador até o checklist de chegada do motorista.
- **🏗️ Infraestrutura:** Painel completo para configuração de banco de dados, proxy, DNS, SMTP e credenciais do servidor.
- **⚖️ Conformidade LGPD:** Central de privacidade integrada, garantindo que o tratamento de dados pessoais dos servidores esteja em conformidade com a Lei nº 13.709/2018.

---

## 🗺️ Roadmap de Evolução

### **Fase 1: Fundação & Persistência (Concluído)**
- [x] Motor de persistência SQLite com suporte a múltiplos bancos.
- [x] Camada de segurança JWT/Bcrypt/Rate Limiting/CORS.
- [x] Módulo de Abastecimento e Telemetria básica.
- [x] Console de Administração (Terminal Kernel).
- [x] Painel de Infraestrutura com teste de conexão de bancos.

### **Fase 2: Conectividade & Automação (Concluído)**
- [x] **Notificações Push:** Alertas em tempo real para motoristas sobre novas missões via Nexus-Notification.
- [x] **WebSocket Events:** Eventos de novas solicitações entre frontend e backend.
- [ ] **Integração de Sensores:** Leitura automática de odômetro via sensores IoT.

### **Fase 3: Inteligência Preditiva (2025-2026)**
- [ ] **IA Predictor:** Algoritmo de inteligência artificial para prever manutenções antes de falhas ocorrerem.
- [ ] **Relatórios BI Avançados:** Dashboards customizáveis com Recharts para análise de custo por setor.
- [ ] **HTTPS/TLS:** Certificado SSL e headers de segurança HTTP.

---

## 🏗️ Especificações Técnicas

- **Frontend:** Next.js 15 (Turbopack) + ShadCN UI + Tailwind CSS.
- **Backend:** Node.js Express (Porta 3001) com Rate Limiting e CORS.
- **Banco de Dados:** SQLite3 (local), PostgreSQL, MongoDB ou Supabase (nuvem).
- **Segurança:** JWT + Bcrypt + Rate Limiting + CORS + SQL Injection Protection.
- **RBAC:** Controle de Acesso Baseado em Função com 5 níveis de privilégios.
- **Portabilidade:** Suporte nativo para rodar em Pendrives Persistentes ou Containers Docker em máquinas leves (antiX/Debian).
- **Configuração:** Variáveis de ambiente via `.env` com documentação completa.

---

## 🚀 Solicite uma Demonstração

O CityMotion é uma solução **White Label**, permitindo a aplicação das cores e marca da sua prefeitura ou empresa.

**CityMotion — Mobilidade, transparência e eficiência para a gestão moderna.**
