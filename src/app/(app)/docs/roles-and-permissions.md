# Hierarquia de Perfis e Permissões no CityMotion

O CityMotion foi projetado com uma estrutura de permissões flexível para garantir que cada usuário tenha acesso apenas às ferramentas e informações relevantes para sua função dentro da prefeitura. A hierarquia é dividida em quatro perfis principais, que podem ser simulados na página de login para testes.

---

## 1. Administrador (Admin)

O **Administrador** é o superusuário do sistema. Este perfil tem controle total e irrestrito sobre todas as funcionalidades e dados da plataforma.

-   **Visão:** Total. Vê todos os veículos, todos os funcionários, todos os setores e todas as viagens.
-   **Permissões de Gestão:**
    -   Pode cadastrar, editar e remover **qualquer** veículo, funcionário ou setor.
    -   Pode agendar viagens para qualquer motorista/veículo.
    -   Tem acesso a todos os relatórios sem filtros de permissão.
-   **Configurações:** É o único perfil que pode acessar a página de **Configurações** para personalizar a aparência do sistema.
-   **Atribuição de Perfis (Futuro):** Será o responsável por atribuir ou remover o perfil de **Gestor** a outros funcionários.

> **E-mail de teste:** `admin@citymotion.com`

---

## 2. Gestor de Setor (Manager)

O **Gestor** é, tipicamente, o Secretário de uma pasta (Saúde, Obras, Educação) ou um funcionário designado para gerenciar os recursos de um setor específico. Ele tem permissões elevadas, mas **apenas dentro do seu próprio setor**.

-   **Visão:** Restrita ao seu setor. Vê apenas os veículos, funcionários e viagens associados ao seu setor.
-   **Principal Função:**
    -   **Aprovar ou Rejeitar** solicitações de transporte feitas por funcionários do seu setor.
-   **Permissões de Gestão:**
    -   Pode gerenciar os veículos e funcionários que pertencem ao seu setor.
    -   Pode agendar viagens utilizando os recursos (motoristas e veículos) do seu setor.
-   **Relatórios:** Pode gerar relatórios, mas os dados são pré-filtrados para mostrar apenas informações relacionadas ao seu setor.

> **E-mail de teste:** `manager@citymotion.com` (simula um gestor da Secretaria de Obras)

---

## 3. Motorista (Driver)

O **Motorista** é um tipo de funcionário cujo foco está na execução das viagens. Seu painel é simplificado para otimizar suas tarefas diárias.

-   **Visão:** Focada em suas próprias atividades.
-   **Permissões:**
    -   Visualiza as viagens que foram **atribuídas a ele**.
    -   **Inicia e Finaliza** viagens, preenchendo os checklists de pré e pós-viagem.
    -   Registra quilometragem e abastecimentos.
-   **Histórico:** Acessa o histórico de relatórios apenas das viagens que ele mesmo realizou (seja como motorista ou passageiro). Ele não pode ver o histórico de outros motoristas.

> **E-mail de teste:** `driver@citymotion.com` (simula a motorista Maria Oliveira)

---

## 4. Funcionário (Employee)

Este é o perfil padrão para a maioria dos servidores da prefeitura (professores, médicos, técnicos, etc.) que precisam solicitar transporte para realizar suas atividades.

-   **Visão:** A mais restrita, focada em suas próprias solicitações.
-   **Principal Função:**
    -   **Solicitar um transporte** através do formulário "Pedir Transporte".
-   **Permissões:**
    -   Pode visualizar o status de suas próprias solicitações (Pendente, Aprovada, Rejeitada).
    -   Acessa sua página de perfil para ver seu histórico de solicitações.
    -   Acessa seu crachá virtual.
-   **Restrições:** Não tem acesso a painéis de gestão, viagens de outros funcionários ou relatórios gerais.

> **E-mail de teste:** `employee@citymotion.com` (simula a funcionária Ana Souza)
