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
    participant RL as Rate Limiter
    participant DB as Banco de Dados

    User->>Bridge: POST /api/nexus/auth/login {email, pass}
    Bridge->>Node: POST /api/login
    Node->>RL: Verificar Rate Limit (10 req/15min)
    RL-->>Node: Permitido / Bloqueado
    alt Rate Limit Excedido
        Node-->>User: 429 Too Many Requests
    else Permitido
        Node->>DB: SELECT * FROM employees WHERE email=$1
        DB-->>Node: user_data (hashed_pass)
        Node->>Node: Bcrypt.compare(pass, hashed_pass)
        Note over Node: Se válido, gera JWT com Role inclusa
        Node-->>Bridge: 200 OK {token, user}
        Bridge-->>User: Armazena Token no LocalStorage
    end
```

---

## 2. Diagrama de Entidade-Relacionamento (ERD)
Estrutura lógica das tabelas no banco de dados.

```mermaid
erDiagram
    EMPLOYEES ||--o{ AUDIT_LOGS : gera
    EMPLOYEES ||--o{ TRIPS : conduz
    EMPLOYEES ||--o{ MESSAGES : envia
    VEHICLES ||--o{ TRIPS : utilizado_em
    VEHICLES ||--o{ MAINTENANCE_REQUESTS : requer
    VEHICLES ||--o{ REFUELINGS : recebe
    SECTORS ||--o{ EMPLOYEES : possui
    SECTORS ||--o{ VEHICLES : aloca
    ORGANIZATIONS ||--o{ EMPLOYEES : gerencia
```

---

## 3. Arquitetura NexusBridge
Visão de componentes da camada de adaptação.

```mermaid
graph TD
    A[Frontend React/Next.js] -->|Request Virtual| B[NexusBridge Engine]
    B -->|Match Route| C{Router Resolver}
    C -->|Adapter HTTP| D[Backend Express.js]
    D -->|SQL/NoSQL| E[(Banco de Dados)]
    D -->|Config| F[.env File]
    C -->|Mock| G[JSON Local Files]
    D -->|WebSocket| H[Socket.IO Events]
```

---

## 4. Fluxo de Segurança Completo

```mermaid
graph LR
    A[Requisição] --> B{CORS Check}
    B -->|Origem Inválida| X[Bloqueado]
    B -->|Origem Válida| C{Rate Limit}
    C -->|Excedido| Y[429 Too Many Requests]
    C -->|Dentro do Limite| D{JWT Token}
    D -->|Token Inválido| Z[401/403]
    D -->|Token Válido| E{RBAC Check}
    E -->|Sem Permissão| W[403 Forbidden]
    E -->|Com Permissão| F[Executar Rota]
    F --> G[Auditoria no DB]
```

---

## 5. Estados do Veículo (Telemetria)
Ciclo de vida de um ativo na frota.

```mermaid
stateDiagram-v2
    [*] --> Disponivel
    Disponivel --> EmViagem : Iniciar Missão
    EmViagem --> Disponivel : Finalizar Checklist
    Disponivel --> Manutencao : Relatar Defeito
    Manutencao --> Disponivel : Concluir OS
    Disponivel --> Abastecendo : Registrar Abastecimento
    Abastecendo --> Disponivel : Confirmar Litros
```

---

## 6. Arquitetura de Segurança

```mermaid
graph TB
    subgraph "Frontend (Porta 9002)"
        A[Next.js App] --> B[NexusBridge]
    end
    
    subgraph "Backend (Porta 3001)"
        C[Express Server]
        D[CORS Middleware]
        E[Rate Limiter]
        F[Auth Middleware JWT]
        G[Infrastructure Routes]
    end
    
    subgraph "Banco de Dados"
        H[(SQLite)]
        I[(PostgreSQL)]
        J[(Supabase)]
    end
    
    B --> D
    D --> E
    E --> F
    F --> C
    C --> H
    C --> I
    C --> J
    G --> K[.env Config]
```

---

## 7. Fluxo de Configuração de Infraestrutura

```mermaid
sequenceDiagram
    participant Admin as Admin (DEV/TI)
    participant UI as Painel Infraestrutura
    participant Bridge as NexusBridge
    participant API as Backend API
    participant Env as .env File

    Admin->>UI: Acessa Configurações → Infraestrutura
    UI->>Bridge: GET /api/nexus/infrastructure/config
    Bridge->>API: GET /api/infrastructure/config
    API->>Env: Ler configurações
    Env-->>API: Config completa
    API-->>UI: Config (senhas mascaradas)
    
    Admin->>UI: Clica "Testar Conexão"
    UI->>Bridge: POST /api/nexus/infrastructure/test-db
    Bridge->>API: POST /api/infrastructure/test-db
    API->>API: Testar conexão com banco
    API-->>UI: {success: true, message: "..."}
    
    Admin->>UI: Clica "Salvar"
    UI->>Bridge: POST /api/nexus/infrastructure/save
    Bridge->>API: POST /api/infrastructure/save
    API->>Env: Atualizar variáveis
    Env-->>API: Salvo com sucesso
    API-->>UI: "Reinicie o servidor para aplicar"
```
