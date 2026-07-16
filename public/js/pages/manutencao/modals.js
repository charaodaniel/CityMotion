/**
 * CityMotion — Manutenção: Renderizadores de Modal (HTML puro)
 */
import { formatDate } from '/js/format-utils.js';

export function getStatusVariant(status) {
  const map = { Pendente: 'badge-secondary', 'Em Andamento': 'badge-default', Concluída: 'badge-outline' };
  return map[status] || 'badge-outline';
}

export function getKanbanColumns() {
  return [
    { title: 'Pendentes', status: 'Pendente', icon: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
    { title: 'Em Andamento', status: 'Em Andamento', icon: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' },
    { title: 'Concluídas', status: 'Concluída', icon: '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
  ];
}

export function renderDetailsModal(req, formatDate, isAdmin) {
  return `
    <div class="h-1.5 w-full bg-[#93c5fd]"></div>
    <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl sm:text-3xl font-black tracking-tight">${req.vehicleModel} (${req.licensePlate})</h2>
          <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">Protocolo MNT-${(req.id || '').replace(/\D/g, '')} // Solicitado em ${formatDate(req.requestDate)}</p>
        </div>
        <button onclick="document.getElementById('manutencaoModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30 space-y-5">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status Atual</span>
          <div class="mt-1"><span class="${getStatusVariant(req.status)} text-[10px] font-bold uppercase tracking-tight">${req.status}</span></div>
        </div>
        <div class="border-t border-zinc-800/30"></div>
        <div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tipo de Manutenção</span>
          <p class="text-base font-bold mt-1">${req.type}</p>
        </div>
        <div class="border-t border-zinc-800/30"></div>
        <div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Descrição do Diagnóstico</span>
          <p class="text-sm mt-2 p-4 bg-black/40 rounded-md font-mono leading-relaxed text-zinc-300 border border-zinc-800/30">${req.description}</p>
        </div>
        ${req.requesterName ? `
          <div class="border-t border-zinc-800/30"></div>
          <div class="flex items-center gap-2 text-[10px] text-zinc-500">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <span>Solicitante: <strong class="text-zinc-300">${req.requesterName}</strong></span>
          </div>` : ''}
        ${isAdmin ? `
          <div class="border-t border-zinc-800/30"></div>
          <div>
            <h3 class="text-xs font-black uppercase tracking-widest mb-4 text-primary">Ações de Oficina</h3>
            <div class="flex flex-wrap gap-3">
              ${req.status === 'Pendente' ? `
                <button onclick="document.getElementById('manutencaoModalOverlay').dispatchEvent(new CustomEvent('updateStatus', {detail: 'Em Andamento'}))" class="btn btn-primary text-[10px] h-10 px-4">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  Iniciar Protocolo
                </button>` : ''}
              ${req.status === 'Em Andamento' ? `
                <button onclick="document.getElementById('manutencaoModalOverlay').dispatchEvent(new CustomEvent('updateStatus', {detail: 'Concluída'}))" class="btn bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] h-10 px-4">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Finalizar Reparo
                </button>
                <button onclick="document.getElementById('manutencaoModalOverlay').dispatchEvent(new CustomEvent('openPartModal'))" class="btn btn-outline text-[10px] h-10 px-4">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
                  Solicitar Peças
                </button>` : ''}
              ${req.status === 'Concluída' ? `
                <button onclick="document.getElementById('manutencaoModalOverlay').dispatchEvent(new CustomEvent('updateStatus', {detail: 'Pendente'}))" class="btn btn-ghost text-[10px]">Reabrir Chamado</button>` : ''}
            </div>
          </div>` : ''}
      </div>
    </div>`;
}

export function renderPartModal(request, form) {
  return `
    <div class="h-1.5 w-full bg-[#93c5fd]"></div>
    <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-black tracking-tight flex items-center gap-2">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
            Pedido de Peças
          </h2>
          <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">MNT-REF: ${request?.vehicleModel || ''} // ${request?.licensePlate || ''}</p>
        </div>
        <button onclick="document.getElementById('manutencaoModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30">
        <form id="partForm" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nome da Peça / Componente</label>
              <input type="text" id="partName" value="${form.partName}" placeholder="Ex: Pastilha de freio dianteira" required minlength="3" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Quantidade</label>
              <input type="number" id="partQuantity" value="${form.quantity}" min="1" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Fornecedor (Opcional)</label>
            <input type="text" id="partSupplier" value="${form.supplier}" placeholder="Ex: Autopeças do Bairro" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Justificativa da Necessidade</label>
            <textarea id="partJustification" rows="4" placeholder="Descreva por que esta peça é essencial para conclusão da manutenção." class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs resize-none focus:outline-none focus:border-primary/50">${form.justification}</textarea>
          </div>
          <button type="button" onclick="document.getElementById('manutencaoModalOverlay').dispatchEvent(new CustomEvent('submitPartRequest'))" class="btn btn-primary w-full h-10 text-[10px] font-bold uppercase tracking-widest">
            Enviar Pedido de Compra
          </button>
        </form>
      </div>
    </div>`;
}
