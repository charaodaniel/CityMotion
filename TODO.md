
# 📋 CityMotion - Lista de Tarefas (Recapitulação e Roadmap)

Este arquivo organiza o que já foi construído e o que ainda pode ser explorado no CityMotion.

## ✅ Funcionalidades Implementadas (Protótipo Completo)

### **Arquitetura e Integração**
- [x] **NexusBridge:** Implementada camada de adaptação de rotas para multi-backend.
- [x] **Configuração via JSON:** Gerenciamento de endpoints e backends centralizado.
- [x] **Transformers:** Estrutura inicial para normalização de respostas de API.

### **Autenticação e Perfis**
- [x] **Login Simulado/Real:** Suporte a diferentes fluxos de acesso.
- [x] **Hierarquia de Permissões:** Admin, Gestor, Motorista, Funcionário e Mecânico.
- [x] **Multi-setor:** Seleção de unidade para gestores híbridos.
- [x] **Notificações:** Alertas em tempo real para novos pedidos e viagens.

### **Dashboard e UI/UX**
- [x] **Layout Adaptativo:** Sidebar inteligente por cargo.
- [x] **Modo SaaS:** Linguagem genérica para atender diversos tipos de empresas.
- [x] **LGPD:** Banner de consentimento e política de privacidade integrada.

### **Operações de Frota**
- [x] **Painel Kanban:** Gestão visual de viagens.
- [x] **Checklists Digitais:** Verificação de segurança pré e pós-trajeto.
- [x] **Mecânica:** Dashboard exclusivo e fluxo de ordens de serviço.

## 🛠️ Próximos Passos Sugeridos

- [ ] **Migrar Frontend para NexusBridge:** Alterar as chamadas `fetch` no `AppProvider` para usarem `/api/nexus/*`.
- [ ] **Mapeamento de Parâmetros Dinâmicos:** Implementar suporte a `:id` na engine do NexusBridge.
- [ ] **Middlewares de Log:** Adicionar registro de todas as transações que passam pela ponte.

---
**CityMotion — Mobilidade, transparência e eficiência para a gestão moderna.**
