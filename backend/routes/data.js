
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

module.exports = function(db) {
    const dbFilePath = path.resolve(__dirname, '../database/citymotion.db');
    const backupFilePath = path.resolve(__dirname, '../database/citymotion.db.bak');

    function backupDb() {
        try {
            if (fs.existsSync(dbFilePath)) {
                fs.copyFileSync(dbFilePath, backupFilePath);
            }
        } catch (e) {
            console.error('[Backup Error]:', e.message);
        }
    }

    function logChange(action, tableName, recordId, details, user) {
        const userIdentity = user ? `${user.name} (${user.role})` : 'Sistema';
        const sql = `INSERT INTO audit_logs (action, table_name, record_id, details, user_identity) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [action, tableName, recordId, JSON.stringify(details), userIdentity], (err) => {
            if (err) console.error('[Audit Error]:', err.message);
        });
    }

    router.get('/data', authMiddleware, (req, res) => {
        const queries = {
            trips: 'SELECT * FROM trips ORDER BY id DESC',
            requests: 'SELECT * FROM vehicle_requests ORDER BY id DESC',
            vehicles: 'SELECT * FROM vehicles',
            employees: 'SELECT * FROM employees',
            sectors: 'SELECT * FROM sectors',
            maintenanceRequests: 'SELECT * FROM maintenance_requests ORDER BY id DESC',
            refuelings: 'SELECT * FROM refuelings ORDER BY date DESC LIMIT 100',
            messages: `SELECT * FROM messages WHERE senderId = ${req.user.id} OR receiverId = ${req.user.id} ORDER BY timestamp ASC`
        };

        const results = {};
        const promises = Object.entries(queries).map(([key, sql]) => {
            return new Promise((resolve, reject) => {
                db.all(sql, [], (err, rows) => {
                    if (err) {
                        console.error(`[DB Query Error] key: ${key}, error:`, err.message);
                        reject(new Error(`Falha na tabela ${key}: ${err.message}`));
                    } else {
                        results[key] = rows.map(row => {
                            const newRow = { ...row };
                            if (key === 'employees') delete newRow.password;
                            if (key === 'employees' && newRow.sector) {
                                try { newRow.sector = JSON.parse(newRow.sector); } catch(e) { newRow.sector = [newRow.sector]; }
                            }
                            return newRow;
                        });
                        resolve();
                    }
                });
            });
        });

        Promise.all(promises)
            .then(() => res.json(results))
            .catch(err => {
                console.error('[Sync Error]:', err.message);
                res.status(500).json({ error: 'Erro ao carregar ecossistema.', message: err.message });
            });
    });

    // CHAT
    router.post('/messages', authMiddleware, (req, res) => {
        const { receiverId, content } = req.body;
        const senderId = req.user.id;

        if (!receiverId || !content) return res.status(400).json({ message: 'Dados incompletos.' });

        const sql = `INSERT INTO messages (senderId, receiverId, content) VALUES (?, ?, ?)`;
        db.run(sql, [senderId, receiverId, content], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, timestamp: new Date().toISOString() });
        });
    });

    router.get('/employees', authMiddleware, (req, res) => {
        db.all('SELECT * FROM employees', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows.map(r => {
                const row = { ...r };
                delete row.password;
                try { row.sector = JSON.parse(row.sector); } catch(e) { row.sector = [row.sector]; }
                return row;
            }));
        });
    });

    router.get('/vehicles', authMiddleware, (req, res) => {
        db.all('SELECT * FROM vehicles', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });

    router.post('/employees', authMiddleware, (req, res) => {
        const role = req.user.role.toLowerCase();
        const isAuthorized = role.includes('admin') || role.includes('dev') || role.includes('ti');
        if (!isAuthorized) return res.status(403).json({ message: 'Acesso negado.' });

        backupDb();
        const { name, email, phone, role: empRole, sector, status, password, matricula, cnh } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password || '123456', salt);
        
        const sql = `INSERT INTO employees (name, email, phone, role, sector, status, password, matricula, cnh) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [name, email, phone || null, empRole, JSON.stringify(sector || []), status || 'Disponível', hashedPassword, matricula || null, cnh || null];
        
        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            logChange('INSERT', 'employees', this.lastID, { name, role: empRole }, req.user);
            res.json({ id: this.lastID });
        });
    });

    router.put('/employees/:id', authMiddleware, (req, res) => {
        const userRole = req.user.role.toLowerCase();
        const isAuthorized = userRole.includes('admin') || userRole.includes('dev') || userRole.includes('ti');
        if (!isAuthorized) return res.status(403).json({ message: 'Ação não permitida.' });

        backupDb();
        const { name, role: empRole, status, email, phone, sector, password, matricula, cnh } = req.body;
        let passwordFragment = '';
        const params = [name || null, empRole || null, status || null, email || null, phone || null, null, matricula || null, cnh || null];

        if (password) {
            const salt = bcrypt.genSaltSync(10);
            params.push(bcrypt.hashSync(password, salt));
            passwordFragment = ', password = ?';
        }

        const sectorStr = sector ? (Array.isArray(sector) ? JSON.stringify(sector) : sector) : null;
        params[5] = sectorStr;
        params.push(req.params.id);

        const sql = `UPDATE employees SET name = COALESCE(?, name), role = COALESCE(?, role), status = COALESCE(?, status), email = COALESCE(?, email), phone = COALESCE(?, phone), sector = COALESCE(?, sector), matricula = COALESCE(?, matricula), cnh = COALESCE(?, cnh) ${passwordFragment} WHERE id = ?`;
        
        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            logChange('UPDATE', 'employees', req.params.id, { name }, req.user);
            res.json({ updated: this.changes });
        });
    });

    router.delete('/employees/:id', authMiddleware, (req, res) => {
        const userRole = req.user.role.toLowerCase();
        const isRoot = userRole.includes('dev') || userRole.includes('global');
        
        backupDb();
        if (isRoot) {
            db.run('DELETE FROM employees WHERE id = ?', [req.params.id], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                logChange('DELETE_HARD', 'employees', req.params.id, { message: 'Removido permanentemente' }, req.user);
                res.json({ deleted: this.changes });
            });
        } else {
            db.run('UPDATE employees SET status = "Desativado" WHERE id = ?', [req.params.id], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                logChange('DELETE_SOFT', 'employees', req.params.id, { status: 'Desativado' }, req.user);
                res.json({ deactivated: this.changes });
            });
        }
    });

    // ABASTECIMENTOS
    router.post('/refuelings', authMiddleware, (req, res) => {
        const { vehicleId, vehicleModel, licensePlate, tripId, mileage, liters, price, fuelType, gasStation, notes } = req.body;
        const totalValue = parseFloat(liters) * parseFloat(price);
        
        backupDb();
        const sql = `INSERT INTO refuelings (vehicleId, vehicleModel, licensePlate, tripId, mileage, liters, price, totalValue, fuelType, gasStation, driverName, notes) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [vehicleId, vehicleModel, licensePlate, tripId || null, mileage, liters, price, totalValue, fuelType, gasStation || null, req.user.name, notes || null];

        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            db.run('UPDATE vehicles SET mileage = ? WHERE id = ?', [mileage, vehicleId]);
            logChange('INSERT', 'refuelings', this.lastID, { licensePlate, totalValue }, req.user);
            res.json({ id: this.lastID });
        });
    });

    // SISTEMA
    router.get('/system/audit-logs', authMiddleware, (req, res) => {
        db.all('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        });
    });

    router.get('/system/db-info', authMiddleware, (req, res) => {
        const tables = ['employees', 'vehicles', 'trips', 'vehicle_requests', 'sectors', 'refuelings', 'maintenance_requests', 'messages'];
        const counts = {};
        const promises = tables.map(table => {
            return new Promise(resolve => {
                db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
                    counts[table] = row ? row.count : 0;
                    resolve();
                });
            });
        });
        Promise.all(promises).then(() => res.json({ status: 'online', counts }));
    });

    router.post('/maintenance/reset', authMiddleware, (req, res) => {
        const role = req.user.role.toLowerCase();
        if (!role.includes('dev') && !role.includes('global')) return res.status(403).json({ message: 'Apenas ROOT.' });
        const initScriptPath = path.resolve(__dirname, '../database/init_db.js');
        exec(`node ${initScriptPath}`, (error) => {
            if (error) return res.status(500).json({ success: false, message: error.message });
            logChange('SYSTEM_RESET', 'database', '*', { message: 'Reset executado' }, req.user);
            res.json({ success: true, message: 'Sistema restaurado.' });
        });
    });

    return router;
};
