
# 📊 Diagramas de Arquitetura e Fluxo - CityMotion

Este documento detalha a estrutura técnica do sistema utilizando UML (Mermaid.js).

---

## 1. Fluxo de Autenticação e Autorização (JWT)
Representa como o sistema valida a identidade sem confiar cegamente no frontend.

```mermaid
sequenceDiagram
    participant User as Usuário (Browser)
    participant Bridge as NexusBridge (Next.js)
    participant Node as Backend (Express)
    participant DB as SQLite (citymotion.db)

    User->>Bridge: POST /api/nexus/auth/login {user, pass}
    Bridge->>Node: POST /api/login {user, pass}
    Node->>DB: SELECT * FROM employees WHERE...
    DB-->>Node: user_data (hashed_pass)
    Node->>Node: Bcrypt.compare(pass, hashed_pass)
    Note over Node: Se válido, gera JWT com Role inclusa
    Node-->>Bridge: 200 OK {token, user}
    Bridge-->>User: Armazena Token no LocalStorage
    
    Note over User,DB: Requisição Protegida (Ex: Reset Banco)
    User->>Bridge: POST /api/nexus/maintenance/db-reset (Header: Bearer JWT)
    Bridge->>Node: Repassa Header Authorization
    Node->>Node: JWT.verify(token)
    Note over Node: Valida se Role === 'Desenvolvedor Global'
    Node->>DB: Executa Script de Reset
    DB-->>Node: Sucesso
    Node-->>Bridge: 200 OK
    Bridge-->>User: "Sistema Reiniciado"
```

---

## 2. Diagrama de Entidade-Relacionamento (ERD)
Estrutura lógica das tabelas no SQLite.

```mermaid
erDiagram
    EMPLOYEES ||--o{ AUDIT_LOGS : gera
    EMPLOYEES ||--o{ TRIPS : conduz
    VEHICLES ||--o{ TRIPS : utilizado_em
    VEHICLES ||--o{ MAINTENANCE_REQUESTS : requer
    SECTORS ||--o{ EMPLOYEES : possui
    SECTORS ||--o{ VEHICLES : aloca
```

---

## 3. Arquitetura NexusBridge
Visão de componentes da camada de adaptação.

```mermaid
graph TD
    A[Frontend React] -->|Request Virtual| B[NexusBridge Engine]
    B -->|Match Route| C{Router Resolver}
    C -->|Adapter HTTP| D[Node.js Backend]
    D -->|SQL| E[(SQLite Database)]
    C -->|Mock| F[JSON Local Files]
    D -->|Backup| G[.bak Files]
```

---

## 4. Estados do Veículo (Telemetria)
Ciclo de vida de um ativo na frota.

```mermaid
stateDiagram-v2
    [*] --> Disponivel
    Disponivel --> EmViagem : Iniciar Missão
    EmViagem --> Disponivel : Finalizar Checklist
    Disponivel --> Manutencao : Relatar Defeito
    Manutencao --> Disponivel : Concluir OS
```
