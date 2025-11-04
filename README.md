
# 🚘 CityMotion - Sistema Inteligente de Gestão de Frota

Bem-vindo ao **CityMotion**, a solução completa para modernizar e otimizar o gerenciamento da frota de veículos da sua prefeitura.

Desenvolvido para ser intuitivo e eficiente, nosso sistema centraliza o controle de veículos, funcionários, viagens e solicitações em uma plataforma web amigável, garantindo mais organização, transparência e economia para a gestão pública.

---

## ✅ Funcionalidades Implementadas (Versão de Protótipo com Back-end)

O CityMotion agora conta com uma arquitetura de front-end e um back-end Node.js local, pronto para ser executado e testado.

### **1. Painel de Controle Dinâmico por Perfil**
Uma tela inicial que se adapta ao perfil do usuário (Administrador, Gestor, Motorista ou Funcionário), exibindo as informações e ações mais relevantes.

### **2. Gestão Completa de Recursos (CRUD)**
-   **Veículos:** Cadastre, edite e gerencie todos os veículos da frota.
-   **Funcionários:** Mantenha um registro completo dos funcionários.
-   **Setores:** Organize a prefeitura em setores para vincular recursos.

### **3. Fluxo de Viagens Inteligente (Solicitação e Aprovação)**
Acompanhe o ciclo de vida de cada viagem, desde a solicitação até a conclusão, através de um painel Kanban visual.

### **4. Checklists de Segurança e Relatórios de Sinistro**
-   **Pré e Pós-viagem:** Garanta a segurança com checklists digitais.
-   **Relatório de Sinistro:** Abra chamados de incidentes diretamente pela plataforma.

### **5. Crachá Virtual com QR Code**
Cada funcionário possui um crachá virtual acessível online para validação rápida.

### **6. Relatórios e Análises (KPIs)**
Gere relatórios em PDF com filtros avançados e acompanhe indicadores de performance.

### **7. Gestão de Manutenção e Escalas**
Acompanhe manutenções, solicite peças e gerencie escalas de trabalho dos funcionários.

### **8. Back-end Local com Node.js e SQLite**
-   Uma API RESTful construída com **Express.js** foi criada para servir os dados da aplicação.
-   Utiliza um banco de dados **SQLite**, ideal para simplicidade e portabilidade.
-   Inclui rotas para **autenticação** (login) e para buscar/salvar dados de todas as seções do sistema.

### **9. Preparação para Desktop com Electron**
-   O projeto agora inclui as dependências e a estrutura de arquivos para ser empacotado como um aplicativo de desktop com Electron.
-   Contém um script de configuração de IP para facilitar a conexão com o servidor em uma rede local.

---

## 🚀 Como Rodar o Projeto (Front-end e Back-end)

Para executar o projeto completo localmente, você precisará de dois ou três terminais, dependendo do modo de execução.

### **Terminal 1: Rodar o Back-end (API)**

1.  **Navegue até a pasta do back-end:**
    ```bash
    cd backend
    ```

2.  **Instale as dependências (faça isso apenas na primeira vez):**
    ```bash
    npm install
    ```

3.  **Inicialize o Banco de Dados (faça isso apenas uma vez):**
    Este comando irá ler o arquivo `src/data/database.sql` e criar o arquivo `citymotion.db` com todas as tabelas e dados de teste.
    ```bash
    npm run db:init
    ```

4.  **Inicie o servidor da API:**
    ```bash
    npm run dev
    ```
    O servidor estará rodando em `http://localhost:3001`.

### **Terminal 2: Rodar o Front-end (Next.js)**

1.  **Na raiz do projeto, instale as dependências:**
    ```bash
    npm install
    ```

2.  **Inicie a aplicação Next.js:**
    ```bash
    npm run dev
    ```
    A aplicação estará acessível em `http://localhost:9002`.

### **(Opcional) Rodar com Electron**

Se desejar testar o ambiente de desenvolvimento do Electron:

1.  **Instale todas as dependências na raiz do projeto:**
    ```bash
    npm install
    ```
2.  **Inicie o ambiente de desenvolvimento Electron com um único comando:**
    Este comando irá iniciar o servidor de back-end, o servidor de front-end e a janela do Electron simultaneamente.
    ```bash
    npm run electron:dev
    ```

---

## 🔮 Próximos Passos

-   [ ] **Refatorar o Front-end:** Modificar as páginas para consumir os dados da nova API (`http://localhost:3001/api/...`) em vez dos dados estáticos, utilizando o token de autenticação.
-   [ ] **Build para Desktop com Electron:** Empacotar a aplicação como um programa de desktop, configurando o `electron-builder`.
-   [ ] **Configuração de Acesso Externo via Proxy Reverso (Nginx):** Permitir acesso seguro ao sistema de fora da intranet da prefeitura.

---

**CityMotion — Mobilidade, transparência e eficiência para a gestão pública municipal.**
