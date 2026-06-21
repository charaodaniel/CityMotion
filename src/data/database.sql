
--- TABELA DE FUNCIONÁRIOS (Lotação e Segurança)
--- Senha padrão para todos: 123456
--- Hash Bcrypt: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi

CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON String ["Setor A", "Setor B"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    phone TEXT UNIQUE,
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
    startChecklist TEXT, 
    endChecklist TEXT,
    startNotes TEXT,
    endNotes TEXT
);

--- TABELA DE ABASTECIMENTOS
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

--- INSERÇÃO DE DADOS INICIAIS
INSERT OR IGNORE INTO employees (id, name, email, role, sector, status, matricula, phone) VALUES 
(0, 'Desenvolvedor Root', 'dev@dev.com', 'Desenvolvedor Global', '["TI - Infraestrutura"]', 'Disponível', 'root', '5511999999999'),
(1, 'Júlio César', 'admin@citymotion.com', 'Administrador', '["Gabinete do Prefeito"]', 'Disponível', 'GP-001', '5511988888888'),
(2, 'Maria Oliveira', 'manager@citymotion.com', 'Gestor de Setor', '["Secretaria de Saúde"]', 'Disponível', 'M-002', '5511977777777'),
(3, 'João da Silva', 'driver@citymotion.com', 'Motorista', '["Secretaria de Obras"]', 'Disponível', 'M-001', '5511966666666');

INSERT OR IGNORE INTO vehicles (id, vehicleModel, licensePlate, sector, mileage, status) VALUES 
(1, 'Fiat Strada', 'PM-001', 'Secretaria de Obras', 15000, 'Disponível'),
(2, 'VW Gol', 'PM-002', 'Secretaria de Saúde', 8500, 'Disponível'),
(3, 'Renault Kwid', 'PM-003', 'Secretaria de Administração', 22000, 'Disponível');
