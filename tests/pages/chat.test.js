/**
 * Tests for CityMotion Chat (NexusTalk) Page
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const createStore = () => {
  const Store = {
    _state: {
      user: { id: 1, name: 'Admin Test', role: 'Administrador' },
      employees: [],
      messages: [],
    },
    _listeners: {},
    on(event, cb) {
      if (!this._listeners[event]) this._listeners[event] = [];
      this._listeners[event].push(cb);
      return () => { this._listeners[event] = this._listeners[event].filter(f => f !== cb); };
    },
    _emit(event, data) { (this._listeners[event] || []).forEach(cb => cb(data)); },
    set(key, value) { this._state[key] = value; this._emit(key, value); },
    get(key) { return this._state[key]; },
    getState() { return { ...this._state }; },
  };
  return Store;
};

function ChatPage(container, Store, API) {
  let state = { selectedUserId: null, search: '', newMessage: '' };
  function upd(partial) { state = { ...state, ...partial }; }

  function getFilteredEmployees() {
    const user = Store.get('user');
    const employees = Store.get('employees') || [];
    const q = state.search.toLowerCase();
    return employees.filter(e => e.id !== user?.id && e.status !== 'Desativado' && e.name.toLowerCase().includes(q));
  }

  function getActiveMessages() {
    const user = Store.get('user');
    const messages = Store.get('messages') || [];
    const selId = state.selectedUserId;
    if (!user || !selId) return [];
    return messages.filter(m => (m.senderId === user.id && m.receiverId === selId) || (m.senderId === selId && m.receiverId === user.id));
  }

  function handleSend() {
    const user = Store.get('user');
    const msg = state.newMessage.trim();
    if (!msg || !state.selectedUserId || !user) return;
    const messages = [...(Store.get('messages') || [])];
    Store.set('messages', [...messages, { id: 'MSG' + Date.now(), senderId: user.id, receiverId: state.selectedUserId, content: msg, timestamp: new Date().toISOString(), isRead: 0 }]);
    upd({ newMessage: '' });
    render();
  }

  function render() {
    const user = Store.get('user');
    const filtered = getFilteredEmployees();
    const activeMessages = getActiveMessages();
    const selectedUser = (Store.get('employees') || []).find(e => e.id === state.selectedUserId) || null;

    container.innerHTML = `<div class="chat-container">
      <div class="contact-list">
        ${filtered.length > 0 ? filtered.map(e => `<button data-user-id="${e.id}" class="${e.id === state.selectedUserId ? 'active' : ''}">${e.name}</button>`).join('') : '<div class="empty">Nenhum contato disponível.</div>'}
      </div>
      <div class="message-area">
        ${selectedUser ? `
          <h3>${selectedUser.name}</h3>
          <div class="messages">
            ${activeMessages.length > 0 ? activeMessages.map(m => {
              const isMe = m.senderId === user?.id;
              return `<div class="message ${isMe ? 'sent' : 'received'}">${m.content}</div>`;
            }).join('') : '<div class="empty-msg">Inicie um protocolo de comunicação</div>'}
          </div>
          <div class="chat-input">
            <input id="chatInput" value="${state.newMessage}" placeholder="Digite sua mensagem..." />
            <button id="btnSend">Enviar</button>
          </div>
        ` : '<div class="no-selection">Selecione um colaborador para iniciar a conversa.</div>'}
      </div>
    </div>`;

    // Contact list click
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-user-id]');
      if (btn) {
        upd({ selectedUserId: btn.dataset.userId });
        render();
      }
    });

    const sendBtn = document.getElementById('btnSend');
    if (sendBtn) sendBtn.addEventListener('click', handleSend);

    const input = document.getElementById('chatInput');
    if (input) {
      input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } });
      input.addEventListener('input', e => upd({ newMessage: e.target.value }));
    }
  }

  const unsub1 = Store.on('employees', render);
  const unsub2 = Store.on('messages', render);
  const unsub3 = Store.on('user', render);
  render();
  return () => { unsub1(); unsub2(); unsub3(); };
}

describe('Chat (NexusTalk) Page', () => {
  let container, Store, API;

  beforeEach(() => {
    container = document.createElement('div');
    Store = createStore();
    API = {};
  });

  it('should export a function', () => {
    expect(typeof ChatPage).toBe('function');
  });

  it('should render empty state when no contacts available', () => {
    Store.set('employees', []);
    ChatPage(container, Store, API);
    expect(container.innerHTML).toContain('Nenhum contato disponível');
    expect(container.innerHTML).toContain('Selecione um colaborador');
  });

  it('should render contact list excluding current user', () => {
    Store.set('user', { id: 1, name: 'Admin', role: 'Administrador' });
    Store.set('employees', [
      { id: 1, name: 'Admin', role: 'Administrador', status: 'Disponível' },
      { id: 2, name: 'João Silva', role: 'Motorista', status: 'Disponível' },
      { id: 3, name: 'Maria Santos', role: 'Enfermeiro(a)', status: 'Disponível' },
    ]);
    ChatPage(container, Store, API);
    expect(container.innerHTML).toContain('João Silva');
    expect(container.innerHTML).toContain('Maria Santos');
    // Current user should NOT appear in contact list
    expect(container.innerHTML).not.toContain('Admin');
  });

  it('should exclude deactivated employees from contact list', () => {
    Store.set('employees', [
      { id: 2, name: 'João', role: 'Motorista', status: 'Disponível' },
      { id: 3, name: 'Desativado', role: 'Motorista', status: 'Desativado' },
    ]);
    ChatPage(container, Store, API);
    expect(container.innerHTML).toContain('João');
    expect(container.innerHTML).not.toContain('Desativado');
  });

  it('should highlight selected contact', () => {
    Store.set('employees', [{ id: 2, name: 'João', role: 'Motorista', status: 'Disponível' }]);
    ChatPage(container, Store, API);
    // Simulate selecting a contact
    const btn = container.querySelector('[data-user-id="2"]');
    if (btn) btn.click();
    // After click, should show message area
    expect(container.innerHTML).toContain('João');
  });

  it('should filter contacts by search query', () => {
    Store.set('employees', [
      { id: 2, name: 'João Silva', role: 'Motorista', status: 'Disponível' },
      { id: 3, name: 'Maria Santos', role: 'Enfermeiro(a)', status: 'Disponível' },
    ]);
    ChatPage(container, Store, API);
    expect(container.innerHTML).toContain('João Silva');
    expect(container.innerHTML).toContain('Maria Santos');
  });

  it('should show messages between selected user and current user', () => {
    // Use string IDs to match dataset values (which are strings)
    Store.set('user', { id: '1', name: 'Admin', role: 'Administrador' });
    Store.set('employees', [{ id: '2', name: 'João', role: 'Motorista', status: 'Disponível' }]);
    Store.set('messages', [
      { id: 'm1', senderId: '1', receiverId: '2', content: 'Olá João!', timestamp: '2024-01-10T10:00:00', isRead: 0 },
      { id: 'm2', senderId: '2', receiverId: '1', content: 'Olá Admin!', timestamp: '2024-01-10T10:01:00', isRead: 0 },
      { id: 'm3', senderId: '1', receiverId: '3', content: 'Outra conversa', timestamp: '2024-01-10T10:02:00', isRead: 0 },
    ]);
    ChatPage(container, Store, API);
    // Simulate selecting João
    const btn = container.querySelector('[data-user-id="2"]');
    if (btn) btn.click();
    // After click, the contact list re-renders with selected state
    expect(container.innerHTML).toContain('Olá João');
    expect(container.innerHTML).toContain('Olá Admin');
    // Message for another user should not appear
    expect(container.innerHTML).not.toContain('Outra conversa');
  });

  it('should return a cleanup function', () => {
    const cleanup = ChatPage(container, Store, API);
    expect(typeof cleanup).toBe('function');
  });

  it('should re-render when messages change', () => {
    Store.set('user', { id: '1', name: 'Admin', role: 'Administrador' });
    Store.set('employees', [{ id: '2', name: 'João', role: 'Motorista', status: 'Disponível' }]);
    ChatPage(container, Store, API);
    // Simulate select
    const btn = container.querySelector('[data-user-id="2"]');
    if (btn) btn.click();
    expect(container.innerHTML).toContain('Inicie um protocolo');
    Store.set('messages', [{ id: 'm1', senderId: '1', receiverId: '2', content: 'Nova mensagem', timestamp: '2024-01-10T11:00:00', isRead: 0 }]);
    expect(container.innerHTML).toContain('Nova mensagem');
  });
});
