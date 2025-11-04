# 📋 CityMotion - Lista de Tarefas (To-Do)

Este arquivo organiza as funcionalidades pendentes e melhorias a serem implementadas no projeto CityMotion.

## ✅ Funcionalidades Concluídas (Milestones)

-   [x] **Interface e Navegação Básica:** Estrutura inicial do layout, menu lateral e navegação entre páginas.
-   [x] **Gestão de Recursos (CRUD Visual):**
    -   [x] Cadastro, visualização, edição e detalhamento de **Veículos**.
    -   [x] Cadastro, visualização, edição e detalhamento de **Funcionários** (substituindo o antigo "Motoristas").
    -   [x] Cadastro, visualização, edição e detalhamento de **Setores**.
-   [x] **Painel de Viagens (Kanban):** Visualização de viagens nas colunas "Agendadas", "Em Andamento" e "Concluídas".
-   [x] **Checklists de Viagem (Pré e Pós):** Implementação de modais para checklists de segurança antes e depois das viagens, com registro de quilometragem e observações.
-   [x] **Fluxo Completo de Solicitação e Aprovação:**
    -   [x] Funcionário solicita um transporte.
    -   [x] Gestor do setor recebe a notificação no painel.
    -   [x] Gestor aprova ou rejeita.
    -   [x] Ao ser aprovada, a solicitação **automaticamente se torna uma viagem agendada**.
-   [x] **Página de Relatórios Melhorada:**
    -   [x] Inclusão de KPIs (Total de Viagens, KM Total, Veículo Mais Usado).
    -   [x] Adição de filtros por período, setor, veículo e motorista.
    -   [x] Lógica de permissão para que motoristas vejam apenas seu próprio histórico.
-   [x] **Crachá Virtual com QR Code:** Geração de um crachá virtual para cada funcionário com função de impressão.
-   [x] **Central de Ajuda (Documentação):** Criação de uma seção de documentação no estilo SaaS com layout próprio e múltiplos tópicos.
-   [x] **Hierarquia de Perfis e Permissões (Simulação):** Implementação de regras de visibilidade na interface para diferentes perfis (Admin, Gestor, Motorista, Funcionário), garantindo que cada um veja apenas os dados pertinentes.
-   [x] **Página de Login (Visual e Funcional para Simulação):** Interface de login que permite alternar entre os perfis de teste.
-   [x] **Página de Configurações Avançada:** Adição de abas e novas opções de personalização para o administrador.

## 🚀 Próximas Funcionalidades (Roadmap)

-   [ ] **Painel de Administração de Perfis:**
    -   [x] Criar uma nova página (`/perfis`) onde o **Administrador** possa atribuir o perfil a qualquer funcionário.
    -   [x] Criar uma API (`/api/profiles`) que simula a alteração do perfil no backend, preparando para a integração com banco de dados.

-   [ ] **Página de Perfil 100% Dinâmica:**
    -   [ ] Garantir que a página `/perfil` exiba as informações (nome, cargo, setor) e o histórico de atividades (solicitações ou viagens) do usuário que está "logado" (simulado pelo seletor de perfil), e não de um usuário fixo.

-   [ ] **Gerenciamento de Documentos (Upload Real):**
    -   [ ] Implementar a lógica de back-end (ou simulação com armazenamento local) para o upload real de arquivos (fotos de CNH, CRLV, recibos de abastecimento) e a visualização deles.

-   [ ] **Internacionalização (Tradução Completa):**
    -   [ ] Traduzir todos os componentes de UI que ainda exibem textos em inglês (ex: `Calendar`, textos de bibliotecas).

## 🔮 Futuro (Pós-MVP)

-   [ ] **Integração com Backend e Banco de Dados (SQLite):**
    -   [ ] Substituir a API de dados simulada (`/api/data`, `/api/profiles`) e o `AppProvider` por chamadas a um backend real (Node.js) conectado a um banco de dados SQLite.
-   [ ] **Autenticação Real:**
    -   [ ] Implementar um sistema de autenticação completo (ex: JWT) para substituir a simulação de perfis.
-   [ ] **Notificações:**
    -   [ ] Implementar um sistema de notificações (ex: via toast ou um ícone de sino) para alertar gestores sobre novas solicitações ou motoristas sobre novas viagens agendadas.
-   [ ] **Build para Desktop (Electron):**
    -   [ ] Configurar o Electron para empacotar a aplicação para uso como um programa de desktop, garantindo que o servidor Node.js seja iniciado junto com o aplicativo.
