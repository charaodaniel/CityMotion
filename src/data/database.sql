
--- CITYMOTION DATABASE SCHEMA v2.5
--- Este arquivo define a estrutura para o banco SQLite3

--- TABELA DE FUNCIONÁRIOS (Lotação e Segurança)
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON String ["Setor A", "Setor B"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    phone TEXT,
    cnh TEXT,
    reset_token TEXT,
    reset_expires DATETIME,
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

--- TABELA DE SETORES (Organização)
CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

--- TABELA DE ABASTECIMENTOS (Financeiro/Consumo)
CREATE TABLE IF NOT EXISTS refuelings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT,
    licensePlate TEXT,
    tripId TEXT,
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

--- TABELA DE MANUTENÇÃO (Oficina)
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT,
    licensePlate TEXT,
    requesterName TEXT,
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT, -- 'Manutenção Corretiva' | 'Revisão Preventiva'
    description TEXT,
    status TEXT DEFAULT 'Pendente'
);

--- TABELA DE CHAT (Comunicação)
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId INTEGER NOT NULL,
    receiverId INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    isRead INTEGER DEFAULT 0
);

--- TABELA DE AUDITORIA (Compliance LGPD)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    details TEXT,
    user_identity TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

--- INSERIR SETORES PADRÃO
INSERT OR IGNORE INTO sectors (name, description) VALUES 
('Gabinete do Prefeito', 'Administração superior'),
('Secretaria de Saúde', 'Saúde e Vigilância'),
('Secretaria de Educação, Cultura, Desporto e Lazer', 'Ensino e Esporte'),
('Secretaria de Obras, Viação e Urbanismo', 'Infraestrutura e manutenção'),
('TI - Infraestrutura', 'Suporte tecnológico');
