# 📋 CityMotion - Lista de Tarefas (To-Do)

Este arquivo organiza as funcionalidades pendentes e melhorias a serem implementadas no projeto CityMotion.

## ✅ Funcionalidades Concluídas (Milestones)

-   [x] **Interface e Navegação Básica:** Estrutura inicial do layout, menu lateral e navegação entre páginas.
-   [x] **Gestão de Recursos (CRUD Visual):**
    -   [x] Cadastro, visualização, edição e detalhamento de **Veículos**.
    -   [x] Cadastro, visualização, edição e detalhamento de **Funcionários**.
    -   [x] Cadastro, visualização, edição e detalhamento de **Setores**.
-   [x] **Painel de Viagens (Kanban):** Visualização de viagens nas colunas "Agendadas", "Em Andamento" e "Concluídas".
-   [x] **Checklists de Viagem (Pré e Pós):** Implementação de modais para checklists de segurança antes e depois das viagens.
-   [x] **Fluxo Completo de Solicitação e Aprovação:**
    -   [x] Funcionário solicita um transporte.
    -   [x] Gestor do setor recebe a notificação no painel.
    -   [x] Gestor aprova ou rejeita, gerando a viagem.
-   [x] **Página de Relatórios Melhorada:** Com KPIs e filtros dinâmicos.
-   [x] **Crachá Virtual com QR Code:** Geração de um crachá virtual para cada funcionário.
-   [x] **Central de Ajuda:** Seção de documentação no estilo SaaS.
-   [x] **Hierarquia de Perfis e Permissões (Simulação):** Regras de visibilidade para diferentes perfis.
-   [x] **Página de Login (Visual e Funcional para Simulação):** Interface de login que permite alternar entre os perfis.
-   [x] **Página de Configurações Avançada:** Com abas para identidade visual, operações e monitoramento.
-   [x] **Painel de Administração de Perfis:** Interface para o Admin atribuir perfis.
-   [x] **Página de Perfil 100% Dinâmica:** Exibe informações do usuário "logado".
-   [x] **Estrutura do Banco de Dados:** Criação do arquivo `database.sql` com o esquema das tabelas.

## 🚀 Próximas Funcionalidades (Roadmap)

-   [ ] **Integração com Backend e Banco de Dados (SQLite):**
    -   [ ] **Construir o Servidor Node.js:** Utilizar o guia em `docs/BACKEND_GUIDE.md` para criar o servidor Express.
    -   [ ] **Inicializar o Banco de Dados:** Usar o arquivo `src/data/database.sql` para criar e popular o banco de dados `citymotion.db`.
    -   [ ] **Implementar Autenticação Real:** Substituir o `AppProvider` de simulação por chamadas reais à nova API de login (`/api/login`), armazenando o token JWT no cliente.
    -   [ ] **Refatorar as Páginas:** Modificar as páginas (Veículos, Funcionários, Viagens, etc.) para buscar e enviar dados para a nova API do Node.js em vez de usar os dados estáticos.
    -   [ ] **Implementar Upload de Arquivos:** Criar a lógica no servidor para receber e salvar os arquivos de documentos (CNH, CRLV, etc.) em uma pasta `uploads`.

-   [ ] **Internacionalização (Tradução Completa):**
    -   [ ] Traduzir todos os componentes de UI que ainda exibem textos em inglês (ex: `Calendar`, textos de bibliotecas).

## 🔮 Futuro (Pós-MVP)

-   [ ] **Notificações em Tempo Real:**
    -   [ ] Implementar um sistema de notificações (ex: via WebSockets) para alertar gestores sobre novas solicitações ou motoristas sobre novas viagens agendadas.
-   [ ] **Build para Desktop (Electron):**
    -   [ ] Configurar o Electron para empacotar a aplicação, garantindo que o servidor Node.js seja iniciado junto com o aplicativo.
-   [ ] **Configuração de Acesso Externo (Proxy Reverso):**
    -   [ ] Configurar um proxy reverso (ex: Nginx) para permitir acesso seguro ao sistema de fora da intranet.
