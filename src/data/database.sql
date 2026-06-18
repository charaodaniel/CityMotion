
-- CityMotion Database Schema

-- Setores
CREATE TABLE IF NOT EXISTS sectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    vehicleCount INTEGER DEFAULT 0,
    driverCount INTEGER DEFAULT 0
);

-- Funcionários
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL,
    sector TEXT NOT NULL, -- JSON array string
    cnh TEXT,
    matricula TEXT,
    idPhoto TEXT,
    cnhPhoto TEXT
);

-- Veículos
CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    sector TEXT,
    driverName TEXT,
    destination TEXT
);

-- Viagens (Schedules)
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
    passengers TEXT, -- JSON string
    startNotes TEXT,
    endNotes TEXT,
    startChecklist TEXT, -- JSON string
    endChecklist TEXT -- JSON string
);

-- Solicitações de Veículo
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

-- Escalas de Trabalho
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

-- Manutenções
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

-- DADOS INICIAIS --

INSERT INTO sectors (id, name, description) VALUES 
('SEC01', 'Gabinete do Prefeito', 'Assessoramento direto ao comando da organização.'),
('SEC02', 'Administração e Planejamento', 'Gestão de pessoal, patrimônio e planejamento.'),
('SEC05', 'Saúde', 'Gestão de saúde pública e unidades de atendimento.'),
('SEC06', 'Obras e Infraestrutura', 'Manutenção de vias e serviços urbanos.');

INSERT INTO employees (id, name, email, password, role, status, sector, matricula, cnh) VALUES 
('11', 'Júlio César', 'admin@citymotion.com', '123456', 'Administrador', 'Em Serviço', '["Gabinete do Prefeito"]', 'GP-001', NULL),
('12', 'Ricardo Nunes', 'manager@citymotion.com', '123456', 'Engenheiro Civil', 'Disponível', '["Obras e Infraestrutura", "Saúde"]', 'OBR-012', '444555666'),
('9', 'Marcos Lima', 'driver@citymotion.com', '123456', 'Motorista', 'Em Viagem', '["Administração e Planejamento"]', 'M-009', '111222333'),
('4', 'Ana Souza', 'employee@citymotion.com', '123456', 'Colaborador', 'Afastado', '["Administração e Planejamento"]', 'EDU-004', NULL),
('17', 'Sérgio Moraes', 'mecanico@citymotion.com', '123456', 'Mecânico Chefe', 'Disponível', '["Obras e Infraestrutura"]', 'MEC-001', '777888999');

INSERT INTO vehicles (id, vehicleModel, licensePlate, status, mileage, sector) VALUES 
('V1', 'Fiat Strada', 'PM-001', 'Disponível', 15000, 'Obras e Infraestrutura'),
('V2', 'VW Gol', 'PM-002', 'Disponível', 8525, 'Saúde'),
('V3', 'Renault Kwid', 'PM-003', 'Em Viagem', 22000, 'Administração e Planejamento'),
('V4', 'Chevrolet Onix', 'PM-004', 'Manutenção', 41000, 'Administração e Planejamento');

INSERT INTO vehicle_requests (id, title, sector, details, priority, requestDate, requester, status) VALUES 
('REQ001', 'Vistoria em Unidade Local', 'Saúde', 'Necessário transporte para equipe de enfermagem.', 'Alta', '2024-07-29T10:00:00Z', 'Maria Oliveira', 'Pendente'),
('REQ002', 'Entrega de Relatórios', 'Administração e Planejamento', 'Entrega de documentos no escritório central.', 'Média', '2024-07-29T11:30:00Z', 'Ana Souza', 'Pendente');

INSERT INTO trips (id, title, driver, vehicle, origin, destination, departureTime, status, category) VALUES 
('SCH001', 'Transporte de Equipe', 'Marcos Lima', 'Renault Kwid (PM-003)', 'Sede Central', 'Unidade Regional', '29/07/2024 09:30', 'Em Andamento', 'Administração');
