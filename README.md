# 🚘 CityMotion - Sistema SaaS de Gestão Inteligente de Frota

O **CityMotion** é uma solução completa de software como serviço (SaaS) desenvolvida para modernizar e otimizar o gerenciamento de frotas veiculares em organizações de qualquer porte — desde prefeituras e órgãos públicos até empresas privadas de logística e serviços.

Desenvolvido com uma arquitetura desacoplada e modular, o sistema centraliza o controle de veículos, colaboradores, viagens e manutenções em uma plataforma intuitiva e de alta segurança.

---

## ✨ Diferenciais e Tecnologias

- **Next.js 15 (App Router):** Performance de ponta com React Server Components e Turbopack.
- **NexusBridge Architecture:** Camada intermediária de adaptação que permite conectar o frontend a múltiplos backends de forma transparente via roteamento virtual.
- **Segurança Enterprise:** Autenticação via **JWT (JSON Web Tokens)**, criptografia de senhas com **Bcrypt**, **Rate Limiting** e **CORS configurável**.
- **Multi-Banco de Dados:** Suporte nativo a **SQLite3**, **PostgreSQL**, **MongoDB** e **Supabase**, com teste de conexão integrado no painel de infraestrutura.
- **Painel de Infraestrutura:** Interface completa para gerenciar bancos de dados, proxy/CORS, SMTP, DNS e credenciais do servidor.
- **Multi-Empresa e Multi-Setor:** Suporte nativo a hierarquias complexas para ambientes SaaS.
- **Admin Console (Kernel Shell):** Terminal interativo de manutenção (estilo TTY) com acesso root protegido para diagnósticos de hardware e banco.
- **Design System NexusOS V2:** Interface high-tech com telemetria, scanlines e visual focado em legibilidade de dados logísticos.

---

## 🛠️ Arquitetura do Sistema

O CityMotion utiliza o conceito de **NexusBridge** para garantir flexibilidade total:

1. **Frontend:** React + Next.js (Porta 9002).
2. **NexusBridge Engine:** Motor de roteamento no Next.js que resolve chamadas para diferentes fontes de dados.
3. **Backend Core:** Servidor Express.js rodando em Node.js (Porta 3001).
4. **Camada de Dados:** SQLite3 (local) ou PostgreSQL/MongoDB/Supabase (nuvem) com logs de auditoria automáticos.

---

## 🔒 Segurança

| Recurso | Status |
| :--- | :--- |
| JWT com expiração de 8h | ✅ Ativo |
| Bcrypt (hashing de senhas) | ✅ Ativo |
| CORS configurável via `.env` | ✅ Ativo |
| Rate Limiting (global + login) | ✅ Ativo |
| Proteção contra SQL Injection | ✅ Ativo |
| Reset diário apenas em modo demo | ✅ Ativo |
| Auditoria automática de alterações | ✅ Ativo |

---

## 📦 Variáveis de Ambiente

O CityMotion utiliza um arquivo `.env` para configuração. Copie o `.env.example` para `.env`:

```bash
cp .env.example .env
```

| Variável | Obrigatória | Descrição |
| :--- | :---: | :--- |
| `JWT_SECRET` | ✅ | Chave secreta para assinatura de tokens JWT |
| `PORT` | ❌ | Porta do backend (padrão: 3001) |
| `DATABASE_URL` | ❌ | URL de conexão do banco (vazio = SQLite local) |
| `CORS_ORIGIN` | ❌ | Origens permitidas separadas por vírgula |
| `DEMO_MODE` | ❌ | `true` ativa reset diário dos dados |
| `SMTP_HOST` | ❌ | Servidor SMTP para envio de e-mails |
| `SMTP_PORT` | ❌ | Porta SMTP (padrão: 587) |
| `SMTP_USER` | ❌ | Usuário SMTP |
| `SMTP_PASS` | ❌ | Senha SMTP |
| `SMTP_SECURE` | ❌ | Usar TLS/SSL (`true`/`false`) |

---

## 🚀 Como Executar o Projeto (Desenvolvimento)

### Pré-requisitos
- Node.js 18+ instalado.

### Passo 1: Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Edite o .env e defina pelo menos o JWT_SECRET
```

### Passo 2: Iniciar o Ecossistema (Frontend + Backend)
```bash
npm install
npm run dev
```
O sistema iniciará automaticamente o frontend na porta `9002` e o backend na porta `3001`.

### Passo 3: Inicializar o Banco de Dados (Primeira Execução)
Caso os dados não apareçam ou o login falhe, rode o script de inicialização:
```bash
cd backend
npm run db:init
```

### Credenciais Padrão (Desenvolvimento)
| Perfil | E-mail | Senha |
| :--- | :--- | :--- |
| Desenvolvedor Root | `dev@dev.com` | `123456789` |
| Administrador | `admin@citymotion.com` | `123456` |
| Motorista | `driver@citymotion.com` | `123456` |

---

## 🐳 Docker

```bash
docker-compose up -d
```

O container expõe as portas `9002` (frontend) e `3001` (backend). O banco de dados é persistido em `./backend/database/`.

---

## 📊 Módulos do Sistema

- **📊 Dashboard:** Painel de controle adaptativo por perfil de usuário.
- **🚗 Frota:** Gestão completa de veículos com status e telemetria.
- **👥 Funcionários:** Cadastro, perfis e hierarquia de accesso.
- **🗓️ Missões:** Ciclo de vida completo da viagem com checklists.
- **⛽ Abastecimento:** Controle de consumo e histórico por veículo.
- **🔧 Manutenção:** Ordens de serviço e pedidos de peças.
- **📅 Escalas:** Agenda de trabalho e plantões.
- **💬 Chat:** Comunicação interna entre colaboradores.
- **💳 Crachá Virtual:** Identificação com QR Code dinâmico.
- **🏗️ Infraestrutura:** Painel de configuração de banco, proxy, DNS e SMTP.

---

## ✅ Documentação Adicional

- [🚀 Referência da API Backend](./backend/API_REFERENCE.md)
- [📊 Diagramas UML e Arquitetura](./docs/DIAGRAMS.md)
- [🎨 Guia de UI e Layout](./docs/UI_LAYOUT_GUIDE.md)
- [🛠️ Ferramentas de Administração](./docs/ADMIN_TOOLS.md)
- [🏗️ Guia de Implementação do Backend](./docs/BACKEND_GUIDE.md)
- [📋 Roadmap e Tarefas](./TODO.md)
- [📝 Proposta do Produto](./PROPOSAL.md)

---

**CityMotion — Inteligência em mobilidade para a gestão corporativa moderna.**
