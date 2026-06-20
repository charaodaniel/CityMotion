
# 📊 Diagramas de Arquitetura e UML - CityMotion

Este documento detalha a estrutura técnica do sistema CityMotion utilizando UML (via Mermaid.js).

---

## 1. Diagrama de Entidade-Relacionamento (ERD)
Este diagrama representa a estrutura lógica do banco de dados SQLite e as relações entre as entidades do sistema.

```mermaid
erDiagram
    ORGANIZATION ||--o{ EMPLOYEE : possui
    ORGANIZATION ||--o{ VEHICLE : gerencia
    ORGANIZATION ||--o{ SECTOR : define
    
    SECTOR ||--o{ EMPLOYEE : lotacao
    SECTOR ||--o{ VEHICLE : alocacao
    
    EMPLOYEE ||--o{ TRIP : conduz
    VEHICLE ||--o{ TRIP : utilizado_em
    
    EMPLOYEE ||--o{ VEHICLE_REQUEST : solicita
    SECTOR ||--o{ VEHICLE_REQUEST : destino_setor
    
    VEHICLE ||--o{ MAINTENANCE_REQUEST : requer
    EMPLOYEE ||--o{ MAINTENANCE_REQUEST : abre_chamado
```

---

## 2. Diagrama de Sequência (NexusBridge Flow)
Representa o ciclo de vida de uma requisição de atualização de dados, passando pela camada de adaptação.

```mermaid
sequenceDiagram
    participant UI as Interface (React)
    participant Provider as AppProvider (Context)
    participant Bridge as NexusBridge (Next.js Route)
    participant Node as Backend (Express)
    participant DB as SQLite (citymotion.db)
    participant Backup as Backup System (.bak)

    UI->>Provider: updateEmployee(id, data)
    Provider->>Bridge: PUT /api/nexus/test/db-employees/:id
    Bridge->>Bridge: Resolve path & backendId
    Bridge->>Node: PUT http://localhost:3001/api/employees/:id
    
    Note over Node,DB: Backend logic
    Node->>Backup: createCopy(citymotion.db)
    Node->>DB: UPDATE employees SET ... WHERE id = :id
    DB-->>Node: changes: 1
    
    Node-->>Bridge: 200 OK (JSON)
    Bridge-->>Provider: 200 OK
    Provider->>Provider: refreshData() (Silent Sync)
    Provider-->>UI: Update Local State
```

---

## 3. Diagrama de Estados (Vehicle Lifecycle)
Representa as mudanças de estado de um ativo de frota dentro do sistema.

```mermaid
stateDiagram-v2
    [*] --> Disponivel
    Disponivel --> Agendada : Criar Missão
    Agendada --> EmViagem : Iniciar Missão (Checklist)
    EmViagem --> Disponivel : Finalizar Missão (Checklist)
    Disponivel --> Manutencao : Relatar Defeito
    Manutencao --> Disponivel : Concluir Reparo
    
    state Manutencao {
        [*] --> Pendente
        Pendente --> EmAndamento : Iniciar OS
        EmAndamento --> Concluida : Finalizar OS
        Concluida --> [*]
    }
```

---

## 4. Diagrama de Atividade (Agendamento de Viagem)
Representa o processo de negócio desde o pedido até a execução.

```mermaid
flowchart TD
    A[Início: Colaborador solicita transporte] --> B{Gestor aprova?}
    B -- Não --> C[Notificar Colaborador]
    C --> D[Fim]
    B -- Sim --> E[Sistema gera Trip ID]
    E --> F[Alocar Motorista e Veículo]
    F --> G[Notificar Motorista via App]
    G --> H[Checklist de Saída]
    H --> I[Executar Viagem]
    I --> J[Checklist de Chegada]
    J --> K[Atualizar KM no SQLite]
    K --> D
```

---

## 5. Diagrama de Componentes (SaaS Layer)
Visão de alto nível da separação de responsabilidades.

```mermaid
graph TD
    subgraph "Frontend Layer (Vercel/Next.js)"
        A[Dashboard UI] --> B[AppProvider Context]
    end

    subgraph "NexusBridge Integration"
        B --> C{Routing Engine}
        C -->|Match| D[HTTP Adapter]
        D --> E[Data Transformers]
    end

    subgraph "Infrastructure Layer (On-Premise/Cloud)"
        E --> F[Node.js Express Server]
        F --> G[(SQLite Database)]
        F --> H[File Storage]
    end

    subgraph "Developer Tools"
        I[Nexus CLI] --> C
        J[TUI Terminal] --> B
    end
```
