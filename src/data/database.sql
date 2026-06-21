
--- CityMotion Database Schema v2.5
--- Suporte a Módulo de Chat e Abastecimento

--- TABELA DE FUNCIONÁRIOS
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    sector TEXT, -- JSON String ["Setor A"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    cnh TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

--- TABELA DE VEÍCULOS
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

--- TABELA DE VIAGENS (MISSÕES)
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
    startChecklist TEXT, 
    endChecklist TEXT
);

--- TABELA DE ABASTECIMENTOS
CREATE TABLE IF NOT EXISTS refuelings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId INTEGER NOT NULL,
    vehicleModel TEXT,
    licensePlate TEXT,
    tripId INTEGER,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    mileage INTEGER NOT NULL,
    liters REAL NOT NULL,
    price REAL NOT NULL,
    totalValue REAL NOT NULL,
    fuelType TEXT NOT NULL,
    gasStation TEXT,
    driverName TEXT NOT NULL,
    notes TEXT,
    FOREIGN KEY (vehicleId) REFERENCES vehicles (id)
);

--- TABELA DE MENSAGENS (CHAT)
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId INTEGER NOT NULL,
    receiverId INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    isRead INTEGER DEFAULT 0,
    FOREIGN KEY (senderId) REFERENCES employees (id),
    FOREIGN KEY (receiverId) REFERENCES employees (id)
);

--- TABELA DE AUDITORIA
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    details TEXT,
    user_identity TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

--- TABELA DE SETORES
CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

--- TABELA DE SOLICITAÇÕES DE VEÍCULOS
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

--- TABELA DE MANUTENÇÃO
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId INTEGER NOT NULL,
    vehicleModel TEXT,
    licensePlate TEXT,
    requesterName TEXT,
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pendente'
);

--- POPULANDO SETORES BÁSICOS
INSERT OR IGNORE INTO sectors (name, description) VALUES 
('Gabinete do Prefeito', 'Assessoramento direto executivo'),
('Secretaria de Saúde', 'Gestão de saúde pública e vigilância'),
('Secretaria de Obras, Viação e Urbanismo', 'Manutenção urbana e infraestrutura'),
('Secretaria de Educação, Cultura, Desporto e Lazer', 'Ensino municipal e eventos'),
('TI - Infraestrutura', 'Suporte tecnológico e redes');

--- POPULANDO VEÍCULOS DE TESTE
INSERT OR IGNORE INTO vehicles (vehicleModel, licensePlate, sector, mileage, status) VALUES 
('Fiat Strada', 'PM-001', 'Secretaria de Obras, Viação e Urbanismo', 15000, 'Disponível'),
('VW Gol', 'PM-002', 'Secretaria de Saúde', 8525, 'Disponível'),
('Renault Kwid', 'PM-003', 'Secretaria de Educação, Cultura, Desporto e Lazer', 22000, 'Disponível');
