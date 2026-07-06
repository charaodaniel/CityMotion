/**
 * CityMotion — Página: Setores
 * Cards de departamentos, modal detalhes com veículos/funcionários vinculados
 */
export default function SectorsPage(container, Store, API) {
  let state = {
    activeModal: null, // null | 'register' | 'details' | 'edit'
    selectedSector: null,
    formData: { name: '', description: '' },
  };

  function upd(partial) { state = { ...state, ...partial }; }

  // ----------------------------------------------------------
  //  Modal
  // ----------------------------------------------------------
  function openModal(type, sector) {
    const data = sector
      ? { name: sector.name || '', description: sector.description || '' }
      : { name: '', description: '' };
    upd({ activeModal: type, selectedSector: sector, formData: data });
    renderModal();
  }

  function closeModal() {
    upd({ activeModal: null, selectedSector: null });
    renderModal();
  }

  function renderModal() {
    const overlay = document.getElementById('setoresModalOverlay');
    const content = document.getElementById('setoresModalContent');
    if (!overlay || !content) return;
    if (!state.activeModal) { overlay.classList.add('hidden'); return; }
    overlay.classList.remove('hidden');
    if (state.activeModal === 'details') renderDetailsModal(content);
    else renderFormModal(content);
  }

  function renderDetailsModal(el) {
    const s = state.selectedSector;
    if (!s) return;
    const employees = (Store.get('employees') || []).filter(d => d.sector?.includes?.(s.name));
    const vehicles = (Store.get('vehicles') || []).filter(v => v.sector === s.name);

    el.innerHTML = `
      <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-2xl font-black tracking-tight">${s.name}</h2>
            <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">${s.description || 'Sem descrição'}</p>
          </div>
          <button onclick="document.getElementById('setoresModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="flex justify-end mb-4">
          <button onclick="document.getElementById('setoresModalOverlay').dispatchEvent(new CustomEvent('openEdit', {detail: '${s.id}'}))" class="btn btn-outline btn-sm text-[10px]">
            <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            Editar
          </button>
        </div>
        <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30 space-y-6">
          <div>
            <h3 class="text-sm font-bold mb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg>
              Funcionários Vinculados (${employees.length})
            </h3>
            ${employees.length > 0 ? `
            <div class="overflow-x-auto rounded-lg border border-zinc-800/50">
              <table class="w-full text-xs">
                <thead><tr class="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  <th class="text-left px-4 py-2">Nome</th>
                  <th class="text-left px-4 py-2">Cargo</th>
                  <th class="text-left px-4 py-2">Status</th>
                </tr></thead>
                <tbody class="divide-y divide-zinc-800/30">
                  ${employees.map(e => `<tr class="hover:bg-zinc-800/20"><td class="px-4 py-2 font-medium">${e.name}</td><td class="px-4 py-2 text-zinc-400">${e.role}</td><td class="px-4 py-2"><span class="badge badge-secondary text-[9px]">${e.status}</span></td></tr>`).join('')}
                </tbody>
              </table>
            </div>` : `<p class="text-xs text-zinc-600 italic">Nenhum funcionário vinculado a este setor.</p>`}
          </div>
          <div class="border-t border-zinc-800/30"></div>
          <div>
            <h3 class="text-sm font-bold mb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Veículos Vinculados (${vehicles.length})
            </h3>
            ${vehicles.length > 0 ? `
            <div class="overflow-x-auto rounded-lg border border-zinc-800/50">
              <table class="w-full text-xs">
                <thead><tr class="bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                  <th class="text-left px-4 py-2">Modelo</th>
                  <th class="text-left px-4 py-2">Placa</th>
                  <th class="text-left px-4 py-2">Status</th>
                </tr></thead>
                <tbody class="divide-y divide-zinc-800/30">
                  ${vehicles.map(v => `<tr class="hover:bg-zinc-800/20"><td class="px-4 py-2 font-medium">${v.vehicleModel}</td><td class="px-4 py-2 font-mono text-primary">${v.licensePlate}</td><td class="px-4 py-2"><span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold ${v.status === 'Disponível' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : v.status === 'Manutenção' ? 'border-red-500/30 bg-red-500/10 text-red-400' : 'border-primary/30 bg-primary/10 text-primary'}">${v.status}</span></td></tr>`).join('')}
                </tbody>
              </table>
            </div>` : `<p class="text-xs text-zinc-600 italic">Nenhum veículo vinculado a este setor.</p>`}
          </div>
        </div>
      </div>`;
  }

  function renderFormModal(el) {
    const isEdit = state.activeModal === 'edit';
    const fd = state.formData;
    el.innerHTML = `
      <div class="h-1.5 w-full bg-[#93c5fd]"></div>
      <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-black tracking-tight">${isEdit ? 'Editar Setor' : 'Adicionar Novo Setor'}</h2>
            <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">${isEdit ? 'Altere as informações do setor' : 'Preencha para cadastrar um novo setor'}</p>
          </div>
          <button onclick="document.getElementById('setoresModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30">
          <form id="sectorForm" class="space-y-5">
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nome do Setor</label>
              <input type="text" name="name" value="${fd.name}" placeholder="Ex: Secretaria de Finanças" required minlength="3" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Descrição (Opcional)</label>
              <textarea name="description" rows="3" placeholder="Descreva brevemente a função do setor." class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs resize-none focus:outline-none focus:border-primary/50">${fd.description}</textarea>
            </div>
            <div class="flex justify-end pt-2">
              <button type="button" onclick="document.getElementById('setoresModalOverlay').dispatchEvent(new CustomEvent('submitSectorForm'))" class="btn btn-primary h-10 px-8 text-[10px] font-bold uppercase tracking-widest">
                ${isEdit ? 'Salvar Alterações' : 'Salvar Setor'}
              </button>
            </div>
          </form>
        </div>
      </div>`;
  }

  function handleFormSubmit(data) {
    const sectors = [...(Store.get('sectors') || [])];
    if (state.activeModal === 'edit' && state.selectedSector) {
      Store.set('sectors', sectors.map(s => s.id === state.selectedSector.id ? { ...s, ...data } : s));
    } else {
      const newSector = { id: 'SEC' + Date.now(), ...data, driverCount: 0, vehicleCount: 0 };
      Store.set('sectors', [...sectors, newSector]);
    }
    closeModal();
  }

  // ----------------------------------------------------------
  //  Render
  // ----------------------------------------------------------
  function render() {
    const sectors = Store.get('sectors') || [];
    const employees = Store.get('employees') || [];
    const vehicles = Store.get('vehicles') || [];

    container.innerHTML = `
      <div class="animate-fade-in space-y-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 class="text-3xl sm:text-4xl font-black tracking-tighter flex items-center gap-3">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
              Gestão de Setores
            </h1>
            <p class="text-zinc-400 text-sm mt-1 font-medium">Configuração de unidades e departamentos.</p>
          </div>
          <button onclick="document.getElementById('setoresModalOverlay').dispatchEvent(new CustomEvent('openRegister'))" class="btn btn-primary btn-sm text-[10px]">
            <svg class="w-3.5 h-3.5 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Adicionar Novo Setor
          </button>
        </div>
        ${sectors.length > 0 ? `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${sectors.map(s => {
            const vCount = vehicles.filter(v => v.sector === s.name).length;
            return `
            <div class="nexus-card p-5 cursor-pointer hover:border-primary/50 transition-all duration-300" data-sector-id="${s.id}">
              <div class="flex items-center gap-3 mb-3">
                <svg class="w-5 h-5 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                <h3 class="text-base font-bold truncate">${s.name}</h3>
              </div>
              <p class="text-xs text-zinc-500 line-clamp-2 mb-4 min-h-[2.5em]">${s.description || 'Sem descrição'}</p>
              <div class="flex items-center text-xs text-zinc-500">
                <svg class="w-4 h-4 mr-1.5 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                <span>${vCount} veículos</span>
              </div>
            </div>`;
          }).join('')}
        </div>` : `
        <div class="text-center py-16 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
          <p class="text-lg italic text-zinc-500">Nenhum setor cadastrado no momento.</p>
          <button onclick="document.getElementById('setoresModalOverlay').dispatchEvent(new CustomEvent('openRegister'))" class="mt-3 text-primary font-bold uppercase tracking-widest text-xs hover:underline">Adicionar agora</button>
        </div>`}
      </div>
      <div id="setoresModalOverlay" class="fixed inset-0 z-50 flex items-center justify-center hidden" style="background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);">
        <div id="setoresModalContent" class="bg-[#0f0f13] border border-zinc-700/50 rounded-xl shadow-2xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden"></div>
      </div>`;
    setupEventListeners();
  }

  function setupEventListeners() {
    const overlay = document.getElementById('setoresModalOverlay');
    if (!overlay) return;

    container.addEventListener('click', e => {
      const card = e.target.closest('[data-sector-id]');
      if (card && !e.target.closest('button')) {
        const sectors = Store.get('sectors') || [];
        const s = sectors.find(x => x.id === card.dataset.sectorId);
        if (s) openModal('details', s);
      }
    });

    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    overlay.addEventListener('closeModal', () => closeModal());
    overlay.addEventListener('openRegister', () => openModal('register'));
    overlay.addEventListener('openEdit', e => {
      const sectors = Store.get('sectors') || [];
      const s = sectors.find(x => x.id === e.detail);
      if (s) openModal('edit', s);
    });
    overlay.addEventListener('submitSectorForm', () => {
      const form = document.getElementById('sectorForm');
      if (!form) return;
      const data = new FormData(form);
      const name = (data.get('name') || '').trim();
      const description = (data.get('description') || '').trim();
      if (!name || name.length < 3) { Toast.show('O nome do setor é obrigatório.', 'warning'); return; }
      handleFormSubmit({ name, description });
    });
  }

  const unsub = Store.on('sectors', render);
  render();
  return () => { unsub(); };
}
