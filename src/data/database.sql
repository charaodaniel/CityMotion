-- Arquivo de Schema do Banco de Dados para o CityMotion
-- Dialeto: SQLite

-- Tabela para os Setores da prefeitura
CREATE TABLE IF NOT EXISTS sectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- Tabela para os Funcionários
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Disponível', 'Em Viagem', 'Afastado', 'Em Serviço')),
    role TEXT NOT NULL,
    matricula TEXT UNIQUE,
    cnh TEXT,
    id_photo_path TEXT,    -- Caminho para o arquivo da foto 3x4
    cnh_photo_path TEXT,   -- Caminho para o arquivo da foto da CNH
    sector_id TEXT NOT NULL,
    FOREIGN KEY (sector_id) REFERENCES sectors (id)
);

-- Tabela para os Veículos da Frota
CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    vehicle_model TEXT NOT NULL,
    license_plate TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK(status IN ('Disponível', 'Em Serviço', 'Em Viagem', 'Manutenção')),
    mileage INTEGER NOT NULL,
    sector_id TEXT NOT NULL,
    FOREIGN KEY (sector_id) REFERENCES sectors (id)
);

-- Tabela para Solicitações de Veículos (antes de se tornarem uma viagem)
CREATE TABLE IF NOT EXISTS vehicle_requests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    details TEXT,
    priority TEXT NOT NULL CHECK(priority IN ('Alta', 'Média', 'Baixa')),
    status TEXT NOT NULL CHECK(status IN ('Pendente', 'Aprovada', 'Rejeitada')),
    request_date TEXT NOT NULL, -- ISO 8601 format
    requester_id TEXT NOT NULL,
    sector_id TEXT NOT NULL,
    FOREIGN KEY (requester_id) REFERENCES employees (id),
    FOREIGN KEY (sector_id) REFERENCES sectors (id)
);

-- Tabela para as Viagens (Schedules)
CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    origin TEXT,
    destination TEXT,
    departure_time TEXT NOT NULL, -- ISO 8601 format
    arrival_time TEXT,            -- ISO 8601 format
    status TEXT NOT NULL CHECK(status IN ('Agendada', 'Em Andamento', 'Concluída', 'Cancelada')),
    category TEXT,
    driver_id TEXT NOT NULL,
    vehicle_id TEXT NOT NULL,
    FOREIGN KEY (driver_id) REFERENCES employees (id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
);

-- Tabela de associação para os Passageiros de uma Viagem
CREATE TABLE IF NOT EXISTS trip_passengers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id TEXT NOT NULL,
    passenger_name TEXT NOT NULL,
    passenger_document TEXT,
    FOREIGN KEY (trip_id) REFERENCES trips (id)
);

-- Tabela para armazenar os Checklists de início e fim de viagem
CREATE TABLE IF NOT EXISTS checklists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trip_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('start', 'finish')),
    mileage INTEGER NOT NULL,
    notes TEXT,
    items_checked TEXT, -- JSON array of checked items, e.g., '["Nível de óleo", "Pneus"]'
    created_at TEXT NOT NULL, -- ISO 8601 format
    FOREIGN KEY (trip_id) REFERENCES trips (id)
);

-- Tabela para Escalas de Trabalho (Plantões, Folgas, etc.)
CREATE TABLE IF NOT EXISTS work_schedules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Agendada', 'Em Andamento', 'Concluída')),
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    description TEXT,
    employee_id TEXT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees (id)
);

-- Tabela para Solicitações de Manutenção
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('Manutenção Corretiva', 'Revisão Preventiva')),
    description TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Pendente', 'Em Andamento', 'Concluída')),
    request_date TEXT NOT NULL, -- ISO 8601 format
    completion_date TEXT,     -- ISO 8601 format
    vehicle_id TEXT NOT NULL,
    requester_id TEXT NOT NULL,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id),
    FOREIGN KEY (requester_id) REFERENCES employees (id)
);
