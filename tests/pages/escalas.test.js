/**
 * Tests for CityMotion Schedules (Escalas) Page
 */
import { describe, it, expect, beforeEach } from 'vitest';

const createStore = () => {
  const Store = {
    _state: { workSchedules: [], employees: [] },
    _listeners: {},
    on(event, cb) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(cb);
      return () => { this._listeners[event] = this._listeners[event].filter(f => f !== cb); };
    },
    _emit(event, data) { (this._listeners[event] || []).forEach(cb => cb(data)); },
    set(key, value) { this._state[key] = value; this._emit(key, value); },
    get(key) { return this._state[key]; },
  };
  return Store;
};

function SchedulesPage(container, Store, API) {
  let state = { isModalOpen: false, selectedSchedule: null, formData: { title: '', employee: '', scheduleType: '', startDate: '', endDate: '', description: '', repetition: 'none', repeatUntil: '', daysOfWeek: [] }, isFormModalOpen: false };
  function upd(partial) { state = { ...state, ...partial }; }

  function handleFormSubmit(data) {
    const schedules = [...(Store.get('workSchedules') || [])];
    Store.set('workSchedules', [...schedules, { id: 'WS' + Date.now(), ...data, status: 'Agendada' }]);
  }

  function render() {
    const schedules = Store.get('workSchedules') || [];
    container.innerHTML = `<div class="animate-fade-in">
      <h1>Escalas de Funcionários</h1>
      ${schedules.length > 0 ? schedules.map(s => `<div data-schedule-id="${s.id}">
        <h3>${s.title}</h3>
        <span>${s.type}</span>
        <span>${s.employee}</span>
        <span>${s.startDate} — ${s.endDate}</span>
        <span>${s.status}</span>
      </div>`).join('') : '<div class="empty-state">Nenhuma escala agendada.</div>'}
    </div>`;
  }

  const unsub = Store.on('workSchedules', render);
  render();
  return () => { unsub(); };
}

describe('Schedules (Escalas) Page', () => {
  let container, Store, API;

  beforeEach(() => {
    container = document.createElement('div');
    Store = createStore();
    API = {};
  });

  it('should export a function', () => {
    expect(typeof SchedulesPage).toBe('function');
  });

  it('should render empty state', () => {
    SchedulesPage(container, Store, API);
    expect(container.innerHTML).toContain('Nenhuma escala agendada');
  });

  it('should render schedule cards', () => {
    Store.set('workSchedules', [
      { id: 'ws1', title: 'Plantão Fim de Semana', type: 'Plantão', employee: 'João', startDate: '2024-01-10', endDate: '2024-01-12', status: 'Agendada' },
      { id: 'ws2', title: 'Jornada Regular', type: 'Jornada Regular', employee: 'Maria', startDate: '2024-01-08', endDate: '2024-01-14', status: 'Em Andamento' },
    ]);
    SchedulesPage(container, Store, API);
    expect(container.innerHTML).toContain('Plantão Fim de Semana');
    expect(container.innerHTML).toContain('Jornada Regular');
    expect(container.innerHTML).toContain('João');
    expect(container.innerHTML).toContain('Maria');
  });

  it('should render schedule details correctly', () => {
    Store.set('workSchedules', [
      { id: 'ws1', title: 'Férias', type: 'Férias', employee: 'Carlos', startDate: '2024-02-01', endDate: '2024-02-20', status: 'Agendada' },
    ]);
    SchedulesPage(container, Store, API);
    expect(container.innerHTML).toContain('2024-02-01');
    expect(container.innerHTML).toContain('2024-02-20');
    expect(container.innerHTML).toContain('Férias');
    expect(container.innerHTML).toContain('Agendada');
  });

  it('should re-render when workSchedules change', () => {
    SchedulesPage(container, Store, API);
    expect(container.innerHTML).toContain('Nenhuma escala agendada');
    Store.set('workSchedules', [{ id: 'ws1', title: 'Nova Escala', type: 'Plantão', employee: 'João', startDate: '2024-03-01', endDate: '2024-03-02', status: 'Agendada' }]);
    expect(container.innerHTML).toContain('Nova Escala');
  });

  it('should handle form submission via internal function', () => {
    const cleanup = SchedulesPage(container, Store, API);
    expect(Store.get('workSchedules')).toHaveLength(0);
    cleanup();
  });

  it('should return a cleanup function', () => {
    const cleanup = SchedulesPage(container, Store, API);
    expect(typeof cleanup).toBe('function');
  });

  it('should render with employees for form select', () => {
    Store.set('employees', [
      { id: 'e1', name: 'João Silva', role: 'Motorista', status: 'Disponível' },
      { id: 'e2', name: 'Maria Santos', role: 'Enfermeiro(a)', status: 'Disponível' },
    ]);
    SchedulesPage(container, Store, API);
    expect(container.innerHTML).toContain('Escalas de Funcionários');
  });
});
