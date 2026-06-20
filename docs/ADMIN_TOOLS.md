
# 🛠️ Ferramentas de Administração e Manutenção - CityMotion

O CityMotion oferece uma suite de ferramentas avançadas para usuários de nível técnico (**Desenvolvedores, TI e Administradores**).

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

Interface visual para monitorar a saúde da ponte entre sistemas:
- **Traffic Analyzer:** Monitora latência e status HTTP de cada chamada.
- **Mapeamento de Rotas:** Visualiza quais endpoints virtuais apontam para quais serviços reais.
- **Console de Teste:** Permite executar requisições manuais para debugar o backend.

---

## 🗄️ Gerenciamento do Banco (SQLite)

O banco de dados reside em `backend/database/citymotion.db`. 
- **Auto-Backup:** O sistema cria um arquivo `.bak` antes de qualquer alteração estrutural.
- **Portabilidade:** Ideal para instalações locais e totens sem dependência de internet constante.
