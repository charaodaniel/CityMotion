/**
 * CityMotion — Funcionários: Renderizadores de Modais (HTML puro)
 */

/**
 * Renderiza modal de detalhes do funcionário
 */
export function renderDetailsModal(employee, getStatusLabel, userRole) {
  if (!employee) return '';
  const e = employee;

  return `
    <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <button onclick="document.getElementById('funcModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="text-center mb-6">
        <div class="w-24 h-24 rounded-full bg-zinc-800 flex items-center justify-center text-3xl font-bold text-zinc-400 border-2 border-primary/20 mx-auto mb-4">${(e.name || 'U').charAt(0)}</div>
        <h2 class="text-2xl font-bold tracking-tight">${e.name}</h2>
        <p class="text-[10px] uppercase tracking-widest font-mono text-primary/70 mt-1">${e.role} • ${Array.isArray(e.sector) ? e.sector.join(', ') : e.sector}</p>
      </div>
      <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30 space-y-4">
        <div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nome Completo</span>
          <p class="text-base font-bold mt-1">${e.name}</p>
        </div>
        <div class="border-t border-zinc-800/30"></div>
        ${e.email ? `
          <div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email de Acesso</span>
            <p class="text-sm font-mono mt-1 text-primary">${e.email}</p>
          </div>
          <div class="border-t border-zinc-800/30"></div>
        ` : ''}
        ${e.matricula ? `
          <div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Matrícula</span>
            <p class="text-base font-mono font-bold mt-1 text-primary">${e.matricula}</p>
          </div>
          <div class="border-t border-zinc-800/30"></div>
        ` : ''}
        <div>
          <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</span>
          <div class="mt-1">
            <span class="badge badge-${getStatusLabel(e.status)} text-[10px] font-bold uppercase tracking-tight">${e.status}</span>
          </div>
        </div>
        ${e.cnh ? `
          <div class="border-t border-zinc-800/30"></div>
          <div class="flex items-center gap-2 text-emerald-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <span class="text-xs font-bold font-mono">CNH OK • ${e.cnh}</span>
          </div>
        ` : ''}
        <div class="border-t border-zinc-800/30"></div>
        <div class="flex justify-between items-center pt-4">
          <button onclick="document.getElementById('funcModalOverlay').dispatchEvent(new CustomEvent('deleteEmployee'))" class="btn btn-ghost btn-sm text-[10px] text-red-400 hover:bg-red-500/10">
            <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            ${userRole === 'dev' ? 'Remover Definitivo' : 'Desativar Registro'}
          </button>
          <button onclick="document.getElementById('funcModalOverlay').dispatchEvent(new CustomEvent('openEdit', {detail: '${e.id}'}))" class="btn btn-outline btn-sm text-[10px]">
            <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            Editar Registro
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renderiza modal de formulário (registro/edição)
 */
export function renderFormModal(isEdit, formData, EMPLOYEE_ROLES, sectors) {
  const fd = formData;

  return `
    <div class="h-1.5 w-full bg-[#93c5fd]"></div>
    <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-black tracking-tight">${isEdit ? 'Editar Funcionário' : 'Cadastro de Funcionário'}</h2>
          <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">${isEdit ? 'Altere as informações do funcionário' : 'Preencha para cadastrar um novo funcionário'}</p>
        </div>
        <button onclick="document.getElementById('funcModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
      <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30">
        <form id="employeeForm" class="space-y-6">
          <!-- Credenciais -->
          <div>
            <h3 class="text-sm font-bold mb-4 text-zinc-300">Credenciais de Acesso</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email Corporativo</label>
                <input type="email" name="email" value="${fd.email}" placeholder="email@acesso.com" required class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Senha</label>
                <input type="password" name="password" value="${fd.password}" placeholder="${isEdit ? 'Deixe em branco para não alterar' : 'Senha de 6+ dígitos'}" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
              </div>
            </div>
          </div>
          <div class="border-t border-zinc-800/30"></div>
          <!-- Dados Pessoais -->
          <div>
            <h3 class="text-sm font-bold mb-4 text-zinc-300 flex items-center gap-2">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              Informações Pessoais e Funcionais (LGPD)
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nome Completo</label>
                <input type="text" name="name" value="${fd.name}" placeholder="Nome do colaborador" required minlength="2" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Matrícula / ID Interno</label>
                <input type="text" name="matricula" value="${fd.matricula}" placeholder="Número da matrícula" required class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Cargo</label>
                <select name="role" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                  <option value="">Selecione o cargo</option>
                  ${EMPLOYEE_ROLES.sort().map(r => `<option value="${r}" ${fd.role === r ? 'selected' : ''}>${r}</option>`).join('')}
                </select>
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nº da CNH (apenas motoristas)</label>
                <input type="text" name="cnh" value="${fd.cnh}" placeholder="0123456789" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
              </div>
            </div>
            <!-- Setores (checkboxes) -->
            <div class="mt-6">
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-3">Setor(es) de Lotação</label>
              ${sectors.length === 0 ? '<p class="text-xs text-zinc-600 italic">Nenhum setor cadastrado.</p>' : `
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3" id="sectorCheckboxes">
                ${sectors.map(s => `
                  <label class="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800/30 cursor-pointer">
                    <input type="checkbox" name="sector" value="${s.name}" ${fd.sector.includes(s.name) ? 'checked' : ''} class="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-primary focus:ring-primary/30" />
                    <span class="text-xs text-zinc-400">${s.name}</span>
                  </label>
                `).join('')}
              </div>
              `}
            </div>
          </div>
          <div class="border-t border-zinc-800/30"></div>
          <!-- Documentação -->
          <div>
            <h3 class="text-sm font-bold mb-4 text-zinc-300">Documentação</h3>
            <p class="text-xs text-zinc-600 mb-4">${isEdit ? 'Para alterar um documento, faça um novo upload.' : 'O upload é criptografado e de acesso restrito.'}</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Foto Funcional (3x4)</label>
                <input type="file" accept="image/*" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Foto da CNH (se condutor)</label>
                <input type="file" accept="image/*,application/pdf" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" />
              </div>
            </div>
          </div>
          <div class="border-t border-zinc-800/30"></div>
          <!-- LGPD Consent -->
          <label class="flex items-start gap-3 p-4 rounded-lg border border-zinc-700/50 bg-zinc-900/50 cursor-pointer">
            <input type="checkbox" id="lgpdConsent" ${fd.lgpdConsent ? 'checked' : ''} class="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-primary focus:ring-primary/30" />
            <div class="space-y-1 leading-none">
              <span class="text-xs font-bold">Declaro que li e aceito a <a href="#" class="text-primary underline">Política de Privacidade</a></span>
              <p class="text-[10px] text-zinc-600">Autorizo o processamento dos dados pela organização para fins de gestão operacional da frota, conforme a LGPD.</p>
            </div>
          </label>
          <div class="flex justify-end pt-2">
            <button type="button" onclick="document.getElementById('funcModalOverlay').dispatchEvent(new CustomEvent('submitEmployeeForm'))" class="btn btn-primary h-11 px-10 text-[10px] font-black uppercase tracking-[0.2em]">
              ${isEdit ? 'Salvar Alterações' : 'Cadastrar Colaborador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
