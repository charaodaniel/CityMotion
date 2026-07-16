/**
 * CityMotion — Página: Veículos (Frota)
 *
 * Módulos:
 *   ./modals.js → Renderizadores de modais (HTML puro)
 */
import { renderDetailsModal, renderFormModal } from './modals.js';

export default function VehiclesPage(container, Store, API) {
  // ============================================================
  //  Estado local
  // ============================================================
  let state = {
    activeModal: null, // null | 'register' | 'details' | 'edit'
    selectedVehicle: null,
    searchQuery: '',
    formData: { vehicleModel: '', licensePlate: '', sector: '', mileage: 0 },
  };

  let _rowDelegate = null;

  function upd(partial) { state = { ...state, ...partial }; }

  // ============================================================
  //  Helpers
  // ============================================================
  function getStatusStyles(status) {
    switch (status) {
      case 'Em Serviço': case 'Em Viagem':
        return 'border-primary/30 bg-primary/10 text-primary';
      case 'Disponível':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
      case 'Manutenção':
        return 'border-destructive/30 bg-destructive/10 text-destructive';
      default:
        return 'border-zinc-600 bg-zinc-800/50 text-zinc-400';
    }
  }

  function getFilteredVehicles() {
    const vehicles = Store.get('vehicles') || [];
    const q = state.searchQuery.toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter(
      (v) => v.vehicleModel?.toLowerCase().includes(q) ||
            v.licensePlate?.toLowerCase().includes(q) ||
            v.sector?.toLowerCase().includes(q)
    );
  }

  // ============================================================
  //  Formulário
  // ============================================================
  async function handleFormSubmit(formData) {
    const vehicles = [...(Store.get('vehicles') || [])];
    if (state.activeModal === 'edit' && state.selectedVehicle) {
      try {
        const result = await API.put('/api/vehicles/' + state.selectedVehicle.id, formData);
        Store.set('vehicles', vehicles.map((v) => v.id === state.selectedVehicle.id ? { ...v, ...result } : v));
      } catch (e) {
        Store.set('vehicles', vehicles.map((v) => v.id === state.selectedVehicle.id ? { ...v, ...formData } : v));
      }
    } else {
      try {
        const result = await API.post('/api/vehicles', formData);
        Store.set('vehicles', [...vehicles, { ...formData, ...result, status: 'Disponível' }]);
      } catch (e) {
        Store.set('vehicles', [...vehicles, { id: 'V' + Date.now(), ...formData, status: 'Disponível' }]);
      }
    }
    closeModal();
  }

  // ============================================================
  //  Modal
  // ============================================================
  function openModal(type, vehicle) {
    const data = vehicle
      ? {
          vehicleModel: vehicle.vehicleModel || '',
          licensePlate: vehicle.licensePlate || '',
          sector: vehicle.sector || '',
          mileage: vehicle.mileage || 0,
        }
      : { vehicleModel: '', licensePlate: '', sector: '', mileage: 0 };
    upd({ activeModal: type, selectedVehicle: vehicle, formData: data });
    renderModal();
  }

  function closeModal() {
    upd({ activeModal: null, selectedVehicle: null });
    renderModal();
  }

  function renderModal() {
    const overlay = document.getElementById('veiculosModalOverlay');
    const content = document.getElementById('veiculosModalContent');
    if (!overlay || !content) return;
    if (!state.activeModal) { overlay.classList.add('hidden'); return; }
    overlay.classList.remove('hidden');

    switch (state.activeModal) {
      case 'details':
        content.innerHTML = renderDetailsModal(state.selectedVehicle, getStatusStyles);
        break;
      case 'register':
      case 'edit':
        content.innerHTML = renderFormModal(state.activeModal === 'edit', state.formData, Store.get('sectors') || []);
        break;
    }
  }

  // ============================================================
  //  Render
  // ============================================================
  function render() {
    const vehicles = Store.get('vehicles') || [];
    const filtered = getFilteredVehicles();
    const total = vehicles.length;
    const disponiveis = vehicles.filter((v) => v.status === 'Disponível').length;
    const emViagem = vehicles.filter((v) => v.status === 'Em Viagem' || v.status === 'Em Serviço').length;
    const manutencao = vehicles.filter((v) => v.status === 'Manutenção').length;

    container.innerHTML = `
      <div class="animate-fade-in space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 class="text-3xl sm:text-4xl font-black tracking-tighter flex items-center gap-3">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Gestão de Frota
            </h1>
            <p class="text-zinc-400 text-sm mt-1 font-medium">Controle de ativos e telemetria NexusOS.</p>
          </div>
          <button onclick="document.getElementById('veiculosModalOverlay').dispatchEvent(new CustomEvent('openRegister'))" class="btn btn-primary btn-sm text-[10px]">
            <svg class="w-3.5 h-3.5 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Novo Veículo
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${[
            { label: 'Prontos para Saída', count: disponiveis, color: 'emerald', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>' },
            { label: 'Rotas Ativas', count: emViagem, color: 'primary', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>' },
            { label: 'Oficina / Manutenção', count: manutencao, color: 'destructive', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
          ].map((stat, i) => `
            <div class="glass-card rounded-xl p-5 relative overflow-hidden group scanlines">
              <div class="absolute right-0 top-0 w-32 h-32 rounded-bl-full -z-0 transition-transform group-hover:scale-110 ${stat.color === 'emerald' ? 'bg-emerald-500/10' : stat.color === 'primary' ? 'bg-primary/10' : 'bg-destructive/10'}"></div>
              <div class="flex justify-between items-start mb-6 relative z-10">
                <div class="p-3 rounded-lg border ${stat.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : stat.color === 'primary' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-destructive/20 text-destructive border-destructive/30'}">${stat.icon}</div>
              </div>
              <div class="relative z-10">
                <p class="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mb-1">${stat.label}</p>
                <p class="text-4xl font-black tracking-tighter ${stat.color === 'emerald' ? 'text-emerald-400' : stat.color === 'primary' ? 'text-blue-300' : 'text-red-400'}">${stat.count}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Tabela + Sidebar -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div class="lg:col-span-3">
            <div class="glass-card rounded-xl overflow-hidden">
              <div class="p-4 border-b border-zinc-800/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/20">
                <h3 class="text-sm font-bold tracking-tight">Frota Ativa</h3>
                <div class="relative w-full md:w-64">
                  <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <input type="text" id="vehicleSearch" value="${state.searchQuery}" placeholder="Buscar veículos, placas..." class="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs focus:outline-none focus:border-primary/50" />
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="border-b border-zinc-800/30 bg-zinc-900/20 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                      <th class="text-left px-4 py-3">ID Veículo</th>
                      <th class="text-left px-4 py-3">Modelo / Placa</th>
                      <th class="text-left px-4 py-3">Setor</th>
                      <th class="text-left px-4 py-3">Status</th>
                      <th class="text-right px-4 py-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-zinc-800/20">
                    ${filtered.length > 0 ? filtered.map((v) => `
                      <tr class="hover:bg-zinc-800/20 transition-all cursor-pointer group" data-vehicle-id="${v.id}">
                        <td class="px-4 py-3 font-bold text-primary font-mono">NEX-${(v.id || '').replace(/\D/g, '').padStart(3, '0')}</td>
                        <td class="px-4 py-3">
                          <div class="flex flex-col">
                            <span class="font-bold text-sm text-zinc-200">${v.vehicleModel}</span>
                            <span class="text-[10px] text-zinc-500 tracking-widest">${v.licensePlate}</span>
                          </div>
                        </td>
                        <td class="px-4 py-3 text-zinc-400">${v.sector}</td>
                        <td class="px-4 py-3">
                          <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tight ${getStatusStyles(v.status)}">
                            <span class="w-1.5 h-1.5 rounded-full ${v.status === 'Em Viagem' ? 'animate-pulse bg-primary' : v.status === 'Disponível' ? 'bg-emerald-400' : v.status === 'Manutenção' ? 'bg-destructive' : 'bg-zinc-400'}"></span>
                            ${v.status}
                          </span>
                        </td>
                        <td class="text-right px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button class="btn btn-ghost btn-icon" data-action="edit" data-vehicle-id="${v.id}" title="Editar">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          </button>
                        </td>
                      </tr>
                    `).join('') : `
                      <tr><td colspan="5" class="text-center py-10 text-zinc-600 italic">Nenhum veículo encontrado.</td></tr>
                    `}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="flex flex-col gap-4">
            <div class="glass-card rounded-xl p-5">
              <h4 class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Motoristas Destaque
              </h4>
              <div class="space-y-3">
                ${['J. Pereira', 'M. Santos'].map((name) => `
                  <div class="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/30 transition-all cursor-pointer">
                    <div class="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400 border-2 border-primary/20">${name[0]}</div>
                    <div class="flex-1 overflow-hidden">
                      <p class="text-xs font-bold truncate leading-none mb-0.5">${name}</p>
                      <p class="text-[9px] font-mono text-zinc-600 uppercase">${(4.8 + Math.random() * 0.2).toFixed(1)}/5.0 • ${(800 + Math.floor(Math.random() * 400))} Viagens</p>
                    </div>
                    <svg class="w-3.5 h-3.5 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="glass-card rounded-xl p-5 relative overflow-hidden flex-1">
              <h4 class="text-[10px] font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Log de Atividade
              </h4>
              <div class="font-mono text-[10px] text-zinc-500 flex flex-col gap-2">
                ${[
                  { time: '10:42', id: 'NEX-108', msg: 'Geocerca Z-04 detectada', type: 'primary' },
                  { time: '10:38', id: 'NEX-015', msg: 'Manutenção #882 aberta', type: 'destructive' },
                  { time: '10:15', id: 'NEX-042', msg: 'Viagem T-9912 concluída', type: 'emerald' },
                  { time: '09:55', id: 'SYS', msg: 'Update OTA v2.4 aplicado', type: 'primary' },
                ].map((log) => `
                  <div class="flex gap-2 leading-tight">
                    <span class="text-primary/40 shrink-0">[${log.time}]</span>
                    <span class="font-bold uppercase shrink-0 ${log.type === 'primary' ? 'text-primary' : log.type === 'destructive' ? 'text-red-400' : 'text-emerald-400'}">${log.id}</span>
                    <span class="text-zinc-400/70">${log.msg}</span>
                  </div>
                `).join('')}
              </div>
              <div class="absolute bottom-5 right-5">
                <span class="inline-block w-2 h-4 bg-primary animate-pulse"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="veiculosModalOverlay" class="fixed inset-0 z-50 flex items-center justify-center hidden" style="background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);">
        <div id="veiculosModalContent" class="bg-[#0f0f13] border border-zinc-700/50 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"></div>
      </div>
    `;

    setupEventListeners();
  }

  // ============================================================
  //  Event Listeners
  // ============================================================
  function setupEventListeners() {
    const overlay = document.getElementById('veiculosModalOverlay');
    if (!overlay) return;

    // Search
    const searchInput = document.getElementById('vehicleSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        upd({ searchQuery: e.target.value });
        render();
      });
    }

    // Delegacia de eventos (única vez)
    if (!_rowDelegate) {
      _rowDelegate = (e) => {
        // Clique na linha → abrir detalhes
        const row = e.target.closest('tr[data-vehicle-id]');
        if (row && !e.target.closest('button')) {
          const vid = row.dataset.vehicleId;
          const vehicles = Store.get('vehicles') || [];
          const v = vehicles.find((x) => x.id === vid);
          if (v) openModal('details', v);
        }

        // Botão de editar
        const btn = e.target.closest('[data-action="edit"]');
        if (btn) {
          const vid = btn.dataset.vehicleId;
          const vehicles = Store.get('vehicles') || [];
          const v = vehicles.find((x) => x.id === vid);
          if (v) openModal('edit', v);
        }
      };
      container.addEventListener('click', _rowDelegate);
    }

    // Modal events (overlay é recriado a cada render, precisa re-listen)
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
    overlay.addEventListener('closeModal', () => closeModal());
    overlay.addEventListener('openRegister', () => openModal('register'));
    overlay.addEventListener('openEdit', (e) => {
      const vehicles = Store.get('vehicles') || [];
      const v = vehicles.find((x) => x.id === e.detail);
      if (v) openModal('edit', v);
    });
    overlay.addEventListener('openMaintenance', () => {
      Toast.show('🔧 Módulo de manutenção será integrado em breve.', 'info');
      closeModal();
    });
    overlay.addEventListener('submitVehicleForm', () => {
      const form = document.getElementById('vehicleForm');
      if (!form) return;
      const data = new FormData(form);
      const vehicleModel = (data.get('vehicleModel') || '').trim();
      const licensePlate = (data.get('licensePlate') || '').trim().toUpperCase();
      const sector = (data.get('sector') || '').trim();
      const mileage = parseInt(data.get('mileage')) || 0;
      if (!vehicleModel || vehicleModel.length < 3) { Toast.show('O modelo do veículo é obrigatório.', 'warning'); return; }
      if (!licensePlate || licensePlate.length < 7) { Toast.show('A placa deve ter no mínimo 7 caracteres.', 'warning'); return; }
      if (!sector) { Toast.show('Selecione um setor.', 'warning'); return; }
      handleFormSubmit({ vehicleModel, licensePlate, sector, mileage });
    });
  }

  // ============================================================
  //  Subscriptions & Init
  // ============================================================
  const unsubVehicles = Store.on('vehicles', render);
  const unsubEmployees = Store.on('employees', render);
  render();

  // ============================================================
  //  Cleanup
  // ============================================================
  return () => {
    unsubVehicles();
    unsubEmployees();
  };
}
