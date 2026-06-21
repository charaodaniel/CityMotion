
-- CityMotion NexusOS - Database Schema V2 (SQLite)

-- 1. SETORES
CREATE TABLE IF NOT EXISTS sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO sectors (name, description) VALUES 
('Gabinete do Prefeito', 'Assessoramento direto.'),
('Secretaria de Administração e Planejamento', 'Gestão de pessoal e patrimônio.'),
('Secretaria da Fazenda', 'Gestão financeira e tributária.'),
('Secretaria de Educação, Cultura, Desporto e Lazer', 'Administração de escolas e transporte escolar.'),
('Secretaria de Saúde', 'Gestão de saúde pública e vigilância.'),
('Secretaria de Obras, Viação e Urbanismo', 'Manutenção de infraestrutura.'),
('Secretaria de Assistência Social', 'Políticas de proteção social.'),
('Secretaria de Agricultura e Meio Ambiente', 'Apoio rural e ambiental.'),
('Secretaria de Turismo e Desenvolvimento Econômico', 'Fomento ao comércio.'),
('TI - Infraestrutura', 'Suporte tecnológico central.');

-- 2. FUNCIONÁRIOS (Lotação e Segurança)
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON String ["Setor A"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    cnh TEXT,
    reset_token TEXT,
    reset_expires TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. VEÍCULOS (Ativos de Frota)
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sector) REFERENCES sectors(name)
);

INSERT OR IGNORE INTO vehicles (vehicleModel, licensePlate, sector, mileage, status) VALUES 
('Fiat Strada', 'PM-001', 'Secretaria de Obras, Viação e Urbanismo', 15000, 'Disponível'),
('VW Gol', 'PM-002', 'Secretaria de Saúde', 8525, 'Disponível'),
('Renault Kwid', 'PM-003', 'Administração', 22000, 'Disponível'),
('Chevrolet Onix', 'PM-004', 'Secretaria de Educação, Cultura, Desporto e Lazer', 41000, 'Manutenção'),
('Fiat Mobi', 'PM-005', 'Secretaria de Saúde', 5200, 'Disponível');

-- 4. MISSÕES (Viagens)
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

-- 5. SOLICITAÇÕES DE TRANSPORTE
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

-- 6. ABASTECIMENTOS
CREATE TABLE IF NOT EXISTS refuelings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId INTEGER,
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
    notes TEXT
);

-- 7. MANUTENÇÃO
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId INTEGER,
    vehicleModel TEXT,
    licensePlate TEXT,
    requesterName TEXT,
    requestDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    type TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pendente'
);

-- 8. CHAT
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    senderId INTEGER NOT NULL,
    receiverId INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    isRead INTEGER DEFAULT 0
);

-- 9. AUDITORIA
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    details TEXT,
    user_identity TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
