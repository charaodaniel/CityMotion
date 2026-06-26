
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const db = require('./database/db_manager');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.json());

// Logger de Requisições Técnica
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`\x1b[36m[${timestamp}] API:\x1b[0m ${req.method} ${req.url}`);
    next();
});

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

app.use('/api', authRoutes(db));
app.use('/api', dataRoutes(db));

app.get('/api/health', async (req, res) => {
    try {
        const dbStatus = await db.query('SELECT 1');
        res.json({ 
            status: 'online', 
            persistence: process.env.DATABASE_URL ? 'Dual (Local+Cloud)' : 'Local Only',
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        res.status(500).json({ status: 'error', database: 'disconnected' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n\x1b[42m\x1b[30m NEXUS-CORE \x1b[0m Servidor rodando em http://0.0.0.0:${PORT}`);
    console.log(`\x1b[33m[Sync]:\x1b[0m SQLite e PostgreSQL operando em modo espelhado.\x1b[0m\n`);
});
