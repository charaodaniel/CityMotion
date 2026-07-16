/**
 * CityMotion — Abastecimento: Renderizador de Modal (HTML puro)
 */

/**
 * Renderiza modal de formulário de abastecimento
 */
export function renderRefuelingForm(vehicles, formData) {
  const fd = formData;
  const total = (fd.liters * fd.price).toFixed(2);

  return `
    <div class="h-1.5 w-full bg-[#93c5fd]"></div>
    <div class="p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-black tracking-tight">Novo Registro de Combustível</h2>
          <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">Protocolo de suprimento logístico</p>
        </div>
        <button onclick="document.getElementById('refuelingModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30">
        <form id="refuelingForm" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Veículo</label>
              <select id="refuelingVehicle" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                <option value="">Selecione o veículo</option>
                ${vehicles.map(v => `<option value="${v.id}" ${fd.vehicleId === v.id ? 'selected' : ''}>${v.vehicleModel} (${v.licensePlate})</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tipo de Combustível</label>
              <select id="refuelingFuelType" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                ${['Gasolina', 'Etanol', 'Diesel', 'GNV', 'Arla 32'].map(f => `<option value="${f}" ${fd.fuelType === f ? 'selected' : ''}>${f}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Odômetro (KM)</label>
              <input type="number" id="refuelingMileage" value="${fd.mileage}" min="1" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Litros</label>
              <input type="number" id="refuelingLiters" value="${fd.liters}" step="0.01" min="0.1" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Preço / Litro</label>
              <input type="number" id="refuelingPrice" value="${fd.price}" step="0.01" min="0.1" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div id="refuelingTotal" class="p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between">
            <span class="text-[10px] font-bold uppercase tracking-widest text-primary/70">Total Calculado:</span>
            <span class="text-2xl font-black tracking-tighter text-primary">R$ ${total}</span>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Posto / Fornecedor</label>
            <input type="text" id="refuelingStation" value="${fd.gasStation}" placeholder="Ex: Posto Central Shell" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Observações</label>
            <textarea id="refuelingNotes" rows="3" placeholder="Observações adicionais..." class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs resize-none focus:outline-none focus:border-primary/50">${fd.notes}</textarea>
          </div>
          <button type="button" onclick="document.getElementById('refuelingModalOverlay').dispatchEvent(new CustomEvent('submitRefueling'))" class="btn btn-primary w-full h-12 text-[10px] font-black uppercase tracking-[0.2em]">
            Confirmar Registro de Abastecimento
          </button>
        </form>
      </div>
    </div>`;
}
