
-- --- CITYMOTION DATABASE SCHEMA (SQLite) ---

-- 1. TABELA DE SETORES
CREATE TABLE IF NOT EXISTS sectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    vehicleCount INTEGER DEFAULT 0,
    driverCount INTEGER DEFAULT 0
);

-- 2. TABELA DE FUNCIONÁRIOS (Lotação e Segurança)
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT '123456',
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON String ["Setor A", "Setor B"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    cnh TEXT,
    idPhoto TEXT,
    cnhPhoto TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE VEÍCULOS (Ativos de Frota)
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    driverName TEXT,
    destination TEXT,
    lastRefuelingDate TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sector) REFERENCES sectors(name)
);

-- 4. TABELA DE VIAGENS (Missões Logísticas)
CREATE TABLE IF NOT EXISTS trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    driver TEXT NOT NULL,
    vehicle TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departureTime TEXT NOT NULL,
    arrivalTime TEXT,
    startMileage INTEGER,
    endMileage INTEGER,
    status TEXT DEFAULT 'Agendada',
    category TEXT,
    startChecklist TEXT, -- JSON Array
    endChecklist TEXT, -- JSON Array
    startNotes TEXT,
    endNotes TEXT
);

-- 5. TABELA DE SOLICITAÇÕES DE VEÍCULOS
CREATE TABLE IF NOT EXISTS vehicle_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    sector TEXT NOT NULL,
    details TEXT,
    priority TEXT DEFAULT 'Média',
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'Pendente',
    requester TEXT
);

-- 6. TABELA DE ESCALAS DE TRABALHO
CREATE TABLE IF NOT EXISTS work_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    employee TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'Agendada',
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    description TEXT
);

-- 7. TABELA DE MANUTENÇÃO
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT NOT NULL,
    requesterName TEXT,
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Pendente'
);

-- --- DADOS INICIAIS (SEED) ---

INSERT INTO sectors (id, name, description) VALUES 
('SEC01', 'Gabinete do Prefeito', 'Assessoramento direto ao Prefeito.'),
('SEC02', 'Secretaria de Saúde', 'Gestão de saúde pública e vigilância.'),
('SEC03', 'Secretaria de Obras', 'Manutenção de vias e infraestrutura.'),
('SEC04', 'TI - Infraestrutura', 'Suporte tecnológico e sistemas.');

INSERT INTO employees (name, email, password, role, sector, status, matricula) VALUES 
('Desenvolvedor Root', 'dev@dev.com', '123456789', 'Desenvolvedor Global', '["TI - Infraestrutura"]', 'Disponível', 'root'),
('João da Silva', 'driver@citymotion.com', '123456', 'Motorista', '["Secretaria de Obras"]', 'Disponível', 'M-001'),
('Maria Oliveira', 'manager@citymotion.com', '123456', 'Gestor de Setor', '["Secretaria de Saúde"]', 'Disponível', 'M-002'),
('Júlio César', 'admin@citymotion.com', '123456', 'Administrador', '["Gabinete do Prefeito"]', 'Disponível', 'GP-001');

INSERT INTO vehicles (vehicleModel, licensePlate, sector, mileage, status) VALUES 
('Fiat Strada', 'PM-001', 'Secretaria de Obras', 15000, 'Disponível'),
('VW Gol', 'PM-002', 'Secretaria de Saúde', 8525, 'Disponível'),
('Renault Kwid', 'PM-003', 'Gabinete do Prefeito', 22000, 'Disponível');
