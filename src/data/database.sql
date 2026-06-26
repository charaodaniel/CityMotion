
--- CITYMOTION KERNEL SCHEMA V2.4
--- Suporte para SQLite3 e PostgreSQL

--- TABELA DE FUNCIONÁRIOS
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT '123456',
    role TEXT NOT NULL,
    sector TEXT, -- JSON String
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    phone TEXT,
    cnh TEXT,
    is_demo INTEGER DEFAULT 0,
    reset_token TEXT,
    reset_expires DATETIME,
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

--- TABELA DE MISSÕES (TRIPS)
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

--- TABELA DE ABASTECIMENTOS
CREATE TABLE IF NOT EXISTS refuelings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT,
    licensePlate TEXT,
    driverName TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    mileage INTEGER,
    liters REAL,
    price REAL,
    totalValue REAL,
    fuelType TEXT,
    gasStation TEXT,
    notes TEXT
);

--- TABELA DE CHAT (MESSAGES)
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read INTEGER DEFAULT 0
);

--- TABELA DE MANUTENÇÃO
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT,
    licensePlate TEXT,
    requesterName TEXT,
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pendente'
);

--- TRILHA DE AUDITORIA
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_identity TEXT,
    action TEXT,
    table_name TEXT,
    details TEXT
);

--- TABELA DE SETORES (SECTORS)
CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);

--- POPULAR SETORES BÁSICOS
INSERT OR IGNORE INTO sectors (name, description) VALUES 
('Gabinete do Prefeito', 'Assessoramento direto'),
('Secretaria de Saúde', 'Gestão de saúde pública'),
('Secretaria de Obras, Viação e Urbanismo', 'Infraestrutura'),
('TI - Infraestrutura', 'Suporte técnico central');
