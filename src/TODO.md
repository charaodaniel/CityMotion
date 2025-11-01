# 📋 CityMotion - Lista de Tarefas (To-Do)

Este arquivo organiza as funcionalidades pendentes e melhorias a serem implementadas no projeto CityMotion.

## 🚀 Prioridade Alta

-   [ ] **Corrigir Navegação e Páginas Duplicadas**
    -   [x] Renomear o link "Deslocamentos" para "Viagens" no menu lateral.
    -   [x] Ajustar a página `/escalas` para gerenciar escalas de trabalho (plantões, folgas) em vez de duplicar a página de viagens.

-   [ ] **Melhorar Página de Relatórios (`/relatorios`)**
    -   [x] Adicionar cartões de resumo (KPIs) para "Total de Viagens", "Quilometragem Total" e "Veículo Mais Utilizado".
    -   [x] Garantir que os KPIs sejam atualizados com base nos filtros aplicados.
    -   [x] Adicionar filtros por "Motorista" e "Funcionário".

-   [ ] **Implementar Checklists de Viagem**
    -   [x] Criar modal de checklist de pré-viagem ao clicar em "Iniciar".
    -   [x] Incluir campo para KM inicial no checklist.
    -   [x] Incluir campo para observações no checklist.
    -   [x] Criar modal de checklist de pós-viagem ao clicar em "Finalizar".
    -   [x] Incluir campos para KM final e observações.
    -   [x] Exibir os checklists preenchidos (itens e observações) nos detalhes da viagem.

## 🛠️ Próximas Funcionalidades

-   [ ] **Implementar Fluxo de Aprovação de Viagens**
    -   [x] Conectar o formulário "Pedir Transporte" para que ele crie uma "Solicitação de Veículo" com status "Pendente".
    -   [ ] Exibir solicitações pendentes no painel do "Gestor de Setor" (`ManagerDashboard`).
    -   [ ] Implementar a lógica nos botões "Aprovar" e "Rejeitar" para que mudem o status da solicitação.
    -   [ ] Uma vez aprovada, a solicitação deve se tornar uma viagem "Agendada" na página `/viagens`.

-   [ ] **Dinamizar Página de Perfil (`/perfil`)**
    -   [ ] Fazer com que a página exiba as informações do usuário "logado" (simulado pelo seletor de perfil).
    -   [ ] O histórico de viagens na página de perfil deve ser do usuário selecionado.

-   [ ] **Aprimorar Painel Principal (`/`)**
    -   [ ] Adicionar mais cartões de resumo (KPIs) ao `AdminDashboard`, como "Total de Veículos na Frota" e "Viagens em Andamento".

## ✨ Melhorias e UI/UX

-   [ ] **Criar Página de Login (Visual)**
    -   [ ] Desenvolver a interface da página de login, sem a lógica de autenticação por enquanto.

-   [ ] **Internacionalização (Tradução)**
    -   [ ] Traduzir componentes de UI que ainda exibem textos em inglês (ex: `Calendar`).

-   [ ] **Gerenciamento de Documentos**
    -   [ ] Implementar a lógica para upload e visualização de documentos para veículos e motoristas.

## 🔮 Futuro (Pós-Apresentação)

-   [ ] **Integração com Backend**
    -   [ ] Substituir os arquivos JSON por chamadas de API para um backend real (ex: PocketBase).
-   [ ] **Build para Desktop**
    -   [ ] Configurar o Electron para empacotar a aplicação para desktop.
