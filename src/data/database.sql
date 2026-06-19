
-- Estrutura do Banco de Dados CityMotion

-- 1. Tabela de Setores
CREATE TABLE IF NOT EXISTS sectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    vehicleCount INTEGER DEFAULT 0,
    driverCount INTEGER DEFAULT 0
);

-- 2. Tabela de Funcionários
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'Disponível',
    sector TEXT, -- Armazenado como JSON array string: ["Setor A", "Setor B"]
    cnh TEXT,
    matricula TEXT,
    idPhoto TEXT,
    cnhPhoto TEXT
);

-- 3. Tabela de Veículos
CREATE TABLE IF NOT EXISTS vehicles (
    id TEXT PRIMARY KEY,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'Disponível',
    mileage INTEGER DEFAULT 0,
    sector TEXT,
    driverName TEXT,
    destination TEXT
);

-- 4. Tabela de Viagens
CREATE TABLE IF NOT EXISTS trips (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    driver TEXT,
    vehicle TEXT,
    origin TEXT,
    destination TEXT,
    departureTime TEXT,
    arrivalTime TEXT,
    startMileage INTEGER,
    endMileage INTEGER,
    status TEXT DEFAULT 'Agendada',
    category TEXT,
    passengers TEXT, -- JSON array
    startNotes TEXT,
    endNotes TEXT,
    startChecklist TEXT, -- JSON array
    endChecklist TEXT -- JSON array
);

-- 5. Tabela de Solicitações de Veículos
CREATE TABLE IF NOT EXISTS vehicle_requests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    sector TEXT NOT NULL,
    details TEXT,
    priority TEXT DEFAULT 'Média',
    requestDate TEXT,
    requester TEXT,
    status TEXT DEFAULT 'Pendente'
);

-- 6. Tabela de Escalas de Trabalho
CREATE TABLE IF NOT EXISTS work_schedules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    employee TEXT NOT NULL,
    type TEXT,
    status TEXT DEFAULT 'Agendada',
    startDate TEXT,
    endDate TEXT,
    description TEXT
);

-- 7. Tabela de Pedidos de Manutenção
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id TEXT PRIMARY KEY,
    vehicleId TEXT,
    vehicleModel TEXT,
    licensePlate TEXT,
    requesterName TEXT,
    requestDate TEXT,
    type TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pendente'
);

-- DADOS INICIAIS (SEED)

INSERT INTO sectors (id, name, description) VALUES 
('SEC01', 'Gabinete do Prefeito', 'Assessoramento direto.'),
('SEC02', 'Administração', 'Gestão de pessoal e patrimônio.'),
('SEC05', 'Secretaria de Saúde', 'Gestão de saúde pública.'),
('SEC06', 'Secretaria de Obras', 'Manutenção de infraestrutura.');

INSERT INTO employees (id, name, email, password, role, sector, status, matricula) VALUES 
('11', 'Júlio César', 'admin@citymotion.com', '123456', 'Administrador Geral', '["Gabinete do Prefeito"]', 'Disponível', 'GP-001'),
('12', 'Ricardo Nunes', 'manager@citymotion.com', '123456', 'Gestor de Unidade', '["Secretaria de Obras", "Secretaria de Saúde"]', 'Disponível', 'OBR-012'),
('9', 'Marcos Lima', 'driver@citymotion.com', '123456', 'Motorista', '["Secretaria de Saúde"]', 'Disponível', 'M-009'),
('4', 'Ana Souza', 'employee@citymotion.com', '123456', 'Colaborador', '["Administração"]', 'Disponível', 'ADM-004'),
('17', 'Sérgio Moraes', 'mecanico@citymotion.com', '123456', 'Mecânico Chefe', '["Secretaria de Obras"]', 'Disponível', 'MEC-001');

INSERT INTO vehicles (id, vehicleModel, licensePlate, sector, status, mileage) VALUES 
('V1', 'Fiat Strada', 'PM-001', 'Secretaria de Obras', 'Disponível', 15000),
('V2', 'VW Gol', 'PM-002', 'Secretaria de Saúde', 'Disponível', 8500),
('V3', 'Renault Kwid', 'PM-003', 'Administração', 'Em Viagem', 22000);

INSERT INTO trips (id, title, driver, vehicle, origin, destination, departureTime, status) VALUES 
('SCH003', 'Visita Técnica em Obra', 'João da Silva', 'Fiat Strada (PM-001)', 'Secretaria de Obras', 'Bairro Novo Horizonte', '30/07/2024 14:00', 'Agendada');
