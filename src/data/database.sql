
-- CityMotion - Script de Inicialização SQLite

-- 1. TABELA DE FUNCIONÁRIOS
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    status TEXT DEFAULT 'Disponível',
    sector TEXT, -- Armazenado como string JSON array
    matricula TEXT,
    cnh TEXT,
    idPhoto TEXT,
    cnhPhoto TEXT
);

-- 2. TABELA DE VEÍCULOS
CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT NOT NULL,
    status TEXT NOT NULL,
    mileage INTEGER NOT NULL,
    sector TEXT NOT NULL,
    driverName TEXT,
    destination TEXT,
    lastRefuelingDate TEXT
);

-- 3. TABELA DE VIAGENS (Trips)
CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    driver TEXT NOT NULL,
    vehicle TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    departureTime TEXT NOT NULL,
    arrivalTime TEXT,
    startMileage INTEGER,
    endMileage INTEGER,
    status TEXT NOT NULL,
    category TEXT NOT NULL,
    passengers TEXT, -- JSON array
    startNotes TEXT,
    endNotes TEXT,
    startChecklist TEXT, -- JSON array
    endChecklist TEXT -- JSON array
);

-- 4. TABELA DE SETORES
CREATE TABLE IF NOT EXISTS sectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    vehicleCount INTEGER DEFAULT 0,
    driverCount INTEGER DEFAULT 0
);

-- 5. TABELA DE SOLICITAÇÕES
CREATE TABLE IF NOT EXISTS vehicle_requests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    sector TEXT NOT NULL,
    details TEXT,
    priority TEXT NOT NULL,
    requestDate TEXT NOT NULL,
    requester TEXT NOT NULL,
    status TEXT NOT NULL
);

-- 6. ESCALAS E MANUTENÇÃO
CREATE TABLE IF NOT EXISTS work_schedules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    employee TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS maintenance_requests (
    id TEXT PRIMARY KEY,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT NOT NULL,
    requesterName TEXT NOT NULL,
    requestDate TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL
);

-- INSERÇÃO DE DADOS INICIAIS (SEED)

-- Funcionários (Senhas padrão 123456, exceto DEV)
INSERT INTO employees (id, name, role, email, password, status, sector, matricula) VALUES 
(0, 'Desenvolvedor Root', 'Desenvolvedor Global', 'dev@dev.com', '123456789', 'Disponível', '["TI - Infraestrutura"]', 'DEV-001'),
(1, 'João da Silva', 'Motorista', 'driver@citymotion.com', '123456', 'Em Serviço', '["Secretaria de Obras, Viação e Urbanismo"]', 'M-001'),
(2, 'Maria Oliveira', 'Gestor de Setor', 'manager@citymotion.com', '123456', 'Disponível', '["Secretaria de Saúde"]', 'M-002'),
(4, 'Ana Souza', 'Colaborador', 'employee@citymotion.com', '123456', 'Disponível', '["Secretaria de Educação, Cultura, Desporto e Lazer"]', 'EDU-004'),
(11, 'Júlio César', 'Administrador', 'admin@citymotion.com', '123456', 'Em Serviço', '["Gabinete do Prefeito"]', 'GP-001'),
(17, 'Sérgio Moraes', 'Técnico Mecânico', 'mecanico@citymotion.com', '123456', 'Disponível', '["Secretaria de Obras, Viação e Urbanismo"]', 'MEC-001');

-- Setores
INSERT INTO sectors (id, name, description) VALUES 
('SEC01', 'Gabinete do Prefeito', 'Assessoramento direto ao Prefeito e Vice-Prefeito.'),
('SEC02', 'Secretaria de Administração e Planejamento', 'Gestão de pessoal e patrimônio.'),
('SEC05', 'Secretaria de Saúde', 'Gestão de saúde pública e vigilância.'),
('SEC06', 'Secretaria de Obras, Viação e Urbanismo', 'Manutenção de vias e infraestrutura.');

-- Veículos
INSERT INTO vehicles (id, vehicleModel, licensePlate, status, mileage, sector) VALUES 
('V1', 'Fiat Strada', 'PM-001', 'Disponível', 15000, 'Secretaria de Obras, Viação e Urbanismo'),
('V2', 'VW Gol', 'PM-002', 'Disponível', 8525, 'Secretaria de Saúde'),
('V3', 'Renault Kwid', 'PM-003', 'Em Viagem', 22000, 'Secretaria de Administração e Planejamento');

-- Viagens
INSERT INTO trips (id, title, driver, vehicle, origin, destination, departureTime, status, category) VALUES 
('SCH001', 'Transporte de Paciente', 'Maria Oliveira', 'VW Gol (PM-002)', 'Posto de Saúde', 'Hospital Regional', '2024-03-20 08:00', 'Concluída', 'Saúde');
