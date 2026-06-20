-- CityMotion Database Schema
-- Last Update: Jun 20, 2026 (Safety & Fueling Update)

-- TABELA DE FUNCIONÁRIOS
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    password TEXT NOT NULL, -- Hasheada com Bcrypt
    role TEXT NOT NULL,
    sector TEXT, -- JSON String ["Setor A", "Setor B"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    cnh TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABELA DE VEÍCULOS
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABELA DE VIAGENS (MISSÕES)
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

-- TABELA DE SOLICITAÇÕES DE VEÍCULOS
CREATE TABLE IF NOT EXISTS vehicle_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    sector TEXT NOT NULL,
    details TEXT,
    priority TEXT DEFAULT 'Média',
    status TEXT DEFAULT 'Pendente',
    requester TEXT,
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABELA DE SETORES
CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    vehicleCount INTEGER DEFAULT 0,
    driverCount INTEGER DEFAULT 0
);

-- TABELA DE ESCALAS DE TRABALHO
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

-- TABELA DE MANUTENÇÃO
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT,
    licensePlate TEXT,
    requesterName TEXT,
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pendente',
    FOREIGN KEY(vehicleId) REFERENCES vehicles(id)
);

-- TABELA DE ABASTECIMENTO
CREATE TABLE IF NOT EXISTS refuelings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT,
    licensePlate TEXT,
    tripId TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    mileage INTEGER NOT NULL,
    liters REAL NOT NULL,
    price REAL NOT NULL,
    totalValue REAL NOT NULL,
    fuelType TEXT NOT NULL,
    gasStation TEXT,
    driverName TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY(vehicleId) REFERENCES vehicles(id)
);

-- TABELA DE AUDITORIA (LOGS DE SISTEMA)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    details TEXT,
    user_identity TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- DADOS INICIAIS (SEEDS)
-- Senhas padrão hasheadas: 123456789 (dev) e 123456 (outros)

INSERT OR IGNORE INTO employees (name, email, phone, password, role, sector, status, matricula) VALUES 
('Desenvolvedor Root', 'dev@dev.com', '5511999999999', '$2a$10$C8.6N9aLdY8DkMhB3V7D.eZ8yKxU7D8yKxU7D8yKxU7D8yKxU7D8y', 'Desenvolvedor Global', '["TI - Infraestrutura"]', 'Disponível', 'root'),
('João da Silva', 'driver@citymotion.com', '5511988888888', '$2a$10$fN8p7X2kR.PZ9N9K9K9K9.eZ8yKxU7D8yKxU7D8yKxU7D8yKxU7D8y', 'Motorista', '["Secretaria de Obras, Viação e Urbanismo"]', 'Em Serviço', 'M-001'),
('Maria Oliveira', 'manager@citymotion.com', '5511977777777', '$2a$10$fN8p7X2kR.PZ9N9K9K9K9.eZ8yKxU7D8yKxU7D8yKxU7D8yKxU7D8y', 'Gestor de Setor', '["Secretaria de Saúde"]', 'Disponível', 'M-002'),
('Sérgio Moraes', 'mecanico@citymotion.com', '5511966666666', '$2a$10$fN8p7X2kR.PZ9N9K9K9K9.eZ8yKxU7D8yKxU7D8yKxU7D8yKxU7D8y', 'Técnico Mecânico', '["Secretaria de Obras, Viação e Urbanismo"]', 'Disponível', 'MEC-001');

INSERT OR IGNORE INTO sectors (name, description) VALUES 
('Gabinete do Prefeito', 'Assessoramento direto ao Prefeito.'),
('Secretaria de Saúde', 'Gestão de saúde pública e vigilância.'),
('Secretaria de Educação, Cultura, Desporto e Lazer', 'Administração escolar e cultura.'),
('Secretaria de Obras, Viação e Urbanismo', 'Manutenção urbana e infraestrutura.');

INSERT OR IGNORE INTO vehicles (vehicleModel, licensePlate, sector, mileage, status) VALUES 
('Fiat Strada', 'PM-001', 'Secretaria de Obras, Viação e Urbanismo', 15200, 'Em Serviço'),
('VW Gol', 'PM-002', 'Secretaria de Saúde', 8525, 'Disponível'),
('Renault Kwid', 'PM-003', 'Secretaria de Obras, Viação e Urbanismo', 22100, 'Disponível'),
('Chevrolet Onix', 'PM-004', 'Secretaria de Educação, Cultura, Desporto e Lazer', 41000, 'Manutenção');

INSERT OR IGNORE INTO trips (title, driver, vehicle, origin, destination, departureTime, status, category) VALUES 
('Visita Técnica Bairro Novo', 'João da Silva', 'Fiat Strada (PM-001)', 'Secretaria de Obras', 'Bairro Novo', '20/06/2026 14:00', 'Agendada', 'Visita Técnica');
