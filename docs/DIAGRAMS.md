# 📊 Diagramas de Arquitetura e Fluxo — CityMotion

Este documento detalha a estrutura técnica do sistema utilizando diagramas Mermaid.js.

---

## 1. Arquitetura Geral do Sistema

```mermaid
graph TB
    subgraph "Navegador (SPA)"
        A[App Shell - app.html]
        B[Store.js - Gerenciamento de Estado]
        C[API.js - Cliente HTTP]
        D[WS.js - Socket.IO Client]
        E[Toast.js - Notificações]
        F[Pages - Dashboard, Veículos, ...]
    end

    subgraph "Backend Fastify (Porta 3001)"
        G[Fastify Server]
        H[Auth Plugin - @fastify/jwt]
        I[Rate Limit - @fastify/rate-limit]
        J[CORS - @fastify/cors]
        K[Static - @fastify/static → /public]
        L[Swagger - /docs]
        M[Socket.IO Server]
        N[Routes Auth]
        O[Routes Data]
        P[Routes Infrastructure]
    end

    subgraph "Banco de Dados"
        Q[(SQLite / PostgreSQL)]
        R[Drizzle ORM Engine]
    end

    F --> B
    F --> C
    F --> D
    B --> C
    D --> M
    C --> G
    G --> N
    G --> O
    G --> P
    N --> R --> Q
    O --> R --> Q
    P --> R --> Q
    M --> D
    G --> K --> A
```

---

## 2. Fluxo de Autenticação e Autorização (JWT)

```mermaid
sequenceDiagram
    participant User as Usuário (Browser)
    participant Store as Store.js
    participant API as API.js
    participant Fastify as Backend Fastify
    participant DB as Banco de Dados

    User->>Store: login(email, password)
    Store->>API: POST /api/login {email, password}
    API->>Fastify: HTTP Request
    Fastify->>Fastify: Verificar Rate Limit (10 req/15min)
    alt Rate Limit Excedido
        Fastify-->>API: 429 Too Many Requests
        API-->>Store: Erro
        Store-->>User: Toast "Muitas tentativas"
    else Permitido
        Fastify->>DB: SELECT * FROM employees WHERE email=$1
        DB-->>Fastify: user_data (hashed password)
        Fastify->>Fastify: Bcrypt.compare(password, hash)
        alt Senha Inválida
            Fastify-->>API: 401 Unauthorized
        else Senha Válida
            Fastify->>Fastify: @fastify/jwt.sign({id, name, role, sector})
            Fastify-->>API: 200 {token, user}
            API-->>Store: Salva token + user
            Store-->>User: Redireciona para Dashboard
        end
    end
```

---

## 3. Diagrama de Entidade-Relacionamento (ERD)

```mermaid
erDiagram
    EMPLOYEES ||--o{ TRIPS : conduz
    EMPLOYEES ||--o{ MESSAGES : envia
    EMPLOYEES ||--o{ WORK_SCHEDULES : possui
    VEHICLES ||--o{ TRIPS : utilizado_em
    VEHICLES ||--o{ MAINTENANCE_REQUESTS : requer
    VEHICLES ||--o{ REFUELINGS : recebe
    SECTORS ||--o{ EMPLOYEES : possui
    SECTORS ||--o{ VEHICLES : aloca
    ORGANIZATIONS ||--o{ SECTORS : possui
    ORGANIZATIONS ||--o{ EMPLOYEES : gerencia

    EMPLOYEES {
        int id PK
        string name
        string email UK
        string password
        string role
        string sector
        string status
        string matricula UK
        int is_demo
    }
    VEHICLES {
        int id PK
        string vehicle_model
        string license_plate UK
        string sector
        int mileage
        string status
    }
    TRIPS {
        int id PK
        string title
        string driver
        string vehicle
        string origin
        string destination
        string status
    }
```

---

## 4. Fluxo de Segurança Completo

```mermaid
graph LR
    A[Requisição HTTP] --> B{CORS Check}
    B -->|Origem Inválida| X[Bloqueado 403]
    B -->|Origem Válida| C{Rate Limit}
    C -->|Excedido| Y[429 Too Many Requests]
    C -->|OK| D{JWT válido?}
    D -->|Sem token| Z[401 Unauthorized]
    D -->|Token inválido| Z
    D -->|Token válido| E{role autorizada?}
    E -->|Sem permissão| W[403 Forbidden]
    E -->|OK| F[Executar Handler]
    F --> G[Socket.IO Broadcast]
    F --> H[Retornar JSON]
```

---

## 5. Estados do Veículo (Ciclo de Vida)

```mermaid
stateDiagram-v2
    [*] --> Disponivel
    Disponivel --> EmViagem : Iniciar Missão
    EmViagem --> Disponivel : Finalizar (checklist OK)
    Disponivel --> Manutencao : Solicitar Manutenção
    Manutencao --> Disponivel : Concluir OS
    Disponivel --> Abastecendo : Registrar Abastecimento
    Abastecendo --> Disponivel : Confirmar
    Disponivel --> Inativo : Desativar
    Inativo --> Disponivel : Reativar
```

---

## 6. Fluxo de Notificações em Tempo Real (WebSocket)

```mermaid
sequenceDiagram
    participant Page as Página SPA
    participant WS as WS.js (Socket.IO)
    participant Server as Backend (Socket.IO)
    participant Route as Rota API
    participant DB as Banco

    Page->>WS: init(user.sectors)
    WS->>Server: connect + join-sector
    Note over WS,Server: Conexão estabelecida

    alt Usuário cria registro
        Page->>API: POST /api/requests
        API->>Route: Criar solicitação
        Route->>DB: INSERT
        Route->>Server: io.emit('notification', {title, message, sector})
        Server-->>WS: Event 'notification'
        WS-->>Page: notificacoes.unshift(data)
        Page->>Page: Atualiza badge do sino
    else Atualização de entidade
        Route->>Server: io.emit('entity-update', {type, action, data})
        Server-->>WS: Event 'entity-update'
        WS-->>Page: Store.set(type, data)
        Page->>Page: Re-renderiza

    end
```

---

## 7. Arquitetura de Segurança e Deploy

```mermaid
graph TB
    subgraph "Docker / Render"
        A[Fastify Server :3001]
        B[SQLite Volume]
    end

    subgraph "Middleware Stack"
        C[CORS]
        D[Rate Limiter]
        E[JWT Auth]
        F[RBAC Check]
    end

    subgraph "Serviços"
        G[Socket.IO]
        H[Swagger /docs]
        I[Static Files /public]
    end

    A --> C
    C --> D
    D --> E
    E --> F
    F --> G
    F --> H
    F --> I
    A --> B
```

---

## 8. Fluxo de Configuração de Infraestrutura

```mermaid
sequenceDiagram
    participant Admin as Admin (DEV/TI)
    participant UI as Painel Config
    participant API as API Infraestrutura
    participant Env as .env / DB

    Admin->>UI: Aba Infraestrutura
    UI->>API: GET /api/infrastructure/config
    API->>Env: Ler configurações atuais
    Env-->>API: Config (senhas mascaradas)
    API-->>UI: Renderizar painel

    Admin->>UI: Clica "Testar Conexão"
    UI->>API: POST /api/infrastructure/test-db {url}
    API->>API: Tentar conectar com nova URL
    API-->>UI: {success: true/false, message}

    Admin->>UI: Clica "Salvar"
    UI->>API: POST /api/infrastructure/save {config}
    API->>Env: Persiste configurações
    Env-->>API: Salvo
    API-->>UI: {success: true}
    Note over Admin,UI: Requer reinicialização do servidor
```
