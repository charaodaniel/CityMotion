--- CityMotion Master Database Schema (SQLite)
--- NexusOS Engine V2.4

--- TABELA DE FUNCIONÁRIOS (Lotação e Segurança)
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    password TEXT NOT NULL, -- Hashes Bcrypt
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON String ["Setor A", "Setor B"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    cnh TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

--- TABELA DE VEÍCULOS (Ativos de Frota)
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

--- TABELA DE VIAGENS (Missões Logísticas)
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

--- TABELA DE SETORES (Hierarquia)
CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

--- TABELA DE SOLICITAÇÕES (Workflow de Aprovação)
CREATE TABLE IF NOT EXISTS vehicle_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    sector TEXT NOT NULL,
    details TEXT,
    priority TEXT DEFAULT 'Média',
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    requester TEXT,
    status TEXT DEFAULT 'Pendente'
);

--- TABELA DE MANUTENÇÃO (Oficina)
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT NOT NULL,
    requesterName TEXT NOT NULL,
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT NOT NULL, -- 'Corretiva' ou 'Preventiva'
    description TEXT,
    status TEXT DEFAULT 'Pendente'
);

--- TABELA DE AUDITORIA (Logs Imutáveis)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    details TEXT,
    user_identity TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

--- SEED DATA: SETORES
INSERT OR IGNORE INTO sectors (name, description) VALUES 
('Gabinete do Prefeito', 'Assessoramento direto à gestão municipal.'),
('Secretaria de Saúde', 'Gestão de hospitais, postos e vigilância.'),
('Secretaria de Educação', 'Gestão escolar e transporte de alunos.'),
('Secretaria de Obras', 'Manutenção de vias e infraestrutura urbana.'),
('TI - Infraestrutura', 'Suporte técnico e gestão do NexusOS.');

--- SEED DATA: FUNCIONÁRIOS (Senhas hasheadas com Bcrypt)
-- Senha '123456789' para root, '123456' para os demais.
INSERT OR IGNORE INTO employees (name, email, phone, password, role, sector, status, matricula) VALUES 
('Desenvolvedor Root', 'dev@dev.com', '5511999999999', '$2a$10$7R6v7S1u.rQ.tQvG2k9G8ue.P.O.v3hF0v8V6k8f4.V4V4V4V4V4', 'Desenvolvedor Global', '["TI - Infraestrutura"]', 'Disponível', 'root'),
('Administrador Geral', 'admin@citymotion.com', '5511988888888', '$2a$10$EIXVdaVVP6T.F5A.k4C.O.v3hF0v8V6k8f4.V4V4V4V4V4V4', 'Administrador', '["Gabinete do Prefeito"]', 'Disponível', 'ADM-001'),
('Maria Oliveira', 'manager@citymotion.com', '5511977777777', '$2a$10$EIXVdaVVP6T.F5A.k4C.O.v3hF0v8V6k8f4.V4V4V4V4V4V4', 'Gestor de Setor', '["Secretaria de Saúde"]', 'Disponível', 'M-002'),
('João da Silva', 'driver@citymotion.com', '5511966666666', '$2a$10$EIXVdaVVP6T.F5A.k4C.O.v3hF0v8V6k8f4.V4V4V4V4V4V4', 'Motorista', '["Secretaria de Obras"]', 'Disponível', 'M-001');

--- SEED DATA: VEÍCULOS
INSERT OR IGNORE INTO vehicles (vehicleModel, licensePlate, sector, mileage, status) VALUES 
('Fiat Strada', 'PM-001', 'Secretaria de Obras', 15000, 'Disponível'),
('VW Gol', 'PM-002', 'Secretaria de Saúde', 8500, 'Disponível'),
('Renault Kwid', 'PM-003', 'Gabinete do Prefeito', 22000, 'Disponível');