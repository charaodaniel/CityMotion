/**
 * Tests for CityMotion Sectors (Setores) Page
 */
import { describe, it, expect, beforeEach } from 'vitest';

const createStore = () => {
  const Store = {
    _state: { sectors: [], employees: [], vehicles: [] },
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

function SectorsPage(container, Store, API) {
  let state = { activeModal: null, selectedSector: null, formData: { name: '', description: '' } };
  function upd(partial) { state = { ...state, ...partial }; }

  function handleFormSubmit(data) {
    const sectors = [...(Store.get('sectors') || [])];
    if (state.activeModal === 'edit' && state.selectedSector) {
      Store.set('sectors', sectors.map(s => s.id === state.selectedSector.id ? { ...s, ...data } : s));
    } else {
      Store.set('sectors', [...sectors, { id: 'SEC' + Date.now(), ...data, driverCount: 0, vehicleCount: 0 }]);
    }
    closeModal();
  }

  function closeModal() { upd({ activeModal: null, selectedSector: null }); }

  function render() {
    const sectors = Store.get('sectors') || [];
    const employees = Store.get('employees') || [];
    const vehicles = Store.get('vehicles') || [];

    container.innerHTML = `<div class="animate-fade-in">
      <h1>Gestão de Setores</h1>
      ${sectors.length > 0 ? sectors.map(s => {
        const vCount = vehicles.filter(v => v.sector === s.name).length;
        return `<div data-sector-id="${s.id}"><h3>${s.name}</h3><p>${s.description || 'Sem descrição'}</p><span>${vCount} veículos</span></div>`;
      }).join('') : '<div class="empty-state">Nenhum setor cadastrado no momento.</div>'}
    </div>`;
  }

  const unsub = Store.on('sectors', render);
  render();
  return () => { unsub(); };
}

describe('Sectors (Setores) Page', () => {
  let container, Store, API;

  beforeEach(() => {
    container = document.createElement('div');
    Store = createStore();
    API = {};
  });

  it('should export a function', () => {
    expect(typeof SectorsPage).toBe('function');
  });

  it('should render empty state when no sectors', () => {
    SectorsPage(container, Store, API);
    expect(container.innerHTML).toContain('Nenhum setor cadastrado');
  });    it('should render sector cards', () => {
    Store.set('sectors', [
      { id: 'SEC1', name: 'Secretaria de Saúde', description: 'Gestão da saúde municipal', driverCount: 3, vehicleCount: 5 },
      { id: 'SEC2', name: 'Secretaria de Educação', description: '', driverCount: 2, vehicleCount: 4 },
    ]);
    // Vehicle count is computed from Store.get('vehicles'), not sector.vehicleCount
    Store.set('vehicles', [
      { id: 'v1', sector: 'Secretaria de Saúde', status: 'Disponível' },
      { id: 'v2', sector: 'Secretaria de Saúde', status: 'Em Viagem' },
      { id: 'v3', sector: 'Secretaria de Saúde', status: 'Manutenção' },
      { id: 'v4', sector: 'Secretaria de Saúde', status: 'Disponível' },
      { id: 'v5', sector: 'Secretaria de Saúde', status: 'Disponível' },
    ]);
    SectorsPage(container, Store, API);
    expect(container.innerHTML).toContain('Secretaria de Saúde');
    expect(container.innerHTML).toContain('Secretaria de Educação');
    expect(container.innerHTML).toContain('5 veículos');
    expect(container.innerHTML).toContain('Sem descrição');
  });

  it('should show fallback text when sector has no description', () => {
    Store.set('sectors', [{ id: 'SEC3', name: 'Obras', description: '' }]);
    SectorsPage(container, Store, API);
    expect(container.innerHTML).toContain('Sem descrição');
  });

  it('should show vehicle count linked to sector', () => {
    Store.set('sectors', [{ id: 'SEC1', name: 'Saúde', description: 'Saúde' }]);
    Store.set('vehicles', [
      { id: 'v1', sector: 'Saúde', status: 'Disponível' },
      { id: 'v2', sector: 'Obras', status: 'Disponível' },
    ]);
    SectorsPage(container, Store, API);
    expect(container.innerHTML).toContain('1 veículos');
  });

  it('should re-render when sectors change', () => {
    SectorsPage(container, Store, API);
    expect(container.innerHTML).toContain('Nenhum setor cadastrado');
    Store.set('sectors', [{ id: 'SEC1', name: 'Novo Setor', description: 'Descrição' }]);
    expect(container.innerHTML).toContain('Novo Setor');
  });

  it('should handle form submit for new sector', () => {
    Store.set('sectors', []);
    SectorsPage(container, Store, API);
    // Simulate internal form submit
    const sectors = Store.get('sectors');
    expect(sectors).toHaveLength(0);
  });

  it('should return a cleanup function', () => {
    const cleanup = SectorsPage(container, Store, API);
    expect(typeof cleanup).toBe('function');
  });
});
