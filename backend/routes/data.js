const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

module.exports = function(db) {
    // Middleware de autenticação para todas as rotas de dados
    router.use(authMiddleware);

    // Rota para buscar todos os dados iniciais
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
                        // Remove a senha do payload dos funcionários
                        if (key === 'employees') {
                            results[key] = rows.map(row => {
                                const { password, ...rest } = row;
                                return rest;
                            });
                        } else {
                            results[key] = rows;
                        }
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
                console.error('Erro ao buscar todos os dados:', err);
                res.status(500).json({ message: 'Erro ao buscar dados do banco.' });
            });
    });

    // Exemplo de uma rota POST para adicionar uma solicitação de veículo
    router.post('/vehicle-requests', (req, res) => {
        const { title, sector, details, priority, requester } = req.body;

        const sql = `INSERT INTO vehicle_requests (title, sector, details, priority, requester, status, requestDate)
                     VALUES (?, ?, ?, ?, ?, 'Pendente', datetime('now'))`;

        db.run(sql, [title, sector, details, priority, requester], function(err) {
            if (err) {
                console.error('Erro ao inserir solicitação:', err);
                return res.status(500).json({ message: 'Erro ao criar solicitação.' });
            }
            res.status(201).json({ id: this.lastID, ...req.body });
        });
    });

    return router;
}
