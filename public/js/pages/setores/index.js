/**
 * CityMotion — Página: Setores
 * Cards de departamentos, modal detalhes com veículos/funcionários vinculados
 */
import {
  renderDetailsModal, renderEmployeesTable, renderVehiclesTable, renderFormModal
} from './modals.js';

export default function SectorsPage(container, Store, API) {
  let state = {
    activeModal: null, // null | 'register' | 'details' | 'edit'
    selectedSector: null,
    formData: { name: '', description: '' },
  };
  let _cardDelegate = null;

  function upd(partial) { state = { ...state, ...partial }; }

  // ── Modal ────────────────────────────────────────────────
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

    if (state.activeModal === 'details') {
      const s = state.selectedSector;
      if (!s) return;
      const employees = (Store.get('employees') || []).filter(d => d.sector?.includes?.(s.name));
      const vehicles = (Store.get('vehicles') || []).filter(v => v.sector === s.name);

      content.innerHTML = renderDetailsModal(s, employees.length, vehicles.length);

      document.getElementById('sectorEmployees').innerHTML = renderEmployeesTable(employees);
      document.getElementById('sectorVehicles').innerHTML = renderVehiclesTable(vehicles);
    } else {
      content.innerHTML = renderFormModal(state.activeModal === 'edit', state.formData);
    }
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

  // ── Render ───────────────────────────────────────────────
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

    // Delegacia de cards (única vez)
    if (!_cardDelegate) {
      _cardDelegate = (e) => {
        const card = e.target.closest('[data-sector-id]');
        if (card && !e.target.closest('button')) {
          const sectors = Store.get('sectors') || [];
          const s = sectors.find(x => x.id === card.dataset.sectorId);
          if (s) openModal('details', s);
        }
      };
      container.addEventListener('click', _cardDelegate);
    }

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
