
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
            }
        } catch (e) {
            console.error('[Backup Error]:', e.message);
        }
    }

    // Função auxiliar para registrar auditoria (Usa a identidade real do Token)
    function logChange(action, tableName, recordId, details, user) {
        const userIdentity = user ? `${user.name} (${user.role})` : 'Sistema';
        const sql = `INSERT INTO audit_logs (action, table_name, record_id, details, user_identity) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [action, tableName, recordId, JSON.stringify(details), userIdentity], (err) => {
            if (err) console.error('[Audit Error]:', err.message);
        });
    }

    // Rota consolidada de dados - Protegida
    router.get('/data', authMiddleware, (req, res) => {
        const queries = {
            trips: 'SELECT * FROM trips ORDER BY id DESC',
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
                    if (err) reject(err);
                    else {
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
            .catch(err => res.status(500).json({ error: err.message }));
    });

    // Listagem individual
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

    // CRUD Funcionários - Apenas Admin ou Dev
    router.post('/employees', authMiddleware, (req, res) => {
        const isAuthorized = req.user.role.toLowerCase().includes('admin') || req.user.role.toLowerCase().includes('dev');
        if (!isAuthorized) return res.status(403).json({ message: 'Ação não permitida para seu cargo.' });

        backupDb();
        const { name, email, role, sector, status, password, matricula, cnh } = req.body;
        
        const sql = `INSERT INTO employees (name, email, role, sector, status, password, matricula, cnh) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [name, email, role, JSON.stringify(sector || []), status || 'Disponível', password || '123456', matricula || null, cnh || null];
        
        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            logChange('INSERT', 'employees', this.lastID, { name, role, matricula }, req.user);
            res.json({ id: this.lastID });
        });
    });

    router.put('/employees/:id', authMiddleware, (req, res) => {
        const isAuthorized = req.user.role.toLowerCase().includes('admin') || req.user.role.toLowerCase().includes('dev');
        if (!isAuthorized) return res.status(403).json({ message: 'Ação não permitida.' });

        backupDb();
        const { name, role, status, email, sector, password, matricula, cnh } = req.body;
        
        const sql = `UPDATE employees SET 
            name = COALESCE(?, name), 
            role = COALESCE(?, role), 
            status = COALESCE(?, status), 
            email = COALESCE(?, email), 
            sector = COALESCE(?, sector), 
            password = COALESCE(?, password),
            matricula = COALESCE(?, matricula),
            cnh = COALESCE(?, cnh)
            WHERE id = ?`;
        
        const sectorStr = sector ? (Array.isArray(sector) ? JSON.stringify(sector) : sector) : null;
        
        db.run(sql, [
            name || null, 
            role || null, 
            status || null, 
            email || null, 
            sectorStr, 
            password || null,
            matricula || null,
            cnh || null,
            req.params.id
        ], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            logChange('UPDATE', 'employees', req.params.id, { name, role, status, matricula, cnh }, req.user);
            res.json({ updated: this.changes });
        });
    });

    router.delete('/employees/:id', authMiddleware, (req, res) => {
        const isRoot = req.user.role.toLowerCase().includes('dev') || req.user.role.toLowerCase().includes('global');
        const isAdmin = req.user.role.toLowerCase().includes('admin');
        
        if (!isAdmin && !isRoot) return res.status(403).json({ message: 'Apenas administradores podem remover registros.' });

        backupDb();
        const employeeId = req.params.id;

        if (isRoot) {
            db.run('DELETE FROM employees WHERE id = ?', [employeeId], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                logChange('DELETE', 'employees', employeeId, { message: 'Remoção física por ROOT' }, req.user);
                res.json({ message: 'Removido permanentemente do banco.', deleted: true });
            });
        } else {
            db.run("UPDATE employees SET status = 'Desativado' WHERE id = ?", [employeeId], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                logChange('SOFT_DELETE', 'employees', employeeId, { status: 'Desativado' }, req.user);
                res.json({ message: 'Marcado como desativado.', deleted: false });
            });
        }
    });

    // Auditoria de Sistema - Apenas Dev/TI
    router.get('/system/audit-logs', authMiddleware, (req, res) => {
        const isAuthorized = req.user.role.toLowerCase().includes('dev') || req.user.role.toLowerCase().includes('ti');
        if (!isAuthorized) return res.status(403).json({ message: 'Acesso restrito a auditoria técnica.' });

        db.all('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        });
    });

    router.get('/system/resources', authMiddleware, (req, res) => {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        res.json({
            uptime: process.uptime(),
            memory: { 
                total: (totalMem / 1024 / 1024 / 1024).toFixed(2) + ' GB', 
                used: (usedMem / 1024 / 1024 / 1024).toFixed(2) + ' GB', 
                percentage: ((usedMem / totalMem) * 100).toFixed(1) 
            },
            cpu: { model: os.cpus()[0].model, cores: os.cpus().length, load: (os.loadavg()[0] * 10).toFixed(1) },
            platform: process.platform,
            nodeVersion: process.version
        });
    });

    router.post('/maintenance/reset', authMiddleware, (req, res) => {
        const isRoot = req.user.role.toLowerCase().includes('dev') || req.user.role.toLowerCase().includes('global');
        if (!isRoot) return res.status(403).json({ message: 'Permissão negada. Apenas usuários ROOT podem realizar o reset de fábrica.' });

        const initScriptPath = path.resolve(__dirname, '../database/init_db.js');
        exec(`node ${initScriptPath}`, (error) => {
            if (error) return res.status(500).json({ success: false, message: error.message });
            logChange('SYSTEM_RESET', 'database', '*', { message: 'Reset total de fábrica executado' }, req.user);
            res.json({ success: true, message: 'Sistema reiniciado e banco restaurado.' });
        });
    });

    return router;
};
