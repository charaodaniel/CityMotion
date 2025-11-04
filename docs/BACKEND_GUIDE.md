# 🚀 Guia de Implementação do Back-end Node.js para o CityMotion

Este documento serve como um guia completo para construir o servidor Node.js que funcionará como o back-end da aplicação CityMotion, utilizando Express.js e SQLite.

---

## Passo 1: Estrutura do Projeto Back-end

Recomendamos criar uma pasta `backend/` na raiz do seu projeto para separar completamente o código do servidor do código do front-end (Next.js).

```
citymotion/
├── backend/
│   ├── node_modules/
│   ├── database/
│   │   └── citymotion.db  // O SQLite irá criar este arquivo
│   ├── routes/
│   │   ├── auth.js
│   │   └── data.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── server.js          // Arquivo principal do servidor
│   └── package.json
├── src/
│   └── ... (seu projeto Next.js)
└── ...
```

Execute `npm init -y` dentro da pasta `backend/` para criar o `package.json`.

---

## Passo 2: Instalar as Dependências

Dentro da pasta `backend/`, instale as bibliotecas necessárias:

```bash
npm install express sqlite3 cors bcryptjs jsonwebtoken
```

-   **express**: Framework para criar o servidor e as rotas da API.
-   **sqlite3**: Driver para se conectar e interagir com o banco de dados SQLite.
-   **cors**: Middleware para permitir que seu front-end (em `localhost:3000`) acesse o back-end (em `localhost:3001`).
-   **bcryptjs**: Para criptografar as senhas dos usuários de forma segura.
-   **jsonwebtoken**: Para criar e validar tokens de autenticação (JWT).

---

## Passo 3: Configurar o Banco de Dados

1.  **Crie o arquivo do banco de dados:** Crie uma pasta `backend/database`.
2.  **Crie um script de inicialização:** Crie um arquivo `backend/database/init_db.js` para ler o seu `database.sql` e popular o banco.

    ```javascript
    // backend/database/init_db.js
    const sqlite3 = require('sqlite3').verbose();
    const fs = require('fs');
    const path = require('path');

    const dbPath = path.resolve(__dirname, 'citymotion.db');
    const sqlScriptPath = path.resolve(__dirname, '../../src/data/database.sql');

    // Apaga o banco de dados antigo, se existir
    if (fs.existsSync(dbPath)) {
        fs.unlinkSync(dbPath);
        console.log('Banco de dados antigo removido.');
    }

    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Erro ao abrir o banco de dados', err.message);
        } else {
            console.log('Conectado ao banco de dados SQLite.');
            initializeDatabase();
        }
    });

    function initializeDatabase() {
        console.log('Lendo script SQL...');
        const sqlScript = fs.readFileSync(sqlScriptPath, 'utf8');

        db.exec(sqlScript, (err) => {
            if (err) {
                console.error('Erro ao executar o script SQL:', err.message);
            } else {
                console.log('Banco de dados e tabelas criados com sucesso.');
                console.log('Populando dados iniciais...');
            }

            db.close((err) => {
                if (err) {
                    console.error('Erro ao fechar o banco de dados', err.message);
                } else {
                    console.log('Conexão com o banco de dados fechada.');
                }
            });
        });
    }
    ```

3.  **Execute o script:** Rode `node backend/database/init_db.js`. Isso criará o arquivo `citymotion.db` com todas as tabelas e dados de teste.

---

## Passo 4: Criar o Servidor Express (`server.js`)

Este é o ponto de entrada do seu back-end.

```javascript
// backend/server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

// Conexão com o Banco de Dados
const dbPath = path.resolve(__dirname, 'database', 'citymotion.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err.message);
    } else {
        console.log("Conexão com o banco de dados SQLite estabelecida.");
    }
});

// Middlewares
app.use(cors()); // Permite requisições de outras origens (seu front-end)
app.use(express.json()); // Permite que o servidor entenda JSON

// Rotas da API
const authRoutes = require('./routes/auth');
// const dataRoutes = require('./routes/data'); // Futuras rotas

app.use('/api', authRoutes(db)); // Passa a instância do DB para as rotas
// app.use('/api', dataRoutes(db));

// Rota de teste
app.get('/', (req, res) => {
    res.send('Servidor do CityMotion está no ar!');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
```

---

## Passo 5: Implementar a Autenticação (`/routes/auth.js`)

Esta rota cuidará do login dos usuários.

```javascript
// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = 'seu-segredo-super-secreto-para-jwt'; // Mude isso para uma variável de ambiente!

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
                return res.status(500).json({ message: 'Erro no servidor.' });
            }
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            // Compara a senha enviada com a senha hasheada no banco
            const isPasswordCorrect = bcrypt.compareSync(password, user.password);

            if (!isPasswordCorrect) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            // Gera o Token JWT
            const token = jwt.sign(
                { id: user.id, name: user.name, role: user.role },
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
```

---

## Passo 6: Rotas Protegidas e Middleware de Verificação

Para garantir que apenas usuários logados acessem certas rotas, crie um middleware.

```javascript
// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'seu-segredo-super-secreto-para-jwt';

module.exports = function(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer <TOKEN>

    if (token == null) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
}
```

Agora, você pode criar as rotas para buscar dados e protegê-las com este middleware.

```javascript
// backend/routes/data.js (Exemplo)
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

module.exports = function(db) {
    // Exemplo de uma rota protegida para buscar todos os veículos
    router.get('/vehicles', authMiddleware, (req, res) => {
        // req.user contém os dados do usuário do token (id, name, role)
        console.log('Usuário autenticado:', req.user);
        
        const sql = `SELECT * FROM vehicles`;
        db.all(sql, [], (err, rows) => {
            if (err) {
                res.status(500).json({ message: "Erro ao buscar veículos." });
                return;
            }
            res.json(rows);
        });
    });

    // Você pode criar outras rotas aqui para /employees, /trips, etc.

    return router;
}
```

Não se esqueça de descomentar e usar essas rotas no `server.js`.

---

## Próximos Passos no Front-end

1.  **Refatorar o Login:** Altere a página `/login` para fazer uma requisição `POST` para `http://localhost:3001/api/login`.
2.  **Armazenar o Token:** Após o login bem-sucedido, armazene o token JWT recebido no `localStorage`.
3.  **Enviar o Token:** Para cada requisição a uma rota protegida, adicione o cabeçalho `Authorization: Bearer <seu_token>`.
4.  **Refatorar `AppProvider`:** Substitua a lógica de simulação de usuário e a busca de dados da `/api/data` por requisições à sua nova API Node.js.

Este guia fornece a base sólida para você construir um back-end robusto e seguro para o CityMotion. Boa codificação!
