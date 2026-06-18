
-- CityMotion - Database Schema e Dados Iniciais

-- 1. Setores
CREATE TABLE IF NOT EXISTS sectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    vehicleCount INTEGER DEFAULT 0,
    driverCount INTEGER DEFAULT 0
);

INSERT INTO sectors (id, name, description) VALUES 
('SEC01', 'Gabinete do Prefeito', 'Assessoramento direto ao Prefeito e Vice-Prefeito.'),
('SEC02', 'Secretaria de Administração e Planejamento', 'Gestão de pessoal, patrimônio e modernização.'),
('SEC03', 'Secretaria da Fazenda', 'Gestão financeira e tributária.'),
('SEC04', 'Secretaria de Educação, Cultura, Desporto e Lazer', 'Transporte escolar e fomento à cultura.'),
('SEC05', 'Secretaria de Saúde', 'Gestão de saúde pública e vigilância.'),
('SEC06', 'Secretaria de Obras, Viação e Urbanismo', 'Manutenção de infraestrutura urbana.'),
('SEC07', 'Secretaria de Assistência Social', 'Políticas de proteção social.'),
('SEC08', 'Secretaria de Agricultura e Meio Ambiente', 'Apoio ao produtor e políticas ambientais.'),
('SEC09', 'Secretaria de Turismo e Desenvolvimento Econômico', 'Fomento ao comércio e turismo.');

-- 2. Funcionários (Senhas simplificadas para o protótipo: 123456)
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT DEFAULT 'Disponível',
    sector TEXT, -- Armazenado como JSON string ["Setor A", "Setor B"]
    cnh TEXT,
    matricula TEXT
);

INSERT INTO employees (id, name, email, password, role, status, sector, cnh, matricula) VALUES 
('1', 'João da Silva', 'driver@citymotion.com', '123456', 'Motorista', 'Em Serviço', '["Secretaria de Obras, Viação e Urbanismo"]', '123456789', 'M-001'),
('2', 'Maria Oliveira', 'manager@citymotion.com', '123456', 'Gestor de Setor', 'Disponível', '["Secretaria de Saúde"]', '987654321', 'M-002'),
('11', 'Júlio César', 'admin@citymotion.com', '123456', 'Prefeito', 'Em Serviço', '["Gabinete do Prefeito"]', NULL, 'GP-001'),
('12', 'Ricardo Nunes', 'eng@empresa.com', '123456', 'Engenheiro Civil', 'Disponível', '["Secretaria de Obras, Viação e Urbanismo", "Secretaria de Agricultura e Meio Ambiente"]', '444555666', 'OBR-012'),
('17', 'Sérgio Moraes', 'mecanico@citymotion.com', '123456', 'Mecânico Chefe', 'Disponível', '["Secretaria de Obras, Viação e Urbanismo"]', '777888999', 'MEC-001'),
('4', 'Ana Souza', 'employee@citymotion.com', '123456', 'Professor(a)', 'Afastado', '["Secretaria de Educação, Cultura, Desporto e Lazer"]', NULL, 'EDU-004');

-- 3. Veículos
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

INSERT INTO vehicles (id, vehicleModel, licensePlate, status, mileage, sector, driverName, destination) VALUES 
('V1', 'Fiat Strada', 'PM-001', 'Em Serviço', 15000, 'Secretaria de Obras', 'João da Silva', 'Hospital Municipal'),
('V2', 'VW Gol', 'PM-002', 'Disponível', 8525, 'Secretaria de Saúde', NULL, NULL),
('V3', 'Renault Kwid', 'PM-003', 'Em Viagem', 22000, 'Secretaria de Administração e Planejamento', NULL, 'Secretaria de Educação'),
('V4', 'Chevrolet Onix', 'PM-004', 'Manutenção', 41000, 'Secretaria de Educação', NULL, NULL),
('V5', 'Fiat Mobi', 'PM-005', 'Em Viagem', 5200, 'Secretaria de Saúde', 'Carlos Pereira', 'Uruguaiana/RS');

-- 4. Viagens (Trips)
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
    passengers TEXT, -- JSON string
    startNotes TEXT,
    endNotes TEXT,
    startChecklist TEXT, -- JSON string
    endChecklist TEXT -- JSON string
);

INSERT INTO trips (id, title, driver, vehicle, origin, destination, departureTime, status, category) VALUES 
('SCH001', 'Transporte de Paciente', 'Maria Oliveira', 'VW Gol (PM-002)', 'Posto de Saúde Central', 'Hospital Regional', '28/07/2024 08:00', 'Concluída', 'Transporte de Paciente'),
('SCH002', 'Visita Técnica', 'João da Silva', 'Fiat Strada (PM-001)', 'Secretaria de Obras', 'Bairro Novo Horizonte', '30/07/2024 14:00', 'Agendada', 'Visita Técnica');

-- 5. Solicitações de Veículo
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

INSERT INTO vehicle_requests (id, title, sector, details, priority, requestDate, requester, status) VALUES 
('REQ001', 'Buscar materiais', 'Secretaria de Obras', 'Veículo com caçamba para cimento.', 'Alta', '2024-07-29T10:00:00Z', 'João da Silva', 'Pendente');

-- 6. Escalas de Trabalho
CREATE TABLE IF NOT EXISTS work_schedules (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    employee TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'Agendada',
    startDate TEXT,
    endDate TEXT,
    description TEXT
);

INSERT INTO work_schedules (id, title, employee, type, status, startDate, endDate) VALUES 
('WS001', 'Plantão Fim de Semana', 'João da Silva', 'Plantão', 'Agendada', '03/08/2024', '04/08/2024');

-- 7. Manutenções
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
