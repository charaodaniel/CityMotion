/**
 * CityMotion — Viagens: Renderizadores de Modais (HTML puro)
 *
 * Todas as funções recebem dados e retornam HTML string.
 * Nenhuma depende de estado global — recebem tudo por parâmetro.
 */
import { CHECKLIST_START, CHECKLIST_END } from './data.js';

/**
 * Renderiza modal de detalhes da viagem
 */
export function renderDetailsModal(schedule, getStatusLabel) {
  if (!schedule) return '';
  const s = schedule;
  return `
    <div class="h-1.5 w-full bg-[#93c5fd]"></div>
    <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-black tracking-tight">${s.title}</h2>
          <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">Visualizando telemetria de missão</p>
        </div>
        <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30 space-y-5">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</span>
          <div class="mt-1">
            <span class="badge badge-${getStatusLabel(s.status)} text-[10px] font-bold uppercase tracking-tight">${s.status}</span>
          </div>
        </div>
        <div class="border-t border-zinc-800/30 my-2"></div>
        <div class="grid grid-cols-2 gap-6">
          <div><p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Motorista</p><p class="text-sm font-bold">${s.driver}</p></div>
          <div><p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Veículo</p><p class="text-sm font-bold">${s.vehicle}</p></div>
          <div><p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Origem</p><p class="text-sm font-bold">${s.origin}</p></div>
          <div><p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Destino</p><p class="text-sm font-bold">${s.destination}</p></div>
          <div><p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Partida</p><p class="text-sm font-bold">${s.departureTime}</p></div>
          ${s.arrivalTime ? `<div><p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Chegada</p><p class="text-sm font-bold">${s.arrivalTime}</p></div>` : ''}
          ${s.category ? `<div class="col-span-2"><p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Categoria</p><p class="text-sm font-bold">${s.category}</p></div>` : ''}
        </div>
        <div class="border-t border-zinc-800/30 my-2"></div>
        <div class="flex justify-end gap-3">
          ${s.status === 'Agendada' ? `
            <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('openChecklist', {detail: '${s.id}'}))" class="btn btn-primary text-[10px] h-10 px-6">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              Executar Checklist
            </button>
          ` : ''}
          ${s.status === 'Em Andamento' ? `
            <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('openIncident', {detail: '${s.id}'}))" class="btn btn-destructive text-[10px] h-10 px-6">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
              Relatar Sinistro
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderiza modal de checklist (partida ou chegada)
 */
export function renderChecklistModal(schedule, type, mileage, notes) {
  if (!schedule) return '';
  const items = type === 'start' ? CHECKLIST_START : CHECKLIST_END;
  const isStart = type === 'start';
  const title = isStart ? 'Checklist de Partida' : 'Checklist de Chegada';
  const topColor = isStart ? 'bg-[#93c5fd]' : 'bg-emerald-500';
  const icon = isStart
    ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>'
    : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';
  const btnClass = isStart ? 'btn btn-primary' : 'btn bg-emerald-600 hover:bg-emerald-500 text-white';
  const btnLabel = isStart ? 'Iniciar Missão' : 'Finalizar Viagem';

  return `
    <div class="h-1.5 w-full ${topColor}"></div>
    <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <span class="text-primary">${icon}</span>
          <div>
            <h2 class="text-2xl font-black tracking-tight">${title}</h2>
            <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">${schedule.title}</p>
          </div>
        </div>
        <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30 space-y-5">
        ${isStart
          ? `<div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">KM do Hodômetro</label>
              <input type="number" id="checklistMileage" value="${mileage}" placeholder="KM atual" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div class="border-t border-zinc-800/30"></div>`
          : `<input type="hidden" id="checklistMileage" value="${mileage}" />`
        }
        <div>
          <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Itens de Verificação</p>
          <div class="space-y-2" id="checklistItems">
            ${items.map((item, i) => `
              <label class="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-800/30 cursor-pointer transition-colors">
                <input type="checkbox" data-index="${i}" class="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-primary focus:ring-primary/30" />
                <span class="text-xs text-zinc-400">${item}</span>
              </label>
            `).join('')}
          </div>
        </div>
        <div>
          <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Observações</label>
          <textarea id="checklistNotes" rows="3" placeholder="Observações adicionais..." class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs resize-none focus:outline-none focus:border-primary/50">${notes}</textarea>
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="btn btn-ghost text-[10px] h-10 px-5">Cancelar</button>
          <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('confirmChecklist', {detail: '${type}'}))" class="${btnClass} text-[10px] h-10 px-6">
            ${btnLabel}
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderiza modal de sinistro
 */
export function renderIncidentModal(schedule, incidentData) {
  if (!schedule) return '';
  const inc = incidentData;
  return `
    <div class="h-1.5 w-full bg-red-500"></div>
    <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-black tracking-tight text-red-400">Relatório de Sinistro</h2>
          <p class="text-[10px] font-mono uppercase tracking-widest text-red-400/70 mt-1">Protocolo de incidente crítico</p>
        </div>
        <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="scanlines rounded-lg border border-red-500/30 p-6 bg-red-500/5 space-y-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Data e Hora do Incidente</label>
            <input type="datetime-local" id="incidentDate" value="${inc.incidentDate}" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-red-500/50" />
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Localização</label>
            <input type="text" id="incidentLocation" value="${inc.location}" placeholder="Ex: Av. Brasil com Rua das Flores" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-red-500/50" />
          </div>
        </div>
        <div>
          <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Descrição Detalhada do Ocorrido</label>
          <textarea id="incidentDescription" rows="5" placeholder="Descreva o que aconteceu, os danos, se há terceiros envolvidos, etc." class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs resize-none focus:outline-none focus:border-red-500/50">${inc.description}</textarea>
        </div>
        <div>
          <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Anexar Fotos</label>
          <input type="file" id="incidentPhotos" accept="image/*" multiple class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-red-500/20 file:text-red-400 hover:file:bg-red-500/30" />
        </div>
        <div class="border-t border-red-500/20 my-2"></div>
        <div class="flex justify-end">
          <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('submitIncident'))" class="btn btn-destructive text-[10px] h-11 px-8">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
            Enviar Relatório de Sinistro
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderiza modal de formulário de agendamento
 */
export function renderScheduleFormModal(formData, employees, vehicles, sectors) {
  const drivers = employees.filter((e) => e.role === 'Motorista');
  const fd = formData;

  return `
    <div class="h-1.5 w-full bg-[#93c5fd]"></div>
    <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-black tracking-tight">Novo Protocolo de Viagem</h2>
          <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">Executando agendamento logístico V3</p>
        </div>
        <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30 space-y-6">
        <form id="scheduleTripForm">
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Título da Viagem</label>
            <input type="text" name="title" value="${fd.title}" placeholder="Ex: Transporte de equipe para evento" required minlength="5" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
          </div>
          <div class="border-t border-zinc-800/30"></div>
          <div>
            <p class="text-sm font-bold mb-4 text-zinc-300">Detalhes da Viagem</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Setor Solicitante</label>
                <select name="sector" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" onchange="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('sectorChange', {detail: this.value}))">
                  <option value="">Selecione o setor</option>
                  ${sectors.map((sec) =>
                    `<option value="${sec.name}" ${fd.sector === sec.name ? 'selected' : ''}>${sec.name}</option>`
                  ).join('')}
                </select>
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Categoria</label>
                <select name="category" id="formCategory" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                  <option value="">${fd.sector ? 'Selecione a categoria' : 'Selecione um setor primeiro'}</option>
                </select>
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Motorista Responsável</label>
                <select name="driver" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                  <option value="">Selecione o motorista</option>
                  ${drivers.map((d) =>
                    `<option value="${d.name}" ${fd.driver === d.name ? 'selected' : ''}>${d.name}</option>`
                  ).join('')}
                </select>
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Veículo Designado</label>
                <select name="vehicle" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                  <option value="">Selecione o veículo</option>
                  ${vehicles.map((v) =>
                    `<option value="${v.vehicleModel} (${v.licensePlate})" ${fd.vehicle === `${v.vehicleModel} (${v.licensePlate})` ? 'selected' : ''}>${v.vehicleModel} (${v.licensePlate})</option>`
                  ).join('')}
                </select>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Data de Partida</label>
              <input type="date" name="departureDate" value="${fd.departureDate}" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Horário de Partida</label>
              <input type="time" name="departureTime" value="${fd.departureTime}" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Origem</label>
              <input type="text" name="origin" value="${fd.origin}" placeholder="Local de partida" required minlength="3" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Destino</label>
              <input type="text" name="destination" value="${fd.destination}" placeholder="Local de chegada" required minlength="3" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div class="border-t border-zinc-800/30"></div>
          <!-- Passageiros -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <p class="text-sm font-bold text-zinc-300">Passageiros</p>
              <button type="button" onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('addPassenger'))" class="btn btn-ghost btn-sm text-[10px]">
                <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                Adicionar
              </button>
            </div>
            <div id="passengersList" class="space-y-2">
              ${fd.passengers.length === 0
                ? '<p class="text-xs text-zinc-600 text-center py-4 border border-dashed rounded-md italic">Nenhum passageiro adicionado.</p>'
                : fd.passengers.map((p, i) => `
                  <div class="flex items-center gap-3 p-3 border border-zinc-700/50 rounded-md bg-black/20" data-passenger-index="${i}">
                    <div class="grid grid-cols-2 gap-3 flex-1">
                      <div>
                        <label class="text-[9px] uppercase font-bold text-zinc-500">Nome</label>
                        <input type="text" value="${p.name}" placeholder="Nome completo" class="passenger-name w-full mt-0.5 px-2 py-1.5 bg-zinc-900 border border-zinc-700/50 rounded text-xs focus:outline-none focus:border-primary/50" />
                      </div>
                      <div>
                        <label class="text-[9px] uppercase font-bold text-zinc-500">CPF/RG</label>
                        <input type="text" value="${p.document}" placeholder="Número" class="passenger-doc w-full mt-0.5 px-2 py-1.5 bg-zinc-900 border border-zinc-700/50 rounded text-xs focus:outline-none focus:border-primary/50" />
                      </div>
                    </div>
                    <button type="button" onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('removePassenger', {detail: ${i}}))" class="text-red-400 hover:text-red-300 p-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                `).join('')
              }
            </div>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Motivo/Descrição</label>
            <textarea name="description" rows="4" placeholder="Descreva o motivo da viagem, pessoas envolvidas ou outras informações relevantes." class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs resize-none focus:outline-none focus:border-primary/50">${fd.description}</textarea>
          </div>
          <div class="flex justify-end pt-2">
            <button type="button" onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('submitScheduleForm'))" class="btn btn-primary h-11 px-10 text-[10px] font-black uppercase tracking-[0.2em]">
              Confirmar Missão
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
