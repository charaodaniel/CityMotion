
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

module.exports = function(db) {
    const dbFilePath = path.resolve(__dirname, '../database/citymotion.db');
    const backupFilePath = path.resolve(__dirname, '../database/citymotion.db.bak');

    // Função auxiliar para criar backup antes de alterações
    function backupDb() {
        try {
            if (fs.existsSync(dbFilePath)) {
                fs.copyFileSync(dbFilePath, backupFilePath);
                console.log(`[Backup] Cópia de segurança criada em: ${backupFilePath}`);
            }
        } catch (e) {
            console.error('[Backup] Falha ao criar backup:', e.message);
        }
    }

    // Rota para buscar todos os dados iniciais consolidada
    router.get('/data', (req, res) => {
        const queries = {
            schedules: 'SELECT * FROM trips ORDER BY id DESC',
            requests: 'SELECT * FROM vehicle_requests ORDER BY id DESC',
            vehicles: 'SELECT * FROM vehicles',
            employees: 'SELECT * FROM employees',
            sectors: 'SELECT * FROM sectors',
            workSchedules: 'SELECT * FROM work_schedules',
            maintenanceRequests: 'SELECT * FROM maintenance_requests ORDER BY id DESC',
        };

        const results = {};
        const promises = Object.entries(queries).map(([key, sql]) => {
            return new Promise((resolve, reject) => {
                db.all(sql, [], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        results[key] = rows.map(row => {
                            const newRow = { ...row };
                            if (key === 'employees') delete newRow.password;
                            
                            if (key === 'employees' && newRow.sector) {
                                try { newRow.sector = JSON.parse(newRow.sector); } catch(e) { newRow.sector = [newRow.sector]; }
                            }
                            if (key === 'schedules') {
                                if (newRow.passengers) try { newRow.passengers = JSON.parse(newRow.passengers); } catch(e) { newRow.passengers = []; }
                                if (newRow.startChecklist) try { newRow.startChecklist = JSON.parse(newRow.startChecklist); } catch(e) { newRow.startChecklist = []; }
                                if (newRow.endChecklist) try { newRow.endChecklist = JSON.parse(newRow.endChecklist); } catch(e) { newRow.endChecklist = []; }
                            }
                            return newRow;
                        });
                        resolve();
                    }
                });
            });
        });

        Promise.all(promises)
            .then(() => {
                res.json(results);
            })
            .catch(err => {
                console.error('Erro ao buscar dados do banco:', err);
                res.status(500).json({ message: 'Erro ao buscar dados do banco.' });
            });
    });

    // --- CRUD EMPLOYEES ---
    router.post('/employees', authMiddleware, (req, res) => {
        backupDb();
        const { name, email, role, sector, status, password, matricula, cnh } = req.body;
        const sql = `INSERT INTO employees (name, email, role, sector, status, password, matricula, cnh) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [name, email, role, JSON.stringify(sector || []), status || 'Disponível', password || '123456', matricula || null, cnh || null];
        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        });
    });

    router.put('/employees/:id', authMiddleware, (req, res) => {
        backupDb();
        const { name, role, status, email, sector, matricula, cnh, password } = req.body;
        const sql = `UPDATE employees SET name = COALESCE(?, name), role = COALESCE(?, role), status = COALESCE(?, status), email = COALESCE(?, email), sector = COALESCE(?, sector), matricula = COALESCE(?, matricula), cnh = COALESCE(?, cnh), password = COALESCE(?, password) WHERE id = ?`;
        const sectorStr = sector ? (Array.isArray(sector) ? JSON.stringify(sector) : sector) : null;
        db.run(sql, [name || null, role || null, status || null, email || null, sectorStr, matricula || null, cnh || null, password || null, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        });
    });

    router.delete('/employees/:id', authMiddleware, (req, res) => {
        backupDb();
        const employeeId = req.params.id;
        const userRole = req.user?.role;

        // Somente 'Desenvolvedor Global' pode remover de vez (Hard Delete)
        if (userRole === 'Desenvolvedor Global') {
            db.run('DELETE FROM employees WHERE id = ?', [employeeId], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Registro removido permanentemente.', deleted: true });
            });
        } else {
            // Outros usuários fazem Soft Delete (Muda status para Desativado)
            db.run("UPDATE employees SET status = 'Desativado' WHERE id = ?", [employeeId], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'Colaborador desativado do sistema.', softDeleted: true });
            });
        }
    });

    // --- CRUD VEHICLES ---
    router.put('/vehicles/:id', authMiddleware, (req, res) => {
        backupDb();
        const { vehicleModel, licensePlate, sector, mileage, status } = req.body;
        const sql = `UPDATE vehicles SET vehicleModel = COALESCE(?, vehicleModel), licensePlate = COALESCE(?, licensePlate), sector = COALESCE(?, sector), mileage = COALESCE(?, mileage), status = COALESCE(?, status) WHERE id = ?`;
        db.run(sql, [vehicleModel || null, licensePlate || null, sector || null, mileage || null, status || null, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        });
    });

    // --- CRUD TRIPS ---
    router.put('/trips/:id', authMiddleware, (req, res) => {
        backupDb();
        const { status, startMileage, endMileage, arrivalTime, startChecklist, endChecklist } = req.body;
        const sql = `UPDATE trips SET status = COALESCE(?, status), startMileage = COALESCE(?, startMileage), endMileage = COALESCE(?, endMileage), arrivalTime = COALESCE(?, arrivalTime), startChecklist = COALESCE(?, startChecklist), endChecklist = COALESCE(?, endChecklist) WHERE id = ?`;
        db.run(sql, [
            status || null, 
            startMileage || null, 
            endMileage || null, 
            arrivalTime || null, 
            startChecklist ? JSON.stringify(startChecklist) : null,
            endChecklist ? JSON.stringify(endChecklist) : null,
            req.params.id
        ], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        });
    });

    // --- CRUD REQUESTS ---
    router.post('/vehicle_requests', authMiddleware, (req, res) => {
        backupDb();
        const { title, sector, details, priority, requester } = req.body;
        const sql = `INSERT INTO vehicle_requests (title, sector, details, priority, requester, requestDate, status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [title, sector, details, priority || 'Média', requester, new Date().toISOString(), 'Pendente'], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        });
    });

    router.put('/vehicle_requests/:id', authMiddleware, (req, res) => {
        backupDb();
        const { status } = req.body;
        db.run('UPDATE vehicle_requests SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        });
    });

    // --- MAINTENANCE ---
    router.post('/maintenance_requests', authMiddleware, (req, res) => {
        backupDb();
        const { vehicleId, vehicleModel, licensePlate, type, description, requesterName } = req.body;
        const sql = `INSERT INTO maintenance_requests (vehicleId, vehicleModel, licensePlate, type, description, requesterName, requestDate, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [vehicleId, vehicleModel, licensePlate, type, description, requesterName, new Date().toISOString(), 'Pendente'], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        });
    });

    router.put('/maintenance_requests/:id', authMiddleware, (req, res) => {
        backupDb();
        const { status } = req.body;
        db.run('UPDATE maintenance_requests SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        });
    });

    // --- SYSTEM INFO ---
    router.get('/system/resources', (req, res) => {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memUsage = ((usedMem / totalMem) * 100).toFixed(1);
        const cpus = os.cpus();
        res.json({
            uptime: process.uptime(),
            memory: { total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + ' GB', used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + ' GB', percentage: memUsage },
            cpu: { model: cpus[0].model, cores: cpus.length, load: os.loadavg()[0].toFixed(2) },
            platform: process.platform,
            nodeVersion: process.version
        });
    });

    router.get('/system/db-info', (req, res) => {
        const tables = ['employees', 'vehicles', 'trips', 'sectors', 'vehicle_requests', 'maintenance_requests'];
        const stats = {};
        const promises = tables.map(table => new Promise((resolve) => {
            db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
                stats[table] = err ? 0 : row.count;
                resolve();
            });
        }));
        Promise.all(promises).then(() => res.json({ tables, counts: stats, database: 'SQLite3', status: 'Healthy' }));
    });

    router.post('/maintenance/reset', (req, res) => {
        const initScriptPath = path.resolve(__dirname, '../database/init_db.js');
        exec(`node ${initScriptPath}`, (error, stdout, stderr) => {
            if (error) return res.status(500).json({ success: false, message: error.message });
            res.json({ success: true, message: 'Sistema reiniciado e banco restaurado.' });
        });
    });

    return router;
}
