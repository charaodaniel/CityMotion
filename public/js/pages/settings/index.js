/**
 * CityMotion — Settings: Lógica de estado, API, eventos e subscriptions
 */
import { renderOperationsTab, renderReportDesignTab, renderInfraTabs, renderLoading } from './modals.js';

export default function SettingsPage(container, Store, API) {
  let state = {
    tab: 'operations',
    infraTab: 'database',
    infraLoading: true,
    infraConfig: null,
    dbType: 'sqlite',
    dbUrl: '',
    smtpHost: '', smtpPort: '587', smtpUser: '', smtpPass: '', smtpSecure: false,
    corsOrigins: 'http://localhost:9002',
    serverPort: '3001', demoMode: false,
    saving: false, testing: null, testResults: {}, showPasswords: {},
    orgName: 'CityMotion', defaultPriority: 'Média', requireDestination: true,
    reportTab: 'header',
    reportLoading: false,
    repTemplate: null,
  };

  function upd(partial) { state = { ...state, ...partial }; }

  function authHeaders() {
    const h = { 'Content-Type': 'application/json' };
    const token = API.getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  }

  // ── Infra API ─────────────────────────────────────────────
  async function fetchInfraConfig() {
    upd({ infraLoading: true });
    try {
      const res = await fetch('/api/infrastructure/config', { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        upd({ infraConfig: data, dbType: data.database?.type || 'sqlite', dbUrl: data.database?.urlRaw || '',
          smtpHost: data.smtp?.host || '', smtpPort: data.smtp?.port || '587', smtpUser: data.smtp?.user || '',
          smtpPass: data.smtp?.passRaw || '', smtpSecure: data.smtp?.secure || false,
          corsOrigins: data.proxy?.allowedOrigins || 'http://localhost:9002',
          serverPort: data.server?.port || '3001', demoMode: data.server?.demoMode || false });
      }
    } catch (e) { console.error('[Settings] Erro:', e); }
    finally { upd({ infraLoading: false }); }
  }

  async function testConnection(section, payload) {
    upd({ testing: section, testResults: { ...state.testResults, [section]: { success: false, message: 'Testando...' } } });
    try {
      const ep = section === 'database' ? '/api/infrastructure/test-db' : '/api/infrastructure/test-smtp';
      const res = await fetch(ep, { method: 'POST', headers: authHeaders(), body: JSON.stringify(payload) });
      const result = await res.json();
      upd({ testResults: { ...state.testResults, [section]: result } });
      Toast.show(result.success ? `✅ ${result.message}` : `❌ ${result.message}`, result.success ? 'success' : 'error');
    } catch (e) { upd({ testResults: { ...state.testResults, [section]: { success: false, message: e.message } } }); Toast.show(`❌ ${e.message}`, 'error'); }
    finally { upd({ testing: null }); }
  }

  async function saveConfig(section, data) {
    upd({ saving: true });
    try {
      const res = await fetch('/api/infrastructure/save', { method: 'POST', headers: authHeaders(), body: JSON.stringify({ section, config: data }) });
      const result = await res.json();
      Toast.show(result.success ? `✅ ${result.message}` : `❌ ${result.message}`, result.success ? 'success' : 'error');
      if (result.success) fetchInfraConfig();
    } catch (e) { Toast.show(`❌ ${e.message}`, 'error'); }
    finally { upd({ saving: false }); }
  }

  // ── Report Template API ──────────────────────────────────
  async function fetchRepTemplate() {
    upd({ reportLoading: true });
    try {
      const res = await fetch('/api/report-template', { headers: authHeaders() });
      if (res.ok) upd({ repTemplate: await res.json() });
    } catch (e) { console.error('[Settings] Erro template:', e); }
    finally { upd({ reportLoading: false }); }
  }

  async function saveRepTemplate() {
    upd({ saving: true });
    try {
      const form = {
        headerTitle: g('repHeaderTitle'), headerSubtitle: g('repHeaderSubtitle'),
        headerExtra: g('repHeaderExtra'), primaryColor: g('repPrimaryColor') || '#3b82f6',
        secondaryColor: g('repSecondaryColor') || '#1e293b', accentColor: g('repAccentColor') || '#10b981',
        footerText: g('repFooterText'), footerExtra: g('repFooterExtra'),
        sectorName: g('repSectorName'), sectorDepartment: g('repSectorDepartment'),
        headerLogo: state.repTemplate?.headerLogo || '', headerLogoSecondary: state.repTemplate?.headerLogoSecondary || '',
      };
      const res = await fetch('/api/report-template', { method: 'PUT', headers: authHeaders(), body: JSON.stringify(form) });
      const result = await res.json();
      if (result.success) { upd({ repTemplate: result.template }); Toast.show('✅ Template salvo!', 'success'); }
      else Toast.show('❌ Erro ao salvar.', 'error');
    } catch (e) { Toast.show(`❌ ${e.message}`, 'error'); }
    finally { upd({ saving: false }); }
  }

  function g(id) { return document.getElementById(id)?.value || ''; }

  function handleLogo(id, field) {
    const file = document.getElementById(id)?.files?.[0];
    if (!file?.type.startsWith('image/')) { Toast.show('❌ Selecione uma imagem.', 'error'); return; }
    const r = new FileReader();
    r.onload = (e) => { upd({ repTemplate: { ...state.repTemplate, [field]: e.target.result } }); Toast.show('✅ Logo carregada. Salve!', 'success'); };
    r.readAsDataURL(file);
  }

  function removeLogo(field) { upd({ repTemplate: { ...state.repTemplate, [field]: '' } }); render(); }

  // ── MAIN RENDER ───────────────────────────────────────────
  async function render() {
    const user = Store.get('user');
    const userRole = Store.mapRole(user?.role);
    const isDev = ['dev', 'ti', 'admin'].includes(userRole);
    const cfg = state.infraConfig;

    container.innerHTML = `
      <div class="animate-fade-in space-y-8">
        <div class="flex flex-col gap-2">
          <h1 class="text-3xl sm:text-4xl font-black tracking-tighter flex items-center gap-4">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Configurações
          </h1>
          <p class="text-zinc-400 text-sm font-medium mt-1">Gerencie regras, design de relatórios e infraestrutura.</p>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 p-1 bg-zinc-900/60 border border-zinc-800/50 rounded-lg w-full lg:w-fit">
          <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('setTab',{detail:'operations'}))"
            class="text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-md transition-colors ${state.tab === 'operations' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-zinc-500 hover:text-zinc-300'}">
            <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            Operações
          </button>
          ${isDev ? `
          <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('setTab',{detail:'report'}))"
            class="text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-md transition-colors ${state.tab === 'report' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-zinc-500 hover:text-zinc-300'}">
            <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Design Relatórios
          </button>
          <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('setTab',{detail:'infrastructure'}))"
            class="text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-md transition-colors ${state.tab === 'infrastructure' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-zinc-500 hover:text-zinc-300'}">
            <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>
            Infraestrutura
          </button>` : ''}
        </div>

        <div id="settingsTabContent">
          ${state.tab === 'operations' ? renderOperationsTab(state) : ''}
          ${state.tab === 'report'
            ? (state.reportLoading
              ? renderLoading()
              : renderReportDesignTab(state.repTemplate || {}, state.saving, state.reportTab))
            : ''}
          ${state.tab === 'infrastructure'
            ? (state.infraLoading
              ? renderLoading()
              : renderInfraTabs(cfg, state, state.testResults))
            : ''}
        </div>
      </div>
      <div id="settingsOverlay"></div>`;

    setupEventListeners();
  }

  // ── EVENT LISTENERS ───────────────────────────────────────
  function setupEventListeners() {
    const o = document.getElementById('settingsOverlay');
    if (!o) return;

    o.addEventListener('setTab', async (e) => {
      upd({ tab: e.detail });
      if (e.detail === 'infrastructure' && !state.infraConfig) await fetchInfraConfig();
      if (e.detail === 'report' && !state.repTemplate) await fetchRepTemplate();
      render();
    });

    o.addEventListener('setInfraTab', (e) => { upd({ infraTab: e.detail }); render(); });
    o.addEventListener('setRepTab', (e) => { upd({ reportTab: e.detail }); render(); });

    // Operations
    o.addEventListener('saveOperations', () => {
      const n = (document.getElementById('settingsOrgName')?.value || '').trim();
      if (!n || n.length < 3) { Toast.show('Nome obrigatório (mín. 3 caracteres).', 'warning'); return; }
      upd({ orgName: n, defaultPriority: document.getElementById('settingsDefaultPriority')?.value || state.defaultPriority });
      Toast.show('✅ Configurações salvas!', 'success');
    });

    o.addEventListener('toggleRequireDest', () => { upd({ requireDestination: !state.requireDestination }); render(); });

    // Infra
    o.addEventListener('testDbConn', async () => {
      await testConnection('database', { type: document.getElementById('infraDbType')?.value || state.dbType, url: document.getElementById('infraDbUrl')?.value || state.dbUrl });
    });
    o.addEventListener('saveDb', async () => {
      await saveConfig('database', { type: document.getElementById('infraDbType')?.value || state.dbType, url: document.getElementById('infraDbUrl')?.value || state.dbUrl });
    });
    o.addEventListener('saveCors', async () => { await saveConfig('proxy', { allowedOrigins: document.getElementById('infraCorsOrigins')?.value || state.corsOrigins }); });
    o.addEventListener('toggleSmtpSecure', () => { upd({ smtpSecure: !state.smtpSecure }); render(); });
    o.addEventListener('testSmtp', async () => {
      await testConnection('smtp', {
        host: document.getElementById('infraSmtpHost')?.value || state.smtpHost,
        port: document.getElementById('infraSmtpPort')?.value || state.smtpPort,
        user: document.getElementById('infraSmtpUser')?.value || state.smtpUser,
        pass: document.getElementById('infraSmtpPass')?.value || state.smtpPass,
        secure: state.smtpSecure,
      });
    });
    o.addEventListener('saveSmtp', async () => {
      await saveConfig('smtp', {
        host: document.getElementById('infraSmtpHost')?.value || state.smtpHost,
        port: document.getElementById('infraSmtpPort')?.value || state.smtpPort,
        user: document.getElementById('infraSmtpUser')?.value || state.smtpUser,
        pass: document.getElementById('infraSmtpPass')?.value || state.smtpPass,
        secure: state.smtpSecure,
      });
    });
    o.addEventListener('toggleDemoMode', () => { upd({ demoMode: !state.demoMode }); render(); });
    o.addEventListener('saveServer', async () => {
      await saveConfig('server', { port: document.getElementById('infraServerPort')?.value || state.serverPort, demoMode: state.demoMode });
    });

    // Report Design
    o.addEventListener('saveRepTemplate', saveRepTemplate);

    o.addEventListener('logoUpload', (e) => {
      const { id, field } = e.detail;
      handleLogo(id, field);
    });

    o.addEventListener('removeLogo', (e) => {
      removeLogo(e.detail);
    });

    o.addEventListener('colorChange', () => { render(); });

    o.addEventListener('resetRepTemplate', async () => {
      upd({ repTemplate: {
        headerLogo: '', headerLogoSecondary: '', headerTitle: 'CityMotion',
        headerSubtitle: 'Gestão Inteligente de Frotas', headerExtra: '',
        primaryColor: '#3b82f6', secondaryColor: '#1e293b', accentColor: '#10b981',
        footerText: 'CityMotion — Mobilidade, transparência e eficiência.', footerExtra: '',
        sectorName: '', sectorDepartment: '',
      }});
      render();
      Toast.show('Template resetado. Salve para confirmar.', 'info');
    });

    // DB type change
    const dbTypeSelect = document.getElementById('infraDbType');
    if (dbTypeSelect) {
      dbTypeSelect.addEventListener('change', () => { upd({ dbType: dbTypeSelect.value }); render(); });
    }
  }

  const unsub = Store.on('user', render);
  render();
  return () => { unsub(); };
}
