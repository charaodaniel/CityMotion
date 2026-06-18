
# 🚘 CityMotion - Sistema SaaS de Gestão Inteligente de Frota

O **CityMotion** é uma solução completa de software como serviço (SaaS) desenvolvida para modernizar e otimizar o gerenciamento de frotas veiculares em organizações de qualquer porte — desde prefeituras e órgãos públicos até empresas privadas de logística e serviços.

Desenvolvido com uma arquitetura desacoplada e modular, o sistema centraliza o controle de veículos, colaboradores, viagens e manutenções em uma plataforma intuitiva e segura.

---

## ✨ Diferenciais e Tecnologias

- **Next.js 15 (App Router):** Performance de ponta e experiência de usuário fluida.
- **NexusBridge Architecture:** Camada intermediária de adaptação que permite conectar o frontend a múltiplos backends (Node.js, Legados, APIs externas) sem alterar o código do cliente.
- **Multi-Empresa e Multi-Setor:** Suporte a hierarquias complexas de departamentos e unidades de negócio.
- **Design System Profissional:** Construído com Tailwind CSS e componentes ShadCN UI para uma interface moderna e responsiva.
- **Desktop Ready:** Estrutura integrada com Electron para funcionamento como aplicativo desktop.

---

## 🛠️ Arquitetura do Sistema

O CityMotion utiliza o conceito de **NexusBridge** para garantir flexibilidade total:

1. **Frontend:** React + Next.js rodando na Vercel ou em ambiente local.
2. **NexusBridge:** Motor de roteamento que resolve chamadas para diferentes fontes de dados.
3. **Backend Principal:** Servidor Express.js rodando em Node.js.
4. **Banco de Dados:** SQLite3 (baseado em arquivo), ideal para implementações rápidas em intranets e servidores locais.

---

## ✅ Funcionalidades Principais

### **1. Painel de Controle Dinâmico**
Interface personalizada para Administradores, Gestores de Unidade, Motoristas e Mecânicos.

### **2. Fluxo de Viagens e Operações**
- Solicitação e aprovação de transportes.
- Painel Kanban visual para acompanhamento de viagens em tempo real.
- Checklists digitais obrigatórios (pré e pós-viagem).
- Registro de abastecimentos e relatórios de sinistros.

### **3. Gestão de Recursos (ERP de Frota)**
- Gestão completa de veículos (quilometragem, status, documentação).
- Cadastro de colaboradores e controle de CNH.
- Escalas de trabalho e plantões com suporte a recorrência.

### **4. Módulo de Mecânica Especializado**
- Dashboard exclusivo para técnicos.
- Abertura e controle de ordens de serviço.
- Solicitação de compra de peças integrada ao fluxo de manutenção.

### **5. Conformidade e Segurança (LGPD)**
- Banner de consentimento e política de privacidade integrada.
- Crachá virtual individual com QR Code dinâmico para identificação funcional.

---

## 🚀 Como Executar o Projeto (Desenvolvimento)

### Pré-requisitos
- Node.js instalado.

### Passo 1: Configurar o Backend e Banco de Dados
```bash
cd backend
npm install
# Inicialize o banco de dados SQLite com os dados de teste
npm run db:init
# Inicie o servidor backend (rodando em http://localhost:3001)
npm run dev
```

### Passo 2: Iniciar o Frontend (Next.js)
Abra um novo terminal na raiz do projeto:
```bash
npm install
npm run dev
```
Acesse: `http://localhost:9002`

### Passo 3: Versão Desktop (Opcional)
Para rodar como aplicativo desktop via Electron:
```bash
npm run electron:dev
```

---

**CityMotion — Inteligência em mobilidade para a gestão corporativa moderna.**
