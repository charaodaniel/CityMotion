
# 🏗️ Guia de Implementação do Back-end Pro (Node.js/SQLite)

Este guia detalha como o backend do CityMotion foi construído para ser seguro e resiliente.

---

## 1. Camada de Segurança (The Guard)

Nunca armazene senhas em texto claro. Utilizamos a biblioteca `bcryptjs` para criar hashes irreversíveis.

### Fluxo de Registro de Senha
```javascript
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);
// Armazena 'hashedPassword' no SQLite
```

### Fluxo de Login
```javascript
const isMatch = bcrypt.compareSync(providedPassword, storedHash);
if (isMatch) {
    // Gera JWT assinado com a chave secreta do .env
}
```

---

## 2. Gestão de Estado e JWT

O token JWT contém as declarações de identidade (Claims) do usuário. O backend utiliza o middleware `authMiddleware.js` para interceptar toda requisição:

1. Extrai o token do Header `Authorization`.
2. Verifica a assinatura.
3. Anexa o objeto do usuário (id, role, sector) ao objeto `req.user`.
4. As rotas seguintes decidem se permitem a ação com base em `req.user.role`.

---

## 3. Banco de Dados SQLite e SQL Nativo

Diferente de Mocks em JSON, o SQLite permite integridade referencial:

- **FK Constraints:** Garante que você não apague um setor que ainda possui veículos.
- **Audit Triggers:** O backend registra o "autor" de cada mudança usando a identidade do JWT.

---

## 4. Variáveis de Ambiente (.env)

Mantenha segredos fora do Git:
```env
JWT_SECRET=sua_chave_ultra_secreta
PORT=3001
# O backend carrega isso via dotenv.config()
```

---

## 5. Manutenção

Para resetar o ambiente de desenvolvimento sem apagar o código, use:
`npm run db:init` dentro da pasta `/backend`. Isso reconstruirá as tabelas e reiniciará a sequência de IDs.
