
# 🎨 Guia de Layout e Componentes UI - CityMotion

Este documento descreve a arquitetura visual, o sistema de design e os componentes fundamentais que compõem a interface do CityMotion.

---

## 🏗️ Arquitetura do Layout

O sistema utiliza uma estrutura de **Sidebar Inset**, garantindo que a navegação principal esteja sempre acessível enquanto o conteúdo se adapta dinamicamente.

### 1. Sidebar (Navegação Inteligente)
- **Componente:** `Sidebar` e `SidebarProvider`.
- **Lógica de Renderização:** O menu é filtrado dinamicamente com base no `userRole`.
- **Seções:**
    - **Plataforma (Dev/TI):** Ferramentas de infraestrutura e gestão SaaS.
    - **Operação (Geral):** Módulos do dia a dia da frota (Veículos, Viagens, etc).
    - **Perfil e Suporte:** Ações de conta e documentação.

### 2. Header (Barra de Ações Rápidas)
- **Funcionalidades:**
    - Botão de **Refresh Global** (sincronização com SQLite).
    - Gatilho do **NexusOS Terminal** (visível para Admin/Dev).
    - Central de Notificações.
    - Menu do Usuário (Avatar e Logout).

---

## 🎨 Sistema de Design

### Cores e Temas
O sistema utiliza variáveis CSS HSL definidas em `globals.css` para permitir a personalização total (White Label).
- **Primary:** Azul vibrante para ações principais e identidade.
- **Background:** Escuro profundo (`zinc-950`) para a versão moderna/dark.
- **Accent:** Cores de destaque para badges de status (Verde para disponível, Vermelho para manutenção).

### Tipografia
- **Fonte Principal:** Inter (Sans-serif) para legibilidade de dados.
- **Headlines:** Variantes com `font-headline` para títulos de páginas, garantindo hierarquia visual clara.

---

## 🧩 Componentes Core (ShadCN UI)

Utilizamos a biblioteca **ShadCN UI** (Tailwind + Radix UI) para componentes acessíveis e performáticos:

| Componente | Uso Principal |
| :--- | :--- |
| **Card** | Container base para métricas, listas e itens de frota. |
| **Dialog** | Formulários de cadastro, checklists de viagem e editores TUI. |
| **Table** | Relatórios de faturamento, gestão de funcionários e logs de auditoria. |
| **Tabs** | Separação de visões (ex: Viagens Gerais vs. Escolares). |
| **Badge** | Indicadores visuais de status e prioridade. |
| **Progress** | Monitor de recursos do sistema (CPU/RAM) no terminal. |

---

## 🚀 Componentes Especializados

### 1. DevTerminal (`dev-terminal.tsx`)
Um terminal interativo estilizado em "Retro TUI" que permite:
- Monitoramento de hardware em tempo real.
- Edição de banco de dados via interface de comando.
- Diagnósticos de rede NexusBridge.

### 2. Gráficos de Monitoramento
- **Módulos:** `OverviewChart` e `DriverActivityChart`.
- **Tecnologia:** Recharts integrado com o tema do sistema.
- **Uso:** Dashboards de Admin e Relatórios de Faturamento.

### 3. Crachá Virtual (`BadgePage`)
- **Foco:** Mobile-first e Acesso Público.
- **Componentes:** `QRCodeSVG` dinâmico para validação online instantânea.
- **Layout:** Card vertical otimizado para impressão e compartilhamento.

### 4. LGPDBanner
- Componente de consentimento persistente em `localStorage`.
- Estilizado com `backdrop-blur` para não obstruir a navegação inicial.

---

## 📱 Responsividade
O layout é construído com **Tailwind CSS**, utilizando uma abordagem mobile-first:
- Em telas pequenas, a Sidebar é convertida em um **Drawer** lateral.
- Grades de cards (Veículos/Funcionários) adaptam-se de 1 a 4 colunas automaticamente.
- Tabelas possuem scroll horizontal protegido para não quebrar o layout.
