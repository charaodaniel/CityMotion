
# 🚘 CityMotion - Sistema Inteligente de Gestão de Frota

Bem-vindo ao **CityMotion**, a solução completa para modernizar e otimizar o gerenciamento da frota de veículos da sua prefeitura ou organização.

Desenvolvido para ser intuitivo e eficiente, nosso sistema centraliza o controle de veículos, funcionários, viagens e solicitações em uma plataforma web amigável, garantindo mais organização, transparência e economia.

---

## ✨ Diferenciais Técnicos (NexusOS)

-   **NexusBridge Engine:** Camada de roteamento virtual que permite conectar múltiplos backends de forma transparente para o frontend.
-   **Full Persistence:** Todos os módulos (Viagens, Manutenção, Frota) estão conectados a um banco de dados **SQLite3** real via Node.js.
-   **Data Resiliency:** Sistema de **Auto-Backup** preventivo em cada operação de escrita e política de **Soft Delete** para auditoria.
-   **Admin Console (TUI):** Terminal interativo integrado para monitoramento de hardware (CPU/RAM) e edição direta de banco de dados.

---

## ✅ Funcionalidades de Nível Profissional

### **1. Painel de Controle e Telemetria**
Dashboard dinâmico que exibe métricas reais da frota, fluxo de operações e alertas críticos de prioridade.

### **2. Gestão de Missões (Viagens)**
Fluxo completo de agendamento, checklists de segurança (pré e pós-viagem) e controle automático de odômetro.

### **3. Manutenção e Oficina**
Módulo técnico para abertura de chamados, controle de status (Pendente/Andamento/Concluído) e pedidos de compra de peças integrados.

### **4. Segurança e LGPD**
-   **Crachá Virtual:** Identificação moderna com QR Code dinâmico e validação online.
-   **Controle de Acesso:** Hierarquia baseada em papéis (RBAC) para Admin, Gestor, Motorista e Desenvolvedor.
-   **Termos de Uso:** Banner de consentimento persistente em conformidade com a LGPD.

### **5. Relatórios e Auditoria**
Emissão de relatórios em PDF com filtros avançados e logs de tráfego capturados pelo **Traffic Analyzer** da NexusBridge.

---

## 🔮 Próximos Passos (Roadmap)

-   [x] **Sincronização Total com SQLite:** Implementado via NexusBridge.
-   [x] **Sistema de Backup Automático:** Implementado no servidor Node.js.
-   [ ] **Notificações WebSockets:** Alertas em tempo real para novos pedidos.
-   [ ] **Build Desktop (Electron):** Empacotamento para uso em terminais de garagem.
-   [ ] **Módulo de Abastecimento Inteligente:** Integração com sensores de bomba.

---

**CityMotion — Inteligência em mobilidade para a gestão corporativa moderna.**
