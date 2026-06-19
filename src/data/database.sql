
-- CityMotion - Estrutura do Banco de Dados SQLite Inicial

-- 1. Tabela de Setores
CREATE TABLE sectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    vehicleCount INTEGER DEFAULT 0,
    driverCount INTEGER DEFAULT 0
);

INSERT INTO sectors (id, name, description, vehicleCount, driverCount) VALUES 
('SEC01', 'Gabinete do Prefeito', 'Assessoramento direto à diretoria.', 1, 1),
('SEC02', 'Administração e Planejamento', 'Gestão de pessoal e patrimônio.', 2, 2),
('SEC03', 'Fazenda', 'Gestão financeira e contábil.', 1, 1),
('SEC04', 'Educação e Cultura', 'Transporte escolar e eventos.', 5, 5),
('SEC05', 'Saúde', 'Gestão de hospitais e ambulâncias.', 8, 8),
('SEC06', 'Obras e Urbanismo', 'Manutenção de infraestrutura.', 10, 12);

-- 2. Tabela de Funcionários (Employees)
CREATE TABLE employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON array string: '["Saúde"]'
    matricula TEXT,
    cnh TEXT,
    idPhoto TEXT,
    cnhPhoto TEXT
);

INSERT INTO employees (id, name, email, password, role, status, sector, matricula, cnh) VALUES 
('11', 'Júlio César', 'admin@citymotion.com', '123456', 'Administrador Geral', 'Em Serviço', '["Gabinete do Prefeito"]', 'GP-001', NULL),
('12', 'Ricardo Nunes', 'manager@citymotion.com', '123456', 'Gerente de Engenharia', 'Disponível', '["Obras e Urbanismo", "Saúde"]', 'OBR-012', '444555666'),
('9', 'Marcos Lima', 'driver@citymotion.com', '123456', 'Motorista Escolar', 'Em Viagem', '["Educação e Cultura"]', 'M-009', '111222333'),
('4', 'Ana Souza', 'employee@citymotion.com', '123456', 'Analista Administrativo', 'Disponível', '["Administração e Planejamento"]', 'ADM-004', NULL),
('17', 'Sérgio Moraes', 'mecanico@citymotion.com', '123456', 'Mecânico Chefe', 'Disponível', '["Obras e Urbanismo"]', 'MEC-001', '777888999');

-- 3. Tabela de Veículos
CREATE TABLE vehicles (
    id TEXT PRIMARY KEY,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    sector TEXT NOT NULL,
    driverName TEXT,
    destination TEXT
);

INSERT INTO vehicles (id, vehicleModel, licensePlate, status, mileage, sector) VALUES 
('V1', 'Fiat Strada', 'PM-001', 'Disponível', 15000, 'Obras e Urbanismo'),
('V2', 'VW Gol', 'PM-002', 'Disponível', 8525, 'Saúde'),
('V3', 'Renault Kwid', 'PM-003', 'Em Viagem', 22000, 'Administração e Planejamento'),
('V4', 'Chevrolet Onix', 'PM-004', 'Manutenção', 41000, 'Educação e Cultura');

-- 4. Tabela de Viagens (Trips/Schedules)
CREATE TABLE trips (
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
    startChecklist TEXT, -- JSON string
    endChecklist TEXT -- JSON string
);

INSERT INTO trips (id, title, driver, vehicle, origin, destination, departureTime, status, category) VALUES 
('SCH001', 'Visita Técnica em Obra', 'João da Silva', 'Fiat Strada (PM-001)', 'Sede', 'Bairro Novo', '2024-08-10 14:00', 'Agendada', 'Obras');

-- 5. Tabela de Solicitações de Veículo
CREATE TABLE vehicle_requests (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    sector TEXT NOT NULL,
    details TEXT,
    priority TEXT NOT NULL,
    requestDate TEXT NOT NULL,
    requester TEXT NOT NULL,
    status TEXT NOT NULL
);

-- 6. Tabela de Escalas de Trabalho
CREATE TABLE work_schedules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    employee TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    description TEXT
);

-- 7. Tabela de Manutenção
CREATE TABLE maintenance_requests (
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
