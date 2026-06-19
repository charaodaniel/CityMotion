
-- CityMotion Database Schema

-- Tabela de Setores
CREATE TABLE IF NOT EXISTS sectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    vehicleCount INTEGER DEFAULT 0,
    driverCount INTEGER DEFAULT 0
);

-- Tabela de Funcionários
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT DEFAULT '123456',
    role TEXT NOT NULL,
    status TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON array: ["Setor A", "Setor B"]
    matricula TEXT,
    cnh TEXT,
    idPhoto TEXT,
    cnhPhoto TEXT
);

-- Tabela de Veículos
CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    driverName TEXT,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    destination TEXT,
    mileage INTEGER DEFAULT 0,
    sector TEXT -- Nome do setor principal
);

-- Tabela de Requisições de Veículos
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

-- Tabela de Viagens (Trips/Schedules)
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
    category TEXT,
    passengers TEXT, -- JSON array
    startChecklist TEXT, -- JSON array
    endChecklist TEXT, -- JSON array
    startNotes TEXT,
    endNotes TEXT
);

-- Tabela de Escalas (Work Schedules)
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

-- Tabela de Manutenção
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id TEXT PRIMARY KEY,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT NOT NULL,
    requesterName TEXT NOT NULL,
    requestDate TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL
);

-- Inserção de dados iniciais (baseado nos dados mockados anteriormente)
INSERT INTO sectors (id, name, description, vehicleCount, driverCount) VALUES 
('SEC01', 'Gabinete do Prefeito', 'Assessoramento direto à diretoria.', 1, 1),
('SEC05', 'Secretaria de Saúde', 'Gestão de saúde e atendimentos.', 8, 8),
('SEC06', 'Secretaria de Obras', 'Manutenção e infraestrutura.', 10, 12);

INSERT INTO employees (id, name, email, role, status, sector, matricula) VALUES 
('11', 'Júlio César', 'admin@citymotion.com', 'Administrador', 'Disponível', '["Gabinete do Prefeito"]', 'GP-001'),
('12', 'Ricardo Nunes', 'manager@citymotion.com', 'Gestor de Setor', 'Disponível', '["Secretaria de Obras"]', 'OBR-012'),
('9', 'Marcos Lima', 'driver@citymotion.com', 'Motorista', 'Disponível', '["Secretaria de Saúde"]', 'M-009');

INSERT INTO vehicles (id, vehicleModel, licensePlate, status, mileage, sector) VALUES 
('V1', 'Fiat Strada', 'PM-001', 'Disponível', 15000, 'Secretaria de Obras'),
('V2', 'VW Gol', 'PM-002', 'Disponível', 8525, 'Secretaria de Saúde');

INSERT INTO trips (id, title, driver, vehicle, origin, destination, departureTime, status, category) VALUES 
('SCH001', 'Entrega Urgente', 'Marcos Lima', 'VW Gol (PM-002)', 'Sede', 'Hospital', '2024-06-18 10:00', 'Agendada', 'Saúde');
