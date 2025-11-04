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

## 3. Funcionário (Employee)

Este é o perfil padrão para a maioria dos servidores da prefeitura, incluindo motoristas, professores, médicos, técnicos, etc.

-   **Visão:** A mais restrita, focada em suas próprias solicitações e atividades.
-   **Principal Função:**
    -   **Solicitar um transporte** através do formulário "Pedir Transporte".
-   **Funções Específicas do Cargo:**
    -   Se um funcionário tiver o cargo de **Motorista**, sua interface será adaptada. Ele poderá:
        -   Visualizar as viagens que foram **atribuídas a ele**.
        -   **Iniciar e Finalizar** viagens, preenchendo os checklists de pré e pós-viagem.
        -   Registrar quilometragem e abastecimentos.
        -   Acessar o histórico de relatórios apenas das viagens que ele mesmo realizou.
-   **Permissões Gerais de Funcionário:**
    -   Pode visualizar o status de suas próprias solicitações (Pendente, Aprovada, Rejeitada).
    -   Acessa sua página de perfil para ver seu histórico de solicitações.
    -   Acessa seu crachá virtual.
-   **Restrições:** Não tem acesso a painéis de gestão, viagens de outros funcionários ou relatórios gerais (a menos que seja um motorista visualizando seu próprio histórico).

> **E-mails de teste:** 
> - `employee@citymotion.com` (simula a funcionária Ana Souza)
> - `driver@citymotion.com` (simula a motorista Maria Oliveira, que é um tipo de funcionário)

