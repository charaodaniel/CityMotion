
-- --- CITYMOTION ENTERPRISE DATABASE SCHEMA ---
-- SQLite3 Portability Layer

PRAGMA foreign_keys = ON;

-- 1. FUNCIONÁRIOS & MOTORISTAS
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    sector TEXT, -- JSON Array: ["Secretaria X", "Setor Y"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    phone TEXT,
    cnh TEXT,
    reset_token TEXT,
    reset_expires TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. VEÍCULOS (ATIVOS DA FROTA)
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. VIAGENS (MISSÕES)
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
    startNotes TEXT,
    endNotes TEXT,
    startChecklist TEXT, -- JSON Array
    endChecklist TEXT    -- JSON Array
);

-- 4. ABASTECIMENTOS
CREATE TABLE IF NOT EXISTS refuelings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId INTEGER NOT NULL,
    vehicleModel TEXT,
    licensePlate TEXT,
    tripId INTEGER,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    mileage INTEGER,
    liters REAL,
    price REAL,
    totalValue REAL,
    fuelType TEXT,
    gasStation TEXT,
    driverName TEXT,
    notes TEXT,
    FOREIGN KEY(vehicleId) REFERENCES vehicles(id)
);

-- 5. MANUTENÇÃO (ORDENS DE SERVIÇO)
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId INTEGER NOT NULL,
    vehicleModel TEXT,
    licensePlate TEXT,
    requesterName TEXT,
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pendente',
    FOREIGN KEY(vehicleId) REFERENCES vehicles(id)
);

-- 6. COMUNICAÇÃO (CHAT)
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId INTEGER NOT NULL,
    receiverId INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    isRead INTEGER DEFAULT 0,
    FOREIGN KEY(senderId) REFERENCES employees(id),
    FOREIGN KEY(receiverId) REFERENCES employees(id)
);

-- 7. AUDITORIA DE SISTEMA
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id TEXT,
    details TEXT,
    user_identity TEXT
);

-- 8. SETORES (ESTRUTURA HIERÁRQUICA)
CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

-- 9. SOLICITAÇÕES DE VEÍCULOS (PENDENTES DE APROVAÇÃO)
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

-- INSERIR SETORES INICIAIS
INSERT OR IGNORE INTO sectors (name, description) VALUES 
('Gabinete do Prefeito', 'Gestão administrativa central'),
('Secretaria de Saúde', 'Operações de urgência e transporte médico'),
('Secretaria de Educação, Cultura, Desporto e Lazer', 'Transporte escolar e eventos'),
('Secretaria de Obras, Viação e Urbanismo', 'Infraestrutura e manutenção urbana'),
('TI - Infraestrutura', 'Suporte técnico e rede NexusOS');

-- INSERIR VEÍCULOS INICIAIS
INSERT OR IGNORE INTO vehicles (vehicleModel, licensePlate, sector, mileage, status) VALUES
('Fiat Strada', 'PM-001', 'Secretaria de Obras, Viação e Urbanismo', 15000, 'Disponível'),
('VW Gol', 'PM-002', 'Secretaria de Saúde', 8500, 'Disponível'),
('Renault Kwid', 'PM-003', 'Secretaria de Educação, Cultura, Desporto e Lazer', 22000, 'Disponível');
