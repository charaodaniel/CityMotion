# 📋 CityMotion - Lista de Tarefas (To-Do)

Este arquivo organiza as funcionalidades pendentes e melhorias a serem implementadas no projeto CityMotion.

## 🚀 Próximas Funcionalidades (Roadmap)

-   [ ] **Conectar Front-end com a Nova API (Back-end):**
    -   [ ] **Refatorar o `AppProvider`:** Substituir a lógica de busca de dados do `useEffect` que consome a API de simulação (`/api/data`) para consumir a nova API do back-end (`http://localhost:3001/api/data`).
    -   [ ] **Implementar Autenticação Real:**
        -   Modificar a página de `Login` para fazer uma requisição `POST` para `http://localhost:3001/api/login`.
        -   Após o login, armazenar o token JWT recebido (no `localStorage` ou em um cookie).
        -   Adicionar o token (`Authorization: Bearer <token>`) em todas as requisições subsequentes para as rotas protegidas da API.
    -   [ ] **Refatorar Funções de Mutação:** Atualizar as funções que adicionam ou modificam dados (ex: `addVehicleRequest`, `updateScheduleStatus`) para que, em vez de alterarem o estado local, façam requisições `POST` ou `PUT` para a API do back-end.

-   [ ] **Implementar Upload de Arquivos no Back-end:**
    -   [ ] Criar a lógica no servidor Node.js para receber e salvar os arquivos de documentos (CNH, CRLV, etc.) em uma pasta (ex: `backend/uploads`).

-   [ ] **Internacionalização (Tradução Completa):**
    -   [ ] Traduzir todos os componentes de UI que ainda exibem textos em inglês (ex: `Calendar`, textos de bibliotecas).

## 🔮 Futuro (Pós-MVP)

-   [ ] **Notificações em Tempo Real:**
    -   [ ] Implementar um sistema de notificações (ex: via WebSockets) para alertar gestores sobre novas solicitações ou motoristas sobre novas viagens agendadas.
-   [ ] **Build para Desktop (Electron):**
    -   [ ] Configurar o Electron para empacotar a aplicação, garantindo que o servidor Node.js seja iniciado junto com o aplicativo.
-   [ ] **Configuração de Acesso Externo (Proxy Reverso):**
    -   [ ] Configurar um proxy reverso (ex: Nginx) para permitir acesso seguro ao sistema de fora da intranet.
