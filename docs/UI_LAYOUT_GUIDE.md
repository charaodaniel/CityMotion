# 🎨 Guia de Design System e UI — CityMotion

O CityMotion possui duas interfaces: a **SPA Clássica** (HTML/JS/CSS) servida pelo backend Fastify, e o **Aplicativo Next.js** (herdado). A SPA é a interface principal recomendada.

---

## 📱 SPA Frontend (Principal)

### Arquitetura

```
public/
├── app.html                  # Shell da aplicação (layout + injeção de páginas)
├── index.html                # Página de login (/login)
├── css/
│   └── styles.css            # Estilos globais NexusOS (dark theme)
├── js/
│   ├── app.js                # Roteador SPA + injeção de conteúdo
│   ├── store.js              # Gerenciamento de estado global (pub/sub)
│   ├── api.js                # Cliente HTTP (fetch wrapper + JWT)
│   ├── ws.js                 # Cliente Socket.IO (notificações em tempo real)
│   ├── toast.js              # Sistema de notificações Toast
│   └── pages/                # Páginas da aplicação
│       ├── dashboard.js      # Dashboard com KPIs e gráficos
│       ├── veiculos.js       # Gestão da frota
│       ├── funcionarios.js   # Gestão de pessoas
│       ├── setores.js        # Setores da organização
│       ├── viagens.js        # Agendamento e controle de viagens
│       ├── abastecimento.js  # Registro de abastecimentos
│       ├── manutencao.js     # Kanban de manutenção
│       ├── escalas.js        # Escalas de trabalho
│       ├── chat.js           # Mensagens entre funcionários
│       ├── relatorios.js     # Relatórios e estatísticas
│       ├── perfil.js         # Perfil do usuário
│       └── settings.js       # Configurações (operações + infraestrutura)
```

### Roteamento SPA

Gerenciado por `public/js/app.js`, que:

1. Intercepta cliques em links de navegação
2. Injeta o HTML da página correspondente no `<main>`
3. Executa a função `render()` da página
4. Mantém a Store sincronizada com o estado global

```javascript
// Exemplo de rota
const routes = {
  dashboard: { title: 'Dashboard', render: renderDashboard, roles: ['all'] },
  veiculos: { title: 'Veículos', render: renderVeiculos, roles: ['Desenvolvedor Global', 'Administrador', 'Gestor de Setor', 'Motorista'] },
  // ...
};
```

---

## 🌑 Paleta de Cores (NexusOS Dark Tech)

```css
/* Variáveis CSS em :root */
--bg-primary: #09090b;          /* zinc-950 — fundo profundo */
--bg-secondary: #18181b;        /* zinc-900 — cards e containers */
--bg-tertiary: #27272a;         /* zinc-800 — hover states */
--text-primary: #fafafa;        /* zinc-50 — texto principal */
--text-secondary: #a1a1aa;      /* zinc-400 — texto secundário */
--text-muted: #71717a;          /* zinc-500 — texto muted */
--accent: #3b82f6;              /* blue-500 — ações primárias */
--success: #22c55e;             /* green-500 — sucesso */
--warning: #eab308;             /* yellow-500 — aviso */
--danger: #ef4444;              /* red-500 — erro */
--border: #27272a;              /* zinc-800 — bordas */
```

### Cores de Status

| Status | Cor | Uso |
| :--- | :--- | :--- |
| Disponível | `#22c55e` (green) | Veículos, funcionários |
| Em Viagem | `#3b82f6` (blue) | Viagens em andamento |
| Manutenção | `#f97316` (orange) | Veículos em oficina |
| Pendente | `#eab308` (yellow) | Solicitações |
| Concluído | `#22c55e` (green) | Tarefas finalizadas |
| Inativo | `#6b7280` (gray) | Funcionários desativados |
| Crítico | `#ef4444` (red) | Alertas |

---

## 🧩 Componentes da UI

### Sidebar (Navegação Lateral)
- Background: `bg-zinc-950/80 backdrop-blur-xl`
- Adapta-se dinamicamente ao cargo do usuário
- Ícones Lucide via CDN
- Destaque na rota ativa com `bg-zinc-800`

### Cards de Dashboard
```html
<div class="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-zinc-400 text-xs uppercase tracking-wider">Título</h3>
    <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
      <i data-lucide="icon-name" class="w-5 h-5 text-blue-500"></i>
    </div>
  </div>
  <p class="text-2xl font-bold text-white">42</p>
  <p class="text-xs text-zinc-500 mt-1">Descrição</p>
</div>
```

### Tabelas de Dados
```html
<div class="overflow-x-auto rounded-xl border border-zinc-800">
  <table class="w-full">
    <thead>
      <tr class="border-b border-zinc-800 bg-zinc-900/50">
        <th class="text-left p-3 text-xs font-medium text-zinc-400 uppercase">Coluna</th>
      </tr>
    </thead>
    <tbody>
      <tr class="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
        <td class="p-3 text-sm text-zinc-300">Valor</td>
      </tr>
    </tbody>
  </table>
</div>
```

### Badges de Status
```html
<span class="px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/30">
  Disponível
</span>
```

### Botões
```html
<!-- Primário -->
<button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
  Salvar
</button>

<!-- Secundário -->
<button class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">
  Cancelar
</button>

<!-- Perigoso -->
<button class="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg text-sm font-medium transition-colors">
  Excluir
</button>
```

### Inputs
```html
<input type="text"
  class="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100
         placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
         transition-all text-sm" />
```

### Modal
```html
<div id="modal-overlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
  <div class="bg-zinc-900 rounded-xl border border-zinc-700 w-full max-w-lg max-h-[80vh] overflow-y-auto">
    <div class="flex items-center justify-between p-4 border-b border-zinc-800">
      <h2 class="text-lg font-semibold text-zinc-100">Título</h2>
      <button onclick="closeModal()" class="text-zinc-500 hover:text-zinc-300">✕</button>
    </div>
    <div class="p-4">
      <!-- Conteúdo -->
    </div>
  </div>
</div>
```

### Toast Notifications
```javascript
// Uso
Toast.show('Mensagem', 'success');           // ✅ Verde
Toast.show('Erro ao salvar', 'error');        // ❌ Vermelho
Toast.show('Campo obrigatório', 'warning');   // ⚠️ Amarelo
Toast.show('Informação', 'info');             // ℹ️ Azul

// Com objeto
Toast.show({ title: 'Sucesso', message: 'Registro salvo!', type: 'success', duration: 3000 });
```

---

## 📐 Princípios de Layout

### Dashboard
- Grid responsivo: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`
- Cards de KPI no topo com ícones e valores
- Gráfico de atividade abaixo (Chart.js via CDN)
- Tabela de últimas viagens

### Páginas de Lista (Veículos, Funcionários, etc.)
- Barra de ações: botão "Novo" + campo de busca
- Grid ou tabela de cards
- Modal de formulário para criar/editar
- Paginação ou scroll infinito

### Kanban (Manutenção)
- 3 colunas fixas: Pendente | Em Andamento | Concluído
- Cards arrastáveis (via sortablejs CDN)
- Cores por prioridade

---

## 📱 Responsividade

- **Desktop (≥1024px):** Layout completo com sidebar fixa
- **Tablet (768-1023px):** Sidebar recolhida, grid adaptável
- **Mobile (<768px):** Menu hamburguer, cards empilhados, tabelas com scroll horizontal

---

## 🎭 Animações

```css
/* Transições suaves */
.card { @apply transition-all duration-200; }
.card:hover { @apply border-zinc-600 shadow-lg shadow-black/20; }

/* Fade in de páginas */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.page-content { animation: fadeIn 0.3s ease-out; }

/* Toast slide-in */
@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
```

---

## 🔌 Dependências CDN

A SPA carrega bibliotecas via CDN no `app.html`:

| Biblioteca | CDN | Uso |
| :--- | :--- | :--- |
| Tailwind CSS | `cdn.tailwindcss.com` | Estilos utilitários |
| Lucide Icons | `unpkg.com/lucide@latest` | Ícones |
| Socket.IO | `cdn.socket.io/4.8.1/socket.io.min.js` | WebSocket |
| Chart.js | `cdn.jsdelivr.net/npm/chart.js` | Gráficos |
| SortableJS | `cdn.jsdelivr.net/npm/sortablejs` | Kanban drag & drop |
| html2pdf | `cdnjs.cloudflare.com/ajax/libs/html2pdf.js` | Exportação PDF |
