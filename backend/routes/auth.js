
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-insecure-secret';

module.exports = function(db) {
    // Rota de Login - Suporta Email ou Matrícula
    router.post('/login', (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Identificador e senha são obrigatórios.' });
        }

        // Busca por email OU matrícula
        const sql = `SELECT * FROM employees WHERE email = ? OR matricula = ?`;

        db.get(sql, [email, email], (err, user) => {
            if (err) {
                console.error('Erro no banco de dados:', err);
                return res.status(500).json({ message: 'Erro interno no servidor.' });
            }
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado no sistema.' });
            }

            // Comparação segura usando Bcrypt
            const isPasswordValid = bcrypt.compareSync(password, user.password);

            if (!isPasswordValid) {
                 return res.status(401).json({ message: 'Senha incorreta para o identificador fornecido.' });
            }

            // Tenta fazer o parse do campo 'sector' (JSON array no banco)
            try {
                user.sector = JSON.parse(user.sector);
            } catch (e) {
                user.sector = Array.isArray(user.sector) ? user.sector : [user.sector];
            }

            // Gera o Token JWT contendo apenas dados necessários (RBAC)
            const token = jwt.sign(
                { id: user.id, name: user.name, role: user.role, sector: user.sector },
                JWT_SECRET,
                { expiresIn: '8h' }
            );

            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                message: 'Autenticação bem-sucedida!',
                token,
                user: userWithoutPassword
            });
        });
    });

    return router;
}
