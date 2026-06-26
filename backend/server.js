
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const db = require('./database/db_manager');

/**
 * CityMotion Resilient Backend
 * Focado em Soberania de Dados e Portabilidade.
 */

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.json());

// Logger de Atividade Técnica
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    console.log(`\x1b[90m[${timestamp}]\x1b[0m \x1b[36mAPI:\x1b[0m ${req.method} ${req.url}`);
    next();
});

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

app.use('/api', authRoutes(db));
app.use('/api', dataRoutes(db));

// Endpoint de Saúde e Diagnóstico de Infraestrutura
app.get('/api/health', async (req, res) => {
    try {
        const check = await db.query('SELECT 1 as alive');
        res.json({ 
            status: 'operational', 
            engine: 'Nexus-Dual',
            persistence: {
                local: 'Online (SQLite)',
                cloud: process.env.DATABASE_URL ? 'Online (PostgreSQL)' : 'Inactive'
            },
            timestamp: new Date().toISOString()
        });
    } catch (e) {
        res.status(500).json({ status: 'degraded', error: e.message });
    }
});

// Inicialização com tratamento de erros de porta
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('\x1b[44m\x1b[37m NEXUS-CORE \x1b[0m Servidor rodando em \x1b[4mhttp://0.0.0.0:' + PORT + '\x1b[0m');
    console.log('\x1b[90m[Soberania]:\x1b[0m Persistência local prioritária ativada.');
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\x1b[31m[ERRO]: A porta ${PORT} está ocupada. Use 'npx kill-port ${PORT}' para liberar.\x1b[0m`);
    } else {
        console.error('\x1b[31m[ERRO NO SERVIDOR]:\x1b[0m', err.message);
    }
    process.exit(1);
});
