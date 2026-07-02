# 💻 CityMotion Frontend (NexusOS)

Bem-vindo ao código-fonte da interface do CityMotion. Este projeto utiliza **Next.js 15** com a engine **NexusBridge**.

---

## 🏗️ Guia Rápido para Desenvolvedores

### Conexão com Dados
Evite fazer fetch direto para URLs externas. Use sempre a ponte:
```javascript
// CORRETO: Usa a infraestrutura da NexusBridge
fetch('/api/nexus/sync-all') 

// Para infraestrutura
fetch('/api/nexus/infrastructure/config')
fetch('/api/nexus/infrastructure/test-db', { method: 'POST', body: JSON.stringify({ type: 'sqlite' }) })
```

### Contexto Global (`useApp`)
O `AppProvider` centraliza:
- `userRole`: O cargo atual (dev, ti, admin, manager, employee).
- `currentUser`: Dados do usuário logado (incluindo o Token JWT).
- `refreshData`: Função para forçar sincronia com o banco de dados.

### Segurança e JWT
O Token é armazenado no `localStorage` e anexado automaticamente em todas as chamadas via Bridge:
```javascript
const getHeaders = () => {
    const token = localStorage.getItem('citymotion_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};
```
Se o token expirar ou for inválido, o backend retornará `401/403` e o frontend redirecionará para o login.

### Componente: InfrastructurePanel
O `InfrastructurePanel` (`src/components/infrastructure-panel.tsx`) é o painel completo de configuração:
- **Banco de Dados:** Seletor de motor + teste de conexão.
- **Proxy & CORS:** Configuração de origens permitidas.
- **SMTP:** Configuração e teste de servidor de e-mail.
- **Servidor:** Porta, modo demo e status de segurança.

Uso no settings page:
```tsx
import { InfrastructurePanel } from '@/components/infrastructure-panel';

<TabsContent value="infrastructure">
    <InfrastructurePanel />
</TabsContent>
```

---

## 🎨 Estilização
Utilizamos **Tailwind CSS** + **ShadCN UI**. 
- As cores estão definidas no `globals.css` via variáveis HSL.
- Para componentes técnicos, use a classe `scanlines` ou `tui-scanline`.
- Padrão de botões: `text-[10px] font-bold uppercase tracking-widest`.

---

## 📁 Estrutura de Pastas

```
src/
├── app/
│   ├── (app)/              # Rotas autenticadas
│   │   ├── dashboard/      # Painel principal
│   │   ├── settings/       # Configurações + Infraestrutura
│   │   ├── veiculos/       # Gestão de frota
│   │   ├── funcionarios/   # Gestão de pessoas
│   │   ├── viagens/        # Missões
│   │   ├── manutencao/     # Oficina
│   │   ├── abastecimento/  # Combustível
│   │   ├── nexus/          # NexusBridge Control
│   │   ├── terminal/       # Console TTY
│   │   └── chat/           # Comunicação
│   ├── (auth)/             # Rotas públicas (login, forgot-password)
│   ├── api/                # API routes do Next.js
│   └── cracha/             # Crachá virtual com QR Code
├── components/             # Componentes React
├── contexts/               # AppProvider (context global)
├── hooks/                  # Hooks customizados
├── lib/                    # Utilitários e tipos
├── nexusbridge/            # Engine de roteamento
└── data/                   # Dados estáticos e SQL schema
```

---

**NexusOS: Criando o futuro da gestão de mobilidade.**
