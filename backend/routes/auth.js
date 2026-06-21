
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendPasswordResetEmail } = require('../services/emailService');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'citymotion_secret_key_2024';

module.exports = function(db) {
    router.post('/login', (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Identificador e senha são obrigatórios.' });
        }

        const sql = `SELECT * FROM employees WHERE email = ? OR matricula = ? OR phone = ?`;

        db.get(sql, [email, email, email], (err, user) => {
            if (err) return res.status(500).json({ message: 'Erro no banco de dados.' });
            
            if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

            try {
                const isPasswordValid = bcrypt.compareSync(password, user.password);
                if (!isPasswordValid) return res.status(401).json({ message: 'Senha incorreta.' });

                const token = jwt.sign(
                    { id: user.id, name: user.name, role: user.role, sector: user.sector },
                    JWT_SECRET,
                    { expiresIn: '8h' }
                );

                const { password: _, ...userWithoutPassword } = user;
                res.status(200).json({ token, user: userWithoutPassword });
            } catch (bcryptErr) {
                res.status(500).json({ message: 'Erro interno de segurança.' });
            }
        });
    });

    router.post('/forgot-password', (req, res) => {
        const { identifier } = req.body;
        if (!identifier) return res.status(400).json({ message: 'Informe seu e-mail ou matrícula.' });

        const sql = `SELECT * FROM employees WHERE email = ? OR matricula = ?`;
        db.get(sql, [identifier, identifier], async (err, user) => {
            if (err) return res.status(500).json({ message: 'Erro interno.' });
            if (!user) return res.status(404).json({ message: 'Usuário não localizado.' });

            // Gera código de 6 dígitos
            const token = Math.floor(100000 + Math.random() * 900000).toString();
            const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hora

            db.run(`UPDATE employees SET reset_token = ?, reset_expires = ? WHERE id = ?`, [token, expires, user.id], async (updErr) => {
                if (updErr) return res.status(500).json({ message: 'Erro ao gerar token.' });
                
                // Envio real de e-mail via serviço Nodemailer
                const emailSent = await sendPasswordResetEmail(user.email, user.name, token);

                if (!emailSent) {
                    return res.status(500).json({ 
                        message: 'Erro ao despachar e-mail de segurança. Tente novamente mais tarde.' 
                    });
                }

                res.json({ 
                    message: 'Protocolo de recuperação iniciado. Verifique sua caixa de entrada.',
                    hint: 'O código expira em 60 minutos.'
                });
            });
        });
    });

    router.post('/reset-password', (req, res) => {
        const { identifier, token, newPassword } = req.body;
        if (!identifier || !token || !newPassword) return res.status(400).json({ message: 'Dados incompletos.' });

        const sql = `SELECT * FROM employees WHERE (email = ? OR matricula = ?) AND reset_token = ?`;
        db.get(sql, [identifier, identifier, token], (err, user) => {
            if (err) return res.status(500).json({ message: 'Erro interno.' });
            if (!user) return res.status(400).json({ message: 'Código inválido.' });

            if (new Date(user.reset_expires) < new Date()) {
                return res.status(400).json({ message: 'Código expirado.' });
            }

            const hashed = bcrypt.hashSync(newPassword, 10);
            db.run(`UPDATE employees SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?`, [hashed, user.id], (updErr) => {
                if (updErr) return res.status(500).json({ message: 'Erro ao atualizar senha.' });
                res.json({ message: 'Senha atualizada com sucesso!' });
            });
        });
    });

    return router;
}
