/**
 * CityMotion — Chat: Renderizadores de UI (HTML puro)
 */

export function renderHeader(search) {
  return `
    <h1 class="text-lg font-black tracking-tighter flex items-center gap-2">
      <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
      NexusTalk
    </h1>
    <div class="relative">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <input type="text" id="chatSearch" value="${search}" placeholder="Buscar contato..."
        class="w-full pl-8 pr-3 py-1.5 bg-black/30 border border-zinc-700/50 rounded-lg text-xs focus:outline-none focus:border-primary/50" />
    </div>`;
}

export function renderContactList(contacts, selectedUserId, unreadMap) {
  if (contacts.length === 0) {
    return `<div class="text-center py-8 text-xs text-zinc-600 italic">Nenhum contato disponível.</div>`;
  }

  return contacts.map(e => {
    const eid = String(e.id);
    const isActive = eid === selectedUserId;
    const unreadCount = unreadMap[eid] || 0;
    return `
    <button class="w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left group ${isActive ? 'bg-primary/10 border border-primary/20' : 'hover:bg-zinc-800/30 border border-transparent'}" data-user-id="${e.id}">
      <div class="relative shrink-0">
        <div class="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-bold text-zinc-400 border border-zinc-700/50">${(e.name || '?')[0]}</div>
        ${unreadCount > 0 && !isActive ? `<div class="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-white text-[8px] font-bold flex items-center justify-center shadow-lg shadow-primary/30">${unreadCount > 9 ? '9+' : unreadCount}</div>` : ''}
        <div class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${e.status === 'Disponível' ? 'bg-emerald-500' : 'bg-zinc-600'}"></div>
      </div>
      <div class="flex-1 overflow-hidden text-left">
        <p class="text-xs font-bold truncate text-zinc-200">${e.name}</p>
        <p class="text-[9px] text-zinc-500 uppercase tracking-widest truncate">${e.role}</p>
        ${unreadCount > 0 && !isActive ? `<p class="text-[8px] text-primary font-bold mt-0.5">${unreadCount} mensagem(ns) nova(s)</p>` : ''}
      </div>
    </button>`;
  }).join('');
}

function getRoleBadge(role) {
  const r = (role || '').toLowerCase();
  if (r.includes('admin') || r.includes('dev')) return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
  if (r.includes('motorista')) return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
  if (r.includes('gestor')) return 'bg-primary/10 text-primary border-primary/20';
  return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
}

export function renderChatHeader(selectedUser, isTyping) {
  return `
  <div class="h-16 border-b border-zinc-800/50 px-4 sm:px-6 flex items-center justify-between bg-zinc-900/20 backdrop-blur-md shrink-0">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-base font-bold text-zinc-400 border-2 border-primary/20 shrink-0">${(selectedUser.name || '?')[0]}</div>
      <div>
        <h3 class="font-bold text-sm leading-tight text-zinc-200">${selectedUser.name}</h3>
        <div class="flex items-center gap-2 mt-0.5">
          <span class="inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${getRoleBadge(selectedUser.role)}">${selectedUser.role}</span>
          ${isTyping ? `
            <span class="inline-flex items-center text-[9px] text-primary font-bold gap-1">
              <span class="typing-dots flex gap-0.5">
                <span class="w-1 h-1 rounded-full bg-primary animate-bounce" style="animation-delay:0ms"></span>
                <span class="w-1 h-1 rounded-full bg-primary animate-bounce" style="animation-delay:200ms"></span>
                <span class="w-1 h-1 rounded-full bg-primary animate-bounce" style="animation-delay:400ms"></span>
              </span>
              digitando...
            </span>
          ` : `<span class="text-[9px] text-zinc-600 flex items-center gap-1">
            <svg class="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            NEX-256
          </span>`}
        </div>
      </div>
    </div>
  </div>`;
}

export function renderMessages(messages, userId) {
  if (messages.length === 0) {
    return `
    <div class="flex flex-col items-center justify-center h-full text-center opacity-30 select-none">
      <svg class="w-10 h-10 mb-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
      <p class="text-xs font-bold uppercase tracking-widest">Inicie um protocolo de comunicação</p>
      <p class="text-[10px] text-zinc-600">Segurança técnica ativa para este terminal.</p>
    </div>`;
  }

  return messages.map(m => {
    const isMe = String(m.senderId) === String(userId);
    return `
    <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
      <div class="max-w-[80%]">
        <div class="p-3 rounded-2xl text-sm leading-relaxed ${isMe ? 'bg-primary/20 text-zinc-200 rounded-tr-none border border-primary/30' : 'bg-zinc-900/80 text-zinc-300 rounded-tl-none border border-zinc-800/50'}">${m.content}</div>
        <div class="flex items-center gap-1 mt-1 px-1 ${isMe ? 'justify-end' : 'justify-start'}">
          <span class="text-[9px] font-mono text-zinc-600">${m.timestamp ? new Date(m.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
          ${isMe ? '<svg class="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' : ''}
        </div>
      </div>
    </div>`;
  }).join('');
}

export function renderChatInput(newMessage) {
  return `
  <div class="p-3 sm:p-4 bg-black/30 backdrop-blur-md border-t border-zinc-800/30 shrink-0">
    <div class="flex gap-2">
      <div class="flex-1 relative">
        <input type="text" id="chatInput" value="${newMessage}" placeholder="Digite sua mensagem técnica..."
          class="w-full h-10 px-3 bg-black/40 border border-zinc-700/50 rounded-lg text-xs focus:outline-none focus:border-primary/50 pr-20" />
        <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-mono text-primary/30 font-bold">CM-MSG-SYS</span>
      </div>
      <button id="btnSendMessage" class="h-10 w-10 bg-primary hover:bg-primary/90 rounded-lg flex items-center justify-center transition-transform active:scale-95 shadow-lg shadow-primary/20 shrink-0" ${!newMessage.trim() ? 'disabled' : ''}>
        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5m0 0l-7 7m7-7l7 7"/></svg>
      </button>
    </div>
  </div>`;
}

export function renderEmptyState() {
  return `
  <div class="flex-1 flex flex-col items-center justify-center text-center p-8">
    <div class="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 mb-5">
      <svg class="w-8 h-8 text-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
    </div>
    <h2 class="text-xl font-black tracking-tighter mb-2">Central de Comunicação</h2>
    <p class="text-xs text-zinc-500 max-w-xs">Selecione um colaborador no terminal lateral para iniciar a transmissão de dados e orientações operacionais.</p>
  </div>`;
}
