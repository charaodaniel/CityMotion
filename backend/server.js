
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Conexão com o Banco de Dados
const dbPath = path.resolve(__dirname, 'database', 'citymotion.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Inicializa a conexão com o banco
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("\x1b[31m[ERRO CRÍTICO DB]:\x1b[0m", err.message);
        process.exit(1);
    } else {
        console.log("\x1b[32m[CONECTADO]:\x1b[0m SQLite Kernel em: " + dbPath);
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

app.use('/api', authRoutes(db));
app.use('/api', dataRoutes(db));

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'online', 
        database: fs.existsSync(dbPath) ? 'ready' : 'missing',
        timestamp: new Date().toISOString()
    });
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n\x1b[42m\x1b[30m NEXUS-CORE \x1b[0m Servidor rodando em http://127.0.0.1:${PORT}`);
    console.log(`\x1b[34m[Integridade]:\x1b[0m http://127.0.0.1:${PORT}/api/health\n`);
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`\x1b[31m[FALHA]:\x1b[0m Porta ${PORT} ocupada. Libere-a antes de iniciar.`);
        process.exit(1);
    }
});
