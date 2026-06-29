
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

module.exports = function(db) {
    /**
     * Sincronização Global do Ecossistema
     */
    router.get('/data', authMiddleware, async (req, res) => {
        try {
            const queries = {
                trips: 'SELECT * FROM trips ORDER BY id DESC',
                requests: 'SELECT * FROM vehicle_requests ORDER BY id DESC',
                vehicles: 'SELECT * FROM vehicles ORDER BY id ASC',
                employees: 'SELECT * FROM employees ORDER BY name ASC',
                sectors: 'SELECT * FROM sectors ORDER BY name ASC',
                maintenanceRequests: 'SELECT * FROM maintenance_requests ORDER BY id DESC',
                refuelings: 'SELECT * FROM refuelings ORDER BY date DESC LIMIT 100',
                messages: 'SELECT * FROM messages WHERE sender_id = $1 OR receiver_id = $1 ORDER BY timestamp ASC',
                workSchedules: 'SELECT * FROM work_schedules ORDER BY id DESC'
            };

            const results = {};
            for (const [key, sql] of Object.entries(queries)) {
                try {
                    const params = key === 'messages' ? [req.user.id] : [];
                    const { rows } = await db.query(sql, params);
                    
                    results[key] = rows.map(row => {
                        const newRow = { ...row };
                        if (key === 'employees') delete newRow.password;
                        if (key === 'employees' && typeof newRow.sector === 'string') {
                            try { newRow.sector = JSON.parse(newRow.sector); } catch(e) { newRow.sector = [newRow.sector]; }
                        }
                        return newRow;
                    });
                } catch (e) {
                    results[key] = []; 
                }
            }
            res.json(results);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao carregar ecossistema de dados.' });
        }
    });

    /**
     * Novos Pedidos com Notificação Socket
     */
    router.post('/requests', authMiddleware, async (req, res) => {
        const { title, sector, details, priority } = req.body;
        try {
            const sql = `INSERT INTO vehicle_requests (title, sector, details, priority, requester, status) VALUES ($1, $2, $3, $4, $5, 'Pendente')`;
            const result = await db.execute(sql, [title, sector, details, priority || 'Média', req.user.name]);
            
            // Notificar via WebSocket
            req.io.to(sector).emit('new-request', {
                id: result.lastID,
                title,
                requester: req.user.name,
                priority: priority || 'Média'
            });

            res.json({ success: true, id: result.lastID });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    /**
     * Analytics para Gráficos
     */
    router.get('/analytics/telemetry', authMiddleware, async (req, res) => {
        try {
            // Exemplo de agregação real para Recharts
            const refuelingStats = await db.query(`
                SELECT 
                    strftime('%m', date) as month_num,
                    SUM(totalValue) as total_spent,
                    COUNT(*) as count
                FROM refuelings 
                WHERE date >= date('now', '-6 months')
                GROUP BY month_num
                ORDER BY month_num ASC
            `);

            const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
            const formatted = refuelingStats.rows.map(r => ({
                month: months[parseInt(r.month_num) - 1],
                cost: r.total_spent,
                volume: r.count
            }));

            res.json(formatted);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
