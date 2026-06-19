
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
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

    // Endpoint de Manutenção: Resetar Banco
    router.post('/maintenance/reset', (req, res) => {
        console.log('[Maintenance] Reset de banco solicitado.');
        const initScriptPath = path.resolve(__dirname, '../database/init_db.js');
        
        // Executa o script de inicialização como um processo separado
        exec(`node ${initScriptPath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erro no reset: ${error.message}`);
                return res.status(500).json({ success: false, message: error.message });
            }
            console.log(`Reset concluído: ${stdout}`);
            res.json({ success: true, message: 'Banco de dados restaurado com sucesso.' });
        });
    });

    // Endpoints específicos para cada recurso via GET (útil para o NexusBridge)
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
