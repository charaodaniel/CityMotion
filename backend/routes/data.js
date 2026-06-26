
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

module.exports = function(db) {
    router.get('/data', authMiddleware, async (req, res) => {
        try {
            const queries = {
                trips: 'SELECT * FROM trips ORDER BY id DESC',
                requests: 'SELECT * FROM vehicles ORDER BY id ASC', // Placeholder para requests
                vehicles: 'SELECT * FROM vehicles ORDER BY id ASC',
                employees: 'SELECT * FROM employees ORDER BY name ASC',
                sectors: 'SELECT * FROM sectors ORDER BY name ASC',
                maintenanceRequests: 'SELECT * FROM maintenance_requests ORDER BY id DESC',
                refuelings: 'SELECT * FROM refuelings ORDER BY date DESC LIMIT 100',
                messages: 'SELECT * FROM messages WHERE sender_id = $1 OR receiver_id = $1 ORDER BY timestamp ASC'
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
                    console.error(`[DB Query Error] key: ${key}, error: ${e.message}`);
                    results[key] = [];
                }
            }

            res.json(results);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao carregar ecossistema.', message: err.message });
        }
    });

    router.post('/messages', authMiddleware, async (req, res) => {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        try {
            const sql = `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)`;
            await db.execute(sql, [senderId, receiverId, content], req.user);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.get('/system/audit-logs', authMiddleware, async (req, res) => {
        try {
            const { rows } = await db.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
            res.json(rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
