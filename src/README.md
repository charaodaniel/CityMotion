
# 💻 CityMotion Frontend (NexusOS)

Bem-vindo ao código-fonte da interface do CityMotion. Este projeto utiliza **Next.js 15** com a engine **NexusBridge**.

---

## 🏗️ Guia Rápido para Desenvolvedores

### Conexão com Dados
Evite fazer fetch direto para URLs externas. Use sempre a ponte:
```javascript
// CORRETO: Usa a infraestrutura da NexusBridge
fetch('/api/nexus/sync-all') 
```

### Contexto Global (`useApp`)
O `AppProvider` centraliza:
- `userRole`: O cargo atual (dev, ti, admin, manager, employee).
- `currentUser`: Dados do usuário logado (incluindo o Token JWT).
- `refreshData`: Função para forçar sincronia com o SQLite.

### Segurança e JWT
O Token é armazenado no `localStorage` e anexado automaticamente em todas as chamadas via Bridge. Se o token expirar ou for inválido, o backend retornará `401/403` e o frontend redirecionará para o login.

---

## 🎨 Estilização
Utilizamos **Tailwind CSS** + **ShadCN UI**. 
- As cores estão definidas no `globals.css` via variáveis HSL.
- Para componentes técnicos, use a classe `scanlines` ou `tui-scanline`.

---

**NexusOS: Criando o futuro da gestão de mobilidade.**
