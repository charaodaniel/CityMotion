
# 📋 CityMotion - Roadmap e Lista de Tarefas

Este arquivo organiza as funcionalidades construídas e os próximos passos do projeto.

## ✅ Funcionalidades Implementadas

### **Arquitetura e Backend**
- [x] **NexusBridge Core:** Camada de adaptação de rotas para multi-backend via JSON.
- [x] **SQLite3 Integration:** Banco de dados real configurado para persistência de dados.
- [x] **Segurança Profissional:** Hashing de senhas com **Bcrypt** e autenticação via **JWT**.
- [x] **RBAC no Servidor:** Backend valida privilégios de usuário diretamente no Token, não dependendo apenas do frontend.
- [x] **Admin Console (TTY):** Terminal textual interativo com logs de sistema e comandos root.

### **Gestão e Operações**
- [x] **Módulo de Manutenção:** Fluxo completo de oficina, OS e pedido de peças.
- [x] **SaaS Multitenancy:** Painel global para gerenciamento de múltiplas organizações clientes.
- [x] **Gestão de Missões:** Ciclo de vida completo da viagem com checklists de saída/chegada.
- [x] **Crachá Virtual:** Identificação funcional com QR Code dinâmico e validação online.
- [x] **Notificações Push:** Sistema de alertas imediatos para novos eventos operacionais.

### **Segurança e Identidade**
- [x] **LGPD:** Banner de consentimento persistente e central de privacidade de dados.
- [x] **Auditoria:** Registro automático de todas as alterações (INSERT/UPDATE/DELETE) no banco de dados.
- [x] **Proteção Root:** Desafios de senha (sudo) para comandos destrutivos no terminal.

## 🛠️ Próximos Passos Sugeridos

- [ ] **Módulo de Abastecimento:** Integração com sensores de bomba e controle de média de consumo.
- [ ] **WebSockets:** Notificações em tempo real para gestores quando novos pedidos de viagem são criados.
- [ ] **Build Desktop (Electron):** Empacotamento da aplicação para uso em totens de garagem.
- [ ] **Relatórios Avançados:** Gráficos de telemetria de longo prazo usando Recharts com dados reais do SQLite.

---
**CityMotion — Mobilidade, transparência e eficiência para a gestão moderna.**
