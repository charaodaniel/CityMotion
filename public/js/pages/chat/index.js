/**
 * CityMotion — Página: Chat (NexusTalk)
 * Contatos sidebar, mensagens em tempo real, envio de mensagens
 */
import {
  renderHeader, renderContactList, renderChatHeader,
  renderMessages, renderChatInput, renderEmptyState,
} from './modals.js';

export default function ChatPage(container, Store, API) {
  let state = {
    selectedUserId: null,
    search: '',
    newMessage: '',
    unreadMap: {},
    typingUsers: {},
  };
  let _typingTimer = null;
  let _typingExpireTimers = {};
  let _contactDelegate = null;

  function upd(partial) { state = { ...state, ...partial }; }

  // ── WebSocket Typing ─────────────────────────────────────
  function emitTyping(receiverId) {
    if (!WS._io || !WS._connected) return;
    const user = Store.get('user');
    if (!user) return;
    if (_typingTimer) return;
    WS._io.emit('typing', { from: String(user.id), to: receiverId });
    _typingTimer = setTimeout(() => { _typingTimer = null; }, 2000);
  }

  function emitStopTyping(receiverId) {
    if (!WS._io || !WS._connected) return;
    const user = Store.get('user');
    if (!user) return;
    if (_typingTimer) { clearTimeout(_typingTimer); _typingTimer = null; }
    WS._io.emit('stop-typing', { from: String(user.id), to: receiverId });
  }

  function syncTypingUsers() {
    const typingUsers = Store.get('typingUsers') || {};
    upd({ typingUsers });
    for (const uid of Object.keys(typingUsers)) {
      if (typingUsers[uid]) {
        if (_typingExpireTimers[uid]) clearTimeout(_typingExpireTimers[uid]);
        _typingExpireTimers[uid] = setTimeout(() => {
          const tu = { ...state.typingUsers };
          delete tu[uid];
          upd({ typingUsers: tu });
          render();
          delete _typingExpireTimers[uid];
        }, 3000);
      }
    }
  }

  // ── Helpers ──────────────────────────────────────────────
  function computeUnread() {
    const user = Store.get('user');
    const messages = Store.get('messages') || [];
    if (!user) return {};
    const userIdStr = String(user.id);
    const unread = {};
    for (const m of messages) {
      if (String(m.receiverId) === userIdStr && !m.isRead) {
        const sender = String(m.senderId);
        unread[sender] = (unread[sender] || 0) + 1;
      }
    }
    return unread;
  }

  function getFilteredEmployees() {
    const user = Store.get('user');
    const employees = Store.get('employees') || [];
    const q = state.search.toLowerCase();
    const userIdStr = String(user?.id || '');
    return employees.filter(e =>
      String(e.id) !== userIdStr &&
      e.status !== 'Desativado' &&
      e.name.toLowerCase().includes(q)
    );
  }

  function getActiveMessages() {
    const user = Store.get('user');
    const messages = Store.get('messages') || [];
    const selId = state.selectedUserId;
    if (!user || !selId) return [];
    const userIdStr = String(user.id);
    return messages.filter(m =>
      (String(m.senderId) === userIdStr && String(m.receiverId) === selId) ||
      (String(m.senderId) === selId && String(m.receiverId) === userIdStr)
    );
  }

  function getSelectedUser() {
    const employees = Store.get('employees') || [];
    return employees.find(e => String(e.id) === state.selectedUserId) || null;
  }

  async function handleSend() {
    const user = Store.get('user');
    const msg = state.newMessage.trim();
    if (!msg || !state.selectedUserId || !user) return;

    const messages = [...(Store.get('messages') || [])];
    const newMsg = {
      id: 'MSG' + Date.now(),
      senderId: String(user.id),
      receiverId: state.selectedUserId,
      content: msg,
      timestamp: new Date().toISOString(),
      isRead: 0,
    };

    try {
      await API.post('/api/messages', {
        receiverId: state.selectedUserId,
        content: msg,
      });
    } catch (e) { /* fallback: salvar localmente se API falhar */ }

    Store.set('messages', [...messages, newMsg]);
    upd({ newMessage: '' });
    render();
    scrollToBottom();
  }

  function scrollToBottom() {
    setTimeout(() => {
      const ca = document.getElementById('chatMessages');
      if (ca) ca.scrollTop = ca.scrollHeight;
    }, 50);
  }

  // ── Render ───────────────────────────────────────────────
  function render() {
    const user = Store.get('user');
    const filtered = getFilteredEmployees();
    const activeMessages = getActiveMessages();
    const selectedUser = getSelectedUser();
    const isTyping = selectedUser && state.typingUsers[String(selectedUser.id)];

    container.innerHTML = `
      <div class="flex h-[calc(100vh-4rem)] overflow-hidden" style="margin: -2rem">
        <!-- Sidebar - Contatos -->
        <div class="w-72 lg:w-80 border-r border-zinc-800/50 bg-zinc-900/30 flex flex-col shrink-0">
          <div class="p-4 sm:p-5 border-b border-zinc-800/50 space-y-3">
            ${renderHeader(state.search)}
          </div>
          <div class="flex-1 overflow-y-auto p-2 space-y-0.5" id="contactList">
            ${renderContactList(filtered, state.selectedUserId, state.unreadMap)}
          </div>
        </div>

        <!-- Main - Mensagens -->
        <div class="flex-1 flex flex-col relative bg-black/10">
          ${selectedUser ? `
            ${renderChatHeader(selectedUser, isTyping)}
            <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4" id="chatMessages">
              ${renderMessages(activeMessages, user?.id)}
              <div id="chatScrollAnchor"></div>
            </div>
            ${renderChatInput(state.newMessage)}
          ` : renderEmptyState()}
        </div>
      </div>`;
    setupEventListeners();
    scrollToBottom();
  }

  function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('chatSearch');
    if (searchInput) {
      searchInput.addEventListener('input', e => { upd({ search: e.target.value }); render(); });
    }

    // Contact list clicks (delegado, única vez)
    if (!_contactDelegate) {
      _contactDelegate = (e) => {
        const btn = e.target.closest('[data-user-id]');
        if (btn) {
          const userId = btn.dataset.userId;
          const unreadMap = { ...state.unreadMap };
          delete unreadMap[userId];
          upd({ selectedUserId: userId, unreadMap });
          render();
          scrollToBottom();
        }
      };
      container.addEventListener('click', _contactDelegate);
    }

    // Send button
    const sendBtn = document.getElementById('btnSendMessage');
    if (sendBtn) sendBtn.addEventListener('click', handleSend);

    // Chat input events
    const input = document.getElementById('chatInput');
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (state.selectedUserId) emitStopTyping(state.selectedUserId);
          handleSend();
        }
      });
      input.addEventListener('input', e => {
        const val = e.target.value;
        upd({ newMessage: val });
        if (state.selectedUserId) {
          if (val.trim()) emitTyping(state.selectedUserId);
          else emitStopTyping(state.selectedUserId);
        }
        const btn = document.getElementById('btnSendMessage');
        if (btn) btn.disabled = !val.trim();
      });
      input.addEventListener('blur', () => {
        if (state.selectedUserId) emitStopTyping(state.selectedUserId);
      });
    }
  }

  // ── Subscriptions ────────────────────────────────────────
  const unsubEmployees = Store.on('employees', () => { upd({ unreadMap: computeUnread() }); render(); });
  const unsubMessages = Store.on('messages', () => {
    upd({ unreadMap: computeUnread() });
    const selId = state.selectedUserId;
    if (selId) {
      const tu = { ...state.typingUsers };
      delete tu[selId];
      upd({ typingUsers: tu });
    }
    render();
    scrollToBottom();
  });
  const unsubUser = Store.on('user', () => { upd({ unreadMap: computeUnread() }); render(); });
  const unsubTyping = Store.on('typingUsers', () => { syncTypingUsers(); render(); });

  render();
  return () => {
    unsubEmployees(); unsubMessages(); unsubUser(); unsubTyping();
    if (_typingTimer) { clearTimeout(_typingTimer); _typingTimer = null; }
    for (const key of Object.keys(_typingExpireTimers)) clearTimeout(_typingExpireTimers[key]);
  };
}
