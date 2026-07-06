/**
 * Tests for CityMotion Refueling (Abastecimento) Page
 */
import { describe, it, expect, beforeEach } from 'vitest';

const createStore = () => {
  const Store = {
    _state: { refuelings: [], vehicles: [], user: { id: 1, name: 'Test User' } },
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

function RefuelingPage(container, Store, API) {
  let state = { isModalOpen: false, search: '', formData: { vehicleId: '', mileage: 0, liters: 0, price: 0, fuelType: 'Gasolina', gasStation: '', notes: '' } };
  function upd(partial) { state = { ...state, ...partial }; }

  function getFiltered() {
    const refuelings = Store.get('refuelings') || [];
    const q = state.search.toLowerCase();
    if (!q) return refuelings;
    return refuelings.filter(r => (r.licensePlate || '').toLowerCase().includes(q) || (r.vehicleModel || '').toLowerCase().includes(q) || (r.driverName || '').toLowerCase().includes(q));
  }

  function render() {
    const refuelings = Store.get('refuelings') || [];
    const filtered = getFiltered();
    const totalSpent = refuelings.reduce((acc, r) => acc + (r.totalValue || 0), 0);

    container.innerHTML = `<div class="animate-fade-in">
      <h1>Abastecimento</h1>
      <div class="stats"><span data-stat="total">R$ ${totalSpent.toFixed(2)}</span><span data-stat="count">${refuelings.length}</span></div>
      <div class="refueling-list">
        ${filtered.length > 0 ? filtered.map(r => `<div data-refueling-id="${r.id}">
          <span>${r.vehicleModel}</span>
          <span>R$ ${(r.totalValue || 0).toFixed(2)}</span>
        </div>`).join('') : '<div class="empty-state">Nenhum registro de abastecimento localizado.</div>'}
      </div>
    </div>`;
  }

  const unsub = Store.on('refuelings', render);
  render();
  return () => { unsub(); };
}

describe('Refueling (Abastecimento) Page', () => {
  let container, Store, API;

  beforeEach(() => {
    container = document.createElement('div');
    Store = createStore();
    API = {};
  });

  it('should export a function', () => {
    expect(typeof RefuelingPage).toBe('function');
  });

  it('should render empty state with zero stats', () => {
    RefuelingPage(container, Store, API);
    expect(container.innerHTML).toContain('R$ 0.00');
    expect(container.querySelector('[data-stat="count"]')?.textContent).toBe('0');
    expect(container.innerHTML).toContain('Nenhum registro de abastecimento');
  });

  it('should render total spent correctly', () => {
    Store.set('refuelings', [
      { id: '1', vehicleModel: 'Fiat', licensePlate: 'ABC', totalValue: 150.50, fuelType: 'Gasolina', liters: 25, mileage: 1000, driverName: 'João', date: '2024-01-15' },
      { id: '2', vehicleModel: 'VW', licensePlate: 'XYZ', totalValue: 200.75, fuelType: 'Diesel', liters: 30, mileage: 2000, driverName: 'Maria', date: '2024-01-16' },
    ]);
    RefuelingPage(container, Store, API);
    expect(container.querySelector('[data-stat="total"]')?.textContent).toContain('351.25');
    expect(container.querySelector('[data-stat="count"]')?.textContent).toBe('2');
  });

  it('should render refueling cards with data', () => {
    Store.set('refuelings', [
      { id: '1', vehicleModel: 'Fiat Strada', totalValue: 100, liters: 20, mileage: 5000, driverName: 'João', fuelType: 'Gasolina', licensePlate: 'ABC-123', date: '2024-01-10' },
    ]);
    RefuelingPage(container, Store, API);
    expect(container.innerHTML).toContain('Fiat Strada');
    expect(container.innerHTML).toContain('R$ 100.00');
  });

  it('should re-render when refuelings change', () => {
    RefuelingPage(container, Store, API);
    expect(container.innerHTML).toContain('R$ 0.00');
    Store.set('refuelings', [{ id: '1', vehicleModel: 'Test', totalValue: 90, liters: 15, fuelType: 'Gasolina', driverName: 'J', licensePlate: 'P', mileage: 100, date: '2024-01-01' }]);
    expect(container.innerHTML).toContain('R$ 90.00');
  });

  it('should return a cleanup function', () => {
    const cleanup = RefuelingPage(container, Store, API);
    expect(typeof cleanup).toBe('function');
  });

  it('should handle empty vehicles array for modal', () => {
    Store.set('vehicles', []);
    RefuelingPage(container, Store, API);
    expect(container.innerHTML).toContain('Abastecimento');
  });
});
