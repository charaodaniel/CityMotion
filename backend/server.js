
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

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("\x1b[31m[Erro DB]:\x1b[0m", err.message);
    } else {
        console.log("\x1b[32m[Conectado]:\x1b[0m Banco de dados SQLite pronto em: " + dbPath);
        
        // Garantir que a tabela de auditoria exista para o logger
        db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            table_name TEXT NOT NULL,
            record_id TEXT,
            details TEXT,
            user_identity TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Middlewares
app.use(cors()); 
app.use(express.json());

// Logger de Requisições para Depuração
app.use((req, res, next) => {
    console.log(`\x1b[36m[Backend Request]:\x1b[0m ${req.method} ${req.url}`);
    next();
});

// Rotas da API
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

app.use('/api', authRoutes(db));
app.use('/api', dataRoutes(db));

// Rota de Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'online', 
        timestamp: new Date().toISOString(),
        database: dbPath,
        service: 'CityMotion Backend'
    });
});

app.get('/', (req, res) => {
    res.send('Servidor do CityMotion está no ar! Porta: ' + PORT);
});

// Inicialização do servidor
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n\x1b[42m\x1b[30m SUCESSO \x1b[0m Backend CityMotion rodando na porta ${PORT}`);
    console.log(`\x1b[34m[URL]:\x1b[0m http://localhost:${PORT}`);
    console.log(`\x1b[34m[Health]:\x1b[0m http://localhost:${PORT}/api/health\n`);
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`\n\x1b[41m\x1b[37m ERRO CRÍTICO \x1b[0m A porta ${PORT} já está em uso.`);
        console.error(`\x1b[33m[Dica]:\x1b[0m Rodando 'npm run dev' novamente deve resolver pois incluímos um comando de kill automático.\n`);
        process.exit(1);
    } else {
        console.error("[Backend Error]:", e);
    }
});
