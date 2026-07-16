/**
 * CityMotion — Escalas: Renderizadores de Modais (HTML puro)
 */

const scheduleTypes = ['Jornada Regular', 'Plantão', 'Sobreaviso', 'Folga', 'Férias', 'Hora Extra', 'Evento Especial'];
const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

/**
 * Renderiza modal de detalhes da escala
 */
export function renderDetailsModal(schedule, getStatusVariant) {
  if (!schedule) return '';
  const s = schedule;
  return `
    <div class="h-1.5 w-full bg-[#93c5fd]"></div>
    <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-black tracking-tight">${s.title}</h2>
        <button onclick="document.getElementById('escalasModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30 space-y-4">
        <div><span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tipo</span><p class="text-base font-bold mt-1">${s.type}</p></div>
        <div class="border-t border-zinc-800/30"></div>
        <div><span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Funcionário</span><p class="text-base font-bold mt-1">${s.employee}</p></div>
        <div class="border-t border-zinc-800/30"></div>
        <div><span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Período</span><p class="text-base font-bold mt-1">${s.startDate} — ${s.endDate}</p></div>
        <div class="border-t border-zinc-800/30"></div>
        <div><span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</span><div class="mt-1"><span class="${getStatusVariant(s.status)} text-[10px] font-bold">${s.status}</span></div></div>
        ${s.description ? `
        <div class="border-t border-zinc-800/30"></div>
        <div><span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Observações</span><p class="text-sm mt-1 text-zinc-400">${s.description}</p></div>` : ''}
      </div>
    </div>`;
}

/**
 * Renderiza modal de formulário de escala
 */
export function renderFormModal(formData, employees) {
  const fd = formData;

  return `
    <div class="h-1.5 w-full bg-[#93c5fd]"></div>
    <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-black tracking-tight">Agendamento de Escala</h2>
          <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">Criar novo protocolo de jornada</p>
        </div>
        <button onclick="document.getElementById('escalasModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30">
        <form id="scheduleForm" class="space-y-5">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Título da Escala</label>
              <input type="text" name="title" value="${fd.title}" placeholder="Ex: Plantão do Fim de Semana" required minlength="5" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Funcionário</label>
              <select name="employee" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                <option value="">Selecione</option>
                ${employees.map(e => `<option value="${e.name}" ${fd.employee === e.name ? 'selected' : ''}>${e.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tipo de Escala</label>
            <select name="scheduleType" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
              <option value="">Selecione o tipo</option>
              ${scheduleTypes.map(t => `<option value="${t}" ${fd.scheduleType === t ? 'selected' : ''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Data de Início</label>
              <input type="date" name="startDate" value="${fd.startDate}" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Data de Fim</label>
              <input type="date" name="endDate" value="${fd.endDate}" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div class="border-t border-zinc-800/30"></div>
          <div>
            <h3 class="text-sm font-bold mb-3 text-zinc-300">Recorrência</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Repetir</label>
                <select name="repetition" onchange="document.getElementById('escalasModalOverlay').dispatchEvent(new CustomEvent('updateRepetition', {detail: this.value}))" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                  <option value="none" ${fd.repetition === 'none' ? 'selected' : ''}>Não repetir</option>
                  <option value="daily" ${fd.repetition === 'daily' ? 'selected' : ''}>Diariamente</option>
                  <option value="weekly" ${fd.repetition === 'weekly' ? 'selected' : ''}>Semanalmente</option>
                  <option value="monthly" ${fd.repetition === 'monthly' ? 'selected' : ''}>Mensalmente</option>
                </select>
              </div>
              ${fd.repetition !== 'none' ? `
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Repetir até</label>
                <input type="date" name="repeatUntil" value="${fd.repeatUntil}" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
              </div>` : '<div></div>'}
            </div>
            ${fd.repetition === 'weekly' ? `
            <div class="mt-4">
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Dias da Semana</label>
              <div class="flex flex-wrap gap-3" id="daysOfWeekCheckboxes">
                ${weekdays.map(d => `
                  <label class="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" value="${d}" ${fd.daysOfWeek.includes(d) ? 'checked' : ''} class="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-primary focus:ring-primary/30" />
                    <span class="text-xs text-zinc-400">${d.slice(0, 3)}</span>
                  </label>
                `).join('')}
              </div>
            </div>` : ''}
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Observações</label>
            <textarea name="description" rows="3" placeholder="Adicione informações relevantes sobre a escala." class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs resize-none focus:outline-none focus:border-primary/50">${fd.description}</textarea>
          </div>
          <div class="flex justify-end pt-2">
            <button type="button" onclick="document.getElementById('escalasModalOverlay').dispatchEvent(new CustomEvent('submitSchedule'))" class="btn btn-primary h-11 px-10 text-[10px] font-black uppercase tracking-[0.2em]">Agendar Escala</button>
          </div>
        </form>
      </div>
    </div>`;
}
