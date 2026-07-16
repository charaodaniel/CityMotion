/**
 * CityMotion — Veículos: Renderizadores de Modais (HTML puro)
 */

/**
 * Renderiza modal de detalhes do veículo
 */
export function renderDetailsModal(vehicle, getStatusStyles) {
  if (!vehicle) return '';
  const v = vehicle;

  return `
    <div class="h-1.5 w-full bg-[#93c5fd]"></div>
    <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-black tracking-tight">NEX-${(v.id || '').replace(/\D/g, '').padStart(3, '0')}</h2>
          <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">Telemetria central da unidade</p>
        </div>
        <button onclick="document.getElementById('veiculosModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30 space-y-6">
        <div class="grid grid-cols-2 gap-8">
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Modelo</p>
            <p class="text-lg font-bold">${v.vehicleModel}</p>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Placa</p>
            <p class="text-lg font-mono font-bold text-primary">${v.licensePlate}</p>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Setor Alocado</p>
            <p class="text-sm font-bold">${v.sector}</p>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Distância Total</p>
            <p class="text-sm font-mono">${(v.mileage || 0).toLocaleString('pt-BR')} KM</p>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Status</p>
            <div class="mt-1">
              <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold uppercase tracking-tight ${getStatusStyles(v.status)}">
                <span class="w-1.5 h-1.5 rounded-full ${v.status === 'Em Viagem' ? 'animate-pulse bg-primary' : v.status === 'Disponível' ? 'bg-emerald-400' : v.status === 'Manutenção' ? 'bg-destructive' : 'bg-zinc-400'}"></span>
                ${v.status}
              </span>
            </div>
          </div>
        </div>
        <div class="border-t border-zinc-800/30"></div>
        <div class="flex justify-end gap-3">
          <button onclick="document.getElementById('veiculosModalOverlay').dispatchEvent(new CustomEvent('openMaintenance', {detail: '${v.id}'}))" class="btn btn-ghost btn-sm text-[10px]">
            <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            Abrir Manutenção
          </button>
          <button onclick="document.getElementById('veiculosModalOverlay').dispatchEvent(new CustomEvent('openEdit', {detail: '${v.id}'}))" class="btn btn-primary btn-sm text-[10px]">
            <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            Editar Unidade
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderiza modal de formulário (registro/edição)
 */
export function renderFormModal(isEdit, formData, sectors) {
  const fd = formData;
  const sectorOptions = sectors.length > 0
    ? sectors.map(s => `<option value="${s.name}" ${fd.sector === s.name ? 'selected' : ''}>${s.name}</option>`).join('')
    : `
      <option value="Secretaria de Saúde" ${fd.sector === 'Secretaria de Saúde' ? 'selected' : ''}>Secretaria de Saúde</option>
      <option value="Secretaria de Educação" ${fd.sector === 'Secretaria de Educação' ? 'selected' : ''}>Secretaria de Educação</option>
      <option value="Secretaria de Obras" ${fd.sector === 'Secretaria de Obras' ? 'selected' : ''}>Secretaria de Obras</option>
      <option value="Administração" ${fd.sector === 'Administração' ? 'selected' : ''}>Administração</option>
      <option value="Vigilância Sanitária" ${fd.sector === 'Vigilância Sanitária' ? 'selected' : ''}>Vigilância Sanitária</option>
    `;

  return `
    <div class="h-1.5 w-full bg-[#93c5fd]"></div>
    <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-black tracking-tight">${isEdit ? 'Atualizar Unidade' : 'Novo Protocolo Veicular'}</h2>
          <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">${isEdit ? 'Acessando parâmetros centrais' : 'Executando registro FSP-v3'}</p>
        </div>
        <button onclick="document.getElementById('veiculosModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30">
        <form id="vehicleForm" class="space-y-6">
          <div>
            <h3 class="text-sm font-bold mb-4 text-zinc-300">Informações do Veículo</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Modelo do Veículo</label>
                <input type="text" name="vehicleModel" value="${fd.vehicleModel}" placeholder="Ex: Fiat Strada 2023" required minlength="3" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Placa do Veículo</label>
                <input type="text" name="licensePlate" value="${fd.licensePlate}" placeholder="ABC-1234" required minlength="7" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm uppercase focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Setor Responsável</label>
                <select name="sector" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                  <option value="">Selecione o setor</option>
                  ${sectorOptions}
                </select>
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Quilometragem (KM)</label>
                <input type="number" name="mileage" value="${fd.mileage}" min="0" placeholder="0" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
              </div>
            </div>
          </div>
          <div class="border-t border-zinc-800/30"></div>
          <div>
            <h3 class="text-sm font-bold mb-4 text-zinc-300">Documentação</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">CRLV do Veículo</label>
                <input type="file" accept="image/*,application/pdf" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Certificado de Inspeção</label>
                <input type="file" accept="image/*,application/pdf" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
              </div>
            </div>
          </div>
          <div class="flex justify-end pt-2">
            <button type="button" onclick="document.getElementById('veiculosModalOverlay').dispatchEvent(new CustomEvent('submitVehicleForm'))" class="btn btn-primary h-11 px-10 text-[10px] font-black uppercase tracking-[0.2em]">
              ${isEdit ? 'Salvar Alterações' : 'Enviar Cadastro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
