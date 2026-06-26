
require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const db = require('./database/db_manager');
const { initializeDatabase } = require('./database/init_db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.json());

// Logger Técnico NexusOS
app.use((req, res, next) => {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const isTerminal = req.headers['x-nexus-terminal'] === 'true' ? '[TTY]' : '[WEB]';
    console.log(`\x1b[90m[${timestamp}]\x1b[0m \x1b[36mAPI:\x1b[0m ${isTerminal} ${req.method} ${req.url}`);
    next();
});

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');

app.use('/api', authRoutes(db));
app.use('/api', dataRoutes(db));

app.get('/api/health', async (req, res) => {
    res.json({ status: 'operational', kernel: 'Nexus-Dual', uptime: process.uptime() });
});

// MOTOR DE RESET DIÁRIO (Demo-Cleaner)
let lastResetDate = new Date().toDateString();

setInterval(async () => {
    const currentDate = new Date().toDateString();
    if (currentDate !== lastResetDate) {
        console.log('\x1b[35m[Cron]:\x1b[0m Mudança de dia detectada. Executando limpeza de dados demo...');
        try {
            // Reinicializa o banco para o estado de fábrica
            await initializeDatabase();
            lastResetDate = currentDate;
            console.log('\x1b[32m[Cron]:\x1b[0m Reset diário concluído com sucesso.');
        } catch (err) {
            console.error('[Cron Error]: Falha no reset diário:', err.message);
        }
    }
}, 3600000); // Verifica a cada 1 hora

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log('\x1b[44m\x1b[37m NEXUS-CORE \x1b[0m Servidor rodando em \x1b[4mhttp://0.0.0.0:' + PORT + '\x1b[0m');
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Porta ${PORT} ocupada.`);
    }
    process.exit(1);
});
