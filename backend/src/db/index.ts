import 'dotenv/config';
import { drizzle } from 'drizzle-orm/pg';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { Pool } from 'pg';
import Database from 'better-sqlite3';
import path from 'path';
import * as pgSchema from './pg-schema';
import * as sqliteSchema from './sqlite-schema';
import { getEnv, isPostgresEnabled } from '../config/env';

type DbType = ReturnType<typeof drizzle<typeof pgSchema>> | ReturnType<typeof drizzleSqlite<typeof sqliteSchema>>;
type Schema = typeof pgSchema | typeof sqliteSchema;

let _db: DbType | null = null;
let _schema: Schema | null = null;

export function getDb(): DbType {
  if (!_db) {
    const env = getEnv();

    if (isPostgresEnabled()) {
      const pool = new Pool({
        connectionString: env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      });
      _db = drizzle(pool, { schema: pgSchema });
      _schema = pgSchema;
      console.log('\x1b[36m[PostgreSQL] Conectado à nuvem.\x1b[0m');
    } else {
      const dbPath = path.resolve(__dirname, '../../database/citymotion.db');
      const sqliteDb = new Database(dbPath);
      _db = drizzleSqlite(sqliteDb, { schema: sqliteSchema });
      _schema = sqliteSchema;
      console.log('\x1b[32m[SQLite] Kernel local ativo.\x1b[0m');
    }
  }
  return _db;
}

export function getSchema(): Schema {
  if (!_schema) getDb();
  return _schema!;
}

export { pgSchema, sqliteSchema };
