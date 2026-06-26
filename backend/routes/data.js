
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

module.exports = function(pool) {
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
                const { rows } = await pool.query(sql, params);
                
                results[key] = rows.map(row => {
                    const newRow = { ...row };
                    if (key === 'employees') delete newRow.password;
                    // Postgres lida com JSON de forma diferente dependendo do tipo da coluna, 
                    // se for TEXT no DB, fazemos parse aqui.
                    if (key === 'employees' && typeof newRow.sector === 'string') {
                        try { newRow.sector = JSON.parse(newRow.sector); } catch(e) { newRow.sector = [newRow.sector]; }
                    }
                    return newRow;
                });
            }

            res.json(results);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao sincronizar ecossistema.' });
        }
    });

    router.post('/messages', authMiddleware, async (req, res) => {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        try {
            const sql = `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING id`;
            const { rows } = await pool.query(sql, [senderId, receiverId, content]);
            res.json({ id: rows[0].id, timestamp: new Date().toISOString() });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    router.post('/refuelings', authMiddleware, async (req, res) => {
        const { vehicleId, vehicleModel, licensePlate, tripId, mileage, liters, price, fuelType, gasStation, notes } = req.body;
        const totalValue = parseFloat(liters) * parseFloat(price);
        
        try {
            const sql = `
                INSERT INTO refuelings (vehicle_id, vehicle_model, license_plate, trip_id, mileage, liters, price, total_value, fuel_type, gas_station, driver_name, notes) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`;
            
            const { rows } = await pool.query(sql, [vehicleId, vehicleModel, licensePlate, tripId || null, mileage, liters, price, totalValue, fuelType, gasStation || null, req.user.name, notes || null]);
            
            await pool.query('UPDATE vehicles SET mileage = $1 WHERE id = $2', [mileage, vehicleId]);
            res.json({ id: rows[0].id });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    return router;
};
