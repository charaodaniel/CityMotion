/**
 * CityMotion — Página: Manutenção
 * Kanban 3 colunas (Pendentes, Em Andamento, Concluídas),
 * modal detalhes com ações de status, formulário de pedido de peças
 */
import { formatDate } from '/js/format-utils.js';
import { getStatusVariant, getKanbanColumns, renderDetailsModal, renderPartModal } from './modals.js';

export default function MaintenancePage(container, Store, API) {
  let state = {
    selectedRequest: null,
    isPartModalOpen: false,
    partForm: { partName: '', quantity: 1, supplier: '', justification: '' },
  };
  let _cardDelegate = null;

  function upd(partial) { state = { ...state, ...partial }; }

  const columns = getKanbanColumns();

  // ── Modal ────────────────────────────────────────────────
  function openDetails(request) { upd({ selectedRequest: request }); renderModal(); }
  function closeModal() { upd({ selectedRequest: null, isPartModalOpen: false }); renderModal(); }

  function openPartModal() {
    upd({ isPartModalOpen: true, partForm: { partName: '', quantity: 1, supplier: '', justification: '' } });
    renderModal();
  }

  function handleUpdateStatus(newStatus) {
    const req = state.selectedRequest;
    if (!req) return;
    const requests = [...(Store.get('maintenanceRequests') || [])];
    Store.set('maintenanceRequests', requests.map(r => r.id === req.id ? { ...r, status: newStatus } : r));
    closeModal();
  }

  function renderModal() {
    const overlay = document.getElementById('manutencaoModalOverlay');
    const content = document.getElementById('manutencaoModalContent');
    if (!overlay || !content) return;
    if (!state.selectedRequest && !state.isPartModalOpen) { overlay.classList.add('hidden'); return; }
    overlay.classList.remove('hidden');

    if (state.isPartModalOpen) {
      content.innerHTML = renderPartModal(state.selectedRequest, state.partForm);
      return;
    }
    if (!state.selectedRequest) return;
    const user = Store.get('user');
    const userRole = Store.mapRole(user?.role);
    const isAdmin = ['admin', 'manager', 'dev', 'ti'].includes(userRole);
    content.innerHTML = renderDetailsModal(state.selectedRequest, formatDate, isAdmin);
  }

  // ── Render ───────────────────────────────────────────────
  function render() {
    const requests = Store.get('maintenanceRequests') || [];

    container.innerHTML = `
      <div class="animate-fade-in space-y-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 class="text-3xl sm:text-4xl font-black tracking-tighter flex items-center gap-3">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              Manutenção
            </h1>
            <p class="text-zinc-400 text-sm mt-1 font-medium">Gestão técnica e operacional de reparos da frota NexusOS.</p>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          ${columns.map(col => {
            const items = requests.filter(r => r.status === col.status);
            return `
            <div class="flex flex-col gap-3">
              <h2 class="text-[10px] font-bold uppercase tracking-widest flex items-center text-primary/60 gap-1.5">
                ${col.icon} ${col.title} (${items.length})
              </h2>
              <div class="bg-zinc-900/30 rounded-xl p-3 space-y-3 min-h-[250px] border border-zinc-800/50 scanlines">
                ${items.length > 0 ? items.map(r => `
                  <div class="nexus-card p-0 overflow-hidden cursor-pointer hover:border-primary/50 transition-all" data-request-id="${r.id}">
                    <div class="p-4 pb-2">
                      <h3 class="text-sm font-bold tracking-tight">${r.vehicleModel}</h3>
                      <div class="flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-widest text-primary/50 mt-1">
                        <span class="inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold bg-primary/10 text-primary border border-primary/30">${r.licensePlate}</span>
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        ${formatDate(r.requestDate)}
                      </div>
                    </div>
                    <div class="px-4 pb-3">
                      <p class="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">${r.description}</p>
                    </div>
                    <div class="border-t border-zinc-800/10 px-4 py-2 bg-black/20 flex items-center gap-1.5 text-[10px] text-zinc-500">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      <span>Solicitante: <strong class="text-zinc-300">${r.requesterName}</strong></span>
                    </div>
                  </div>
                `).join('') : `
                <div class="flex flex-col items-center justify-center h-full text-[10px] text-zinc-600 uppercase tracking-widest opacity-50 gap-2">
                  ${col.icon}
                  Vazio
                </div>`}
              </div>
            </div>`;
          }).join('')}
        </div>
      </div>
      <div id="manutencaoModalOverlay" class="fixed inset-0 z-50 flex items-center justify-center hidden" style="background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);">
        <div id="manutencaoModalContent" class="bg-[#0f0f13] border border-zinc-700/50 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"></div>
      </div>`;
    setupEventListeners();
  }

  function setupEventListeners() {
    const overlay = document.getElementById('manutencaoModalOverlay');
    if (!overlay) return;

    // Delegacia de cards (única vez)
    if (!_cardDelegate) {
      _cardDelegate = (e) => {
        const card = e.target.closest('[data-request-id]');
        if (card && !e.target.closest('button')) {
          const requests = Store.get('maintenanceRequests') || [];
          const r = requests.find(x => x.id === card.dataset.requestId);
          if (r) openDetails(r);
        }
      };
      container.addEventListener('click', _cardDelegate);
    }

    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    overlay.addEventListener('closeModal', () => closeModal());
    overlay.addEventListener('openPartModal', () => openPartModal());
    overlay.addEventListener('updateStatus', e => { handleUpdateStatus(e.detail); });

    overlay.addEventListener('submitPartRequest', () => {
      const partName = document.getElementById('partName')?.value?.trim();
      const quantity = parseInt(document.getElementById('partQuantity')?.value) || 1;
      const supplier = document.getElementById('partSupplier')?.value?.trim() || '';
      const justification = document.getElementById('partJustification')?.value?.trim() || '';

      if (!partName || partName.length < 3) { Toast.show('Informe o nome da peça.', 'warning'); return; }
      if (quantity < 1) { Toast.show('A quantidade deve ser pelo menos 1.', 'warning'); return; }
      if (!justification || justification.length < 10) { Toast.show('A justificativa deve ter pelo menos 10 caracteres.', 'warning'); return; }

      Toast.show('✅ Pedido de peça enviado para o setor de compras!', 'success');
      closeModal();
    });
  }

  const unsub = Store.on('maintenanceRequests', render);
  render();
  return () => { unsub(); };
}
