
-- CityMotion NexusOS - Database Schema (SQLite3)

-- 1. FUNCIONÁRIOS (Lotação e Segurança)
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT '$2a$10$7/v8f.fXGkY.Y.7/v8f.fXGkY.Y.7/v8f.fXGkY.Y.7/v8f.fX', -- '123456' hash padrão
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON String ["Setor A", "Setor B"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    phone TEXT,
    cnh TEXT,
    reset_token TEXT,
    reset_expires TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. VEÍCULOS (Ativos de Frota)
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. VIAGENS (Missões Logísticas)
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
    endChecklist TEXT -- JSON Array
);

-- 4. SOLICITAÇÕES DE VEÍCULOS
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

-- 5. SETORES
CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

-- 6. ABASTECIMENTOS
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
    FOREIGN KEY (vehicleId) REFERENCES vehicles(id)
);

-- 7. MANUTENÇÃO
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
    FOREIGN KEY (vehicleId) REFERENCES vehicles(id)
);

-- 8. CHAT / MENSAGENS
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId INTEGER NOT NULL,
    receiverId INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    isRead INTEGER DEFAULT 0
);

-- 9. LOGS DE AUDITORIA
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    details TEXT,
    user_identity TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- DADOS INICIAIS (SECTORS)
INSERT OR IGNORE INTO sectors (name, description) VALUES ('Gabinete do Prefeito', 'Gestão central');
INSERT OR IGNORE INTO sectors (name, description) VALUES ('Secretaria de Saúde', 'Saúde municipal');
INSERT OR IGNORE INTO sectors (name, description) VALUES ('Secretaria de Obras, Viação e Urbanismo', 'Infraestrutura urbana');
INSERT OR IGNORE INTO sectors (name, description) VALUES ('Secretaria de Educação, Cultura, Desporto e Lazer', 'Educação municipal');
INSERT OR IGNORE INTO sectors (name, description) VALUES ('TI - Infraestrutura', 'Tecnologia da Informação');

-- DADOS INICIAIS (VEHICLES)
INSERT OR IGNORE INTO vehicles (vehicleModel, licensePlate, sector, mileage, status) VALUES ('Fiat Strada', 'PM-001', 'Secretaria de Obras, Viação e Urbanismo', 15000, 'Disponível');
INSERT OR IGNORE INTO vehicles (vehicleModel, licensePlate, sector, mileage, status) VALUES ('VW Gol', 'PM-002', 'Secretaria de Saúde', 8500, 'Disponível');
