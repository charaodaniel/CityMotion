# 🎨 Guia de Design System e UI - NexusOS V2

O CityMotion utiliza o **NexusOS**, um sistema de design focado em interfaces de monitoramento e telemetria logística.

---

## 📐 Princípios de Layout

### Sidebar Inset
A navegação lateral é a âncora do sistema. Ela adapta-se dinamicamente ao cargo do usuário:
- **Root/TI:** Menu "Plataforma" liberado (Nexus, Terminal, Gestão Global, Faturamento).
- **Gestores:** Foco em "Logística" (Funcionários, Frota, Missões, Manutenção).
- **Motoristas:** Visão simplificada de "Missões" e "Checklists".
- **Colaboradores:** Acesso a "Pedir Transporte" e "Crachá Virtual".

### Configurações (Settings)
A página de configurações (`/settings`) possui duas abas:
- **Operações:** Regras de negócio (nome da unidade, prioridade padrão, exigir destino).
- **Infraestrutura:** Painel completo de configuração do sistema.

---

## 🏗️ Componente: InfrastructurePanel

O `InfrastructurePanel` é o componente central para configuração do sistema. Localizado em `src/components/infrastructure-panel.tsx`.

### Abas do Painel

#### 1. Banco de Dados
- **Seletor de Motor:** Dropdown com SQLite3, PostgreSQL, MongoDB e Supabase.
- **URL de Conexão:** Campo de texto mono para a connection string.
- **Teste de Conexão:** Botão que valida a conexão antes de salvar.
- **Status:** Card com motor ativo, modo e porta do backend.

#### 2. Proxy & CORS
- **Origens Permitidas:** Textarea para listar domínios (separados por vírgula).
- **Rate Limiting:** Card informativo com status da proteção.

#### 3. SMTP
- **Configuração Completa:** Host, porta, usuário, senha (com toggle de visibilidade) e TLS.
- **Teste SMTP:** Botão que verifica as credenciais no servidor.

#### 4. Servidor
- **Porta:** Campo numérico para a porta do backend.
- **Modo Demo:** Toggle com aviso de segurança quando ativado.
- **Segurança:** Cards com status de JWT, CORS e Rate Limiting.

### Padrões de Componente

#### StatusBadge
```tsx
<Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
    <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> Conectado
</Badge>
```

#### Card de Configuração
```tsx
<Card className="bg-sidebar/50 border-border/50">
    <CardHeader className="border-b border-border/30">
        <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" /> Título
        </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 pt-6">
        {/* Conteúdo */}
    </CardContent>
</Card>
```

#### Botão de Ação
```tsx
<Button
    size="sm"
    onClick={handler}
    disabled={loading}
    className="text-[10px] font-bold uppercase tracking-widest"
>
    <Save className="h-3 w-3 mr-2" /> Salvar
</Button>
```

---

## 🌑 Paleta de Cores (Dark Tech)

Utilizamos variáveis HSL para permitir personalização (White Label):
- **Background:** `zinc-950` (Profundidade e foco).
- **Primary:** Azul Elétrico (Ações principais e telemetria).
- **Accent:** Cores de status (Esmeralda para Disponível, Destrutivo para Manutenção).
- **Sidebar:** `bg-sidebar/80 backdrop-blur-xl` (Vidro fosco).

---

## 🧩 Componentes Especializados

### 1. Scanlines e CRT Effects
Adicionados via CSS em componentes de Terminal e Cards de Telemetria para evocar uma estética de hardware industrial.

### 2. TUI (Text User Interface)
O Terminal utiliza fontes monoespaçadas (`font-mono`) e prompts interativos para simular um kernel Unix real.

### 3. Crachá Dinâmico
Componente mobile-first com QR Code gerado em tempo real, validado contra a Bridge para identificação instantânea.

### 4. DevTerminal
Terminal interativo para comandos de manutenção. Acessível apenas por perfis DEV/TI/ADMIN.

---

## 📱 Responsividade SaaS

- **Desktop:** Dashboard estendido com grids de 4 colunas.
- **Tablet:** Tabelas com scroll horizontal protegido.
- **Mobile:** Sidebar recolhida em Drawer e cards empilhados para operação de campo por motoristas.

---

## 📁 Estrutura de Componentes

```
src/components/
├── layout/
│   ├── app-layout.tsx      # Layout principal do app
│   ├── app-sidebar.tsx     # Sidebar de navegação
│   ├── app-header.tsx      # Cabeçalho com notificações
│   └── header.tsx          # Cabeçalho público
├── infrastructure-panel.tsx # Painel de infraestrutura
├── dev-terminal.tsx        # Terminal de manutenção
├── lgpd-banner.tsx         # Banner de consentimento LGPD
├── pwa-installer.tsx       # Instalador PWA
├── dashboards/
│   ├── admin-dashboard.tsx
│   ├── manager-dashboard.tsx
│   ├── driver-dashboard.tsx
│   └── mechanic-dashboard.tsx
├── forms/
│   ├── quick-request-form.tsx
│   ├── schedule-trip-form.tsx
│   ├── register-vehicle-form.tsx
│   ├── register-employee-form.tsx
│   ├── request-maintenance-form.tsx
│   ├── register-refueling-form.tsx
│   ├── report-incident-form.tsx
│   ├── create-schedule-form.tsx
│   ├── register-sector-form.tsx
│   └── request-part-form.tsx
└── ui/                     # Componentes ShadCN
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── select.tsx
    ├── switch.tsx
    ├── tabs.tsx
    ├── toast.tsx
    └── ...
```
