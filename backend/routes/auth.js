const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'seu-segredo-super-secreto-para-jwt'; // Em produção, use uma variável de ambiente!

module.exports = function(db) {
    // Rota de Login
    router.post('/login', (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        const sql = `SELECT * FROM employees WHERE email = ?`;

        db.get(sql, [email], (err, user) => {
            if (err) {
                console.error('Erro no banco de dados:', err);
                return res.status(500).json({ message: 'Erro no servidor.' });
            }
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            // AVISO: A comparação de senha está simplificada para o protótipo.
            // Em produção, use uma biblioteca como bcrypt para comparar senhas com hash.
            if (password !== user.password) {
                 return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            // Gera o Token JWT
            const token = jwt.sign(
                { id: user.id, name: user.name, role: user.role, sector: user.sector },
                JWT_SECRET,
                { expiresIn: '8h' } // Token expira em 8 horas
            );

            // Remove a senha do objeto de usuário antes de enviar a resposta
            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                message: 'Login bem-sucedido!',
                token,
                user: userWithoutPassword
            });
        });
    });

    return router;
}
