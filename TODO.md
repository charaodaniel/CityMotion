# 📋 CityMotion - Roadmap e Lista de Tarefas

Este arquivo organiza as funcionalidades construídas e os próximos passos do projeto.

---

## ✅ Funcionalidades Implementadas

### **Arquitetura e Backend**
- [x] **NexusBridge Core:** Camada de adaptação de rotas para multi-backend via JSON.
- [x] **SQLite3 Integration:** Banco de dados real configurado para persistência de dados.
- [x] **Multi-Banco de Dados:** Suporte a SQLite3, PostgreSQL, MongoDB e Supabase.
- [x] **Segurança Profissional:** Hashing de senhas com **Bcrypt** e autenticação via **JWT**.
- [x] **RBAC no Servidor:** Backend valida privilégios de usuário diretamente no Token.
- [x] **Admin Console (TTY):** Terminal textual interativo com logs de sistema e comandos root.

### **Segurança e Proteção**
- [x] **CORS Configurável:** Origens permitidas definidas via variável de ambiente `CORS_ORIGIN`.
- [x] **Rate Limiting:** Proteção global (100 req/15min) e dedicada ao login (10 tentativas/15min).
- [x] **Proteção SQL Injection:** Queries parametrizadas e sanitização de inputs em todos os endpoints.
- [x] **Modo Demo Seguro:** Reset diário de dados apenas quando `DEMO_MODE=true` está definido.
- [x] **Variáveis de Ambiente:** Arquivo `.env.example` documentado e `.env` funcional para desenvolvimento.

### **Gestão e Operações**
- [x] **Módulo de Manutenção:** Fluxo completo de oficina, OS e pedido de peças.
- [x] **SaaS Multitenancy:** Painel global para gerenciamento de múltiplas organizações clientes.
- [x] **Gestão de Missões:** Ciclo de vida completo da viagem com checklists de saída/chegada.
- [x] **Crachá Virtual:** Identificação funcional com QR Code dinâmico e validação online.
- [x] **Notificações Push:** Sistema de alertas imediatos para novos eventos operacionais.

### **Infraestrutura**
- [x] **Painel de Infraestrutura:** Interface completa para configuração de banco, proxy, SMTP e servidor.
- [x] **Teste de Conexão DB:** Validação de conexão com SQLite, PostgreSQL, MongoDB e Supabase.
- [x] **Teste SMTP:** Verificação de credenciais de servidor de e-mail antes de salvar.
- [x] **Gerenciamento de .env:** Leitura e escrita segura de variáveis de ambiente pelo painel.
- [x] **NexusBridge Config:** Rota para visualizar e atualizar configuração de roteamento.

### **LGPD e Conformidade**
- [x] **LGPD:** Banner de consentimento persistente e central de privacidade de dados.
- [x] **Auditoria:** Registro automático de todas as alterações (INSERT/UPDATE/DELETE) no banco de dados.
- [x] **Proteção Root:** Desafios de senha (sudo) para comandos destrutivos no terminal.

---

## 🛠️ Próximos Passos Sugeridos

### Segurança
- [ ] **HTTPS/TLS:** Configurar reverse proxy (nginx/caddy) com certificado SSL.
- [ ] **Refresh Token:** Implementar renovação automática de tokens JWT.
- [ ] **Testes Automatizados:** Criar testes para endpoints de autenticação e infraestrutura.

### Funcionalidades
- [ ] **WebSockets:** Notificações em tempo real para gestores quando novos pedidos de viagem são criados.
- [ ] **Paginação:** Adicionar paginação em endpoints de listagem para suportar grandes volumes de dados.
- [ ] **Relatórios Avançados:** Gráficos de telemetria de longo prazo usando Recharts com dados reais.

### Infraestrutura
- [ ] **Docker Healthcheck:** Adicionar `HEALTHCHECK` ao Dockerfile.
- [ ] **Backup Automático:** Implementar backup periódico do SQLite para storage externo.
- [ ] **Monitoramento:** Integrar Sentry ou Datadog para monitoramento de erros.
- [ ] **Build Desktop (WPA):** Empacotamento da aplicação para uso em totens de garagem.

---

**CityMotion — Mobilidade, transparência e eficiência para a gestão moderna.**
