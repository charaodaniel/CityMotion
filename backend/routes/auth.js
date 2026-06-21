
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'citymotion_secret_key_2024';

module.exports = function(db) {
    router.post('/login', (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Identificador e senha são obrigatórios.' });
        }

        console.log(`[Auth] Tentativa de login para: ${email}`);

        const sql = `SELECT * FROM employees WHERE email = ? OR matricula = ? OR phone = ?`;

        db.get(sql, [email, email, email], (err, user) => {
            if (err) {
                console.error('[Auth DB Error]:', err);
                return res.status(500).json({ message: 'Erro no banco de dados.' });
            }
            
            if (!user) {
                console.warn(`[Auth] Usuário não localizado: ${email}`);
                return res.status(401).json({ message: 'Credenciais inválidas ou usuário não cadastrado.' });
            }

            try {
                const isPasswordValid = bcrypt.compareSync(password, user.password);

                if (!isPasswordValid) {
                     console.warn(`[Auth] Senha incorreta para: ${email}`);
                     return res.status(401).json({ message: 'Senha incorreta.' });
                }

                console.log(`[Auth] Login OK: ${user.name}`);

                const token = jwt.sign(
                    { id: user.id, name: user.name, role: user.role, sector: user.sector },
                    JWT_SECRET,
                    { expiresIn: '8h' }
                );

                const { password: _, ...userWithoutPassword } = user;

                res.status(200).json({
                    message: 'Autenticação concluída!',
                    token,
                    user: userWithoutPassword
                });
            } catch (bcryptErr) {
                console.error('[Auth Bcrypt Error]:', bcryptErr);
                res.status(500).json({ message: 'Erro interno ao validar criptografia.' });
            }
        });
    });

    return router;
}
