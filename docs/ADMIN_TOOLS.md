
# 🛠️ Ferramentas de Administração e Manutenção - CityMotion

Este guia detalha os recursos avançados para administradores e desenvolvedores.

---

## 🖥️ Terminal de Desenvolvedor (NexusBridge Console)

Acessível pelo ícone `>_` no cabeçalho. Todos os comandos seguem o padrão `nexus-*`.

### Monitor de Recursos (estilo btop)
O terminal exibe em tempo real:
- **CPU Load:** Carga de processamento do backend Node.js.
- **Memory:** Uso real da memória RAM (GB/Porcentagem).
- **Uptime:** Tempo de atividade ininterrupta do servidor.

### Comandos Principais

| Comando | Descrição |
| :--- | :--- |
| `nexus-help` | Lista todos os comandos e aliases. |
| `nexus-info` | Exibe dados de ambiente e hardware do servidor. |
| `nexus-status` | Testa conectividade da Engine e do Banco SQLite. |
| `nexus-resources` | Força a atualização do monitor btop. |
| `nexus-db-stats` | Mostra contagem de registros por tabela no SQLite. |
| `nexus-employees` | Lista todos os funcionários diretamente do banco. |
| `nexus-employee-info <id>` | Abre o editor interativo (TUI) para um funcionário. |
| `nexus-db-reset` | **Hard Reset:** Reinicia o backend e restaura o banco de fábrica. |
| `nexus-terminal-clear` | Limpa o histórico de comandos. |

---

## 🌉 NexusBridge Control

Localizado no menu lateral (acesso restrito a DEV e TI).
- **Visualização de Backends:** Monitora serviços conectados.
- **Mapa de Rotas:** Visualiza mapeamentos virtuais em tempo real.
- **Transformers:** Verifica normalização de payloads (ex: Auth).

---

## ☕ Easter Eggs e Segurança

O terminal inclui funções especiais para testes de curiosidade (Honeypots):
- `nexus-coffee`: Pausa para o café.
- `nexus-konami`: Ativa segredos do sistema.
- `nexus-root`: Comando monitorado para detecção de acesso indevido.
- `nexus-hack`: Registra tentativas de manipulação não autorizada.

---

## 🗄️ Manutenção do Banco (SQLite)

Localização: `backend/database/citymotion.db`.
O banco pode ser manipulado via TUI no terminal ou através do comando `nexus-db-reset` para restauração rápida em ambiente de homologação.
