/**
 * CityMotion Store
 * Gerenciamento de estado global via eventos (pub/sub)
 * Leve, sem dependências, replacement para React Context
 */
const Store = {
  _state: {
    user: null,
    schedules: [],
    vehicles: [],
    employees: [],
    sectors: [],
    vehicleRequests: [],
    maintenanceRequests: [],
    refuelings: [],
    workSchedules: [],
    organizations: [],
    messages: [],
    notifications: [],
    loading: false,
    refreshing: false,
  },

  _listeners: {},

  /** Inscrever-se em mudanças de estado */
  on(event, callback) {
    if (!this._listeners[event]) this._listeners[event] = [];
    this._listeners[event].push(callback);
    return () => {
      this._listeners[event] = this._listeners[event].filter(cb => cb !== callback);
    };
  },

  /** Notificar listeners de um evento */
  _emit(event, data) {
    (this._listeners[event] || []).forEach(cb => cb(data));
    // Evento genérico '*'
    (this._listeners['*'] || []).forEach(cb => cb(event, data));
  },

  /** Atualizar estado e notificar */
  set(key, value) {
    this._state[key] = value;
    this._emit(key, value);
    this._emit('stateChange', { key, value });
  },

  /** Pegar valor do estado */
  get(key) {
    return this._state[key];
  },

  /** Pegar estado completo */
  getState() {
    return { ...this._state };
  },

  /** Atualizar múltiplos campos de uma vez */
  setState(partial) {
    Object.entries(partial).forEach(([key, value]) => {
      this._state[key] = value;
      this._emit(key, value);
    });
    this._emit('stateChange', partial);
  },

  /** Carregar dados sincronizados da API */
  async loadAll() {
    this.set('loading', true);
    try {
      const data = await API.syncAll();
      this.setState({
        schedules: data.trips || [],
        vehicleRequests: data.requests || [],
        vehicles: data.vehicles || [],
        employees: data.employees || [],
        sectors: data.sectors || [],
        workSchedules: data.workSchedules || [],
        maintenanceRequests: data.maintenanceRequests || [],
        refuelings: data.refuelings || [],
        messages: data.messages || [],
        organizations: data.organizations || [],
        loading: false,
      });
    } catch (err) {
      console.error('[Store] Erro ao carregar dados:', err);
      this.set('loading', false);
    }
  },

  /** Inicializar store com dados do usuário */
  async init() {
    const savedUser = API.getUser();
    if (savedUser) {
      this.set('user', savedUser);
      await this.loadAll();
    }
  },

  /** Resetar store (logout) */
  reset() {
    this.setState({
      user: null,
      schedules: [],
      vehicles: [],
      employees: [],
      sectors: [],
      vehicleRequests: [],
      maintenanceRequests: [],
      refuelings: [],
      workSchedules: [],
      organizations: [],
      messages: [],
      notifications: [],
      loading: false,
      refreshing: false,
    });
  },

  /** Mapear role string para UserRole */
  mapRole(roleStr) {
    const r = (roleStr || '').toLowerCase();
    if (r.includes('desenvolvedor') || r.includes('dev') || r.includes('root')) return 'dev';
    if (r.includes('ti') || r.includes('infra')) return 'ti';
    if (r.includes('admin')) return 'admin';
    if (r.includes('gestor') || r.includes('gerente')) return 'manager';
    return 'employee';
  },
};
