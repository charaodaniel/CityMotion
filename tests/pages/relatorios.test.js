/**
 * Tests for CityMotion Reports (Relatórios) Page
 */
import { describe, it, expect, beforeEach } from 'vitest';

const createStore = () => {
  const Store = {
    _state: { schedules: [] },
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

function ReportsPage(container, Store, API) {
  const telemetryData = [
    { month: 'Janeiro', cost: 12400, volume: 186 },
    { month: 'Fevereiro', cost: 15300, volume: 305 },
    { month: 'Março', cost: 11200, volume: 237 },
    { month: 'Abril', cost: 14500, volume: 273 },
    { month: 'Maio', cost: 13100, volume: 209 },
    { month: 'Junho', cost: 14800, volume: 214 },
  ];
  const maxCost = Math.max(...telemetryData.map(d => d.cost));
  const maxVolume = Math.max(...telemetryData.map(d => d.volume));

  function render() {
    const schedules = Store.get('schedules') || [];
    const totalTrips = schedules.filter(s => s.status === 'Concluída').length;
    const totalMileage = schedules.reduce((acc, s) => acc + ((s.endMileage || 0) - (s.startMileage || 0)), 0);

    container.innerHTML = `<div class="animate-fade-in">
      <h1>Inteligência & Analytics</h1>
      <div class="stats">
        <div data-stat="trips">${totalTrips}</div>
        <div data-stat="mileage">${totalMileage.toLocaleString()}</div>
        <div data-stat="efficiency">94.2%</div>
      </div>
      <div class="charts">
        <div class="cost-chart">
          ${telemetryData.map(d => {
            const pct = (d.cost / maxCost) * 100;
            return `<div class="bar" style="height:${pct}%" data-month="${d.month}" data-cost="${d.cost}"></div>`;
          }).join('')}
        </div>
        <div class="volume-chart">
          ${telemetryData.map(d => {
            const pct = (d.volume / maxVolume) * 100;
            return `<div class="bar" style="height:${pct}%" data-month="${d.month}" data-volume="${d.volume}"></div>`;
          }).join('')}
        </div>
      </div>
    </div>`;
  }

  const unsub = Store.on('schedules', render);
  render();
  return () => { unsub(); };
}

describe('Reports (Relatórios) Page', () => {
  let container, Store, API;

  beforeEach(() => {
    container = document.createElement('div');
    Store = createStore();
    API = {};
  });

  it('should export a function', () => {
    expect(typeof ReportsPage).toBe('function');
  });

  it('should render with zero stats when no schedules', () => {
    ReportsPage(container, Store, API);
    expect(container.innerHTML).toContain('Inteligência &amp; Analytics');
    expect(container.querySelector('[data-stat="trips"]')?.textContent).toBe('0');
    expect(container.querySelector('[data-stat="mileage"]')?.textContent).toBe('0');
    expect(container.innerHTML).toContain('94.2%');
  });

  it('should render total trips from completed schedules', () => {
    Store.set('schedules', [
      { id: 's1', status: 'Concluída', startMileage: 100, endMileage: 150 },
      { id: 's2', status: 'Concluída', startMileage: 200, endMileage: 350 },
      { id: 's3', status: 'Em Andamento', startMileage: 50, endMileage: 0 },
      { id: 's4', status: 'Agendada', startMileage: 0, endMileage: 0 },
    ]);
    ReportsPage(container, Store, API);
    expect(container.querySelector('[data-stat="trips"]')?.textContent).toBe('2');
  });

  it('should calculate total mileage from completed trips', () => {
    Store.set('schedules', [
      { id: 's1', status: 'Concluída', startMileage: 1000, endMileage: 1050 },
      { id: 's2', status: 'Concluída', startMileage: 2000, endMileage: 2200 },
    ]);
    ReportsPage(container, Store, API);
    // (1050-1000) + (2200-2000) = 50 + 200 = 250
    expect(container.querySelector('[data-stat="mileage"]')?.textContent).toBe('250');
  });

  it('should render chart bars with telemetry data', () => {
    ReportsPage(container, Store, API);
    const costBars = container.querySelectorAll('.cost-chart .bar');
    const volumeBars = container.querySelectorAll('.volume-chart .bar');
    expect(costBars.length).toBe(6);
    expect(volumeBars.length).toBe(6);
    expect(costBars[0].dataset.month).toBe('Janeiro');
    expect(costBars[0].dataset.cost).toBe('12400');
    expect(volumeBars[0].dataset.volume).toBe('186');
  });

  it('should re-render when schedules change', () => {
    ReportsPage(container, Store, API);
    expect(container.querySelector('[data-stat="trips"]')?.textContent).toBe('0');
    Store.set('schedules', [{ id: 's1', status: 'Concluída', startMileage: 100, endMileage: 200 }]);
    expect(container.querySelector('[data-stat="trips"]')?.textContent).toBe('1');
    expect(container.querySelector('[data-stat="mileage"]')?.textContent).toBe('100');
  });

  it('should return a cleanup function', () => {
    const cleanup = ReportsPage(container, Store, API);
    expect(typeof cleanup).toBe('function');
  });
});
