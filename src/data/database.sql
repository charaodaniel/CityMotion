
-- CityMotion // NexusOS Kernel Database Schema
-- Compatibilidade Dual: SQLite3 e PostgreSQL (Render)

-- 1. FUNCIONÁRIOS (Lotação e Segurança)
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT '123456',
    phone TEXT,
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON String ["Setor A", "Setor B"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    cnh TEXT,
    is_demo INTEGER DEFAULT 0, -- 1 para usuários voláteis
    reset_token TEXT,
    reset_expires DATETIME,
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
    lastRefuelingDate DATETIME,
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
    startChecklist TEXT, -- JSON Array
    endChecklist TEXT, -- JSON Array
    startNotes TEXT,
    endNotes TEXT
);

-- 4. ABASTECIMENTO (Telemetria Financeira)
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
    driverName TEXT,
    notes TEXT
);

-- 5. MENSAGENS (NexusTalk)
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read INTEGER DEFAULT 0
);

-- 6. MANUTENÇÃO (Oficina)
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT NOT NULL,
    requesterName TEXT NOT NULL,
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'Pendente'
);

-- 7. AUDITORIA (NexusGuard)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_identity TEXT NOT NULL,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    details TEXT -- JSON Data
);

-- 8. SETORES (Organização)
CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);
