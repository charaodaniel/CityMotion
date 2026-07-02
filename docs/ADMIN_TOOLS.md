# 🛠️ Ferramentas de Administração e Manutenção - CityMotion

O CityMotion oferece uma suite de ferramentas avançadas para usuários de nível técnico (**Desenvolvedores, TI e Administradores**).

---

## 🏗️ Painel de Infraestrutura

O painel de infraestrutura é a interface central para configuração do sistema. Acesse via **Configurações → Infraestrutura**.

### Banco de Dados
- **Seletor de Motor:** Escolha entre SQLite3, PostgreSQL, MongoDB ou Supabase.
- **Teste de Conexão:** Valida a conexão antes de salvar as configurações.
- **URL de Conexão:** Campo para informar a string de conexão do banco.
- **Status:** Exibe o motor ativo e a porta do backend.

### Proxy & CORS
- **Origens Permitidas:** Lista de domínios que podem acessar a API (separados por vírgula).
- **Rate Limiting:** Status da proteção contra brute force (global e login).

### SMTP (E-mail)
- **Configuração Completa:** Host, porta, usuário, senha e TLS/SSL.
- **Teste de Conexão:** Verifica as credenciais antes de salvar.
- **Uso:** Envio de e-mails de recuperação de senha e notificações.

### Servidor & Segurança
- **Porta do Backend:** Configuração da porta do servidor Express.
- **Modo Demonstração:** Toggle para ativar/desativar reset diário dos dados.
- **Status de Segurança:** Indicadores visuais de JWT, CORS e Rate Limiting.

---

## 🖥️ NexusOS Terminal (Kernel Shell)

O console do CityMotion não é apenas um simulador visual, mas uma interface de comando real conectada ao backend.

### Como Acessar
- Clique no ícone `>_` no cabeçalho (apenas visível para Admin/Dev).
- Ou acesse diretamente via `/terminal`.

### Comandos de Manutenção

| Comando | Nível | Descrição |
| :--- | :--- | :--- |
| `nexus-info` | Público | Exibe dados do kernel, arquitetura e operador logado. |
| `nexus-health` | Público | Roda diagnósticos de integridade na Bridge e Banco. |
| `nexus-db-stats` | Público | Mostra a contagem de registros em cada tabela SQLite. |
| `nexus-logdb` | TI/Admin | Lista a trilha de auditoria em tempo real. |
| `nexus-integrity` | TI/Admin | Verificação de integridade do banco (PRAGMA). |
| `nexus-db-reset` | **ROOT** | **Operação Crítica:** Apaga o banco e restaura dados de fábrica. |

### Protocolo de Segurança "sudo"
Comandos destrutivos exigem:
1. Confirmação explícita (`y/n`).
2. Digitação da senha do usuário logado no próprio terminal (validação via Bcrypt no backend).

---

## 📊 Auditoria Inviolável

Cada vez que um registro de funcionário, veículo ou viagem é alterado, o backend registra uma entrada na tabela `audit_logs`:
- **Timestamp:** Data e hora exata.
- **Identidade:** Nome e cargo (extraído do JWT).
- **Ação:** INSERT, UPDATE, SOFT_DELETE, etc.
- **Detalhes:** JSON contendo os dados alterados.

---

## 🌉 NexusBridge Control

Interface visual para monitorar a saúde da ponte entre sistemas (`/nexus`):
- **Traffic Analyzer:** Monitora latência e status HTTP de cada chamada.
- **Mapeamento de Rotas:** Visualiza quais endpoints virtuais apontam para quais serviços reais.
- **Console de Teste:** Permite executar requisições manuais para debugar o backend.

---

## 🗄️ Gerenciamento do Banco

### SQLite (Local)
- O banco de dados reside em `backend/database/citymotion.db`.
- **Portabilidade:** Ideal para instalações locais e totens sem dependência de internet constante.

### PostgreSQL / Supabase (Nuvem)
- Configure a URL de conexão no painel de infraestrutura ou via variável `DATABASE_URL` no `.env`.
- **Vantagens:** Alta concorrência, backup automático, escalabilidade.

### Reset do Banco
```bash
# Via terminal
cd backend && npm run db:init

# Via NexusOS Terminal (ROOT)
nexus-db-reset
```

---

## 🔒 Resumo de Segurança

| Recurso | Descrição |
| :--- | :--- |
| JWT | Tokens com expiração de 8 horas |
| Bcrypt | Hashing irreversível de senhas (salt 10) |
| Rate Limiting | 100 req/15min (global), 10 tentativas/15min (login) |
| CORS | Origens permitidas configuráveis via `.env` |
| SQL Injection | Queries parametrizadas e sanitização de inputs |
| Auditoria | Log automático de todas as alterações no banco |
