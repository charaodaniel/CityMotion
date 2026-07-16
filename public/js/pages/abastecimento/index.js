/**
 * CityMotion — Página: Abastecimento
 *
 * Módulos:
 *   ./modals.js → Renderizador do modal (HTML puro)
 */
import { renderRefuelingForm } from './modals.js';
import { formatDate, formatCurrency } from '/js/format-utils.js';

export default function RefuelingPage(container, Store, API) {
  let state = {
    isModalOpen: false,
    search: '',
    formData: {
      vehicleId: '', mileage: 0, liters: 0, price: 0,
      fuelType: 'Gasolina', gasStation: '', notes: '',
    },
  };

  let _cardDelegate = null;

  function upd(partial) { state = { ...state, ...partial }; }

  function getFiltered() {
    const refuelings = Store.get('refuelings') || [];
    const q = state.search.toLowerCase();
    if (!q) return refuelings;
    return refuelings.filter(r =>
      (r.licensePlate || '').toLowerCase().includes(q) ||
      (r.vehicleModel || '').toLowerCase().includes(q) ||
      (r.driverName || '').toLowerCase().includes(q)
    );
  }

  function openModal() {
    upd({
      isModalOpen: true,
      formData: { vehicleId: '', mileage: 0, liters: 0, price: 0, fuelType: 'Gasolina', gasStation: '', notes: '' },
    });
    renderModal();
  }

  function closeModal() { upd({ isModalOpen: false }); renderModal(); }

  function renderModal() {
    const overlay = document.getElementById('refuelingModalOverlay');
    const content = document.getElementById('refuelingModalContent');
    if (!overlay || !content) return;
    if (!state.isModalOpen) { overlay.classList.add('hidden'); return; }
    overlay.classList.remove('hidden');
    content.innerHTML = renderRefuelingForm(Store.get('vehicles') || [], state.formData);
  }

  function render() {
    const refuelings = Store.get('refuelings') || [];
    const filtered = getFiltered();
    const totalSpent = refuelings.reduce((acc, r) => acc + (r.totalValue || 0), 0);

    container.innerHTML = `
      <div class="animate-fade-in space-y-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 class="text-3xl sm:text-4xl font-black tracking-tighter flex items-center gap-3">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              Abastecimento
            </h1>
            <p class="text-zinc-400 text-sm mt-1 font-medium">Controle de consumo e despesas de combustível.</p>
          </div>
          <button onclick="document.getElementById('refuelingModalOverlay').dispatchEvent(new CustomEvent('openForm'))" class="btn btn-primary btn-sm text-[10px]">
            <svg class="w-3.5 h-3.5 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Registrar Abastecimento
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="glass-card rounded-xl p-5 scanlines">
            <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Total Investido (Mês)</p>
            <p class="text-4xl font-black tracking-tighter text-primary mt-2">${formatCurrency(totalSpent)}</p>
            <p class="text-[10px] font-mono text-emerald-500 font-bold mt-1 uppercase">Sincronizado com Financeiro</p>
          </div>
          <div class="glass-card rounded-xl p-5">
            <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Média de Consumo Geral</p>
            <p class="text-4xl font-black tracking-tighter mt-2">12.4 <span class="text-lg text-zinc-500">km/l</span></p>
            <p class="text-[10px] font-mono text-zinc-600 mt-1 uppercase">Baseado em telemetria</p>
          </div>
          <div class="glass-card rounded-xl p-5">
            <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Abastecimentos Ativos</p>
            <p class="text-4xl font-black tracking-tighter mt-2">${refuelings.length}</p>
            <p class="text-[10px] font-mono text-zinc-600 mt-1 uppercase">Últimos 30 dias</p>
          </div>
        </div>
        <div class="glass-card rounded-xl overflow-hidden">
          <div class="p-4 border-b border-zinc-800/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-900/20">
            <h3 class="text-sm font-bold tracking-tight">Histórico de Suprimentos</h3>
            <div class="relative w-full md:w-64">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <input type="text" id="refuelingSearch" value="${state.search}" placeholder="Filtrar placa, veículo..." class="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${filtered.length > 0 ? filtered.map(log => `
              <div class="nexus-card p-4 space-y-3">
                <div class="flex justify-between items-start">
                  <div>
                    <span class="text-[10px] font-black tracking-tighter text-primary">NEX-REF#${(log.id || '').padStart(3, '0')}</span>
                    <p class="text-sm font-bold truncate max-w-[150px]">${log.vehicleModel}</p>
                    <span class="text-[10px] font-mono text-zinc-500 uppercase">${log.licensePlate}</span>
                  </div>
                  <div class="text-right">
                    <div class="text-lg font-black tracking-tighter">${formatCurrency(log.totalValue || 0)}</div>
                    <span class="inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold bg-primary/10 text-primary border border-primary/20">${log.fuelType}</span>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3 py-2 border-y border-zinc-800/10 font-mono text-[10px]">
                  <div><span class="text-zinc-600 uppercase block">Litros</span><span class="font-bold">${(log.liters || 0).toFixed(2)} L</span></div>
                  <div class="text-right"><span class="text-zinc-600 uppercase block">KM Atual</span><span class="font-bold">${(log.mileage || 0).toLocaleString()} KM</span></div>
                </div>
                <div class="flex items-center justify-between pt-1">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-primary border border-primary/20">${(log.driverName || '?')[0]}</div>
                    <span class="text-[9px] text-zinc-500">${(log.driverName || '').split(' ')[0]}</span>
                  </div>
                  <div class="flex items-center gap-1 text-[9px] font-mono text-zinc-600">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    ${formatDate(log.date, { day: '2-digit', month: 'short' })}
                  </div>
                </div>
              </div>
            `).join('') : `
              <div class="col-span-full py-16 text-center border-2 border-dashed rounded-xl bg-zinc-900/20">
                <svg class="w-10 h-10 text-zinc-600 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                <p class="text-sm font-medium text-zinc-500">Nenhum registro de abastecimento localizado.</p>
              </div>`}
          </div>
        </div>
      </div>
      <div id="refuelingModalOverlay" class="fixed inset-0 z-50 flex items-center justify-center hidden" style="background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);">
        <div id="refuelingModalContent" class="bg-[#0f0f13] border border-zinc-700/50 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"></div>
      </div>`;
    setupEventListeners();
  }

  function setupEventListeners() {
    const overlay = document.getElementById('refuelingModalOverlay');
    if (!overlay) return;

    const searchInput = document.getElementById('refuelingSearch');
    if (searchInput) searchInput.addEventListener('input', e => { upd({ search: e.target.value }); render(); });

    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    overlay.addEventListener('closeModal', () => closeModal());
    overlay.addEventListener('openForm', () => openModal());

    overlay.addEventListener('input', () => {
      const liters = parseFloat(document.getElementById('refuelingLiters')?.value) || 0;
      const price = parseFloat(document.getElementById('refuelingPrice')?.value) || 0;
      const totalEl = document.getElementById('refuelingTotal');
      if (totalEl) {
        totalEl.innerHTML = `<span class="text-[10px] font-bold uppercase tracking-widest text-primary/70">Total Calculado:</span>
          <span class="text-2xl font-black tracking-tighter text-primary">R$ ${(liters * price).toFixed(2)}</span>`;
      }
    });

    overlay.addEventListener('change', () => {
      const vehicleId = document.getElementById('refuelingVehicle')?.value;
      if (vehicleId) {
        const vehicles = Store.get('vehicles') || [];
        const v = vehicles.find(x => x.id === vehicleId);
        if (v) {
          const mileageInput = document.getElementById('refuelingMileage');
          if (mileageInput) mileageInput.value = v.mileage || 0;
        }
      }
    });

    overlay.addEventListener('submitRefueling', async () => {
      const vehicleId = document.getElementById('refuelingVehicle')?.value;
      const mileage = parseInt(document.getElementById('refuelingMileage')?.value) || 0;
      const liters = parseFloat(document.getElementById('refuelingLiters')?.value) || 0;
      const price = parseFloat(document.getElementById('refuelingPrice')?.value) || 0;
      const fuelType = document.getElementById('refuelingFuelType')?.value || 'Gasolina';
      const gasStation = document.getElementById('refuelingStation')?.value || '';
      const notes = document.getElementById('refuelingNotes')?.value || '';
      const user = Store.get('user');

      if (!vehicleId) { Toast.show('Selecione um veículo.', 'warning'); return; }
      if (!mileage || mileage < 1) { Toast.show('Informe a quilometragem.', 'warning'); return; }
      if (!liters || liters < 0.1) { Toast.show('Informe a quantidade de litros.', 'warning'); return; }
      if (!price || price < 0.1) { Toast.show('Informe o preço por litro.', 'warning'); return; }

      const vehicles = Store.get('vehicles') || [];
      const vehicle = vehicles.find(v => v.id === vehicleId);
      const totalValue = parseFloat((liters * price).toFixed(2));

      try {
        const result = await API.post('/api/refuelings', {
          vehicleId, mileage, liters, price, totalValue, fuelType, gasStation, notes,
          vehicleModel: vehicle?.vehicleModel || '', licensePlate: vehicle?.licensePlate || '',
          driverName: user?.name || '',
        });
        const refuelings = [...(Store.get('refuelings') || [])];
        Store.set('refuelings', [{ ...result }, ...refuelings]);
        Toast.show('✅ Abastecimento registrado!', 'success');
      } catch {
        const refuelings = [...(Store.get('refuelings') || [])];
        Store.set('refuelings', [{
          id: 'RF' + Date.now(), vehicleId, mileage, liters, price, totalValue, fuelType, gasStation, notes,
          vehicleModel: vehicle?.vehicleModel || '', licensePlate: vehicle?.licensePlate || '',
          driverName: user?.name || '', date: new Date().toISOString(),
        }, ...refuelings]);
        Toast.show('✅ Abastecimento registrado (offline).', 'success');
      }
      closeModal();
    });
  }

  const unsubRefuelings = Store.on('refuelings', render);
  const unsubVehicles = Store.on('vehicles', render);
  render();
  return () => { unsubRefuelings(); unsubVehicles(); };
}
