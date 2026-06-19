
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
        const loadAvg = os.loadavg(); // [1, 5, 15] minute load averages

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

    // Endpoint de Manutenção: Resetar Banco (Simula Reinicialização)
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

    router.get('/employees', (req, res) => {
        db.all('SELECT id, name, email, role, status, sector FROM employees', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows.map(r => ({ ...r, sector: JSON.parse(r.sector) })));
        });
    });

    router.post('/employees', (req, res) => {
        const { name, email, role, sector } = req.body;
        const sql = `INSERT INTO employees (name, email, role, sector, status) VALUES (?, ?, ?, ?, ?)`;
        const params = [name, email, role, JSON.stringify(sector || []), 'Disponível'];
        
        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, message: 'Funcionário criado com sucesso no SQLite.' });
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
