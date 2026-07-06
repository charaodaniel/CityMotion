/**
 * CityMotion Frontend Test Setup
 * Mocks globais para os testes
 */

// Mock localStorage
const store = {};
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
    get length() { return Object.keys(store).length; },
    key: (i) => Object.keys(store)[i] ?? null,
  },
  configurable: true,
});

// Mock console (suppress expected errors in tests)
globalThis.console = {
  ...console,
  // Keep error visible but don't let tests fail from expected logs
  error: (...args) => {},
  warn: (...args) => {},
};

// Mock window.location
delete globalThis.location;
globalThis.location = { href: '', hash: '', pathname: '/' };

// Mock window.dispatchEvent, addEventListener, etc.
if (!globalThis.window) {
  globalThis.window = globalThis;
}

// Mock fetch
globalThis.fetch = async () => ({
  ok: true,
  status: 200,
  json: async () => ({}),
  headers: new Map(),
});
