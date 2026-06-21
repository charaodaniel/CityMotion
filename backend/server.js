
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

// Verifica se o banco existe, senão avisa que precisa rodar o init
if (!fs.existsSync(dbPath)) {
    console.warn("\x1b[33m[Aviso]:\x1b[0m Banco de dados não localizado. Execute 'npm run db:init' na pasta backend.");
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("\x1b[31m[Erro DB]:\x1b[0m", err.message);
    } else {
        console.log("\x1b[32m[Conectado]:\x1b[0m Banco SQLite em: " + dbPath);
    }
});

app.use(cors()); 
app.use(express.json());

// Logger
app.use((req, res, next) => {
    console.log(`\x1b[36m[API]:\x1b[0m ${req.method} ${req.url}`);
    next();
});

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

app.use('/api', authRoutes(db));
app.use('/api', dataRoutes(db));

app.get('/api/health', (req, res) => {
    res.json({ status: 'online', database: fs.existsSync(dbPath) ? 'ready' : 'missing' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n\x1b[42m\x1b[30m SUCESSO \x1b[0m Servidor Backend rodando em http://127.0.0.1:${PORT}`);
    console.log(`\x1b[34m[Health]:\x1b[0m http://127.0.0.1:${PORT}/api/health\n`);
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`\x1b[31mERRO:\x1b[0m A porta ${PORT} está ocupada.`);
        process.exit(1);
    }
});
