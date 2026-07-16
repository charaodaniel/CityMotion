-- =============================================================
-- CityMotion — Políticas RLS (Row Level Security)
--
-- Como usar:
--   1. Acesse o SQL Editor do Supabase Dashboard
--   2. Cole e execute todo este script
--   3. As políticas entrarão em vigor imediatamente
--
-- Requisitos:
--   - Os usuários do Supabase Auth devem ter em user_metadata:
--       { "name": "...", "role": "...", "sector": "..." }
--   - sync-users.ts já faz isso automaticamente
-- =============================================================

-- =============================================================
-- 1. EMPLOYEES (Funcionários)
-- =============================================================
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver APENAS seu próprio registro
-- Admins/Devs podem ver todos
CREATE POLICY "Usuários veem seu próprio perfil"
ON employees
FOR SELECT
TO authenticated
USING (
  auth.uid()::text = supabase_user_id
  OR
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root', 'Gestor de Setor')
);

-- Apenas admins podem criar novos funcionários
CREATE POLICY "Apenas admins criam funcionários"
ON employees
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root')
);

-- Usuários podem atualizar próprio perfil; admins atualizam qualquer um
CREATE POLICY "Usuários editam próprio perfil, admins editam todos"
ON employees
FOR UPDATE
TO authenticated
USING (
  auth.uid()::text = supabase_user_id
  OR
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root')
)
WITH CHECK (
  auth.uid()::text = supabase_user_id
  OR
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root')
);

-- Apenas admins podem deletar
CREATE POLICY "Apenas admins deletam funcionários"
ON employees
FOR DELETE
TO authenticated
USING (
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root')
);

-- =============================================================
-- 2. VEHICLES (Veículos)
-- =============================================================
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

-- Todos usuários autenticados podem ver veículos
CREATE POLICY "Usuários autenticados veem veículos"
ON vehicles
FOR SELECT
TO authenticated
USING (true);

-- Apenas admins/gestores podem criar/editar/deletar veículos
CREATE POLICY "Apenas admins criam veículos"
ON vehicles
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root', 'Gestor de Setor')
);

CREATE POLICY "Apenas admins editam veículos"
ON vehicles
FOR UPDATE
TO authenticated
USING (
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root', 'Gestor de Setor')
);

CREATE POLICY "Apenas admins deletam veículos"
ON vehicles
FOR DELETE
TO authenticated
USING (
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root')
);

-- =============================================================
-- 3. TRIPS (Viagens/Missões)
-- =============================================================
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Motoristas veem suas próprias viagens; admins veem todas
CREATE POLICY "Motoristas veem próprias viagens, admins veem todas"
ON trips
FOR SELECT
TO authenticated
USING (
  driver = (SELECT auth.jwt() -> 'user_metadata' ->> 'name')
  OR
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root', 'Gestor de Setor')
);

-- Apenas admins/gestores criam viagens
CREATE POLICY "Apenas admins e gestores criam viagens"
ON trips
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root', 'Gestor de Setor')
);

CREATE POLICY "Apenas admins editam viagens"
ON trips
FOR UPDATE
TO authenticated
USING (
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root')
);

-- =============================================================
-- 4. MESSAGES (Chat)
--
-- ⚠️  ATENÇÃO: A coluna sender_id armazena o ID do funcionário local
--    (inteiro) para mensagens antigas. Para mensagens criadas após
--    a sincronização com Supabase, sender_id armazena o UUID do
--    Supabase Auth.
--
--    A política abaixo verifica AMBOS: o UUID do Supabase (auth.uid())
--    E o ID local armazenado em app_metadata.user_local_id.
--
--    Para que funcione corretamente, o user_metadata de cada usuário
--    deve conter:
--      { "name": "...", "role": "...", "user_local_id": "123" }
--
--    O script sync-users.ts já faz isso automaticamente.
-- =============================================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Usuários só veem mensagens onde são sender OU receiver
-- Compatível com: UUID (novo) e local ID (antigo) via user_metadata
CREATE POLICY "Usuários veem próprias mensagens"
ON messages
FOR SELECT
TO authenticated
USING (
  sender_id = auth.uid()::text
  OR receiver_id = auth.uid()::text
  OR sender_id = (SELECT auth.jwt() -> 'user_metadata' ->> 'user_local_id')
  OR receiver_id = (SELECT auth.jwt() -> 'user_metadata' ->> 'user_local_id')
);

-- Usuários podem enviar mensagens como próprio sender_id
CREATE POLICY "Usuários enviam mensagens"
ON messages
FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()::text
  OR sender_id = (SELECT auth.jwt() -> 'user_metadata' ->> 'user_local_id')
);

-- =============================================================
-- 5. REFUELINGS (Abastecimentos)
-- =============================================================
ALTER TABLE refuelings ENABLE ROW LEVEL SECURITY;

-- Todos usuários autenticados veem abastecimentos
CREATE POLICY "Usuários autenticados veem abastecimentos"
ON refuelings
FOR SELECT
TO authenticated
USING (true);

-- Qualquer usuário autenticado pode registrar abastecimento
CREATE POLICY "Usuários registram abastecimentos"
ON refuelings
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Apenas admins editam/deletam abastecimentos
CREATE POLICY "Apenas admins editam abastecimentos"
ON refuelings
FOR UPDATE
TO authenticated
USING (
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root')
);

-- =============================================================
-- 6. MAINTENANCE REQUESTS
-- =============================================================
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem solicitações de manutenção"
ON maintenance_requests
FOR SELECT
TO authenticated
USING (
  requester_name = (SELECT auth.jwt() -> 'user_metadata' ->> 'name')
  OR
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root', 'Gestor de Setor')
);

CREATE POLICY "Usuários criam solicitações de manutenção"
ON maintenance_requests
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Apenas admins editam solicitações"
ON maintenance_requests
FOR UPDATE
TO authenticated
USING (
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root')
);

-- =============================================================
-- 7. WORK SCHEDULES (Escalas)
-- =============================================================
ALTER TABLE work_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem próprias escalas"
ON work_schedules
FOR SELECT
TO authenticated
USING (
  employee = (SELECT auth.jwt() -> 'user_metadata' ->> 'name')
  OR
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root', 'Gestor de Setor')
);

CREATE POLICY "Apenas gestores criam escalas"
ON work_schedules
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root', 'Gestor de Setor')
);

-- =============================================================
-- 8. VEHICLE REQUESTS (Solicitações)
-- =============================================================
ALTER TABLE vehicle_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem próprias solicitações"
ON vehicle_requests
FOR SELECT
TO authenticated
USING (
  requester = (SELECT auth.jwt() -> 'user_metadata' ->> 'name')
  OR
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root', 'Gestor de Setor')
);

CREATE POLICY "Usuários criam solicitações"
ON vehicle_requests
FOR INSERT
TO authenticated
WITH CHECK (true);

-- =============================================================
-- 9. SECTORS (Setores)
-- =============================================================
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos veem setores"
ON sectors
FOR SELECT
TO authenticated
USING (true);

-- =============================================================
-- 10. ORGANIZATIONS
-- =============================================================
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos veem organizações"
ON organizations
FOR SELECT
TO authenticated
USING (true);

-- =============================================================
-- 11. AUDIT LOGS
-- =============================================================
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apenas admins veem audit logs"
ON audit_logs
FOR SELECT
TO authenticated
USING (
  (SELECT auth.jwt() -> 'user_metadata' ->> 'role') IN ('Administrador', 'Desenvolvedor Global', 'root')
);

-- =============================================================
-- VERIFICAÇÃO
-- =============================================================
-- Para verificar se as políticas foram aplicadas:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
