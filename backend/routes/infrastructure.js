const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.resolve(__dirname, '../../.env');
const NEXUS_CONFIG_PATH = path.resolve(__dirname, '../../nexusbridge/config/nexus-settings.json');

/**
 * Leitor seguro de configurações do .env
 */
function readEnvConfig() {
    try {
        const envContent = fs.readFileSync(CONFIG_PATH, 'utf8');
        const config = {};
        envContent.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex === -1) return;
            const key = trimmed.substring(0, eqIndex).trim();
            const value = trimmed.substring(eqIndex + 1).trim();
            config[key] = value;
        });
        return config;
    } catch (e) {
        return {};
    }
}

/**
 * Escritor de configurações no .env (preserva comentários e estrutura)
 */
function writeEnvConfig(updates) {
    try {
        let envContent = '';
        try { envContent = fs.readFileSync(CONFIG_PATH, 'utf8'); } catch (e) { envContent = ''; }

        const lines = envContent.split('\n');
        const updatedKeys = new Set();

        const newLines = lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return line;
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex === -1) return line;
            const key = trimmed.substring(0, eqIndex).trim();
            if (updates.hasOwnProperty(key)) {
                updatedKeys.add(key);
                return `${key}=${updates[key]}`;
            }
            return line;
        });

        // Adicionar novas chaves que não existiam
        for (const [key, value] of Object.entries(updates)) {
            if (!updatedKeys.has(key)) {
                newLines.push(`${key}=${value}`);
            }
        }

        fs.writeFileSync(CONFIG_PATH, newLines.join('\n'), 'utf8');
        return true;
    } catch (e) {
        console.error('[Infrastructure] Erro ao salvar .env:', e.message);
        return false;
    }
}

module.exports = function(db) {

    /**
     * GET /api/infrastructure/config
     * Retorna a configuração atual (senhas mascaradas)
     */
    router.get('/infrastructure/config', authMiddleware, (req, res) => {
        // Apenas Dev/TI podem acessar
        if (!['dev', 'ti'].includes(req.user.role?.toLowerCase()) && 
            !['Desenvolvedor Global', 'TI - Infraestrutura'].includes(req.user.role)) {
            // Fallback: verificar pelo nome do cargo
            const r = (req.user.role || '').toLowerCase();
            if (!r.includes('desenvolvedor') && !r.includes('dev') && !r.includes('root') && !r.includes('ti') && !r.includes('infra')) {
                return res.status(403).json({ message: 'Acesso restrito a perfis de infraestrutura.' });
            }
        }

        const config = readEnvConfig();
        const mask = (val) => val ? val.substring(0, 3) + '•'.repeat(Math.max(0, val.length - 3)) : '';

        res.json({
            database: {
                type: config.DATABASE_URL ? 'postgresql' : 'sqlite',
                url: mask(config.DATABASE_URL || ''),
            },
            proxy: {
                enabled: config.CORS_ORIGIN ? true : false,
                allowedOrigins: config.CORS_ORIGIN || 'http://localhost:9002',
            },
            smtp: {
                host: config.SMTP_HOST || '',
                port: config.SMTP_PORT || '587',
                user: config.SMTP_USER || '',
                pass: mask(config.SMTP_PASS || ''),
                secure: config.SMTP_SECURE === 'true',
            },
            server: {
                port: config.PORT || '3001',
                demoMode: config.DEMO_MODE === 'true',
            },
            security: {
                jwtConfigured: !!config.JWT_SECRET,
                corsOrigin: config.CORS_ORIGIN || '',
            }
        });
    });

    /**
     * POST /api/infrastructure/test-db
     * Testa conexão com banco de dados
     */
    router.post('/infrastructure/test-db', authMiddleware, async (req, res) => {
        const { type, url } = req.body;

        try {
            if (type === 'postgresql') {
                const { Pool } = require('pg');
                const pool = new Pool({
                    connectionString: url,
                    ssl: { rejectUnauthorized: false },
                    connectionTimeoutMillis: 5000,
                });
                const client = await pool.connect();
                const result = await client.query('SELECT NOW() as time, current_database() as db');
                client.release();
                await pool.end();
                return res.json({
                    success: true,
                    message: 'Conexão PostgreSQL estabelecida com sucesso.',
                    details: {
                        serverTime: result.rows[0].time,
                        database: result.rows[0].db,
                    }
                });
            }

            if (type === 'sqlite') {
                const sqlite3 = require('sqlite3').verbose();
                return new Promise((resolve) => {
                    const dbPath = url || path.resolve(__dirname, '../database/citymotion.db');
                    const testDb = new sqlite3.Database(dbPath, (err) => {
                        if (err) {
                            res.json({ success: false, message: `Erro SQLite: ${err.message}` });
                        } else {
                            testDb.get("SELECT datetime('now') as time", (err, row) => {
                                testDb.close();
                                if (err) {
                                    res.json({ success: false, message: `Erro ao consultar: ${err.message}` });
                                } else {
                                    res.json({
                                        success: true,
                                        message: 'Conexão SQLite estabelecida com sucesso.',
                                        details: {
                                            serverTime: row?.time,
                                            path: dbPath,
                                        }
                                    });
                                }
                            });
                        }
                        resolve();
                    });
                });
            }

            if (type === 'mongodb') {
                // Teste básico de URL sem driver (validação de formato)
                const urlPattern = /^mongodb(\+srv)?:\/\/.+$/;
                if (!urlPattern.test(url)) {
                    return res.json({ success: false, message: 'Formato de URL MongoDB inválido. Exemplo: mongodb://user:pass@host:27017/dbname' });
                }
                return res.json({
                    success: true,
                    message: 'Formato de URL MongoDB válido. Para teste completo, instale o driver mongoose.',
                    details: { hint: 'npm install mongoose' }
                });
            }

            if (type === 'supabase') {
                // Validação de formato de URL Supabase (PostgreSQL compatível)
                if (!url.includes('supabase') && !url.includes('5432')) {
                    return res.json({ success: false, message: 'URL não parece ser do Supabase. Use o formato: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres' });
                }
                // Tenta como PostgreSQL
                const { Pool } = require('pg');
                const pool = new Pool({
                    connectionString: url,
                    ssl: { rejectUnauthorized: false },
                    connectionTimeoutMillis: 5000,
                });
                const client = await pool.connect();
                const result = await client.query('SELECT NOW() as time, current_database() as db');
                client.release();
                await pool.end();
                return res.json({
                    success: true,
                    message: 'Conexão Supabase (PostgreSQL) estabelecida com sucesso.',
                    details: {
                        serverTime: result.rows[0].time,
                        database: result.rows[0].db,
                    }
                });
            }

            res.json({ success: false, message: `Tipo de banco não suportado: ${type}` });
        } catch (err) {
            res.json({ success: false, message: `Falha na conexão: ${err.message}` });
        }
    });

    /**
     * POST /api/infrastructure/save
     * Salva configurações de infraestrutura no .env
     */
    router.post('/infrastructure/save', authMiddleware, (req, res) => {
        const { section, config } = req.body;

        if (!section || !config) {
            return res.status(400).json({ message: 'section e config são obrigatórios.' });
        }

        let updates = {};

        switch (section) {
            case 'database':
                if (config.type === 'sqlite') {
                    updates.DATABASE_URL = '';
                } else if (config.url) {
                    updates.DATABASE_URL = config.url;
                }
                break;

            case 'proxy':
                updates.CORS_ORIGIN = config.allowedOrigins || 'http://localhost:9002';
                break;

            case 'smtp':
                if (config.host !== undefined) updates.SMTP_HOST = config.host;
                if (config.port !== undefined) updates.SMTP_PORT = String(config.port);
                if (config.user !== undefined) updates.SMTP_USER = config.user;
                if (config.pass !== undefined && !config.pass.includes('•')) updates.SMTP_PASS = config.pass;
                if (config.secure !== undefined) updates.SMTP_SECURE = String(config.secure);
                break;

            case 'server':
                if (config.port !== undefined) updates.PORT = String(config.port);
                if (config.demoMode !== undefined) updates.DEMO_MODE = String(config.demoMode);
                break;

            default:
                return res.status(400).json({ message: `Seção desconhecida: ${section}` });
        }

        const success = writeEnvConfig(updates);

        if (success) {
            res.json({ success: true, message: `Configurações da seção "${section}" salvas. Reinicie o servidor para aplicar.` });
        } else {
            res.status(500).json({ success: false, message: 'Erro ao salvar configurações.' });
        }
    });

    /**
     * GET /api/infrastructure/nexus-config
     * Retorna a configuração atual do NexusBridge
     */
    router.get('/infrastructure/nexus-config', authMiddleware, (req, res) => {
        try {
            if (fs.existsSync(NEXUS_CONFIG_PATH)) {
                const config = JSON.parse(fs.readFileSync(NEXUS_CONFIG_PATH, 'utf8'));
                res.json(config);
            } else {
                res.json({ backends: {}, routes: [] });
            }
        } catch (e) {
            res.status(500).json({ message: 'Erro ao ler configuração do NexusBridge.' });
        }
    });

    /**
     * POST /api/infrastructure/nexus-config
     * Atualiza a configuração do NexusBridge
     */
    router.post('/infrastructure/nexus-config', authMiddleware, (req, res) => {
        try {
            const dir = path.dirname(NEXUS_CONFIG_PATH);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(NEXUS_CONFIG_PATH, JSON.stringify(req.body, null, 2), 'utf8');
            res.json({ success: true, message: 'Configuração do NexusBridge atualizada.' });
        } catch (e) {
            res.status(500).json({ message: 'Erro ao salvar configuração do NexusBridge.' });
        }
    });

    /**
     * POST /api/infrastructure/test-smtp
     * Testa conexão SMTP
     */
    router.post('/infrastructure/test-smtp', authMiddleware, async (req, res) => {
        const { host, port, user, pass, secure } = req.body;

        try {
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                host: host || 'smtp.gmail.com',
                port: parseInt(port) || 587,
                secure: secure === true || secure === 'true',
                auth: {
                    user: user,
                    pass: pass,
                },
                tls: { rejectUnauthorized: false },
                connectionTimeout: 5000,
            });

            await transporter.verify();
            res.json({ success: true, message: 'Conexão SMTP verificada com sucesso.' });
        } catch (err) {
            res.json({ success: false, message: `Falha SMTP: ${err.message}` });
        }
    });

    return router;
};
