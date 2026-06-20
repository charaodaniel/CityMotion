
# 🎨 Guia de Design System e UI - NexusOS V2

O CityMotion utiliza o **NexusOS**, um sistema de design focado em interfaces de monitoramento e telemetria logística.

---

## 📐 Princípios de Layout

### Sidebar Inset
A navegação lateral é a âncora do sistema. Ela adapta-se dinamicamente ao cargo do usuário:
- **Root/TI:** Menu "Plataforma" liberado (Nexus, Terminal, Gestão Global).
- **Gestores:** Foco em "Equipe" e "Aprovações".
- **Motoristas:** Visão simplificada de "Missões" e "Checklists".

---

## 🌑 Paleta de Cores (Dark Tech)

Utilizamos variáveis HSL para permitir personalização (White Label):
- **Background:** `zinc-950` (Profundidade e foco).
- **Primary:** Azul Elétrico (Ações principais e telemetria).
- **Accent:** Cores de status (Esmeralda para Disponível, Destrutivo para Manutenção).

---

## 🧩 Componentes Especializados

### 1. Scanlines e CRT Effects
Adicionados via CSS em componentes de Terminal e Cards de Telemetria para evocar uma estética de hardware industrial.

### 2. TUI (Text User Interface)
O Terminal utiliza fontes monoespaçadas (`font-mono`) e prompts interativos para simular um kernel Unix real.

### 3. Crachá Dinâmico
Componente mobile-first com QR Code gerado em tempo real, validado contra a Bridge para identificação instantânea.

---

## 📱 Responsividade SaaS

- **Desktop:** Dashboard estendido com grids de 4 colunas.
- **Tablet:** Tabelas com scroll horizontal protegido.
- **Mobile:** Sidebar recolhida em Drawer e cards empilhados para operação de campo por motoristas.
