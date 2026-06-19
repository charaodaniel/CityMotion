
# 📋 CityMotion - Roadmap e Lista de Tarefas

Este arquivo organiza as funcionalidades construídas e os próximos passos do projeto.

## ✅ Funcionalidades Implementadas

### **Arquitetura e Backend**
- [x] **NexusBridge:** Camada de adaptação de rotas para multi-backend via JSON.
- [x] **SQLite3 Integration:** Banco de dados real configurado para persistência de dados.
- [x] **Backend Node.js:** Servidor Express robusto servindo dados e autenticação.
- [x] **Script SQL:** Gerador de banco de dados automático (`db:init`).
- [x] **Auto-Start:** Configuração para iniciar Frontend e Backend simultaneamente com `npm run dev`.

### **Gestão e Operações**
- [x] **Módulo de Mecânica:** Fluxo completo de manutenção e compra de peças.
- [x] **SaaS Generalization:** Interface e termos adaptados para qualquer tipo de organização.
- [x] **Multi-setor para Gestores:** Seleção de unidade para usuários com múltiplas responsabilidades.
- [x] **Sistema de Notificações:** Alertas em tempo real para novos pedidos e viagens.

### **Segurança e Identidade**
- [x] **LGPD:** Banner de consentimento e política de privacidade.
- [x] **Crachá Virtual:** Identificação funcional com QR Code dinâmico corrigida.
- [x] **Perfis SaaS:** Hierarquia de permissões para Admin, Gestor, Motorista, Colaborador e Mecânico.

## 🛠️ Próximos Passos Sugeridos

- [ ] **Migrar Frontend Progressivamente:** Alterar gradualmente as funções de mutação no `AppProvider` para usarem a ponte `/api/nexus/*`.
- [ ] **Mapeamento Dinâmico de IDs:** Implementar suporte a parâmetros `:id` na engine do NexusBridge.
- [ ] **Gerador de Logs da Ponte:** Salvar histórico de todas as transações que passam pelo NexusBridge no SQLite.
- [ ] **Upload de Arquivos Real:** Conectar os campos de foto do frontend para salvar arquivos físicos no servidor.

---
**CityMotion — Mobilidade, transparência e eficiência para a gestão moderna.**
