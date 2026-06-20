
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const os = require('os');
const router = express.Router();

module.exports = function(db) {
    // Rota para buscar todos os dados iniciais consolidada
    router.get('/data', (req, res) => {
        const queries = {
            schedules: 'SELECT * FROM trips',
            requests: 'SELECT * FROM vehicle_requests',
            vehicles: 'SELECT * FROM vehicles',
            employees: 'SELECT * FROM employees',
            sectors: 'SELECT * FROM sectors',
            workSchedules: 'SELECT * FROM work_schedules',
            maintenanceRequests: 'SELECT * FROM maintenance_requests',
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

    // Endpoint de Recursos (btop style)
    router.get('/system/resources', (req, res) => {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memUsage = ((usedMem / totalMem) * 100).toFixed(1);
        
        const cpus = os.cpus();
        const loadAvg = os.loadavg();

        res.json({
            uptime: process.uptime(),
            memory: {
                total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
                used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + ' GB',
                percentage: memUsage
            },
            cpu: {
                model: cpus[0].model,
                cores: cpus.length,
                load: loadAvg[0].toFixed(2)
            },
            platform: process.platform,
            nodeVersion: process.version
        });
    });

    // Endpoint de Estatísticas de Banco
    router.get('/system/db-info', (req, res) => {
        const tables = ['employees', 'vehicles', 'trips', 'sectors', 'vehicle_requests', 'maintenance_requests'];
        const stats = {};
        
        const promises = tables.map(table => {
            return new Promise((resolve) => {
                db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
                    stats[table] = err ? 0 : row.count;
                    resolve();
                });
            });
        });

        Promise.all(promises).then(() => {
            res.json({
                tables: tables,
                counts: stats,
                database: 'SQLite3',
                status: 'Healthy'
            });
        });
    });

    // Endpoint de Manutenção: Resetar Banco
    router.post('/maintenance/reset', (req, res) => {
        console.log('[Maintenance] Reset de banco solicitado.');
        const initScriptPath = path.resolve(__dirname, '../database/init_db.js');
        
        exec(`node ${initScriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro no reset: ${error.message}`);
                return res.status(500).json({ success: false, message: error.message });
            }
            res.json({ success: true, message: 'Sistema reiniciado e banco restaurado.' });
        });
    });

    // --- CRUD EMPLOYEES ---

    router.get('/employees', (req, res) => {
        db.all('SELECT id, name, email, role, status, sector, matricula, cnh FROM employees', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows.map(r => {
                try { return { ...r, sector: JSON.parse(r.sector) }; } 
                catch(e) { return { ...r, sector: [r.sector] }; }
            }));
        });
    });

    router.get('/employees/:id', (req, res) => {
        db.get('SELECT id, name, email, role, status, sector, matricula, cnh, password FROM employees WHERE id = ?', [req.params.id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: 'Funcionário não encontrado.' });
            try { row.sector = JSON.parse(row.sector); } catch(e) { row.sector = [row.sector]; }
            res.json(row);
        });
    });

    router.post('/employees', (req, res) => {
        const { name, email, role, sector, status, password, matricula, cnh } = req.body;
        console.log('[SQLite] Criando novo funcionário:', name);
        const sql = `INSERT INTO employees (name, email, role, sector, status, password, matricula, cnh) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [
            name, 
            email, 
            role, 
            JSON.stringify(sector || []), 
            status || 'Disponível', 
            password || '123456',
            matricula || null,
            cnh || null
        ];
        
        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Funcionário criado com sucesso no SQLite.' });
        });
    });

    router.put('/employees/:id', (req, res) => {
        const { name, role, status, email, sector, matricula, cnh, password } = req.body;
        const employeeId = req.params.id;
        
        console.log(`[SQLite] Atualizando funcionário ID ${employeeId}:`, { name, role, status });
        
        const sql = `UPDATE employees SET 
            name = COALESCE(?, name), 
            role = COALESCE(?, role), 
            status = COALESCE(?, status),
            email = COALESCE(?, email),
            sector = COALESCE(?, sector),
            matricula = COALESCE(?, matricula),
            cnh = COALESCE(?, cnh),
            password = COALESCE(?, password)
            WHERE id = ?`;
        
        const sectorStr = sector ? (Array.isArray(sector) ? JSON.stringify(sector) : sector) : null;

        db.run(sql, [
            name || null, 
            role || null, 
            status || null, 
            email || null, 
            sectorStr, 
            matricula || null, 
            cnh || null, 
            password || null,
            employeeId
        ], function(err) {
            if (err) {
                console.error('Erro no UPDATE SQLite:', err.message);
                return res.status(500).json({ error: err.message });
            }
            if (this.changes === 0) {
                console.warn(`[SQLite] Nenhum registro alterado para ID ${employeeId}.`);
            }
            res.json({ updated: this.changes, message: 'Registro atualizado no SQLite.' });
        });
    });

    router.delete('/employees/:id', (req, res) => {
        db.run('DELETE FROM employees WHERE id = ?', req.params.id, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ deleted: this.changes, message: 'Registro removido.' });
        });
    });

    // --- CRUD VEHICLES ---

    router.get('/vehicles', (req, res) => {
        db.all('SELECT * FROM vehicles', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });

    router.post('/vehicles', (req, res) => {
        const { vehicleModel, licensePlate, sector, mileage, status } = req.body;
        const sql = `INSERT INTO vehicles (vehicleModel, licensePlate, sector, mileage, status) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [vehicleModel, licensePlate, sector, mileage || 0, status || 'Disponível'], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Veículo cadastrado.' });
        });
    });

    router.put('/vehicles/:id', (req, res) => {
        const { vehicleModel, licensePlate, sector, mileage, status } = req.body;
        const sql = `UPDATE vehicles SET 
            vehicleModel = COALESCE(?, vehicleModel),
            licensePlate = COALESCE(?, licensePlate),
            sector = COALESCE(?, sector),
            mileage = COALESCE(?, mileage),
            status = COALESCE(?, status)
            WHERE id = ?`;
        db.run(sql, [vehicleModel || null, licensePlate || null, sector || null, mileage || null, status || null, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes });
        });
    });

    return router;
}
