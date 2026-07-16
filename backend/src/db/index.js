import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { Pool } from "pg";
import Database from "better-sqlite3";
import path from "path";
import * as pgSchema from "./pg-schema.js";
import * as sqliteSchema from "./sqlite-schema.js";
import { getEnv, isPostgresEnabled } from "../config/env.js";
import { esmDirname } from "../utils/path.js";
const __dirname = esmDirname(import.meta.url);
let _db = null;
let _schema = null;
function getDb() {
  if (!_db) {
    const env = getEnv();
    if (isPostgresEnabled()) {
      const pool = new Pool({
        connectionString: env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 10,                        // máximo de conexões simultâneas no pool
        idleTimeoutMillis: 30000,       // 30s de inatividade → fecha conexão
        connectionTimeoutMillis: 5000   // 5s timeout para estabelecer nova conexão
      });
      _db = drizzle(pool, { schema: pgSchema });
      _schema = pgSchema;
      console.log("\x1B[36m[PostgreSQL] Conectado \xE0 nuvem.\x1B[0m");
    } else {
      const dbPath = path.resolve(__dirname, "../../database/citymotion.db");
      const sqliteDb = new Database(dbPath);
      _db = drizzleSqlite(sqliteDb, { schema: sqliteSchema });
      _schema = sqliteSchema;
      console.log("\x1B[32m[SQLite] Kernel local ativo.\x1B[0m");
    }
  }
  return _db;
}
function getSchema() {
  if (!_schema) getDb();
  return _schema;
}
export {
  getDb,
  getSchema,
  pgSchema,
  sqliteSchema
};
