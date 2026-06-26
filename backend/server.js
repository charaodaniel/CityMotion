
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do Pool de Conexão PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Teste de conexão
pool.connect((err, client, release) => {
    if (err) {
        console.error("\x1b[31m[ERRO CRÍTICO DB]:\x1b[0m Falha ao conectar ao PostgreSQL", err.stack);
    } else {
        console.log("\x1b[32m[CONECTADO]:\x1b[0m PostgreSQL Engine Ativa.");
        release();
    }
});

app.use(cors()); 
app.use(express.json());

// Logger de Requisições
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\x1b[36m[${timestamp}] API:\x1b[0m ${req.method} ${req.url}`);
    next();
});

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

app.use('/api', authRoutes(pool));
app.use('/api', dataRoutes(pool));

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ 
            status: 'online', 
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n\x1b[42m\x1b[30m NEXUS-CORE \x1b[0m Servidor rodando em http://0.0.0.0:${PORT}`);
});
