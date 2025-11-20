

-- Tabela de Setores
CREATE TABLE sectors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- Inserção de Setores
INSERT INTO sectors (name, description) VALUES
('Gabinete do Prefeito', 'Assessoramento direto ao Prefeito e Vice-Prefeito.'),
('Secretaria de Administração e Planejamento', 'Gestão de pessoal, patrimônio, planejamento e modernização administrativa.'),
('Secretaria da Fazenda', 'Responsável pela gestão financeira, tributária e contábil do município.'),
('Secretaria de Educação, Cultura, Desporto e Lazer', 'Administração de escolas, creches, transporte escolar e fomento à cultura e esporte.'),
('Secretaria de Saúde', 'Gestão de saúde pública, hospitais, postos de saúde e vigilância sanitária.'),
('Secretaria de Obras, Viação e Urbanismo', 'Manutenção de vias, construções, infraestrutura urbana e serviços urbanos.'),
('Secretaria de Assistência Social', 'Políticas de assistência social, proteção a famílias, crianças, adolescentes e idosos.'),
('Secretaria de Agricultura e Meio Ambiente', 'Apoio ao produtor rural, desenvolvimento agrário e políticas ambientais.'),
('Secretaria de Turismo e Desenvolvimento Econômico', 'Fomento ao turismo, desenvolvimento econômico, indústria e comércio.');


-- Tabela de Funcionários
CREATE TABLE employees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    cnh TEXT,
    sector TEXT NOT NULL, -- Armazenará um JSON array: '["Setor A", "Setor B"]'
    status TEXT NOT NULL CHECK(status IN ('Disponível', 'Em Viagem', 'Afastado', 'Em Serviço')),
    matricula TEXT UNIQUE,
    idPhoto TEXT,
    cnhPhoto TEXT
);

-- Inserção de Funcionários
INSERT INTO employees (name, email, password, role, cnh, sector, status, matricula) VALUES
('João da Silva', 'joao.silva@citymotion.com', '123456', 'Motorista', '123456789', '["Secretaria de Obras, Viação e Urbanismo"]', 'Em Serviço', 'M-001'),
('Maria Oliveira', 'maria.oliveira@citymotion.com', '123456', 'Gestor de Setor', '987654321', '["Secretaria de Saúde"]', 'Disponível', 'M-002'),
('Pedro Santos', 'pedro.santos@citymotion.com', '123456', 'Assessor de Comunicação', NULL, '["Gabinete do Prefeito"]', 'Disponível', 'ADM-003'),
('Ana Souza', 'employee@citymotion.com', '123456', 'Professor(a)', NULL, '["Secretaria de Educação, Cultura, Desporto e Lazer"]', 'Afastado', 'EDU-004'),
('Carlos Pereira', 'carlos.pereira@citymotion.com', '123456', 'Agente de Arrecadação', NULL, '["Secretaria da Fazenda"]', 'Disponível', 'FAZ-005'),
('Lúcia Ferreira', 'lucia.ferreira@citymotion.com', '123456', 'Enfermeira', NULL, '["Secretaria de Saúde"]', 'Disponível', 'SAU-006'),
('Roberto Alves', 'roberto.alves@citymotion.com', '123456', 'Operador de Máquinas', '456456456', '["Secretaria de Obras, Viação e Urbanismo"]', 'Disponível', 'OBR-007'),
('Fernanda Costa', 'fernanda.costa@citymotion.com', '123456', 'Assistente Social', '789789789', '["Secretaria de Assistência Social"]', 'Disponível', 'SOC-008'),
('Marcos Lima', 'driver@citymotion.com', '123456', 'Motorista Escolar', '111222333', '["Secretaria de Educação, Cultura, Desporto e Lazer"]', 'Em Viagem', 'M-009'),
('Beatriz Rocha', 'beatriz.rocha@citymotion.com', '123456', 'Médica Clínica Geral', NULL, '["Secretaria de Saúde"]', 'Disponível', 'SAU-010'),
('Júlio César', 'admin@citymotion.com', '123456', 'Prefeito', NULL, '["Gabinete do Prefeito"]', 'Em Serviço', 'GP-001'),
('Ricardo Nunes', 'manager@citymotion.com', '123456', 'Engenheiro Civil', '444555666', '["Secretaria de Obras, Viação e Urbanismo", "Secretaria de Agricultura e Meio Ambiente"]', 'Disponível', 'OBR-012'),
('Laura Martins', 'laura.martins@citymotion.com', '123456', 'Psicóloga', NULL, '["Secretaria de Assistência Social"]', 'Disponível', 'SOC-013'),
('Felipe Arruda', 'felipe.arruda@citymotion.com', '123456', 'Veterinário', NULL, '["Secretaria de Agricultura e Meio Ambiente"]', 'Em Viagem', 'AGR-014'),
('Patrícia Borges', 'patricia.borges@citymotion.com', '123456', 'Secretária de Administração', NULL, '["Secretaria de Administração e Planejamento"]', 'Disponível', 'ADM-001'),
('Lucas Gabriel', 'lucas.gabriel@citymotion.com', '123456', 'Estagiário de TI', NULL, '["Secretaria de Administração e Planejamento"]', 'Disponível', 'EST-001'),
('Sérgio Moraes', 'mecanico@citymotion.com', '123456', 'Mecânico Chefe', '777888999', '["Secretaria de Obras, Viação e Urbanismo"]', 'Disponível', 'MEC-001');

-- Tabela de Veículos
CREATE TABLE vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK(status IN ('Disponível', 'Em Serviço', 'Em Viagem', 'Manutenção')),
    mileage REAL NOT NULL,
    sector TEXT NOT NULL,
    FOREIGN KEY (sector) REFERENCES sectors(name)
);

-- Inserção de Veículos
INSERT INTO vehicles (vehicleModel, licensePlate, status, mileage, sector) VALUES
('Fiat Strada', 'PM-001', 'Em Serviço', 15000, 'Secretaria de Obras, Viação e Urbanismo'),
('VW Gol', 'PM-002', 'Disponível', 8525, 'Secretaria de Saúde'),
('Renault Kwid', 'PM-003', 'Em Viagem', 22000, 'Secretaria de Administração e Planejamento'),
('Chevrolet Onix', 'PM-004', 'Manutenção', 41000, 'Secretaria de Educação, Cultura, Desporto e Lazer'),
('Fiat Mobi', 'PM-005', 'Em Viagem', 5200, 'Secretaria de Agricultura e Meio Ambiente'),
('Toyota Hilux', 'PM-006', 'Disponível', 32000, 'Secretaria de Obras, Viação e Urbanismo'),
('Hyundai HB20', 'PM-007', 'Disponível', 1200, 'Secretaria de Administração e Planejamento');

-- Tabela de Viagens (Trips)
CREATE TABLE trips (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    driver TEXT NOT NULL,
    vehicle TEXT NOT NULL,
    origin TEXT,
    destination TEXT,
    departureTime TEXT NOT NULL,
    arrivalTime TEXT,
    startMileage REAL,
    endMileage REAL,
    status TEXT NOT NULL CHECK(status IN ('Agendada', 'Em Andamento', 'Concluída', 'Cancelada')),
    category TEXT,
    passengers TEXT, -- JSON
    startNotes TEXT,
    endNotes TEXT,
    startChecklist TEXT, -- JSON
    endChecklist TEXT, -- JSON
    refuelings TEXT -- JSON
);

-- Inserção de Viagens
INSERT INTO trips (title, driver, vehicle, origin, destination, departureTime, arrivalTime, startMileage, endMileage, status, category) VALUES
('Transporte de Paciente', 'Maria Oliveira', 'VW Gol (PM-002)', 'Posto de Saúde Central', 'Hospital Regional', '28/07/2024 08:00', '28/07/2024 09:15', 8500, 8525, 'Concluída', 'Saúde'),
('Entrega de Documentos', 'Pedro Santos', 'Renault Kwid (PM-003)', 'Prefeitura', 'Secretaria de Educação', '29/07/2024 09:30', NULL, 22000, NULL, 'Em Andamento', 'Administrativo'),
('Visita Técnica em Obra', 'João da Silva', 'Fiat Strada (PM-001)', 'Secretaria de Obras', 'Bairro Novo Horizonte', '30/07/2024 14:00', NULL, NULL, NULL, 'Agendada', 'Obras'),
('Inspeção Sanitária', 'Carlos Pereira', 'Fiat Mobi (PM-005)', 'Vigilância Sanitária', 'Restaurante Central', '27/07/2024 11:00', '27/07/2024 12:30', 5150, 5165, 'Concluída', 'Saúde'),
('Linha Escolar - Rota 3', 'Marcos Lima', 'Chevrolet Onix (PM-004)', 'Garagem Central', 'Escola Municipal Monteiro Lobato', '31/07/2024 06:30', NULL, NULL, NULL, 'Agendada', 'Educação'),
('Reunião Externa', 'Fernanda Costa', 'Hyundai HB20 (PM-007)', 'Paço Municipal', 'Câmara de Vereadores', '31/07/2024 10:00', NULL, NULL, NULL, 'Agendada', 'Administrativo');


-- Tabela de Solicitações de Veículo
CREATE TABLE vehicle_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    sector TEXT NOT NULL,
    details TEXT,
    priority TEXT NOT NULL CHECK(priority IN ('Alta', 'Média', 'Baixa')),
    requestDate TEXT NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Pendente', 'Aprovada', 'Rejeitada')),
    requester TEXT
);

-- Inserção de Solicitações
INSERT INTO vehicle_requests (title, sector, details, priority, requestDate, status, requester) VALUES
('Buscar materiais de construção', 'Secretaria de Obras, Viação e Urbanismo', 'É necessário um veículo com caçamba para buscar cimento e areia no fornecedor X.', 'Alta', '2024-07-29T10:00:00Z', 'Pendente', 'João da Silva'),
('Levar equipe para evento', 'Secretaria de Educação, Cultura, Desporto e Lazer', 'Transportar 3 pessoas da equipe de eventos para a Praça Central para a montagem do palco.', 'Média', '2024-07-29T11:30:00Z', 'Pendente', 'Carlos Pereira'),
('Transporte de paciente para fisioterapia', 'Secretaria de Saúde', 'Paciente: Sr. José, precisa de transporte para sessão de fisioterapia no Centro de Reabilitação.', 'Alta', '2024-07-30T08:00:00Z', 'Aprovada', 'Maria Oliveira'),
('Coleta de amostras de água', 'Secretaria de Agricultura e Meio Ambiente', 'Realizar coleta em 3 pontos distintos da cidade para análise da qualidade da água.', 'Média', '2024-07-30T09:15:00Z', 'Pendente', 'Carlos Pereira'),
('Levar documentos para o Fórum', 'Secretaria de Administração e Planejamento', 'Entrega de ofícios urgentes no Fórum da cidade.', 'Alta', '2024-08-01T14:00:00Z', 'Pendente', 'Pedro Santos'),
('Viagem para Porto Alegre', 'Secretaria de Educação, Cultura, Desporto e Lazer', 'Transportar a funcionária Ana Souza para um seminário na capital.', 'Baixa', '2024-08-02T09:00:00Z', 'Pendente', 'Ana Souza');

-- Tabela de Escalas de Trabalho
CREATE TABLE work_schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    employee TEXT NOT NULL,
    type TEXT NOT NULL,
    status TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    description TEXT
);

-- Inserção de Escalas
INSERT INTO work_schedules (title, employee, type, status, startDate, endDate, description) VALUES
('Plantão Fim de Semana', 'João da Silva', 'Plantão', 'Agendada', '03/08/2024', '04/08/2024', 'Plantão de 24h para emergências do setor de obras.'),
('Jornada Regular - Agosto', 'Maria Oliveira', 'Jornada Regular', 'Em Andamento', '01/08/2024', '31/08/2024', NULL),
('Folga Compensatória', 'Pedro Santos', 'Folga', 'Concluída', '29/07/2024', '29/07/2024', NULL),
('Férias', 'Ana Souza', 'Férias', 'Em Andamento', '15/07/2024', '05/08/2024', 'Retorno previsto para 06/08/2024.'),
('Sobreaviso - Noturno', 'Carlos Pereira', 'Sobreaviso', 'Agendada', '01/08/2024', '07/08/2024', 'Disponível para chamados de emergência da vigilância sanitária no período noturno.');

-- Tabela de Solicitações de Manutenção
CREATE TABLE maintenance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicleId INTEGER NOT NULL,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT NOT NULL,
    requesterName TEXT NOT NULL,
    requestDate TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (vehicleId) REFERENCES vehicles(id)
);

-- Tabela de Pedidos de Peças (associado a uma manutenção)
CREATE TABLE part_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    maintenanceRequestId INTEGER NOT NULL,
    partName TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    supplier TEXT,
    justification TEXT NOT NULL,
    requestDate TEXT NOT NULL,
    status TEXT NOT NULL, -- Ex: 'Pendente', 'Aprovado', 'Comprado', 'Rejeitado'
    FOREIGN KEY (maintenanceRequestId) REFERENCES maintenance_requests(id)
);
