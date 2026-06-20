
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const router = express.Router();

module.exports = function(db) {
    const dbFilePath = path.resolve(__dirname, '../database/citymotion.db');
    const backupFilePath = path.resolve(__dirname, '../database/citymotion.db.bak');

    // Garantir que a tabela de auditoria exista
    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        action TEXT NOT NULL,
        table_name TEXT NOT NULL,
        record_id TEXT,
        details TEXT,
        user_identity TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

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

    // Função auxiliar para registrar auditoria
    function logChange(action, tableName, recordId, details, userIdentity = 'Sistema') {
        const sql = `INSERT INTO audit_logs (action, table_name, record_id, details, user_identity) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [action, tableName, recordId, JSON.stringify(details), userIdentity], (err) => {
            if (err) console.error('[Audit Error]:', err.message);
        });
    }

    // Rota consolidada de dados
    router.get('/data', (req, res) => {
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

    // Listagem individual para terminais e CRUDs
    router.get('/employees', (req, res) => {
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

    router.get('/employees/:id', (req, res) => {
        db.get('SELECT * FROM employees WHERE id = ?', [req.params.id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ message: 'Não encontrado' });
            delete row.password;
            try { row.sector = JSON.parse(row.sector); } catch(e) { row.sector = [row.sector]; }
            res.json(row);
        });
    });

    router.get('/vehicles', (req, res) => {
        db.all('SELECT * FROM vehicles', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    });

    // CRUD Funcionários com Auditoria e Backup
    router.post('/employees', (req, res) => {
        backupDb();
        const { name, email, role, sector, status, password, matricula, cnh } = req.body;
        const identity = req.headers['x-nexus-user'] || 'Sistema';
        
        const sql = `INSERT INTO employees (name, email, role, sector, status, password, matricula, cnh) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [name, email, role, JSON.stringify(sector || []), status || 'Disponível', password || '123456', matricula || null, cnh || null];
        
        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            logChange('INSERT', 'employees', this.lastID, { name, role }, identity);
            res.json({ id: this.lastID });
        });
    });

    router.put('/employees/:id', (req, res) => {
        backupDb();
        const { name, role, status, email, sector, password } = req.body;
        const identity = req.headers['x-nexus-user'] || 'Sistema';
        
        const sql = `UPDATE employees SET name = COALESCE(?, name), role = COALESCE(?, role), status = COALESCE(?, status), email = COALESCE(?, email), sector = COALESCE(?, sector), password = COALESCE(?, password) WHERE id = ?`;
        const sectorStr = sector ? (Array.isArray(sector) ? JSON.stringify(sector) : sector) : null;
        
        db.run(sql, [name || null, role || null, status || null, email || null, sectorStr, password || null, req.params.id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            logChange('UPDATE', 'employees', req.params.id, { name, role, status }, identity);
            res.json({ updated: this.changes });
        });
    });

    router.delete('/employees/:id', (req, res) => {
        backupDb();
        const employeeId = req.params.id;
        const identity = req.headers['x-nexus-user'] || 'Sistema';
        const isRoot = identity.toLowerCase().includes('dev') || identity.toLowerCase().includes('root');

        if (isRoot) {
            db.run('DELETE FROM employees WHERE id = ?', [employeeId], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                logChange('DELETE', 'employees', employeeId, { message: 'Remoção física' }, identity);
                res.json({ message: 'Removido permanentemente.', deleted: true });
            });
        } else {
            db.run("UPDATE employees SET status = 'Desativado' WHERE id = ?", [employeeId], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                logChange('SOFT_DELETE', 'employees', employeeId, { status: 'Desativado' }, identity);
                res.json({ message: 'Marcado como desativado.', deleted: false });
            });
        }
    });

    // Auditoria de Sistema
    router.get('/system/audit-logs', (req, res) => {
        db.all('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows || []);
        });
    });

    router.get('/system/resources', (req, res) => {
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

    router.get('/system/db-info', (req, res) => {
        const tables = ['employees', 'vehicles', 'trips', 'sectors', 'vehicle_requests', 'maintenance_requests', 'audit_logs'];
        const stats = {};
        const promises = tables.map(table => new Promise((resolve) => {
            db.get(`SELECT COUNT(*) as count FROM ${table}`, (err, row) => {
                stats[table] = err ? 0 : (row ? row.count : 0);
                resolve();
            });
        }));
        Promise.all(promises).then(() => res.json({ counts: stats, database: 'SQLite3', status: 'Healthy' }));
    });

    router.post('/maintenance/reset', (req, res) => {
        const initScriptPath = path.resolve(__dirname, '../database/init_db.js');
        exec(`node ${initScriptPath}`, (error) => {
            if (error) return res.status(500).json({ success: false, message: error.message });
            res.json({ success: true, message: 'Sistema reiniciado e banco restaurado.' });
        });
    });

    return router;
};
