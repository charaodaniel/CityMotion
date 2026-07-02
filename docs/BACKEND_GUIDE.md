# 🏗️ Guia de Implementação do Back-end (Node.js/SQLite)

Este guia detalha como o backend do CityMotion foi construído para ser seguro e resiliente.

---

## 1. Camada de Segurança (The Guard)

Nunca armazene senhas em texto claro. Utilizamos a biblioteca `bcryptjs` para criar hashes irreversíveis.

### Fluxo de Registro de Senha
```javascript
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);
// Armazena 'hashedPassword' no banco de dados
```

### Fluxo de Login
```javascript
const isMatch = bcrypt.compareSync(providedPassword, storedHash);
if (isMatch) {
    // Gera JWT assinado com a chave secreta do .env
    const token = jwt.sign(
        { id: user.id, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '8h' }
    );
}
```

---

## 2. Variáveis de Ambiente (.env)

Mantenha segredos fora do Git. O arquivo `.env` é carregado automaticamente via `dotenv`:

```bash
# Copiar template
cp .env.example .env

# Gerar JWT_SECRET seguro
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Variáveis Obrigatórias
| Variável | Descrição |
| :--- | :--- |
| `JWT_SECRET` | Chave secreta para assinatura de tokens JWT |

### Variáveis Opcionais
| Variável | Padrão | Descrição |
| :--- | :--- | :--- |
| `PORT` | `3001` | Porta do servidor Express |
| `DATABASE_URL` | *(vazio)* | URL de conexão do banco (vazio = SQLite local) |
| `CORS_ORIGIN` | `http://localhost:9002` | Origens permitidas (separadas por vírgula) |
| `DEMO_MODE` | `false` | Ativa reset diário dos dados |
| `SMTP_HOST` | *(vazio)* | Servidor SMTP para e-mails |
| `SMTP_PORT` | `587` | Porta SMTP |
| `SMTP_USER` | *(vazio)* | Usuário SMTP |
| `SMTP_PASS` | *(vazio)* | Senha SMTP |
| `SMTP_SECURE` | `false` | Usar TLS/SSL |

---

## 3. Gestão de Estado e JWT

O token JWT contém as declarações de identidade (Claims) do usuário. O backend utiliza o middleware `authMiddleware.js` para interceptar toda requisição:

1. Extrai o token do Header `Authorization`.
2. Verifica a assinatura com o `JWT_SECRET`.
3. Anexa o objeto do usuário (id, name, role, sector) ao objeto `req.user`.
4. As rotas seguintes decidem se permitem a ação com base em `req.user.role`.

### Exemplo de Proteção de Rota
```javascript
router.get('/admin-only', authMiddleware, (req, res) => {
    if (req.user.role !== 'Desenvolvedor Global') {
        return res.status(403).json({ message: 'Acesso negado.' });
    }
    // Lógica administrativa...
});
```

---

## 4. Rate Limiting

O backend utiliza `express-rate-limit` para proteção contra ataques:

### Configuração Global
```javascript
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutos
    max: 100,                    // 100 requisições por IP
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(globalLimiter);
```

### Rate Limiting Específico (Login)
```javascript
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,                      // 10 tentativas por IP
    skipSuccessfulRequests: true, // Logins OK não contam
});
```

---

## 5. CORS (Cross-Origin Resource Sharing)

Origens permitidas são configuradas via variável `CORS_ORIGIN`:

```env
# Produção: apenas o domínio real
CORS_ORIGIN=https://citymotion.seudominio.com

# Desenvolvimento: localhost
CORS_ORIGIN=http://localhost:9002

# Múltiplas origens
CORS_ORIGIN=http://localhost:9002,https://citymotion.seudominio.com
```

---

## 6. Banco de Dados Multi-Engine

O `db_manager.js` suporta múltiplos motores de persistência:

### SQLite (Local)
- Padrão quando `DATABASE_URL` não está definido.
- Banco local em `backend/database/citymotion.db`.
- Ideal para pendrives e servidores isolados.

### PostgreSQL (Nuvem)
- Ativado quando `DATABASE_URL` está definido.
- Suporte a transações e rollback.
- Configuração via connection string:
  ```
  postgresql://usuario:senha@host:5432/nomedb
  ```

### Supabase
- Usa o driver PostgreSQL (compatível).
- URL do painel Supabase → Settings → Database → Connection string.

### MongoDB
- Validação de formato de URL implementada.
- Para uso completo, instale o driver: `npm install mongoose`.

---

## 7. Proteção contra SQL Injection

Todas as queries utilizam parâmetros:

```javascript
// CORRETO: Query parametrizada
const sql = 'SELECT * FROM employees WHERE email = $1';
const { rows } = await db.query(sql, [email]);

// ERRADO: Interpolação de strings (NUNCA faça isso)
// const sql = `SELECT * FROM employees WHERE email = '${email}'`;
```

---

## 8. Banco de Dados SQLite e SQL Nativo

Diferente de Mocks em JSON, o SQLite permite integridade referencial:

- **FK Constraints:** Garante que você não apague um setor que ainda possui veículos.
- **Audit Triggers:** O backend registra o "autor" de cada mudança usando a identidade do JWT.
- **Soft Delete:** Registros são marcados como desativados em vez de excluídos.

---

## 9. Manutenção

### Reset do Banco de Dados
```bash
cd backend
npm run db:init
```
Isso reconstruirá as tabelas e reiniciará a sequência de IDs.

### Reset via Terminal (ROOT)
```
nexus-db-reset
```
Requer confirmação de senha (validação via Bcrypt).

---

## 10. Estrutura de Rotas

```
backend/
├── server.js              # Servidor Express principal
├── routes/
│   ├── auth.js            # Autenticação (login, forgot/reset password)
│   ├── data.js            # Dados (sync, employees, vehicles, trips)
│   └── infrastructure.js  # Infraestrutura (DB test, config, SMTP test)
├── middleware/
│   └── authMiddleware.js  # Validação JWT
├── database/
│   ├── db_manager.js      # Gerenciador de banco multi-engine
│   ├── init_db.js         # Inicialização e seed do banco
│   └── citymotion.db      # Banco SQLite (gitignored)
└── services/
    └── emailService.js    # Serviço de envio de e-mails
```
