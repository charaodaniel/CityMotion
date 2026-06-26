
-- CityMotion Master Schema (Hybrid: SQLite & PostgreSQL)
-- Este arquivo define a estrutura para persistência local e em nuvem.

-- 1. TABELA DE FUNCIONÁRIOS (Lotação e Segurança)
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    sector TEXT, -- Armazenado como JSON String ["Setor A", "Setor B"]
    status TEXT DEFAULT 'Disponível',
    matricula TEXT UNIQUE,
    cnh TEXT,
    reset_token TEXT,
    reset_expires TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE VEÍCULOS (Ativos de Frota)
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    vehicleModel TEXT NOT NULL,
    licensePlate TEXT UNIQUE NOT NULL,
    sector TEXT NOT NULL,
    mileage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'Disponível',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE SETORES
CREATE TABLE IF NOT EXISTS sectors (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE VIAGENS (Missões Logísticas)
CREATE TABLE IF NOT EXISTS trips (
    id SERIAL PRIMARY KEY,
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
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABELA DE MENSAGENS (Chat Técnico)
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABELA DE ABASTECIMENTOS
CREATE TABLE IF NOT EXISTS refuelings (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL,
    driver_name TEXT NOT NULL,
    mileage INTEGER NOT NULL,
    liters DECIMAL(10,2) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total_value DECIMAL(10,2) NOT NULL,
    fuel_type TEXT NOT NULL,
    gas_station TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABELA DE MANUTENÇÃO
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id SERIAL PRIMARY KEY,
    vehicle_id INTEGER NOT NULL,
    requester_name TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'Pendente',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. TRILHA DE AUDITORIA (Nexus-Audit)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_identity TEXT,
    action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
    table_name TEXT NOT NULL,
    old_data TEXT, -- JSON
    new_data TEXT, -- JSON
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- REGRAS E TRIGGERS PARA POSTGRESQL
-- ==========================================

-- Função para registrar auditoria automaticamente no Postgres
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'process_audit_log') THEN
        CREATE OR REPLACE FUNCTION process_audit_log() RETURNS TRIGGER AS $body$
        DECLARE
            v_user TEXT;
        BEGIN
            -- Tenta obter o usuário da sessão configurado pelo DbManager
            BEGIN
                v_user := current_setting('citymotion.current_user_name');
            EXCEPTION WHEN OTHERS THEN
                v_user := 'SYSTEM_SERVICE';
            END;

            IF (TG_OP = 'INSERT') THEN
                INSERT INTO audit_logs (user_identity, action, table_name, new_data)
                VALUES (v_user, 'INSERT', TG_TABLE_NAME, row_to_json(NEW)::text);
                RETURN NEW;
            ELSIF (TG_OP = 'UPDATE') THEN
                INSERT INTO audit_logs (user_identity, action, table_name, old_data, new_data)
                VALUES (v_user, 'UPDATE', TG_TABLE_NAME, row_to_json(OLD)::text, row_to_json(NEW)::text);
                RETURN NEW;
            ELSIF (TG_OP = 'DELETE') THEN
                INSERT INTO audit_logs (user_identity, action, table_name, old_data)
                VALUES (v_user, 'DELETE', TG_TABLE_NAME, row_to_json(OLD)::text);
                RETURN OLD;
            END IF;
            RETURN NULL;
        END;
        $body$ LANGUAGE plpgsql;
    END IF;
END $$;

-- Aplicação dos triggers de segurança
-- Nota: O script de inicialização ignora erros se o trigger já existir (Postgres 9.0+)
DO $$
BEGIN
    -- Trigger para employees
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trig_audit_employees') THEN
        CREATE TRIGGER trig_audit_employees AFTER INSERT OR UPDATE OR DELETE ON employees FOR EACH ROW EXECUTE FUNCTION process_audit_log();
    END IF;
    -- Trigger para vehicles
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trig_audit_vehicles') THEN
        CREATE TRIGGER trig_audit_vehicles AFTER INSERT OR UPDATE OR DELETE ON vehicles FOR EACH ROW EXECUTE FUNCTION process_audit_log();
    END IF;
END $$;
