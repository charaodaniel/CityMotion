
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

module.exports = function(db) {
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
                messages: 'SELECT * FROM messages WHERE sender_id = $1 OR receiver_id = $1 ORDER BY timestamp ASC'
            };

            const results = {};
            for (const [key, sql] of Object.entries(queries)) {
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
            }

            res.json(results);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao sincronizar ecossistema Nexus.' });
        }
    });

    router.post('/messages', authMiddleware, async (req, res) => {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        try {
            const sql = `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)`;
            await db.execute(sql, [senderId, receiverId, content]);
            res.json({ success: true, timestamp: new Date().toISOString() });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.post('/employees', authMiddleware, async (req, res) => {
        const { name, email, role, sector, matricula, phone } = req.body;
        const defaultPass = require('bcryptjs').hashSync('123456', 10);
        
        try {
            const sql = `
                INSERT INTO employees (name, email, password, role, sector, status, matricula, phone) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
            const sectorJson = Array.isArray(sector) ? JSON.stringify(sector) : JSON.stringify([sector]);
            
            await db.execute(sql, [name, email, defaultPass, role, sectorJson, 'Disponível', matricula, phone]);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
