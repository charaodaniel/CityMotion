
# 🚘 CityMotion - Sistema SaaS de Gestão Inteligente de Frota

O **CityMotion** é uma solução completa de software como serviço (SaaS) desenvolvida para modernizar e otimizar o gerenciamento de frotas veiculares em organizações de qualquer porte — desde prefeituras e órgãos públicos até empresas privadas de logística e serviços.

Desenvolvido com uma arquitetura desacoplada e modular, o sistema centraliza o controle de veículos, colaboradores, viagens e manutenções em uma plataforma intuitiva e de alta segurança.

---

## ✨ Diferenciais e Tecnologias

- **Next.js 15 (App Router):** Performance de ponta com React Server Components.
- **NexusBridge Architecture:** Camada intermediária de adaptação que permite conectar o frontend a múltiplos backends de forma transparente via roteamento virtual.
- **Segurança Enterprise:** Autenticação via **JWT (JSON Web Tokens)** e criptografia de senhas com **Bcrypt**, garantindo que o backend valide cada operação de escrita.
- **Persistência Real:** Banco de dados **SQLite3** conectado via Node.js, com suporte a transações e backups automáticos.
- **Multi-Empresa e Multi-Setor:** Suporte nativo a hierarquias complexas para ambientes SaaS.
- **Admin Console (Kernel Shell):** Terminal interativo de manutenção (estilo TTY) com acesso root protegido para diagnósticos de hardware e banco.
- **Design System NexusOS V2:** Interface high-tech com telemetria, scanlines e visual focado em legibilidade de dados logísticos.

---

## 🛠️ Arquitetura do Sistema

O CityMotion utiliza o conceito de **NexusBridge** para garantir flexibilidade total:

1. **Frontend:** React + Next.js (Porta 9002).
2. **NexusBridge Engine:** Motor de roteamento no Next.js que resolve chamadas para diferentes fontes de dados.
3. **Backend Core:** Servidor Express.js rodando em Node.js (Porta 3001).
4. **Camada de Dados:** SQLite3 com política de **Soft Delete** e logs de auditoria automáticos.

---

## ✅ Documentação Adicional

- [🚀 Referência da API Backend](./backend/API_REFERENCE.md)
- [📊 Diagramas UML e Arquitetura](./docs/DIAGRAMS.md)
- [🎨 Guia de UI e Layout](./docs/UI_LAYOUT_GUIDE.md)
- [🛠️ Ferramentas de Administração](./docs/ADMIN_TOOLS.md)
- [🏗️ Guia de Implementação do Backend](./docs/BACKEND_GUIDE.md)

---

## 🚀 Como Executar o Projeto (Desenvolvimento)

### Pré-requisitos
- Node.js 18+ instalado.

### Passo 1: Iniciar o Ecossistema (Frontend + Backend)
```bash
npm install
npm run dev
```
O sistema iniciará automaticamente o frontend na porta `9002` e o backend na porta `3001`.

### Passo 2: Inicializar o Banco de Dados (Primeira Execução)
Caso os dados não apareçam ou o login falhe, rode o script de inicialização para gerar o arquivo SQLite e os hashes de senha:
```bash
cd backend
npm run db:init
```

---

**CityMotion — Inteligência em mobilidade para a gestão corporativa moderna.**
