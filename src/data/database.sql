
--- SCHEMA CITYMOTION NEXUS-OS
--- Compatível com SQLite3 e PostgreSQL (via Tradutor NexusBridge)

CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    sector TEXT, -- JSON Array ["Setor A"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    phone TEXT,
    cnh TEXT,
    is_demo INTEGER DEFAULT 0, -- 1 para usuários de venda (reset 24h)
    reset_token TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicle_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    sector TEXT NOT NULL,
    details TEXT,
    priority TEXT DEFAULT 'Média',
    requester TEXT,
    status TEXT DEFAULT 'Pendente',
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT NOT NULL,
    requesterName TEXT NOT NULL,
    type TEXT NOT NULL, -- Corretiva/Preventiva
    description TEXT,
    status TEXT DEFAULT 'Pendente',
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refuelings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT,
    licensePlate TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    mileage INTEGER,
    liters REAL,
    price REAL,
    totalValue REAL,
    fuelType TEXT,
    gasStation TEXT,
    driverName TEXT,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_identity TEXT NOT NULL,
    action TEXT NOT NULL, -- INSERT, UPDATE, DELETE, RESET
    table_name TEXT,
    details TEXT, -- JSON snapshot
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

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

--- INICIALIZAÇÃO DE SETORES PADRÃO
INSERT OR IGNORE INTO sectors (name, description) VALUES ('Gabinete do Prefeito', 'Assessoramento direto');
INSERT OR IGNORE INTO sectors (name, description) VALUES ('Secretaria de Saúde', 'Gestão de saúde pública');
INSERT OR IGNORE INTO sectors (name, description) VALUES ('Secretaria de Educação', 'Gestão escolar');
INSERT OR IGNORE INTO sectors (name, description) VALUES ('TI - Infraestrutura', 'Suporte tecnológico');
