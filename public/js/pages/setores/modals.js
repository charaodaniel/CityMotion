/**
 * CityMotion — Setores: Renderizadores de Modal (HTML puro)
 */

export function renderDetailsModal(sector, empCount, vehCount) {
  return `
    <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-2xl font-black tracking-tight">${sector.name}</h2>
          <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">${sector.description || 'Sem descrição'}</p>
        </div>
        <button onclick="document.getElementById('setoresModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="flex justify-end mb-4">
        <button onclick="document.getElementById('setoresModalOverlay').dispatchEvent(new CustomEvent('openEdit', {detail: '${sector.id}'}))" class="btn btn-outline btn-sm text-[10px]">
          <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
          Editar
        </button>
      </div>
      <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30 space-y-6">
        <div>
          <h3 class="text-sm font-bold mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/></svg>
            Funcionários Vinculados (${empCount})
          </h3>
          <div id="sectorEmployees"></div>
        </div>
        <div class="border-t border-zinc-800/30"></div>
        <div>
          <h3 class="text-sm font-bold mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Veículos Vinculados (${vehCount})
          </h3>
          <div id="sectorVehicles"></div>
        </div>
      </div>
    </div>`;
}

export function renderEmployeesTable(employees) {
  if (employees.length === 0) return '<p class="text-xs text-zinc-600 italic">Nenhum funcionário vinculado a este setor.</p>';
  return `
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
    </div>`;
}

export function renderVehiclesTable(vehicles) {
  if (vehicles.length === 0) return '<p class="text-xs text-zinc-600 italic">Nenhum veículo vinculado a este setor.</p>';
  return `
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
    </div>`;
}

export function renderFormModal(isEdit, formData) {
  const fd = formData;
  return `
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
