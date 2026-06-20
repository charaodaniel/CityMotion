
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const bcrypt = require('bcryptjs');
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

    // Função auxiliar para registrar auditoria (Extrai identidade do Token)
    function logChange(action, tableName, recordId, details, user) {
        const userIdentity = user ? `${user.name} (${user.role})` : 'Sistema';
        const sql = `INSERT INTO audit_logs (action, table_name, record_id, details, user_identity) VALUES (?, ?, ?, ?, ?)`;
        db.run(sql, [action, tableName, recordId, JSON.stringify(details), userIdentity], (err) => {
            if (err) console.error('[Audit Error]:', err.message);
        });
    }

    // Rota consolidada de dados - Protegida por JWT
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
            .catch(err => res.status(500).json({ error: 'Erro ao carregar ecossistema de dados.' }));
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

    // CRUD Funcionários - Apenas Perfis Técnicos ou Administrativos
    router.post('/employees', authMiddleware, (req, res) => {
        const role = req.user.role.toLowerCase();
        const isAuthorized = role.includes('admin') || role.includes('dev') || role.includes('ti');
        
        if (!isAuthorized) return res.status(403).json({ message: 'Acesso negado: privilégios insuficientes.' });

        backupDb();
        const { name, email, role: empRole, sector, status, password, matricula, cnh } = req.body;
        
        // Hashing da senha antes de inserir no banco
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password || '123456', salt);
        
        const sql = `INSERT INTO employees (name, email, role, sector, status, password, matricula, cnh) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [name, email, empRole, JSON.stringify(sector || []), status || 'Disponível', hashedPassword, matricula || null, cnh || null];
        
        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ error: 'Falha ao persistir novo colaborador. Verifique se o e-mail ou matrícula já existem.' });
            logChange('INSERT', 'employees', this.lastID, { name, role: empRole, matricula }, req.user);
            res.json({ id: this.lastID });
        });
    });

    router.put('/employees/:id', authMiddleware, (req, res) => {
        const userRole = req.user.role.toLowerCase();
        const isAuthorized = userRole.includes('admin') || userRole.includes('dev') || userRole.includes('ti');
        
        if (!isAuthorized) return res.status(403).json({ message: 'Ação não permitida para seu nível de acesso.' });

        backupDb();
        const { name, role: empRole, status, email, sector, password, matricula, cnh } = req.body;
        
        let passwordFragment = '';
        const params = [name || null, empRole || null, status || null, email || null, null, matricula || null, cnh || null];

        // Se uma nova senha foi enviada, hasheamos
        if (password) {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);
            params.push(hashedPassword);
            passwordFragment = ', password = ?';
        }

        const sectorStr = sector ? (Array.isArray(sector) ? JSON.stringify(sector) : sector) : null;
        params[4] = sectorStr;
        params.push(req.params.id);

        const sql = `UPDATE employees SET 
            name = COALESCE(?, name), 
            role = COALESCE(?, role), 
            status = COALESCE(?, status), 
            email = COALESCE(?, email), 
            sector = COALESCE(?, sector), 
            matricula = COALESCE(?, matricula),
            cnh = COALESCE(?, cnh)
            ${passwordFragment}
            WHERE id = ?`;
        
        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            logChange('UPDATE', 'employees', req.params.id, { name, role: empRole, matricula }, req.user);
            res.json({ updated: this.changes });
        });
    });

    router.delete('/employees/:id', authMiddleware, (req, res) => {
        const role = req.user.role.toLowerCase();
        const isRoot = role.includes('dev') || role.includes('global');
        const isAdmin = role.includes('admin');
        
        if (!isAdmin && !isRoot) return res.status(403).json({ message: 'Apenas administradores de sistema podem remover registros.' });

        backupDb();
        const employeeId = req.params.id;

        if (isRoot) {
            db.run('DELETE FROM employees WHERE id = ?', [employeeId], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                logChange('DELETE', 'employees', employeeId, { message: 'Remoção física por ROOT' }, req.user);
                res.json({ message: 'Registro removido permanentemente.', deleted: true });
            });
        } else {
            db.run("UPDATE employees SET status = 'Desativado' WHERE id = ?", [employeeId], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                logChange('SOFT_DELETE', 'employees', employeeId, { status: 'Desativado' }, req.user);
                res.json({ message: 'Registro desativado conforme política de auditoria.', deleted: false });
            });
        }
    });

    // Auditoria de Sistema - Apenas Dev/TI
    router.get('/system/audit-logs', authMiddleware, (req, res) => {
        const role = req.user.role.toLowerCase();
        const isAuthorized = role.includes('dev') || role.includes('ti');
        if (!isAuthorized) return res.status(403).json({ message: 'Acesso restrito à auditoria técnica.' });

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
        const role = req.user.role.toLowerCase();
        const isRoot = role.includes('dev') || role.includes('global');
        if (!isRoot) return res.status(403).json({ message: 'Permissão negada. Apenas usuários ROOT podem realizar o reset total.' });

        const initScriptPath = path.resolve(__dirname, '../database/init_db.js');
        exec(`node ${initScriptPath}`, (error) => {
            if (error) return res.status(500).json({ success: false, message: error.message });
            logChange('SYSTEM_RESET', 'database', '*', { message: 'Reset de fábrica executado' }, req.user);
            res.json({ success: true, message: 'Sistema reiniciado e banco restaurado com sucesso.' });
        });
    });

    return router;
};
