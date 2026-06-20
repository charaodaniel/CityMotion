
--- TABELA DE SETORES
CREATE TABLE IF NOT EXISTS sectors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    vehicleCount INTEGER DEFAULT 0,
    driverCount INTEGER DEFAULT 0
);

--- TABELA DE FUNCIONÁRIOS
CREATE TABLE IF NOT EXISTS employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT '123456',
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON String ["Setor A", "Setor B"]
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
    startChecklist TEXT, -- JSON Array
    endChecklist TEXT, -- JSON Array
    startNotes TEXT,
    endNotes TEXT
);

--- TABELA DE SOLICITAÇÕES DE VEÍCULOS
CREATE TABLE IF NOT EXISTS vehicle_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    sector TEXT NOT NULL,
    details TEXT,
    priority TEXT DEFAULT 'Média',
    requestDate TEXT NOT NULL,
    requester TEXT,
    status TEXT DEFAULT 'Pendente'
);

--- TABELA DE MANUTENÇÃO
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId TEXT NOT NULL,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT NOT NULL,
    requesterName TEXT NOT NULL,
    requestDate TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Pendente'
);

--- TABELA DE ESCALAS DE TRABALHO
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

--- TABELA DE AUDITORIA (LOGS DE ALTERAÇÃO)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
    table_name TEXT NOT NULL,
    record_id TEXT,
    details TEXT,
    user_identity TEXT
);

--- DADOS INICIAIS: SETORES
INSERT OR IGNORE INTO sectors (id, name, description) VALUES 
('SEC01', 'Gabinete do Prefeito', 'Assessoramento direto ao executivo.'),
('SEC02', 'Secretaria de Administração', 'Gestão de pessoal e patrimônio.'),
('SEC04', 'Secretaria de Educação', 'Transporte escolar e gestão pedagógica.'),
('SEC05', 'Secretaria de Saúde', 'Saúde pública e vigilância.'),
('SEC06', 'Secretaria de Obras', 'Infraestrutura e manutenção urbana.'),
('SEC10', 'TI - Infraestrutura', 'Suporte tecnológico e NexusOS Core.');

--- DADOS INICIAIS: FUNCIONÁRIOS (Senha padrão: 123456)
INSERT OR IGNORE INTO employees (name, email, role, sector, status, matricula) VALUES 
('Desenvolvedor Root', 'dev@dev.com', 'Desenvolvedor Global', '["TI - Infraestrutura"]', 'Disponível', 'DEV-001'),
('Júlio César', 'admin@citymotion.com', 'Administrador', '["Gabinete do Prefeito"]', 'Em Serviço', 'GP-001'),
('Maria Oliveira', 'manager@citymotion.com', 'Gestor de Setor', '["Secretaria de Saúde"]', 'Disponível', 'M-002'),
('João da Silva', 'driver@citymotion.com', 'Motorista', '["Secretaria de Obras"]', 'Em Serviço', 'M-001'),
('Ana Souza', 'employee@citymotion.com', 'Colaborador', '["Secretaria de Educação"]', 'Disponível', 'EDU-004'),
('Sérgio Moraes', 'mecanico@citymotion.com', 'Técnico Mecânico', '["Secretaria de Obras"]', 'Disponível', 'MEC-001');

--- DADOS INICIAIS: VEÍCULOS
INSERT OR IGNORE INTO vehicles (vehicleModel, licensePlate, sector, mileage, status) VALUES 
('Fiat Strada', 'PM-001', 'Secretaria de Obras', 15000, 'Em Serviço'),
('VW Gol', 'PM-002', 'Secretaria de Saúde', 8525, 'Disponível'),
('Renault Kwid', 'PM-003', 'Secretaria de Administração', 22000, 'Em Viagem'),
('Chevrolet Onix', 'PM-004', 'Secretaria de Educação', 41000, 'Manutenção');

--- DADOS INICIAIS: VIAGENS
INSERT OR IGNORE INTO trips (title, driver, vehicle, origin, destination, departureTime, status, category) VALUES 
('Transporte de Paciente', 'Maria Oliveira', 'VW Gol (PM-002)', 'Posto de Saúde Central', 'Hospital Regional', '2024-07-28 08:00', 'Concluída', 'Saúde'),
('Visita Técnica em Obra', 'João da Silva', 'Fiat Strada (PM-001)', 'Secretaria de Obras', 'Bairro Novo Horizonte', '2024-07-30 14:00', 'Agendada', 'Obras');
