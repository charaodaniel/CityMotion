/**
 * CityMotion — Página: Configurações
 * Regras de negócio (Operações) + Design de Relatórios + Infraestrutura
 */
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
    // Report Design
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

  const DB_TYPES = [
    { value: 'sqlite', label: 'SQLite3', desc: 'Local' },
    { value: 'postgresql', label: 'PostgreSQL', desc: 'Nuvem' },
    { value: 'mongodb', label: 'MongoDB', desc: 'NoSQL' },
    { value: 'supabase', label: 'Supabase', desc: 'PostgreSQL gerenciado' },
  ];

  function statusBadge(s) {
    const r = state.testResults[s];
    if (!r) return '';
    const cls = r.success ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30';
    const ic = r.success ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>' : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
    return `<span class="inline-flex items-center text-[9px] font-black border px-1.5 py-0.5 rounded ${cls}"><svg class="w-2.5 h-2.5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">${ic}</svg>${r.message}</span>`;
  }

  // ── RENDER: Design de Relatórios ─────────────────────────
  function renderReportDesignTab() {
    const t = state.repTemplate || {};
    if (state.reportLoading) return '<div class="flex justify-center p-12"><svg class="w-8 h-8 animate-spin text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg><span class="ml-3 text-zinc-500 text-xs">Carregando...</span></div>';

    const subTabs = [
      { id: 'header', label: 'Cabeçalho', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
      { id: 'colors', label: 'Cores', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
      { id: 'footer', label: 'Rodapé', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z' },
      { id: 'sector', label: 'Setor', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    ];

    return `
      <div class="space-y-6">
        <div class="flex items-center gap-4 mb-2">
          <div class="p-2 rounded-lg bg-primary/10">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <div>
            <h2 class="text-lg font-black tracking-tight">Design de Relatórios</h2>
            <p class="text-xs text-zinc-500">Personalize cabeçalho, cores e rodapé dos relatórios exportados em PDF.</p>
          </div>
          ${state.saving ? '<span class="text-[10px] text-primary animate-pulse">Salvando...</span>' : ''}
        </div>

        <!-- Previa -->
        <div class="p-4 rounded-lg border border-zinc-700/50 bg-zinc-900/60" style="background: ${t.secondaryColor || '#1e293b'}10; border-color: ${t.primaryColor || '#3b82f6'}30;">
          <div class="flex items-center gap-4 mb-3">
            ${t.headerLogo ? `<img src="${t.headerLogo}" class="h-10 w-auto object-contain rounded" />` : '<div class="h-10 w-10 rounded bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">LOGO</div>'}
            <div class="flex-1">
              <p class="text-sm font-bold" style="color: ${t.primaryColor || '#3b82f6'}">${t.headerTitle || 'Título do Relatório'}</p>
              <p class="text-[10px] text-zinc-400">${t.headerSubtitle || 'Subtítulo'}</p>
            </div>
            ${t.sectorName ? `<span class="text-[9px] px-2 py-1 rounded font-bold" style="background: ${t.primaryColor || '#3b82f6'}20; color: ${t.primaryColor || '#3b82f6'}">${t.sectorName}</span>` : ''}
          </div>
          <p class="text-[9px] text-zinc-600 border-t border-zinc-800/50 pt-2 mt-2">${t.footerText || 'Rodapé do relatório'}</p>
        </div>

        <!-- Sub-tabs -->
        <div class="flex gap-1 flex-wrap p-1 bg-zinc-900/60 border border-zinc-800/50 rounded-lg">
          ${subTabs.map(st => `
            <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('setRepTab', {detail: '${st.id}'}))"
              class="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-md transition-all ${state.reportTab === st.id ? 'bg-primary/20 text-primary border border-primary/30' : 'text-zinc-500 hover:text-zinc-300'}">
              <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${st.icon}"/></svg>
              ${st.label}
            </button>`).join('')}
        </div>

        ${state.reportTab === 'header' ? renderRepHeader(t) : ''}
        ${state.reportTab === 'colors' ? renderRepColors(t) : ''}
        ${state.reportTab === 'footer' ? renderRepFooter(t) : ''}
        ${state.reportTab === 'sector' ? renderRepSector(t) : ''}

        <div class="flex justify-end gap-3 pt-4 border-t border-zinc-800/30">
          <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('resetRepTemplate'))"
            class="btn btn-ghost btn-sm text-[10px]">Resetar Padrão</button>
          <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('saveRepTemplate'))"
            class="btn btn-primary btn-sm text-[10px] px-8" ${state.saving ? 'disabled' : ''}>
            ${state.saving ? '<svg class="w-3 h-3 mr-2 inline animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>' : '<svg class="w-3 h-3 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>'}
            Salvar Template
          </button>
        </div>
      </div>`;
  }

  function renderRepHeader(t) {
    const logoSection = (label, field, id) => `
      <div class="p-4 border border-zinc-700/50 rounded-lg bg-black/20">
        <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">${label}</p>
        ${t[field] ? `<div class="relative inline-block mb-2"><img src="${t[field]}" class="h-16 w-auto object-contain rounded border border-zinc-700/50" /><button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('removeLogo', {detail: '${field}'}))" class="absolute -top-2 -right-2 bg-red-500/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-[9px] font-bold hover:bg-red-500">&times;</button></div>` : ''}
        <input type="file" id="${id}" accept="image/*" onchange="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('logoUpload', {detail: {id:'${id}',field:'${field}'}}))" class="w-full text-[10px] file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-[9px] file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
      </div>`;

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-4">
          <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
            <h3 class="text-xs font-bold uppercase tracking-widest text-primary mb-4">Logos</h3>
            <div class="space-y-4">
              ${logoSection('Logo Principal', 'headerLogo', 'repLogoInput')}
              ${logoSection('Logo Secundária', 'headerLogoSecondary', 'repLogoSecondaryInput')}
            </div>
          </div>
          <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
            <h3 class="text-xs font-bold uppercase tracking-widest text-primary mb-4">Informações do Setor</h3>
            <div class="space-y-3">
              <div><label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Nome do Setor</label>
                <input type="text" id="repSectorName" value="${t.sectorName || ''}" placeholder="Ex: Secretaria de Obras" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" /></div>
              <div><label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Departamento</label>
                <input type="text" id="repSectorDepartment" value="${t.sectorDepartment || ''}" placeholder="Ex: Transportes" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" /></div>
            </div>
          </div>
        </div>
        <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
          <h3 class="text-xs font-bold uppercase tracking-widest text-primary mb-4">Cabeçalho do Relatório</h3>
          <div class="space-y-3">
            <div><label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Título Principal</label>
              <input type="text" id="repHeaderTitle" value="${t.headerTitle || ''}" placeholder="CityMotion" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" /></div>
            <div><label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Subtítulo</label>
              <input type="text" id="repHeaderSubtitle" value="${t.headerSubtitle || ''}" placeholder="Gestão Inteligente de Frotas" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" /></div>
            <div><label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Informações Extras</label>
              <textarea id="repHeaderExtra" rows="3" placeholder="CNPJ: 00.000.000/0001-00&#10;Endereço: Rua X, 123" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-xs font-mono focus:outline-none focus:border-primary/50">${t.headerExtra || ''}</textarea></div>
          </div>
        </div>
      </div>`;
  }

  function renderRepColors(t) {
    const cPicker = (label, id, val) => `
      <div class="flex items-center justify-between p-3 border border-zinc-700/50 rounded-lg bg-black/20">
        <div><label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">${label}</label>
          <p class="text-[9px] text-zinc-600 font-mono">${val}</p></div>
        <input type="color" id="${id}" value="${val}" onchange="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('colorChange', {detail:'${id}'}))" class="h-9 w-14 rounded cursor-pointer border-0 bg-transparent" />
      </div>`;
    return `
      <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
        <h3 class="text-xs font-bold uppercase tracking-widest text-primary mb-4">Paleta de Cores</h3>
        <div class="space-y-3">
          ${cPicker('Cor Primária (títulos, destaques)', 'repPrimaryColor', t.primaryColor || '#3b82f6')}
          ${cPicker('Cor Secundária (fundos)', 'repSecondaryColor', t.secondaryColor || '#1e293b')}
          ${cPicker('Cor de Destaque (tabelas, OKs)', 'repAccentColor', t.accentColor || '#10b981')}
        </div>
        <div class="mt-4 p-4 rounded-lg" style="background:${t.secondaryColor || '#1e293b'}15; border:1px solid ${t.primaryColor || '#3b82f6'}30">
          <p class="text-[9px] font-bold uppercase tracking-widest" style="color:${t.primaryColor || '#3b82f6'}">Pré-visualização</p>
          <div class="flex gap-2 mt-2">
            <span class="w-6 h-6 rounded" style="background:${t.primaryColor || '#3b82f6'}"></span>
            <span class="w-6 h-6 rounded" style="background:${t.secondaryColor || '#1e293b'}"></span>
            <span class="w-6 h-6 rounded" style="background:${t.accentColor || '#10b981'}"></span>
          </div>
        </div>
      </div>`;
  }

  function renderRepFooter(t) {
    return `
      <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
        <h3 class="text-xs font-bold uppercase tracking-widest text-primary mb-4">Rodapé dos Relatórios</h3>
        <div class="space-y-4">
          <div><label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Texto do Rodapé</label>
            <input type="text" id="repFooterText" value="${t.footerText || ''}" placeholder="CityMotion — Mobilidade, transparência e eficiência." class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" /></div>
          <div><label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Informações Complementares</label>
            <textarea id="repFooterExtra" rows="4" placeholder="Telefone: (xx) xxxx-xxxx&#10;E-mail: contato@citymotion.com&#10;Site: www.citymotion.com" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-xs font-mono focus:outline-none focus:border-primary/50">${t.footerExtra || ''}</textarea></div>
        </div>
      </div>`;
  }

  function renderRepSector(t) {
    return `
      <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
        <h3 class="text-xs font-bold uppercase tracking-widest text-primary mb-4">Informações do Setor / Departamento</h3>
        <p class="text-[10px] text-zinc-500 mb-4">Essas informações aparecerão no cabeçalho dos relatórios quando o relatório for filtrado por setor.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Nome do Setor</label>
            <input type="text" id="repSectorName" value="${t.sectorName || ''}" placeholder="Ex: Secretaria de Obras" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" /></div>
          <div><label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Departamento / Divisão</label>
            <input type="text" id="repSectorDepartment" value="${t.sectorDepartment || ''}" placeholder="Ex: Transportes e Logística" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" /></div>
        </div>
      </div>`;
  }

  // ── RENDER: Operações ─────────────────────────────────────
  function renderOperationsTab() {
    return `<div class="space-y-6">
      <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
        <div class="mb-6 pb-4 border-b border-zinc-800/30">
          <h3 class="text-xs font-bold uppercase tracking-widest text-primary">Regras de Negócio</h3>
          <p class="text-[10px] text-zinc-500 mt-1">Configurações gerais de operação.</p>
        </div>
        <div class="space-y-6">
          <div><label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Nome da Unidade</label>
            <input type="text" id="settingsOrgName" value="${state.orgName}" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" /></div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Prioridade Padrão</label>
              <select id="settingsDefaultPriority" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                ${['Baixa','Média','Alta'].map(p => `<option value="${p}" ${state.defaultPriority===p?'selected':''}>${p}</option>`).join('')}</select></div>
            <div class="flex items-center justify-between p-4 border border-zinc-700/50 rounded-lg bg-black/20 mt-4">
              <div><label class="text-xs font-bold">Exigir Destino</label><p class="text-[10px] text-zinc-500">Obriga preenchimento detalhado.</p></div>
              <button type="button" onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('toggleRequireDest'))"
                class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${state.requireDestination ? 'bg-primary' : 'bg-zinc-700'}">
                <span class="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${state.requireDestination ? 'translate-x-[18px]' : 'translate-x-1'}"></span></button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end pt-6 border-t border-zinc-800/30">
        <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('saveOperations'))" class="btn btn-primary h-12 px-12 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">Salvar</button>
      </div>
    </div>`;
  }

  // ── RENDER: Infraestrutura ───────────────────────────────
  function renderInfraTabs() {
    const cfg = state.infraConfig;
    return `<div class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div>
        <h2 class="text-2xl font-black tracking-tight flex items-center gap-3"><svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>Infraestrutura</h2><p class="text-zinc-500 text-xs mt-1">Banco, rede, SMTP e servidor.</p></div>
        <div class="flex gap-2 flex-wrap">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-black ${cfg?.security?.jwtConfigured ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 'bg-amber-500/10 text-amber-500 border-amber-500/30'}">
            <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>${cfg?.security?.jwtConfigured ? 'JWT OK' : 'JWT!'}
          </span>
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-primary/30 bg-primary/10 text-primary text-[9px] font-black"><svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>Porta ${state.serverPort}</span>
        </div>
      </div>
      <div class="flex gap-1 flex-wrap p-1 bg-zinc-900/60 border border-zinc-800/50 rounded-lg">
        ${['database','network','smtp','server'].map(t => `<button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('setInfraTab',{detail:'${t}'}))" class="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-md transition-colors ${state.infraTab===t ? 'bg-primary/20 text-primary border border-primary/30' : 'text-zinc-500 hover:text-zinc-300'}">${t==='database'?'Banco':t==='network'?'Rede':t==='smtp'?'SMTP':'Servidor'}</button>`).join('')}
      </div>
      ${state.infraTab==='database'?renderDatabaseTab():''}
      ${state.infraTab==='network'?renderNetworkTab():''}
      ${state.infraTab==='smtp'?renderSmtpTab():''}
      ${state.infraTab==='server'?renderServerTab():''}
    </div>`;
  }

  function renderDatabaseTab() {
    const cfg = state.infraConfig;
    return `<div class="space-y-6"><div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
      <div class="mb-4 border-b border-zinc-800/30 pb-4"><h3 class="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>Banco ${statusBadge('database')}</h3></div>
      <div class="space-y-4">
        <div><label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Tipo</label>
          <select id="infraDbType" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
            ${DB_TYPES.map(db => `<option value="${db.value}" ${state.dbType===db.value?'selected':''}>${db.label} — ${db.desc}</option>`).join('')}</select></div>
        ${state.dbType!=='sqlite' ? `<div><label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">URL</label>
          <input type="text" id="infraDbUrl" value="${state.dbUrl}" placeholder="postgresql://..." class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-xs font-mono focus:outline-none focus:border-primary/50" /></div>` : `<div class="p-4 bg-primary/5 border border-primary/20 rounded-md"><p class="text-[11px] font-mono text-primary/70">SQLite local: backend/database/citymotion.db</p></div>`}
        <div class="flex gap-3">
          <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('testDbConn'))" class="btn btn-outline btn-sm text-[10px]" ${state.testing==='database'?'disabled':''}>${state.testing==='database'?'Testando...':'Testar'}</button>
          <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('saveDb'))" class="btn btn-primary btn-sm text-[10px]" ${state.saving?'disabled':''}>Salvar</button>
        </div>
      </div>
    </div></div>`;
  }

  function renderNetworkTab() {
    return `<div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
      <h3 class="text-xs font-bold uppercase tracking-widest mb-4">CORS</h3>
      <div class="space-y-4">
        <div><label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Origens Permitidas</label>
          <textarea id="infraCorsOrigins" rows="3" class="w-full px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-xs font-mono focus:outline-none focus:border-primary/50">${state.corsOrigins}</textarea></div>
        <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('saveCors'))" class="btn btn-primary btn-sm text-[10px]">Salvar</button>
      </div>
    </div>`;
  }

  function renderSmtpTab() {
    return `<div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
      <div class="mb-4 border-b border-zinc-800/30 pb-4"><h3 class="text-xs font-bold uppercase tracking-widest flex items-center gap-2"><svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>SMTP ${statusBadge('smtp')}</h3></div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label class="text-[9px] font-bold uppercase text-zinc-500">Host</label><input type="text" id="infraSmtpHost" value="${state.smtpHost}" class="w-full mt-1 px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-xs font-mono" /></div>
        <div><label class="text-[9px] font-bold uppercase text-zinc-500">Porta</label><input type="number" id="infraSmtpPort" value="${state.smtpPort}" class="w-full mt-1 px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-xs font-mono" /></div>
        <div><label class="text-[9px] font-bold uppercase text-zinc-500">Usuário</label><input type="text" id="infraSmtpUser" value="${state.smtpUser}" class="w-full mt-1 px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-xs font-mono" /></div>
        <div><label class="text-[9px] font-bold uppercase text-zinc-500">Senha</label><input type="${state.showPasswords.smtp?'text':'password'}" id="infraSmtpPass" value="${state.smtpPass}" class="w-full mt-1 px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-xs font-mono" /></div>
      </div>
      <div class="flex items-center justify-between p-3 border border-zinc-700/50 rounded bg-black/20 mt-4">
        <div><label class="text-xs font-bold">TLS/SSL</label><p class="text-[10px] text-zinc-500">Porta 465</p></div>
        <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('toggleSmtpSecure'))" class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${state.smtpSecure ? 'bg-primary' : 'bg-zinc-700'}"><span class="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${state.smtpSecure ? 'translate-x-[18px]' : 'translate-x-1'}"></span></button>
      </div>
      <div class="flex gap-3 mt-4">
        <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('testSmtp'))" class="btn btn-outline btn-sm text-[10px]" ${state.testing==='smtp'?'disabled':''}>Testar</button>
        <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('saveSmtp'))" class="btn btn-primary btn-sm text-[10px]">Salvar</button>
      </div>
    </div>`;
  }

  function renderServerTab() {
    const cfg = state.infraConfig;
    return `<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
        <h3 class="text-xs font-bold uppercase tracking-widest mb-4">Servidor</h3>
        <div class="space-y-4">
          <div><label class="text-[10px] font-bold uppercase text-zinc-500">Porta</label><input type="number" id="infraServerPort" value="${state.serverPort}" class="w-full mt-1 px-3 py-2 bg-black/40 border border-zinc-700/50 rounded-lg text-sm font-mono" /></div>
          <div class="flex items-center justify-between p-3 border border-zinc-700/50 rounded bg-black/20">
            <div><label class="text-xs font-bold">Modo Demo</label><p class="text-[10px] text-zinc-500">Reset diário</p></div>
            <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('toggleDemoMode'))" class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${state.demoMode ? 'bg-primary' : 'bg-zinc-700'}"><span class="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${state.demoMode ? 'translate-x-[18px]' : 'translate-x-1'}"></span></button>
          </div>
          <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('saveServer'))" class="btn btn-primary btn-sm text-[10px]">Salvar</button>
        </div>
      </div>
      <div class="glass-card rounded-xl p-6 border-zinc-700/50 bg-zinc-900/40">
        <h3 class="text-xs font-bold uppercase tracking-widest mb-4">Segurança</h3>
        <div class="space-y-3">
          <div class="flex justify-between p-3 border border-zinc-700/50 rounded bg-black/20"><span class="text-xs font-bold">JWT</span><span class="text-[9px] font-black ${cfg?.security?.jwtConfigured ? 'text-emerald-500' : 'text-red-500'}">${cfg?.security?.jwtConfigured ? 'OK' : 'FALTA'}</span></div>
          <div class="flex justify-between p-3 border border-zinc-700/50 rounded bg-black/20"><span class="text-xs font-bold">CORS</span><span class="text-[9px] text-primary font-black">Ativo</span></div>
          <div class="flex justify-between p-3 border border-zinc-700/50 rounded bg-black/20"><span class="text-xs font-bold">Rate Limit</span><span class="text-[9px] text-emerald-500 font-black">Ativo</span></div>
        </div>
      </div>
    </div>`;
  }

  // ── MAIN RENDER ───────────────────────────────────────────
  async function render() {
    const user = Store.get('user');
    const userRole = Store.mapRole(user?.role);
    const isDev = ['dev','ti','admin'].includes(userRole);

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
            class="text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-md transition-colors ${state.tab==='operations'?'bg-primary/20 text-primary border border-primary/30':'text-zinc-500 hover:text-zinc-300'}">
            <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            Operações
          </button>
          ${isDev ? `
          <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('setTab',{detail:'report'}))"
            class="text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-md transition-colors ${state.tab==='report'?'bg-primary/20 text-primary border border-primary/30':'text-zinc-500 hover:text-zinc-300'}">
            <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Design Relatórios
          </button>
          <button onclick="document.getElementById('settingsOverlay').dispatchEvent(new CustomEvent('setTab',{detail:'infrastructure'}))"
            class="text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-md transition-colors ${state.tab==='infrastructure'?'bg-primary/20 text-primary border border-primary/30':'text-zinc-500 hover:text-zinc-300'}">
            <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"/></svg>
            Infraestrutura
          </button>` : ''}
        </div>

        <div id="settingsTabContent">
          ${state.tab === 'operations' ? renderOperationsTab() : ''}
          ${state.tab === 'report' ? renderReportDesignTab() : ''}
          ${state.tab === 'infrastructure'
            ? (state.infraLoading
              ? '<div class="flex justify-center p-12"><svg class="w-8 h-8 animate-spin text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg><span class="ml-3 text-zinc-500 text-xs">Carregando...</span></div>'
              : renderInfraTabs())
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
