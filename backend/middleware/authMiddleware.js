const jwt = require('jsonwebtoken');
const JWT_SECRET = 'seu-segredo-super-secreto-para-jwt'; // Em produção, use uma variável de ambiente!

module.exports = function(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer <TOKEN>

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Erro na verificação do token:', err.message);
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
}
