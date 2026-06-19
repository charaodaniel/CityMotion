
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
                        // Tratamento de campos JSON
                        results[key] = rows.map(row => {
                            const newRow = { ...row };
                            // Remover senhas por segurança
                            if (key === 'employees') delete newRow.password;
                            
                            // Parsear campos que são strings JSON no SQLite
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

    // --- CRUD TEST ENDPOINTS ---

    router.get('/employees', (req, res) => {
        db.all('SELECT id, name, email, role, status, sector FROM employees', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows.map(r => {
                try { return { ...r, sector: JSON.parse(r.sector) }; } 
                catch(e) { return { ...r, sector: [r.sector] }; }
            }));
        });
    });

    router.get('/employees/:id', (req, res) => {
        db.get('SELECT id, name, email, role, status, sector, matricula, cnh FROM employees WHERE id = ?', [req.params.id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: 'Funcionário não encontrado.' });
            try { row.sector = JSON.parse(row.sector); } catch(e) { row.sector = [row.sector]; }
            res.json(row);
        });
    });

    router.post('/employees', (req, res) => {
        const { name, email, role, sector, status } = req.body;
        const sql = `INSERT INTO employees (name, email, role, sector, status) VALUES (?, ?, ?, ?, ?)`;
        const params = [name, email, role, JSON.stringify(sector || []), status || 'Disponível'];
        
        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Funcionário criado com sucesso no SQLite.' });
        });
    });

    router.put('/employees/:id', (req, res) => {
        const { name, role, status, email, sector, matricula, cnh } = req.body;
        const sql = `UPDATE employees SET 
            name = COALESCE(?, name), 
            role = COALESCE(?, role), 
            status = COALESCE(?, status),
            email = COALESCE(?, email),
            sector = COALESCE(?, sector),
            matricula = COALESCE(?, matricula),
            cnh = COALESCE(?, cnh)
            WHERE id = ?`;
        
        const sectorStr = sector ? JSON.stringify(sector) : null;

        db.run(sql, [name, role, status, email, sectorStr, matricula, cnh, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updated: this.changes, message: 'Registro atualizado no SQLite.' });
        });
    });

    router.delete('/employees/:id', (req, res) => {
        db.run('DELETE FROM employees WHERE id = ?', req.params.id, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ deleted: this.changes, message: 'Registro removido.' });
        });
    });

    router.get('/vehicles', (req, res) => {
        db.all('SELECT * FROM vehicles', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });

    return router;
}
