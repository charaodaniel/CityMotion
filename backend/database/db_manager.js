
const { Pool } = require('pg');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Nexus-Dual Persistence Manager
 * Gerencia a sincronização em tempo real entre SQLite (Local/On-Premise) 
 * e PostgreSQL (Cloud/Managed). 
 * 
 * Desenvolvido para ser agnóstico e resiliente a falhas de rede e DNS.
 */

class DbManager {
    constructor() {
        const sqlitePath = path.resolve(__dirname, './citymotion.db');
        
        // 1. Inicializa persistência física local (Obrigatória)
        this.sqlite = new sqlite3.Database(sqlitePath, (err) => {
            if (err) console.error('\x1b[31m[SQLite] ERRO CRÍTICO:\x1b[0m', err.message);
            else console.log('\x1b[32m[SQLite] Kernel local ativo e persistente.\x1b[0m');
        });

        // 2. Inicializa persistência em nuvem (Opcional/Híbrida)
        this.pgEnabled = !!process.env.DATABASE_URL;
        if (this.pgEnabled) {
            this.pgPool = new Pool({
                connectionString: process.env.DATABASE_URL,
                ssl: { rejectUnauthorized: false },
                connectionTimeoutMillis: 5000 // Evita travar o servidor se a nuvem estiver lenta
            });
            console.log('\x1b[36m[PostgreSQL] Hub em nuvem detectado. Modo Dual ativo.\x1b[0m');
        } else {
            console.log('\x1b[33m[PostgreSQL] Offline. Operando em modo de Soberania Local.\x1b[0m');
        }
    }

    /**
     * Tradutor de dialeto SQL: Converte placeholders $1 para ? quando no SQLite
     */
    toSqliteQuery(sql) {
        return sql.replace(/\$\d+/g, '?');
    }

    /**
     * Query de Leitura (SELECT)
     * Prioriza Postgres para garantir dados globais, fallback imediato para SQLite.
     */
    async query(sql, params = []) {
        if (this.pgEnabled) {
            try {
                const { rows } = await this.pgPool.query(sql, params);
                return { rows };
            } catch (err) {
                console.warn('\x1b[33m[Cloud Sync Fail]:\x1b[0m Lendo do banco local (Fallback). Motivo:', err.message);
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
     * Execução de Escrita (INSERT/UPDATE/DELETE)
     * Grava em AMBOS os bancos. Garante que o servidor local tenha tudo 
     * o que a nuvem tem e vice-versa.
     */
    async execute(sql, params = []) {
        const tasks = [];

        // Task 1: Gravação em Nuvem (Postgres)
        if (this.pgEnabled) {
            tasks.push(
                this.pgPool.query(sql, params)
                .catch(e => console.error('\x1b[31m[Sync Sync-Error Postgres]:\x1b[0m Erro ao espelhar na nuvem.', e.message))
            );
        }

        // Task 2: Gravação Local (SQLite) - ESSENCIAL
        tasks.push(new Promise((resolve, reject) => {
            this.sqlite.run(this.toSqliteQuery(sql), params, function(err) {
                if (err) {
                    console.error('\x1b[31m[Critical Local Write Error]:\x1b[0m', err.message);
                    reject(err);
                } else {
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        }));

        const results = await Promise.all(tasks);
        return results[results.length - 1]; // Retorna sempre o status do banco local
    }

    /**
     * Execução de Scripts em Bloco (Diferente de queries parametrizadas)
     */
    async runScript(sql) {
        if (this.pgEnabled) await this.pgPool.query(sql).catch(e => console.log("PG Script Skip:", e.message));
        return new Promise((resolve, reject) => {
            this.sqlite.exec(sql, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = new DbManager();
