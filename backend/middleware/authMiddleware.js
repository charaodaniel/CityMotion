
const jwt = require('jsonwebtoken');

if (!process.env.JWT_SECRET) {
    throw new Error('[CRÍTICO] JWT_SECRET não definido no arquivo .env. Configure uma chave secreta antes de iniciar o servidor.');
}
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = function(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer <TOKEN>

    if (token == null) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Erro na verificação do token:', err.message);
            return res.status(403).json({ message: 'Sessão expirada ou token inválido.' });
        }
        req.user = user;
        next();
    });
}
