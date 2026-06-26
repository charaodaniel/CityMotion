
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendPasswordResetEmail } = require('../services/emailService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'citymotion_secret_key_2024';

module.exports = function(db) {
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;
        const isTerminalRequest = req.headers['x-nexus-terminal'] === 'true';

        if (!email || !password) {
            return res.status(400).json({ message: 'Identificador e senha são obrigatórios.' });
        }

        try {
            const sql = `SELECT * FROM employees WHERE email = $1 OR matricula = $2 OR phone = $3`;
            const { rows } = await db.query(sql, [email, email, email]);
            const user = rows[0];

            if (!user) return res.status(404).json({ message: 'Usuário não encontrado no sistema.' });

            // Bloqueio de Usuário Demo no Frontend Padrão
            if (user.is_demo === 1 && !isTerminalRequest) {
                return res.status(403).json({ 
                    message: 'ACESSO NEGADO: Este perfil de demonstração só pode ser iniciado via Terminal NexusOS por motivos de segurança.' 
                });
            }

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ message: 'Senha incorreta para o identificador fornecido.' });

            const token = jwt.sign(
                { id: user.id, name: user.name, role: user.role, sector: user.sector, is_demo: user.is_demo },
                JWT_SECRET,
                { expiresIn: '8h' }
            );

            const { password: _, ...userWithoutPassword } = user;
            
            console.log(`[Auth] Login OK: ${user.name} ${user.is_demo ? '(DEMO MODE)' : ''}`);
            
            res.status(200).json({ token, user: userWithoutPassword });
        } catch (err) {
            console.error('[Auth Error]:', err.message);
            res.status(500).json({ message: 'Erro interno no protocolo de autenticação.' });
        }
    });

    router.post('/forgot-password', async (req, res) => {
        const { identifier } = req.body;
        try {
            const { rows } = await db.query(`SELECT * FROM employees WHERE email = $1 OR matricula = $2`, [identifier, identifier]);
            const user = rows[0];
            if (!user) return res.status(404).json({ message: 'Usuário não localizado.' });

            const token = Math.floor(100000 + Math.random() * 900000).toString();
            const expires = new Date(Date.now() + 3600000).toISOString();

            await db.execute(`UPDATE employees SET reset_token = $1, reset_expires = $2 WHERE id = $3`, [token, expires, user.id]);
            await sendPasswordResetEmail(user.email, user.name, token);
            res.json({ message: 'Protocolo de recuperação enviado.' });
        } catch (err) {
            res.status(500).json({ message: 'Erro no despacho do token.' });
        }
    });

    return router;
}
