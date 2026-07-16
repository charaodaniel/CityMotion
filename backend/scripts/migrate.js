/**
 * CityMotion — Startup Migration Script
 *
 * Aplica migrações cirúrgicas no PostgreSQL que o drizzle-kit push não
 * conseguiu aplicar. Usa ALTER TABLE ... ADD COLUMN IF NOT EXISTS para
 * adicionar colunas faltantes sem risco de perda de dados.
 *
 * Uso:
 *   node backend/scripts/migrate.js
 *
 * Ou integrado no startCommand do render.yaml:
 *   cd backend && node scripts/migrate.js && node src/index.js
 */
import { getDb } from "../src/db/index.js";

const MIGRATIONS = [
  // Adiciona coluna supabase_user_id na tabela employees (se não existir)
  `ALTER TABLE employees ADD COLUMN IF NOT EXISTS supabase_user_id TEXT;`,
];

async function runMigrations() {
  const db = getDb();
  console.log("[Migrate] Verificando migrações pendentes...");

  for (const sql of MIGRATIONS) {
    try {
      await db.execute(sql);
      console.log(`[Migrate] ✅ Executado: ${sql.substring(0, 60)}...`);
    } catch (err) {
      // Ignorar erro se a coluna já existir (fallback para IF NOT EXISTS)
      if (err.message?.includes("already exists")) {
        console.log(`[Migrate] ⏭️ Já aplicado: ${sql.substring(0, 60)}...`);
      } else {
        console.error(`[Migrate] ❌ Erro: ${err.message}`);
      }
    }
  }

  console.log("[Migrate] Migrações concluídas.");
}

runMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[Migrate] Falha fatal:", err.message);
    process.exit(1);
  });
