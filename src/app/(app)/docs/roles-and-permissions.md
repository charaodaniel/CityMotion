
# Hierarquia de Perfis e Permissões no CityMotion

O CityMotion foi projetado com uma estrutura de permissões flexível para garantir que cada usuário tenha acesso apenas às ferramentas e informações relevantes para sua função dentro da organização. A hierarquia é dividida em perfis principais que atendem a fluxos de trabalho corporativos e operacionais.

---

## 1. Administrador (Admin)

O **Administrador** é o perfil de controle total. Geralmente destinado à equipe de operações de frota central ou gestores de TI da empresa.

-   **Visão:** Total e irrestrita sobre veículos, funcionários, setores e viagens.
-   **Permissões:**
    -   Gerenciamento completo (CRUD) de todos os recursos.
    -   Configurações de identidade visual e regras de negócio globais.
    -   Acesso a todos os relatórios e logs do sistema.

---

## 2. Gestor de Unidade/Setor (Manager)

O **Gestor** é o responsável por um departamento ou unidade de negócio específica. Ele gerencia os recursos alocados para a sua área.

-   **Visão:** Restrita aos recursos (veículos e motoristas) do seu setor.
-   **Funções:**
    -   **Aprovação:** Analisa e autoriza solicitações de transporte feitas pela sua equipe.
    -   **Gestão Local:** Acompanha a escala e disponibilidade dos recursos sob sua responsabilidade.
-   **Perfil Híbrido:** O gestor também pode atuar como um colaborador comum para solicitar transportes para si mesmo.

---

## 3. Colaborador (Employee)

Este é o perfil padrão para a maioria dos membros da organização que necessitam de transporte para realizar suas atividades.

-   **Função Principal:** Solicitar veículos através do formulário de "Pedido Rápido".
-   **Acesso:** Visualiza o status de suas próprias solicitações e acessa seu crachá virtual funcional.

---

## 4. Motorista (Driver)

Um perfil especializado focado na execução das viagens. Embora tecnicamente seja um "colaborador", sua interface é otimizada para o campo.

-   **Funções:**
    -   Visualiza viagens atribuídas a ele.
    -   Executa checklists de segurança obrigatórios.
    -   Registra eventos de viagem como abastecimentos e incidentes.

---

## 5. Técnico Mecânico (Mechanic)

Perfil voltado para a manutenção e conservação da frota.

-   **Funções:**
    -   Gerencia ordens de serviço e chamados de manutenção.
    -   Solicita compra de peças e componentes.
    -   Controla o status de veículos que entram e saem da oficina.
