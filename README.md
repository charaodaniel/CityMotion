
# 🚘 CityMotion - Sistema SaaS de Gestão Inteligente de Frota

O **CityMotion** é uma solução completa de software como serviço (SaaS) desenvolvida para modernizar e otimizar o gerenciamento de frotas veiculares em organizações de qualquer porte — desde prefeituras e órgãos públicos até empresas privadas de logística e serviços.

Desenvolvido com uma arquitetura desacoplada e modular, o sistema centraliza o controle de veículos, colaboradores, viagens e manutenções em uma plataforma intuitiva e segura.

---

## ✨ Diferenciais e Tecnologias

- **Next.js 15 (App Router):** Performance de ponta e experiência de usuário fluida.
- **NexusBridge Architecture:** Camada intermediária de adaptação que permite conectar o frontend a múltiplos backends (Node.js, Legados, APIs externas) sem alterar o código do cliente.
- **Multi-Empresa e Multi-Setor:** Suporte a hierarquias complexas de departamentos e unidades de negócio.
- **Admin Console (btop style):** Terminal integrado para manutenção e monitoramento de hardware em tempo real.
- **Design System Profissional:** Construído com Tailwind CSS e componentes ShadCN UI.
- **Desktop Ready:** Estrutura integrada com Electron.

---

## 🛠️ Arquitetura do Sistema

O CityMotion utiliza o conceito de **NexusBridge** para garantir flexibilidade total:

1. **Frontend:** React + Next.js rodando na Vercel ou em ambiente local.
2. **NexusBridge:** Motor de roteamento que resolve chamadas para diferentes fontes de dados via JSON de configuração.
3. **Backend Principal:** Servidor Express.js rodando em Node.js.
4. **Banco de Dados:** SQLite3 (baseado em arquivo), ideal para implementações rápidas e Build Desktop.

---

## ✅ Documentação Adicional

- [🚀 Guia do Backend e API](./docs/BACKEND_GUIDE.md)
- [🛠️ Ferramentas de Administração e Terminal](./docs/ADMIN_TOOLS.md)
- [🛡️ Política de Privacidade e LGPD](./src/app/(app)/privacy/page.tsx)

---

## 🚀 Como Executar o Projeto (Desenvolvimento)

### Pré-requisitos
- Node.js instalado.

### Passo 1: Iniciar Tudo (Frontend + Backend)
```bash
npm install
npm run dev
```
O sistema iniciará automaticamente o frontend na porta `9002` e o backend na porta `3001`.

### Passo 2: Inicializar o Banco de Dados (Primeira Execução)
Caso os dados não apareçam, abra um terminal e rode:
```bash
cd backend
npm run db:init
```

---

**CityMotion — Inteligência em mobilidade para a gestão corporativa moderna.**
