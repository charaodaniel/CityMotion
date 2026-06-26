
const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Nexus-Dual Persistence Manager
 * Gerencia a sincronização em tempo real entre SQLite (Local) e PostgreSQL (Nuvem)
 */

class DbManager {
    constructor() {
        // Inicializa SQLite
        const sqlitePath = path.resolve(__dirname, './citymotion.db');
        this.sqlite = new sqlite3.Database(sqlitePath, (err) => {
            if (err) console.error('[SQLite] Erro ao conectar:', err.message);
            else console.log('[SQLite] Persistência local ativa.');
        });

        // Inicializa PostgreSQL
        this.pgEnabled = !!process.env.DATABASE_URL;
        if (this.pgEnabled) {
            this.pgPool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: { rejectUnauthorized: false }
            });
            console.log('[PostgreSQL] Persistência em nuvem ativa.');
        } else {
            console.log('[PostgreSQL] DATABASE_URL não configurada. Operando apenas localmente.');
        }
    }

    // Helper para converter placeholder $1 para ? no SQLite
    toSqliteQuery(sql) {
        return sql.replace(/\$\d+/g, '?');
    }

    /**
     * Executa uma query de leitura (SELECT)
     * Prioriza Postgres, fallback para SQLite
     */
    async query(sql, params = []) {
        if (this.pgEnabled) {
            try {
                const { rows } = await this.pgPool.query(sql, params);
                return { rows };
            } catch (err) {
                console.warn('[Postgres Query Fail] Mudando para SQLite:', err.message);
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
     * Executa uma query de escrita em AMBOS os bancos simultaneamente
     */
    async execute(sql, params = []) {
        const tasks = [];

        // Escrita Postgres
        if (this.pgEnabled) {
            tasks.push(this.pgPool.query(sql, params).catch(e => console.error('[Sync Error Postgres]:', e.message)));
        }

        // Escrita SQLite
        tasks.push(new Promise((resolve, reject) => {
            this.sqlite.run(this.toSqliteQuery(sql), params, function(err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID, changes: this.changes });
            });
        }));

        const results = await Promise.all(tasks);
        return results[results.length - 1]; // Retorna resultado do SQLite (ou do último executado)
    }

    // Execução sequencial para scripts de init
    async runScript(sql) {
        if (this.pgEnabled) await this.pgPool.query(sql);
        return new Promise((resolve, reject) => {
            this.sqlite.exec(sql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = new DbManager();
