/**
 * CityMotion API Client
 * Fetch wrapper com autenticação JWT e tratamento de erros
 */
const API = {
  BASE: '',

  /** Pega o token JWT do localStorage */
  getToken() {
    return localStorage.getItem('citymotion_token');
  },

  /** Pega o usuário logado do localStorage */
  getUser() {
    try {
      const raw = localStorage.getItem('citymotion_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  /** Salva o usuário no localStorage */
  setUser(user) {
    localStorage.setItem('citymotion_user', JSON.stringify(user));
  },

  /** Headers padrão com autenticação */
  headers(extra = {}) {
    const h = { 'Content-Type': 'application/json', ...extra };
    const token = this.getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  },

  /** Logout: limpa token e redireciona */
  logout() {
    localStorage.removeItem('citymotion_token');
    localStorage.removeItem('citymotion_user');
    window.location.href = '/index.html';
  },

  /** Handler centralizado de requisições HTTP */
  async _request(method, path, body) {
    const opts = { method, headers: this.headers() };
    if (body !== undefined) opts.body = JSON.stringify(body);

    const res = await fetch(this.BASE + path, opts);

    if (res.status === 401 || res.status === 403) {
      this.logout();
      throw new Error('Sessão expirada');
    }

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || `Erro ${res.status}`);
    }

    return res.json();
  },

  /** Requisição GET */
  get(path) { return this._request('GET', path); },

  /** Requisição POST */
  post(path, body) { return this._request('POST', path, body); },

  /** Requisição PUT */
  put(path, body) { return this._request('PUT', path, body); },

  /** Requisição DELETE */
  del(path, body) { return this._request('DELETE', path, body); },

  /** Sincronizar todos os dados */
  async syncAll() {
    return this.get('/api/sync-all');
  },

  /** Login */
  async login(email, password) {
    return this.post('/api/login', { email, password });
  },
};
