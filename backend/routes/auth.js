
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendPasswordResetEmail } = require('../services/emailService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'citymotion_secret_key_2024';

module.exports = function(db) {
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Identificador e senha são obrigatórios.' });
        }

        try {
            const sql = `SELECT * FROM employees WHERE email = $1 OR matricula = $2 OR phone = $3`;
            const { rows } = await db.query(sql, [email, email, email]);
            const user = rows[0];

            if (!user) return res.status(401).json({ message: 'Usuário não localizado.' });

            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) return res.status(401).json({ message: 'Senha incorreta.' });

            const token = jwt.sign(
                { id: user.id, name: user.name, role: user.role, sector: user.sector },
                JWT_SECRET,
                { expiresIn: '8h' }
            );

            const { password: _, ...userWithoutPassword } = user;
            res.status(200).json({ token, user: userWithoutPassword });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Erro no protocolo de autenticação.' });
        }
    });

    router.post('/forgot-password', async (req, res) => {
        const { identifier } = req.body;
        if (!identifier) return res.status(400).json({ message: 'Informe seu e-mail ou matrícula.' });

        try {
            const sql = `SELECT * FROM employees WHERE email = $1 OR matricula = $2`;
            const { rows } = await db.query(sql, [identifier, identifier]);
            const user = rows[0];

            if (!user) return res.status(404).json({ message: 'Usuário não localizado.' });

            const token = Math.floor(100000 + Math.random() * 900000).toString();
            const expires = new Date(Date.now() + 3600000).toISOString();

            // Escrita dual sincronizada
            await db.execute(`UPDATE employees SET reset_token = $1, reset_expires = $2 WHERE id = $3`, [token, expires, user.id]);
            
            await sendPasswordResetEmail(user.email, user.name, token);
            res.json({ message: 'Protocolo de recuperação enviado via e-mail.' });
        } catch (err) {
            res.status(500).json({ message: 'Erro interno no despacho do token.' });
        }
    });

    router.post('/reset-password', async (req, res) => {
        const { identifier, token, newPassword } = req.body;
        
        try {
            const sql = `SELECT * FROM employees WHERE (email = $1 OR matricula = $1) AND reset_token = $2`;
            const { rows } = await db.query(sql, [identifier, token]);
            const user = rows[0];

            if (!user) return res.status(401).json({ message: 'Código inválido ou e-mail incorreto.' });

            const expiryDate = new Date(user.reset_expires);
            if (expiryDate < new Date()) return res.status(401).json({ message: 'O código expirou. Solicite um novo.' });

            const hash = bcrypt.hashSync(newPassword, 10);
            
            // Atualiza senha em ambos os bancos
            await db.execute(
                `UPDATE employees SET password = $1, reset_token = NULL, reset_expires = NULL WHERE id = $2`,
                [hash, user.id]
            );

            res.json({ message: 'Senha atualizada com sucesso.' });
        } catch (err) {
            res.status(500).json({ message: 'Falha ao redefinir credencial.' });
        }
    });

    return router;
}
