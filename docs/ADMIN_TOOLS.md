# 🛠️ Ferramentas de Administração e Manutenção - CityMotion

Este guia descreve as ferramentas avançadas integradas ao CityMotion para desenvolvedores e administradores de frota que preferem interações via linha de comando ou monitoramento em tempo real.

---

## 🖥️ Terminal de Desenvolvedor (Admin Console)

Acessível através do ícone de terminal (`>_`) no cabeçalho superior para usuários administradores.

### Monitor de Recursos (estilo btop)
No topo do terminal, você verá barras de uso em tempo real:
- **CPU Load:** Uso atual do processador no servidor.
- **Memory:** Consumo de memória RAM (Usada / Total).
- **Uptime:** Tempo de atividade ininterrupta do servidor backend.

### Comandos Disponíveis

| Comando | Parâmetros | Descrição |
| :--- | :--- | :--- |
| `help` | - | Lista todos os comandos e suas descrições. |
| `top` / `btop` | - | Força a atualização dos dados de recursos de hardware. |
| `status` | - | Verifica a saúde da Engine NexusBridge e a conexão com o SQLite. |
| `whoami` | - | Mostra informações técnicas do seu usuário (ID, Setor, Role). |
| `nexus` | `<path>` | Executa uma consulta **GET** na ponte (Ex: `nexus users`). |
| `nexus-post` | `<path> <body>` | Executa uma inserção **POST** (Ex: `nexus-post users {"name":"Novo"}`). |
| `db-reset` | - | Realiza um **Hard Reset** no backend e restaura o banco original. |
| `clear` / `cls` | - | Limpa o histórico de mensagens do console. |
| `exit` | - | Fecha a janela do terminal. |

---

## ⚡ CLI de Emergência (Terminal da Máquina)

Caso a interface web esteja inacessível, você pode gerenciar o sistema diretamente do terminal do seu computador (VS Code / Terminal Linux).

### Como usar
Navegue até a raiz do projeto e use o comando `node nexus-cli.js`.

**Exemplos:**
- **Verificar status:** `node nexus-cli.js status`
- **Consultar banco de dados:** `node nexus-cli.js test/db-employees`
- **Inserir dados (CRUD):** `node nexus-cli.js test/db-employees POST '{"name": "Admin Emergência", "role": "Administrador"}'`

---

## 🌉 NexusBridge Control

Localizado no menu lateral sob a opção **NexusBridge**.
- **Visualização de Backends:** Veja quais serviços externos estão configurados.
- **Mapeamento de Rotas:** Entenda como os paths virtuais são convertidos em targets reais.
- **Transformers:** Verifique quais dados estão sendo normalizados (ex: Auth Transformer).

---

## 🗄️ Banco de Dados (SQLite)

O banco de dados é um arquivo único localizado em `backend/database/citymotion.db`.

### Manutenção Manual
Você pode usar qualquer cliente SQLite (como DB Browser for SQLite) para abrir o arquivo, ou usar os comandos `db-reset` do terminal para restaurar o estado de fábrica com os dados de teste originais.
