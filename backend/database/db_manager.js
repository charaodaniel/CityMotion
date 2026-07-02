
const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Nexus-Dual Persistence Manager
 * Gerencia a sincronização em tempo real entre SQLite (Local) e PostgreSQL (Cloud).
 */

class DbManager {
    constructor() {
        const sqlitePath = path.resolve(__dirname, './citymotion.db');
        
        this.sqlite = new sqlite3.Database(sqlitePath, (err) => {
            if (err) console.error('\x1b[31m[SQLite] ERRO:\x1b[0m', err.message);
            else console.log('\x1b[32m[SQLite] Kernel local ativo.\x1b[0m');
        });

        this.pgEnabled = !!process.env.DATABASE_URL;
        if (this.pgEnabled) {
            this.pgPool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: { rejectUnauthorized: false }
            });
            console.log('\x1b[36m[PostgreSQL] Nuvem conectada (Render/External).\x1b[0m');
        }
    }

    /**
     * Tradutor de dialeto SQL: Converte $1 para ? no SQLite
     */
    toSqliteQuery(sql) {
        return sql.replace(/\$\d+/g, '?');
    }

    /**
     * Injeta identidade do usuário na sessão do Postgres para Auditoria/RLS
     */
    async setPgIdentity(client, user) {
        if (!user) return;
        const userName = (user.name || 'Anonymous').replace(/[^a-zA-Z0-9_@.\- ]/g, '');
        await client.query('SET LOCAL citymotion.current_user_name = $1', [userName]);
    }

    async query(sql, params = []) {
        if (this.pgEnabled) {
            try {
                const { rows } = await this.pgPool.query(sql, params);
                return { rows };
            } catch (err) {
                console.warn('\x1b[33m[PG Fallback]:\x1b[0m Lendo do banco local.');
            }
        }

        return new Promise((resolve, reject) => {
            this.sqlite.all(this.toSqliteQuery(sql), params, (err, rows) => {
                if (err) reject(err);
                else resolve({ rows });
            });
        });
    }

    /**
     * Execução de Escrita Sincronizada
     * Agora suporta o parâmetro 'user' para registrar quem fez a ação.
     */
    async execute(sql, params = [], user = null) {
        const tasks = [];

        if (this.pgEnabled) {
            tasks.push((async () => {
                const client = await this.pgPool.connect();
                try {
                    await client.query('BEGIN');
                    await this.setPgIdentity(client, user);
                    const res = await client.query(sql, params);
                    await client.query('COMMIT');
                    return res;
                } catch (e) {
                    await client.query('ROLLBACK');
                    console.error('[PG Sync Error]:', e.message);
                } finally {
                    client.release();
                }
            })());
        }

        tasks.push(new Promise((resolve, reject) => {
            this.sqlite.run(this.toSqliteQuery(sql), params, function(err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID, changes: this.changes });
            });
        }));

        const results = await Promise.all(tasks);
        return results[results.length - 1];
    }

    async runScript(sql) {
        if (this.pgEnabled) {
            try {
                await this.pgPool.query(sql);
            } catch (e) {
                console.log("PG Script Info:", e.message);
            }
        }
        return new Promise((resolve, reject) => {
            this.sqlite.exec(sql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = new DbManager();
