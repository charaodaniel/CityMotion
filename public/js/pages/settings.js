/**
 * CityMotion — Página: Configurações
 * Regras de negócio (Operações) + Infraestrutura (Banco, SMTP, Proxy, Servidor)
 */
export default function SettingsPage(container, Store, API) {
  let state = {
    tab: 'operations',
    infraTab: 'database',
    infraLoading: true,
    infraConfig: null,
    dbType: 'sqlite',
    dbUrl: '',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    smtpSecure: false,
    corsOrigins: 'http://localhost:9002',
    serverPort: '3001',
    demoMode: false,
    saving: false,
    testing: null,
    testResults: {},
    showPasswords: {},
    // Operations form
    orgName: 'Instância Local CityMotion',
    defaultPriority: 'Média',
    requireDestination: true,
  };

  function upd(partial) { state = { ...state, ...partial }; }

  // ----------------------------------------------------------
  //  Token helper
  // ----------------------------------------------------------
  function authHeaders() {
    const h = { 'Content-Type': 'application/json' };
    const token = API.getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  }

  // ----------------------------------------------------------
  //  Infrastructure API
  // ----------------------------------------------------------
  async function fetchInfraConfig() {
    upd({ infraLoading: true });
    try {
      const res = await fetch('/api/nexus/infrastructure/config', { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        upd({
          infraConfig: data,
          dbType: data.database?.type || 'sqlite',
          dbUrl: data.database?.urlRaw || '',
          smtpHost: data.smtp?.host || '',
          smtpPort: data.smtp?.port || '587',
          smtpUser: data.smtp?.user || '',
          smtpPass: data.smtp?.passRaw || '',
          smtpSecure: data.smtp?.secure || false,
          corsOrigins: data.proxy?.allowedOrigins || 'http://localhost:9002',
          serverPort: data.server?.port || '3001',
          demoMode: data.server?.demoMode || false,
        });
      }
    } catch (e) {
      console.error('[Settings] Erro ao carregar config:', e);
    } finally {
      upd({ infraLoading: false });
    }
  }

  async function testConnection(section, payload) {
    upd({ testing: section });
    const testResults = { ...state.testResults, [section]: { success: false, message: 'Testando...' } };
    upd({ testResults });
    try {
      let endpoint = '';
      if (section === 'database') endpoint = '/api/nexus/infrastructure/test-db';
      else if (section === 'smtp') endpoint = '/api/nexus/infrastructure/test-smtp';
      const res = await fetch(endpoint, {
        method: 'POST', headers: authHeaders(), body: JSON.stringify(payload),
      });
      const result = await res.json();
      upd({ testResults: { ...state.testResults, [section]: result } });
      Toast.show(result.success ? `✅ Conexão OK — ${result.message}` : `❌ Falha na Conexão — ${result.message}`, result.success ? 'success' : 'error');
    } catch (e) {
      upd({ testResults: { ...state.testResults, [section]: { success: false, message: e.message } } });
      Toast.show(`❌ Erro: ${e.message}`, 'error');
    } finally {
      upd({ testing: null });
    }
  }

  async function saveConfig(section, data) {
    upd({ saving: true });
    try {
      const res = await fetch('/api/nexus/infrastructure/save', {
        method: 'POST', headers: authHeaders(), body: JSON.stringify({ section, config: data }),
      });
      const result = await res.json();
      Toast.show(result.success ? `✅ Salvo — ${result.message}` : `❌ Erro — ${result.message}`, result.success ? 'success' : 'error');
      if (result.success) fetchInfraConfig();
    } catch (e) {
      Toast.show(`❌ Erro ao salvar: ${e.message}`, 'error');
    } finally {
      upd({ saving: false });
    }
  }

  // ----------------------------------------------------------
  //  Operations form
  // ----------------------------------------------------------


  // ----------------------------------------------------------
  //  DB Types
  // ----------------------------------------------------------
  const DB_TYPES = [
    { value: 'sqlite', label: 'SQLite3 (Local)', desc: 'Banco local, ideal para pendrives e servidores pequenos' },
    { value: 'postgresql', label: 'PostgreSQL', desc: 'Banco robusto para produção em nuvem' },
    { value: 'mongodb', label: 'MongoDB', desc: 'Banco NoSQL para dados flexíveis' },
    { value: 'supabase', label: 'Supabase', desc: 'PostgreSQL gerenciado com API automática' },
  ];

  // ----------------------------------------------------------
  //  Status badge helper
  // ----------------------------------------------------------
  function statusBadge(section) {
    const result = state.testResults[section];
    if (!result) return '';
    const cls = result.success
      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
      : 'bg-red-500/10 text-red-500 border-red-500/30';
    const icon = result.success
      ? '<svg class="w-2.5 h-2.5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>'
      : '<svg class="w-2.5 h-2.5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
    return `<span class="inline-flex items-center text-[9px] font-black border px-1.5 py-0.5 rounded ${cls}">${icon}${result.message}</span>`;
  }

  // ----------------------------------------------------------
  //  Render tabs
  // ----------------------------------------------------------
  function renderOperationsTab() {
    return `
      <div class="space-y-6">          <form id="settingsOpsForm" onsubmit="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('saveOperations')); return false;" class="space-y-6">
          <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
            <div class="mb-6 pb-4 border-b border-zinc-800/30">
              <h3 class="text-xs font-bold uppercase tracking-widest text-primary">Regras de Negócio</h3>
              <p class="text-[10px] text-zinc-500 mt-1">Configurações gerais de operação da organização.</p>
            </div>
            <div class="space-y-6">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Nome da Unidade / Prefeitura</label>
                <input type="text" id="settingsOrgName" value="${state.orgName}" placeholder="Ex: Instância Local CityMotion"
                  class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Prioridade Padrão</label>
                  <select id="settingsDefaultPriority" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                    ${['Baixa', 'Média', 'Alta'].map(p => `<option value="${p}" ${state.defaultPriority === p ? 'selected' : ''}>${p}</option>`).join('')}
                  </select>
                </div>
                <div class="flex items-center justify-between p-4 border border-zinc-700/50 rounded-lg bg-black/20 mt-4">
                  <div>
                    <label class="text-xs font-bold">Exigir Destino</label>
                    <p class="text-[10px] text-zinc-500">Obriga o preenchimento detalhado.</p>
                  </div>
                  <button type="button" id="settingsRequireDest" data-checked="${state.requireDestination ? 'true' : 'false'}"
                    onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('toggleRequireDest'))"
                    class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${state.requireDestination ? 'bg-primary' : 'bg-zinc-700'}">
                    <span class="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${state.requireDestination ? 'translate-x-[18px]' : 'translate-x-1'}"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-end pt-6 border-t border-zinc-800/30">
            <button type="button" onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('saveOperations'))" class="btn btn-primary h-12 px-12 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>`;
  }

  function renderInfraTabs() {
    const cfg = state.infraConfig;
    return `
      <div class="space-y-6">
        <!-- Infra header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-black tracking-tight flex items-center gap-3">
              <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/>
              </svg>
              Infraestrutura & Conectividade
            </h2>
            <p class="text-zinc-500 text-xs mt-1">Gerencie bancos de dados, proxy, DNS, credenciais e serviços externos.</p>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-black
              ${cfg?.security?.jwtConfigured
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-500 border-amber-500/30'}">
              <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              ${cfg?.security?.jwtConfigured ? 'JWT Configurado' : 'JWT Não Configurado'}
            </span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary text-[9px] font-black">
              <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Backend: Porta ${state.serverPort}
            </span>
          </div>
        </div>

        <!-- Sub-tabs -->
        <div class="flex gap-1 flex-wrap p-1 bg-zinc-900/60 border border-zinc-800/50 rounded-lg">
          ${['database', 'network', 'smtp', 'server'].map(t => `
            <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('setInfraTab', {detail: '${t}'}))"
              class="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-md transition-colors ${state.infraTab === t ? 'bg-primary/20 text-primary border border-primary/30' : 'text-zinc-500 hover:text-zinc-300'}">
              <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${t === 'database' ? 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' : t === 'network' ? 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' : t === 'smtp' ? 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' : 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'}" />
              </svg>
              ${t === 'database' ? 'Banco de Dados' : t === 'network' ? 'Proxy & CORS' : t === 'smtp' ? 'SMTP' : 'Servidor'}
            </button>
          `).join('')}
        </div>

        ${state.infraTab === 'database' ? renderDatabaseTab() : ''}
        ${state.infraTab === 'network' ? renderNetworkTab() : ''}
        ${state.infraTab === 'smtp' ? renderSmtpTab() : ''}
        ${state.infraTab === 'server' ? renderServerTab() : ''}
      </div>`;
  }

  function renderDatabaseTab() {
    const cfg = state.infraConfig;
    return `
      <div class="space-y-6">
        <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
          <div class="mb-6 pb-4 border-b border-zinc-800/30">
            <h3 class="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>
              </svg>
              Motor de Persistência
              ${statusBadge('database')}
            </h3>
            <p class="text-[10px] text-zinc-500 mt-1">Configure o banco de dados principal.</p>
          </div>
          <div class="space-y-6">
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Tipo de Banco</label>
              <select id="infraDbType" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                ${DB_TYPES.map(db => `
                  <option value="${db.value}" ${state.dbType === db.value ? 'selected' : ''}>
                    ${db.label} — ${db.desc}
                  </option>`).join('')}
              </select>
            </div>
            ${state.dbType !== 'sqlite' ? `
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">URL de Conexão</label>
              <input type="text" id="infraDbUrl" value="${state.dbUrl}"
                placeholder="${state.dbType === 'postgresql' ? 'postgresql://user:pass@host:5432/dbname' : state.dbType === 'mongodb' ? 'mongodb+srv://user:pass@cluster.mongodb.net/dbname' : 'postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres'}"
                class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-xs font-mono focus:outline-none focus:border-primary/50" />
              <p class="text-[10px] text-zinc-600 font-mono mt-1">
                ${state.dbType === 'postgresql' ? 'Formato: postgresql://usuario:senha@host:porta/nomedb' : ''}
                ${state.dbType === 'mongodb' ? 'Formato: mongodb+srv://user:pass@cluster.mongodb.net/dbname' : ''}
                ${state.dbType === 'supabase' ? 'Use a Connection String do painel Supabase → Settings → Database' : ''}
              </p>
            </div>` : `
            <div class="p-4 bg-primary/5 border border-primary/20 rounded-md">
              <p class="text-[11px] font-mono text-primary/70 leading-relaxed">
                [INFO] SQLite não requer configuração de conexão. O banco é armazenado localmente em
                <code class="mx-1 bg-black/30 px-1.5 py-0.5 rounded">backend/database/citymotion.db</code>
                e é ideal para uso em pendrives e servidores isolados.
              </p>
            </div>`}
            <div class="flex gap-3">
              <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('testDbConn'))"
                class="btn btn-outline btn-sm text-[10px]" ${state.testing === 'database' ? 'disabled' : ''}>
                ${state.testing === 'database'
                  ? '<svg class="w-3 h-3 mr-2 inline animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>'
                  : '<svg class="w-3 h-3 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>'}
                Testar Conexão
              </button>
              <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('saveDb'))"
                class="btn btn-primary btn-sm text-[10px]" ${state.saving ? 'disabled' : ''}>
                ${state.saving ? '<svg class="w-3 h-3 mr-2 inline animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>' : '<svg class="w-3 h-3 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>'}
                Salvar
              </button>
            </div>
          </div>
        </div>

        <!-- Status Atual -->
        <div class="glass-card rounded-xl p-6 border-primary/20 bg-zinc-950">
          <h3 class="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2 mb-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
            </svg>
            Status Atual
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-3 bg-black/40 rounded border border-zinc-800/30">
              <p class="text-[9px] uppercase font-black text-zinc-500 tracking-widest">Motor Ativo</p>
              <p class="text-sm font-bold mt-1 font-mono text-primary">${cfg?.database?.type === 'sqlite' ? 'SQLite3' : (cfg?.database?.type || 'N/A').toUpperCase()}</p>
            </div>
            <div class="p-3 bg-black/40 rounded border border-zinc-800/30">
              <p class="text-[9px] uppercase font-black text-zinc-500 tracking-widest">Modo</p>
              <p class="text-sm font-bold mt-1 font-mono text-emerald-500">Operacional</p>
            </div>
            <div class="p-3 bg-black/40 rounded border border-zinc-800/30">
              <p class="text-[9px] uppercase font-black text-zinc-500 tracking-widest">Porta Backend</p>
              <p class="text-sm font-bold mt-1 font-mono">${state.serverPort}</p>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderNetworkTab() {
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
          <h3 class="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            CORS & Origens Permitidas
          </h3>
          <div class="space-y-4">
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Origens Permitidas (separadas por vírgula)</label>
              <textarea id="infraCorsOrigins" rows="3" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-xs font-mono focus:outline-none focus:border-primary/50">${state.corsOrigins}</textarea>
              <p class="text-[10px] text-zinc-500 mt-1">Domínios que podem fazer requisições ao backend.</p>
            </div>
            <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('saveCors'))"
              class="btn btn-primary btn-sm text-[10px]">
              <svg class="w-3 h-3 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
              </svg>
              Salvar CORS
            </button>
          </div>
        </div>

        <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
          <h3 class="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Rate Limiting
          </h3>
          <div class="space-y-3">
            <div class="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded">
              <p class="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Proteção Ativa
              </p>
              <p class="text-[10px] text-zinc-500 mt-1 font-mono">Global: 100 req/15min | Login: 10 tentativas/15min</p>
            </div>
            <div class="p-3 bg-black/40 rounded border border-zinc-800/30 space-y-2">
              <p class="text-[9px] uppercase font-black text-zinc-500 tracking-widest">Endereços Protegidos</p>
              <p class="text-[10px] font-mono text-primary/70">POST /api/login — Rate limit dedicado</p>
              <p class="text-[10px] font-mono text-primary/70">* /api/* — Rate limit global</p>
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderSmtpTab() {
    return `
      <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
        <div class="mb-6 pb-4 border-b border-zinc-800/30">
          <h3 class="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Servidor de E-mail (SMTP)
            ${statusBadge('smtp')}
          </h3>
          <p class="text-[10px] text-zinc-500 mt-1">Configuração para envio de e-mails transacionais.</p>
        </div>
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Host SMTP</label>
              <input type="text" id="infraSmtpHost" value="${state.smtpHost}" placeholder="smtp.gmail.com"
                class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-xs font-mono focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Porta</label>
              <input type="number" id="infraSmtpPort" value="${state.smtpPort}" placeholder="587"
                class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-xs font-mono focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Usuário</label>
              <input type="text" id="infraSmtpUser" value="${state.smtpUser}" placeholder="seu-email@gmail.com"
                class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-xs font-mono focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Senha / App Password</label>
              <div class="relative">
                <input type="${state.showPasswords.smtp ? 'text' : 'password'}" id="infraSmtpPass" value="${state.smtpPass}" placeholder="••••••••"
                  class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-xs font-mono pr-9 focus:outline-none focus:border-primary/50" />
                <button type="button" onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('toggleSmtpPass'))"
                  class="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                  ${state.showPasswords.smtp
                    ? '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>'
                    : '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>'}
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between p-3 border border-zinc-700/50 rounded bg-black/20">
            <div>
              <label class="text-xs font-bold">TLS/SSL Seguro</label>
              <p class="text-[10px] text-zinc-500">Usar conexão segura (porta 465)</p>
            </div>
            <button type="button" id="infraSmtpSecure" data-checked="${state.smtpSecure ? 'true' : 'false'}"
              onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('toggleSmtpSecure'))"
              class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${state.smtpSecure ? 'bg-primary' : 'bg-zinc-700'}">
              <span class="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${state.smtpSecure ? 'translate-x-[18px]' : 'translate-x-1'}"></span>
            </button>
          </div>

          <div class="flex gap-3">              <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('testSmtp'))"
              class="btn btn-outline btn-sm text-[10px]" ${state.testing === 'smtp' ? 'disabled' : ''}>
              ${state.testing === 'smtp'
                ? '<svg class="w-3 h-3 mr-2 inline animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>'
                : '<svg class="w-3 h-3 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>'}
              Testar SMTP
            </button>
            <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('saveSmtp'))"
              class="btn btn-primary btn-sm text-[10px]">
              <svg class="w-3 h-3 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg> Salvar
            </button>
          </div>
        </div>
      </div>`;
  }

  function renderServerTab() {
    const cfg = state.infraConfig;
    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
          <h3 class="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/>
            </svg>
            Configurações do Servidor
          </h3>
          <div class="space-y-4">
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Porta do Backend</label>
              <input type="number" id="infraServerPort" value="${state.serverPort}"
                class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm font-mono focus:outline-none focus:border-primary/50" />
            </div>
            <div class="flex items-center justify-between p-3 border border-zinc-700/50 rounded bg-black/20">
              <div>
                <label class="text-xs font-bold">Modo Demonstração</label>
                <p class="text-[10px] text-zinc-500">Reset diário automático dos dados</p>
              </div>
              <button type="button" id="infraDemoMode" data-checked="${state.demoMode ? 'true' : 'false'}"
                onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('toggleDemoMode'))"
                class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${state.demoMode ? 'bg-primary' : 'bg-zinc-700'}">
                <span class="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${state.demoMode ? 'translate-x-[18px]' : 'translate-x-1'}"></span>
              </button>
            </div>
            ${state.demoMode ? `
            <div class="p-3 bg-amber-500/5 border border-amber-500/20 rounded flex items-start gap-2">
              <svg class="w-4 h-4 text-amber-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
              <p class="text-[10px] text-amber-500">ATENÇÃO: O modo demo apaga todos os dados todos os dias à meia-noite. Não use em produção!</p>
            </div>` : ''}
            <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('saveServer'))"
              class="btn btn-primary btn-sm text-[10px]">
              <svg class="w-3 h-3 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
              </svg>
              Salvar
            </button>
          </div>
        </div>

        <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
          <h3 class="text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Segurança
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 border border-zinc-700/50 rounded bg-black/20">
              <div>
                <label class="text-xs font-bold">JWT Secret</label>
                <p class="text-[10px] text-zinc-500 font-mono">${cfg?.security?.jwtConfigured ? '•••••••••••• configurado' : 'NÃO CONFIGURADO'}</p>
              </div>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-black
                ${cfg?.security?.jwtConfigured ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}">
                <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${cfg?.security?.jwtConfigured ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}"/>
                </svg>
                ${cfg?.security?.jwtConfigured ? 'OK' : 'FALTA'}
              </span>
            </div>
            <div class="flex items-center justify-between p-3 border border-zinc-700/50 rounded bg-black/20">
              <div>
                <label class="text-xs font-bold">CORS Origin</label>
                <p class="text-[10px] text-zinc-500 font-mono truncate max-w-[200px]">${cfg?.security?.corsOrigin || 'Não configurado'}</p>
              </div>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded border bg-primary/10 text-primary border-primary/30 text-[9px] font-black">
                <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                Ativo
              </span>
            </div>
            <div class="flex items-center justify-between p-3 border border-zinc-700/50 rounded bg-black/20">
              <div>
                <label class="text-xs font-bold">Rate Limiting</label>
                <p class="text-[10px] text-zinc-500">Proteção contra brute force</p>
              </div>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-[9px] font-black">
                <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                Ativo
              </span>
            </div>
          </div>
        </div>
      </div>`;
  }

  // ----------------------------------------------------------
  //  Main render
  // ----------------------------------------------------------
  async function render() {
    const user = Store.get('user');
    const userRole = Store.mapRole(user?.role);

    container.innerHTML = `
      <div class="animate-fade-in space-y-8">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl sm:text-4xl font-black tracking-tighter flex items-center gap-4">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Configurações
          </h1>
          <p class="text-zinc-400 text-sm font-medium mt-1">Gerencie regras de negócio e infraestrutura do sistema.</p>
        </div>

        <!-- Main Tabs: Operações | Infraestrutura -->
        <div class="flex gap-1 p-1 bg-zinc-900/60 border border-zinc-800/50 rounded-lg w-full lg:w-fit">
          <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('setTab', {detail: 'operations'}))"
            class="text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-md transition-colors ${state.tab === 'operations' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-zinc-500 hover:text-zinc-300'}">
            <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            Operações
          </button>
          ${['dev', 'ti', 'admin'].includes(userRole) ? `
          <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('setTab', {detail: 'infrastructure'}))"
            class="text-[10px] font-bold uppercase tracking-widest px-6 py-2 rounded-md transition-colors ${state.tab === 'infrastructure' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-zinc-500 hover:text-zinc-300'}">
            <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/>
            </svg>
            Infraestrutura
          </button>` : ''}
        </div>

        <div id="settingsTabContent">
          ${state.tab === 'operations' ? renderOperationsTab() : ''}
          ${state.tab === 'infrastructure' ? (state.infraLoading
            ? '<div class="flex items-center justify-center p-12"><svg class="w-8 h-8 animate-spin text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg><span class="ml-3 text-zinc-500 text-xs">Carregando configurações de infraestrutura...</span></div>'
            : renderInfraTabs()) : ''}
        </div>
      </div>
      <!-- Settings Modal Overlay (for events delegation) -->
      <div id="settingsOverlay"></div>`;

    setupEventListeners();
  }

  // ----------------------------------------------------------
  //  Event listeners
  // ----------------------------------------------------------
  function setupEventListeners() {
    const overlay = document.getElementById('settingsOverlay');
    if (!overlay) return;

    // === Tab switching ===
    overlay.addEventListener('setTab', async (e) => {
      upd({ tab: e.detail });
      if (e.detail === 'infrastructure' && !state.infraConfig) {
        await fetchInfraConfig();
      }
      render();
    });

    overlay.addEventListener('setInfraTab', (e) => {
      upd({ infraTab: e.detail });
      render();
    });

    // === Operations form ===
    overlay.addEventListener('saveOperations', () => {
      const orgName = (document.getElementById('settingsOrgName')?.value || '').trim();
      const defaultPriority = document.getElementById('settingsDefaultPriority')?.value || state.defaultPriority;
      if (!orgName || orgName.length < 3) { Toast.show('O nome da unidade é obrigatório (mínimo 3 caracteres).', 'warning'); return; }
      upd({ orgName, defaultPriority });
      Toast.show('✅ Configurações Salvas — As regras de negócio foram atualizadas com sucesso.', 'success');
    });

    overlay.addEventListener('toggleRequireDest', () => {
      upd({ requireDestination: !state.requireDestination });
      render();
    });

    // === Database infra ===
    overlay.addEventListener('testDbConn', async () => {
      const dbType = document.getElementById('infraDbType')?.value || state.dbType;
      const dbUrl = document.getElementById('infraDbUrl')?.value || state.dbUrl;
      await testConnection('database', { type: dbType, url: dbUrl });
    });

    overlay.addEventListener('saveDb', async () => {
      const dbType = document.getElementById('infraDbType')?.value || state.dbType;
      const dbUrl = document.getElementById('infraDbUrl')?.value || state.dbUrl;
      await saveConfig('database', { type: dbType, url: dbUrl });
    });

    // === Network infra ===
    overlay.addEventListener('saveCors', async () => {
      const corsOrigins = document.getElementById('infraCorsOrigins')?.value || state.corsOrigins;
      await saveConfig('proxy', { allowedOrigins: corsOrigins });
    });

    // === SMTP infra ===
    overlay.addEventListener('toggleSmtpPass', () => {
      upd({ showPasswords: { ...state.showPasswords, smtp: !state.showPasswords.smtp } });
      render();
    });

    overlay.addEventListener('toggleSmtpSecure', () => {
      upd({ smtpSecure: !state.smtpSecure });
      render();
    });

    overlay.addEventListener('testSmtp', async () => {
      const host = document.getElementById('infraSmtpHost')?.value || state.smtpHost;
      const port = document.getElementById('infraSmtpPort')?.value || state.smtpPort;
      const user = document.getElementById('infraSmtpUser')?.value || state.smtpUser;
      const pass = document.getElementById('infraSmtpPass')?.value || state.smtpPass;
      await testConnection('smtp', { host, port, user, pass, secure: state.smtpSecure });
    });

    overlay.addEventListener('saveSmtp', async () => {
      const host = document.getElementById('infraSmtpHost')?.value || state.smtpHost;
      const port = document.getElementById('infraSmtpPort')?.value || state.smtpPort;
      const user = document.getElementById('infraSmtpUser')?.value || state.smtpUser;
      const pass = document.getElementById('infraSmtpPass')?.value || state.smtpPass;
      await saveConfig('smtp', { host, port, user, pass, secure: state.smtpSecure });
    });

    // === Server infra ===
    overlay.addEventListener('toggleDemoMode', () => {
      upd({ demoMode: !state.demoMode });
      render();
    });

    overlay.addEventListener('saveServer', async () => {
      const serverPort = document.getElementById('infraServerPort')?.value || state.serverPort;
      await saveConfig('server', { port: serverPort, demoMode: state.demoMode });
    });

    // Real-time update for db type (auto-refresh on select change)
    const dbTypeSelect = document.getElementById('infraDbType');
    if (dbTypeSelect) {
      dbTypeSelect.addEventListener('change', () => {
        upd({ dbType: dbTypeSelect.value });
        render();
      });
    }
  }

  // ----------------------------------------------------------
  //  Init
  // ----------------------------------------------------------
  const unsub = Store.on('user', render);
  render();
  return () => { unsub(); };
}
