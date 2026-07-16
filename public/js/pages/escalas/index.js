/**
 * CityMotion — Página: Escalas de Funcionários
 *
 * Módulos:
 *   ./modals.js → Renderizadores de modais (HTML puro)
 */
import { renderDetailsModal, renderFormModal } from './modals.js';

export default function SchedulesPage(container, Store, API) {
  let state = {
    isModalOpen: false,
    selectedSchedule: null,
    formData: {
      title: '', employee: '', scheduleType: '', startDate: '', endDate: '',
      description: '', repetition: 'none', repeatUntil: '', daysOfWeek: [],
    },
    isFormModalOpen: false,
  };

  let _cardDelegate = null;

  function upd(partial) { state = { ...state, ...partial }; }

  function getStatusVariant(s) {
    const m = { Agendada: 'badge-secondary', 'Em Andamento': 'badge-default', Concluída: 'badge-outline' };
    return m[s] || 'badge-outline';
  }

  function openModal(schedule) {
    upd({ selectedSchedule: schedule, isModalOpen: true });
    renderModal();
  }

  function closeModal() {
    upd({ selectedSchedule: null, isModalOpen: false, isFormModalOpen: false });
    renderModal();
  }

  function openForm() {
    upd({
      isFormModalOpen: true,
      formData: { title: '', employee: '', scheduleType: '', startDate: '', endDate: '', description: '', repetition: 'none', repeatUntil: '', daysOfWeek: [] },
    });
    renderModal();
  }

  function renderModal() {
    const overlay = document.getElementById('escalasModalOverlay');
    const content = document.getElementById('escalasModalContent');
    if (!overlay || !content) return;
    if (!state.isModalOpen && !state.isFormModalOpen) { overlay.classList.add('hidden'); return; }
    overlay.classList.remove('hidden');

    if (state.isFormModalOpen) {
      const employees = (Store.get('employees') || []).filter(e => e.status !== 'Desativado');
      content.innerHTML = renderFormModal(state.formData, employees);
    } else if (state.selectedSchedule) {
      content.innerHTML = renderDetailsModal(state.selectedSchedule, getStatusVariant);
    }
  }

  function handleFormSubmit(data) {
    const schedules = [...(Store.get('workSchedules') || [])];
    const newSchedule = { id: 'WS' + Date.now(), ...data, status: 'Agendada' };
    Store.set('workSchedules', [...schedules, newSchedule]);
    closeModal();
  }

  function render() {
    const schedules = Store.get('workSchedules') || [];

    container.innerHTML = `
      <div class="animate-fade-in space-y-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 class="text-3xl sm:text-4xl font-black tracking-tighter flex items-center gap-3">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Escalas de Funcionários
            </h1>
            <p class="text-zinc-400 text-sm mt-1 font-medium">Gestão de plantões e jornadas.</p>
          </div>
          <button onclick="document.getElementById('escalasModalOverlay').dispatchEvent(new CustomEvent('openForm'))" class="btn btn-primary btn-sm text-[10px]">
            <svg class="w-3.5 h-3.5 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
            Criar Nova Escala
          </button>
        </div>
        ${schedules.length > 0 ? `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          ${schedules.map(s => `
            <div class="nexus-card p-0 overflow-hidden cursor-pointer hover:border-primary/50 transition-all" data-schedule-id="${s.id}">
              <div class="p-5">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-4 h-4 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  <h3 class="text-sm font-bold truncate text-zinc-200">${s.title}</h3>
                </div>
                <span class="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">${s.type}</span>
              </div>
              <div class="px-5 pb-4 space-y-2 text-xs text-zinc-500">
                <div class="flex items-center gap-2"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg><span>${s.employee}</span></div>
                <div class="flex items-center gap-2"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><span>${s.startDate} — ${s.endDate}</span></div>
              </div>
              <div class="border-t border-zinc-800/10 px-5 py-2.5 bg-black/20">
                <span class="${getStatusVariant(s.status)} text-[9px] font-bold uppercase tracking-tight">${s.status}</span>
              </div>
            </div>
          `).join('')}
        </div>` : `
        <div class="text-center py-16 border-2 border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
          <p class="text-lg italic text-zinc-500">Nenhuma escala agendada.</p>
          <button onclick="document.getElementById('escalasModalOverlay').dispatchEvent(new CustomEvent('openForm'))" class="mt-3 text-primary font-bold uppercase tracking-widest text-xs hover:underline">Criar agora</button>
        </div>`}
      </div>
      <div id="escalasModalOverlay" class="fixed inset-0 z-50 flex items-center justify-center hidden" style="background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);">
        <div id="escalasModalContent" class="bg-[#0f0f13] border border-zinc-700/50 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden"></div>
      </div>`;
    setupEventListeners();
  }

  function setupEventListeners() {
    const overlay = document.getElementById('escalasModalOverlay');
    if (!overlay) return;

    // Delegacia de eventos nos cards (única vez)
    if (!_cardDelegate) {
      _cardDelegate = (e) => {
        const card = e.target.closest('[data-schedule-id]');
        if (card && !e.target.closest('button')) {
          const schedules = Store.get('workSchedules') || [];
          const s = schedules.find(x => x.id === card.dataset.scheduleId);
          if (s) openModal(s);
        }
      };
      container.addEventListener('click', _cardDelegate);
    }

    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    overlay.addEventListener('closeModal', () => closeModal());
    overlay.addEventListener('openForm', () => openForm());

    overlay.addEventListener('updateRepetition', (e) => {
      const fd = state.formData;
      const form = document.getElementById('scheduleForm');
      if (!form) { upd({ formData: { ...fd, repetition: e.detail } }); renderModal(); return; }
      const data = new FormData(form);
      upd({
        formData: {
          title: data.get('title') || '', employee: data.get('employee') || '',
          scheduleType: data.get('scheduleType') || '', startDate: data.get('startDate') || '',
          endDate: data.get('endDate') || '', description: data.get('description') || '',
          repetition: e.detail, repeatUntil: data.get('repeatUntil') || '',
          daysOfWeek: Array.from(form.querySelectorAll('#daysOfWeekCheckboxes input:checked')).map(cb => cb.value),
        }
      });
      renderModal();
    });

    overlay.addEventListener('submitSchedule', () => {
      const form = document.getElementById('scheduleForm');
      if (!form) return;
      const data = new FormData(form);
      const title = (data.get('title') || '').trim();
      const employee = data.get('employee') || '';
      const scheduleType = data.get('scheduleType') || '';
      const startDate = data.get('startDate') || '';
      const endDate = data.get('endDate') || '';
      const description = (data.get('description') || '').trim();
      const repetition = data.get('repetition') || 'none';

      if (!title || title.length < 5) { Toast.show('O título deve ter pelo menos 5 caracteres.', 'warning'); return; }
      if (!employee) { Toast.show('Selecione um funcionário.', 'warning'); return; }
      if (!scheduleType) { Toast.show('Selecione o tipo de escala.', 'warning'); return; }
      if (!startDate) { Toast.show('Informe a data de início.', 'warning'); return; }
      if (!endDate) { Toast.show('Informe a data de fim.', 'warning'); return; }

      const repeatUntil = data.get('repeatUntil') || '';
      const daysOfWeek = Array.from(form.querySelectorAll('#daysOfWeekCheckboxes input:checked')).map(cb => cb.value);
      handleFormSubmit({ title, employee, type: scheduleType, startDate, endDate, description, repetition, repeatUntil, daysOfWeek });
    });
  }

  const unsub = Store.on('workSchedules', render);
  render();
  return () => { unsub(); };
}
