/**
 * CityMotion — Página: Meus Relatórios (Motorista)
 * Histórico de viagens com filtros, estatísticas e exportação PDF
 * Integrado com o template de relatório personalizado (settings → Design de Relatórios)
 */
export default function MeusRelatoriosPage(container, Store, API) {
  let state = {
    tab: 'trips', // 'trips' | 'refuelings' | 'maintenance'
    dateFrom: '',
    dateTo: '',
    statusFilter: 'all',
    isExporting: false,
    template: null,
  };

  function upd(partial) { state = { ...state, ...partial }; }

  // ── Helpers ──────────────────────────────────────────────
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src; s.onload = () => resolve(); s.onerror = () => reject();
      document.head.appendChild(s);
    });
  }

  function getDriverTrips() {
    const user = Store.get('user');
    const all = Store.get('schedules') || [];
    return user ? all.filter(s => s.driver === user.name) : [];
  }

  function getDriverRefuelings() {
    const user = Store.get('user');
    const all = Store.get('refuelings') || [];
    return user ? all.filter(r => r.driverName === user.name) : [];
  }

  function filterByDate(items, dateField = 'departureTime') {
    let filtered = [...items];
    if (state.dateFrom) {
      const from = new Date(state.dateFrom);
      filtered = filtered.filter(i => new Date(i[dateField] || i.createdAt || i.date) >= from);
    }
    if (state.dateTo) {
      const to = new Date(state.dateTo);
      to.setHours(23, 59, 59);
      filtered = filtered.filter(i => new Date(i[dateField] || i.createdAt || i.date) <= to);
    }
    if (state.statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === state.statusFilter);
    }
    return filtered.sort((a, b) => new Date(b[dateField] || b.createdAt || b.date) - new Date(a[dateField] || a.createdAt || a.date));
  }

  function formatDate(d) {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('pt-BR');
  }

  function formatCurrency(val) {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // ── PDF Export ───────────────────────────────────────────
  async function exportPDF() {
    if (state.isExporting) return;
    upd({ isExporting: true });

    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.3/jspdf.plugin.autotable.min.js');

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();

      // Carregar template salvo + função applyReportTemplate
      let tmpl = state.template;
      let applyTmpl = null;
      if (!tmpl) {
        try {
          const mod = await import('/js/pdf-template.js');
          tmpl = await mod.fetchReportTemplate();
          applyTmpl = mod.applyReportTemplate;
          upd({ template: tmpl });
        } catch {}
      } else {
        // Já temos o template em cache, importar só a função
        try {
          const mod = await import('/js/pdf-template.js');
          applyTmpl = mod.applyReportTemplate;
        } catch {}
      }

      // Aplicar template (cabeçalho personalizado)
      if (typeof applyTmpl === 'function') {
        applyTmpl(doc, tmpl, {
          title: `Relatório do Motorista — ${Store.get('user')?.name || ''}`,
          sector: tmpl?.sectorName || '',
          headerHeight: 38,
        });
      } else {
        // Fallback: cabeçalho padrão
        doc.setFillColor(9, 9, 11);
        doc.rect(0, 0, pageWidth, 35, 'F');
        doc.setTextColor(147, 197, 253);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('CityMotion', 14, 18);
        doc.setTextColor(200, 200, 210);
        doc.setFontSize(10);
        doc.text(`Relatório do Motorista — ${Store.get('user')?.name || ''}`, 14, 28);
        doc.text(new Date().toLocaleString('pt-BR'), pageWidth - 14, 28, { align: 'right' });
      }

      const user = Store.get('user');
      const allTrips = getDriverTrips();
      const filtered = filterByDate(allTrips);

      // Resumo
      const concluidas = filtered.filter(s => s.status === 'Concluída').length;
      const andamento = filtered.filter(s => s.status === 'Em Andamento').length;
      const kmTotal = filtered.reduce((acc, s) => acc + ((s.endMileage || 0) - (s.startMileage || 0)), 0);
      const kmMedia = concluidas > 0 ? Math.round(kmTotal / concluidas) : 0;

      const headerMargin = 45;
      doc.setTextColor(100, 100, 120);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('RESUMO DO PERÍODO', 14, headerMargin);
      doc.setFillColor(240, 240, 245);
      doc.rect(14, headerMargin + 3, pageWidth - 28, 18, 'F');
      doc.setTextColor(50, 50, 60);
      doc.setFontSize(9);
      doc.text(`Total Viagens: ${filtered.length}`, 18, headerMargin + 13);
      doc.text(`Concluídas: ${concluidas}`, 70, headerMargin + 13);
      doc.text(`Em Andamento: ${andamento}`, 130, headerMargin + 13);
      doc.text(`KM Total: ${kmTotal} km`, 190, headerMargin + 13);
      doc.text(`Média KM: ${kmMedia} km/viagem`, 250, headerMargin + 13);

      // Tabela de viagens
      doc.setTextColor(100, 100, 120);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('VIAGENS REALIZADAS', 14, headerMargin + 32);

      const tableData = filtered.map(s => [
        s.title || 'Sem título',
        formatDate(s.departureTime),
        s.origin || '-',
        s.destination || '-',
        s.vehicle || '-',
        s.startMileage?.toString() || '-',
        s.endMileage?.toString() || '-',
        s.status || '-',
      ]);

      if (tableData.length > 0) {
        const primaryRGB = tmpl?.primaryColor ? hexToRgb(tmpl.primaryColor) : { r: 59, g: 130, b: 246 };
        doc.autoTable({
          startY: headerMargin + 36,
          head: [['Título', 'Data', 'Origem', 'Destino', 'Veículo', 'KM Inicial', 'KM Final', 'Status']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [primaryRGB.r, primaryRGB.g, primaryRGB.b], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 8, halign: 'center' },
          bodyStyles: { fontSize: 8, textColor: [50, 50, 60] },
          alternateRowStyles: { fillColor: [245, 245, 250] },
          columnStyles: { 0: { cellWidth: 45 }, 2: { cellWidth: 35 }, 3: { cellWidth: 35 }, 7: { cellWidth: 22, halign: 'center' } },
          margin: { left: 14, right: 14, bottom: 20 },
        });
      }

      // Rodapé com paginação (se não houver template, usar padrão)
      if (typeof applyTmpl !== 'function' || !tmpl) {
        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          doc.setTextColor(180, 180, 190);
          doc.setFontSize(7);
          doc.text(`CityMotion — Gerado em ${new Date().toLocaleString('pt-BR')} | Página ${i} de ${pageCount}`,
            pageWidth / 2, doc.internal.pageSize.getHeight() - 8, { align: 'center' });
        }
      }

      const filename = `relatorio-motorista-${(user?.name || 'motorista').replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);
      Toast.show(`✅ PDF gerado: ${filename}`, 'success');
    } catch (err) {
      console.error('[Export] Erro:', err);
      Toast.show('Erro ao gerar PDF: ' + err.message, 'error');
    } finally {
      setTimeout(() => upd({ isExporting: false }), 1000);
    }
  }

  function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 59, g: 130, b: 246 };
  }

  // ── Render ───────────────────────────────────────────────
  function render() {
    const user = Store.get('user');
    const allTrips = getDriverTrips();
    const allRefuelings = getDriverRefuelings();
    const filteredTrips = filterByDate(allTrips);
    const filteredRefuelings = filterByDate(allRefuelings, 'date');

    // Stats do motorista
    const totalTrips = allTrips.length;
    const concluidas = allTrips.filter(s => s.status === 'Concluída').length;
    const kmTotal = allTrips.reduce((acc, s) => acc + ((s.endMileage || 0) - (s.startMileage || 0)), 0);
    const emAndamento = allTrips.filter(s => s.status === 'Em Andamento').length;

    container.innerHTML = `
      <div class="animate-fade-in space-y-6">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 class="text-3xl sm:text-4xl font-black tracking-tighter flex items-center gap-3">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              Meus Relatórios
            </h1>
            <p class="text-sm text-zinc-400 mt-1">Histórico completo de viagens, abastecimentos e exportação PDF.</p>
          </div>
          <button onclick="document.getElementById('meusRelatoriosOverlay').dispatchEvent(new CustomEvent('exportPDF'))"
            class="btn btn-primary btn-sm text-[10px]" ${state.isExporting ? 'disabled' : ''}>
            ${state.isExporting
              ? '<svg class="w-3.5 h-3.5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>'
              : '<svg class="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>'}
            ${state.isExporting ? 'Exportando...' : 'Exportar PDF'}
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div class="glass-card rounded-xl p-4 bg-zinc-900/40 border-zinc-700/50">
            <p class="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Total Viagens</p>
            <p class="text-2xl font-black text-blue-300 mt-1">${totalTrips}</p>
          </div>
          <div class="glass-card rounded-xl p-4 bg-zinc-900/40 border-zinc-700/50">
            <p class="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Concluídas</p>
            <p class="text-2xl font-black text-emerald-400 mt-1">${concluidas}</p>
          </div>
          <div class="glass-card rounded-xl p-4 bg-zinc-900/40 border-zinc-700/50">
            <p class="text-[9px] font-bold uppercase tracking-widest text-zinc-500">KM Total</p>
            <p class="text-2xl font-black text-primary mt-1">${kmTotal} km</p>
          </div>
          <div class="glass-card rounded-xl p-4 bg-zinc-900/40 border-zinc-700/50">
            <p class="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Em Andamento</p>
            <p class="text-2xl font-black text-amber-400 mt-1">${emAndamento}</p>
          </div>
        </div>

        <!-- Filtros -->
        <div class="flex flex-wrap gap-3 items-end p-4 rounded-xl border border-zinc-700/50 bg-zinc-900/30">
          <div>
            <label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">De</label>
            <input type="date" id="filterDateFrom" value="${state.dateFrom}"
              onchange="document.getElementById('meusRelatoriosOverlay').dispatchEvent(new CustomEvent('filterChange'))"
              class="px-3 py-1.5 bg-black/40 border border-zinc-700/50 rounded-lg text-xs focus:outline-none focus:border-primary/50 w-36" />
          </div>
          <div>
            <label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Até</label>
            <input type="date" id="filterDateTo" value="${state.dateTo}"
              onchange="document.getElementById('meusRelatoriosOverlay').dispatchEvent(new CustomEvent('filterChange'))"
              class="px-3 py-1.5 bg-black/40 border border-zinc-700/50 rounded-lg text-xs focus:outline-none focus:border-primary/50 w-36" />
          </div>
          <div>
            <label class="text-[9px] font-bold uppercase tracking-widest text-zinc-500 block mb-1">Status</label>
            <select id="filterStatus"
              onchange="document.getElementById('meusRelatoriosOverlay').dispatchEvent(new CustomEvent('filterChange'))"
              class="px-3 py-1.5 bg-black/40 border border-zinc-700/50 rounded-lg text-xs focus:outline-none focus:border-primary/50">
              <option value="all" ${state.statusFilter === 'all' ? 'selected' : ''}>Todos</option>
              <option value="Concluída" ${state.statusFilter === 'Concluída' ? 'selected' : ''}>Concluídas</option>
              <option value="Em Andamento" ${state.statusFilter === 'Em Andamento' ? 'selected' : ''}>Em Andamento</option>
              <option value="Agendada" ${state.statusFilter === 'Agendada' ? 'selected' : ''}>Agendadas</option>
              <option value="Cancelada" ${state.statusFilter === 'Cancelada' ? 'selected' : ''}>Canceladas</option>
            </select>
          </div>
          <button onclick="document.getElementById('meusRelatoriosOverlay').dispatchEvent(new CustomEvent('clearFilters'))"
            class="btn btn-ghost btn-sm text-[10px]">Limpar Filtros</button>
          <span class="text-[10px] text-zinc-600 ml-auto">${filteredTrips.length} registro(s) encontrado(s)</span>
        </div>

        <!-- Tabs: Viagens | Abastecimentos -->
        <div class="flex gap-1 p-1 bg-zinc-900/60 border border-zinc-800/50 rounded-lg w-fit">
          <button onclick="document.getElementById('meusRelatoriosOverlay').dispatchEvent(new CustomEvent('setTab',{detail:'trips'}))"
            class="text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-md transition-colors ${state.tab === 'trips' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-zinc-500 hover:text-zinc-300'}">
            <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            Viagens (${filteredTrips.length})
          </button>
          <button onclick="document.getElementById('meusRelatoriosOverlay').dispatchEvent(new CustomEvent('setTab',{detail:'refuelings'}))"
            class="text-[10px] font-bold uppercase tracking-widest px-5 py-2 rounded-md transition-colors ${state.tab === 'refuelings' ? 'bg-primary/20 text-primary border border-primary/30' : 'text-zinc-500 hover:text-zinc-300'}">
            <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            Abastecimentos (${filteredRefuelings.length})
          </button>
        </div>

        <!-- Conteúdo -->
        <div class="space-y-2">
          ${state.tab === 'trips' ? renderTripsTable(filteredTrips) : renderRefuelingsTable(filteredRefuelings)}
        </div>
      </div>
      <div id="meusRelatoriosOverlay"></div>`;

    setupEventListeners();
  }

  function renderTripsTable(trips) {
    if (trips.length === 0) {
      return `<div class="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl">
        <p class="text-zinc-500">Nenhuma viagem encontrada no período.</p>
        <p class="text-xs text-zinc-600 mt-1">Ajuste os filtros ou comece uma nova viagem.</p>
      </div>`;
    }

    return `
      <div class="overflow-x-auto rounded-xl border border-zinc-700/50">
        <table class="w-full text-xs">
          <thead>
            <tr class="bg-zinc-900/60 text-zinc-400 uppercase tracking-widest text-[9px] font-bold">
              <th class="text-left p-3">Título</th>
              <th class="text-left p-3">Data</th>
              <th class="text-left p-3">Origem</th>
              <th class="text-left p-3">Destino</th>
              <th class="text-left p-3">Veículo</th>
              <th class="text-right p-3">KM</th>
              <th class="text-center p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            ${trips.map(s => `
              <tr class="border-t border-zinc-800/30 hover:bg-zinc-900/30 transition-colors">
                <td class="p-3 font-medium">${s.title || 'Sem título'}</td>
                <td class="p-3 text-zinc-400">${formatDate(s.departureTime)}</td>
                <td class="p-3 text-zinc-400">${s.origin || '-'}</td>
                <td class="p-3 text-zinc-400">${s.destination || '-'}</td>
                <td class="p-3 text-zinc-400">${s.vehicle || '-'}</td>
                <td class="p-3 text-right font-mono">${((s.endMileage || 0) - (s.startMileage || 0)) || '-'}</td>
                <td class="p-3 text-center">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold
                    ${s.status === 'Concluída' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                    ${s.status === 'Em Andamento' ? 'bg-blue-500/10 text-blue-400' : ''}
                    ${s.status === 'Agendada' ? 'bg-zinc-500/10 text-zinc-400' : ''}
                    ${s.status === 'Cancelada' ? 'bg-red-500/10 text-red-400' : ''}">
                    ${s.status}
                  </span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <p class="text-[10px] text-zinc-600 text-right">${trips.length} viagem(ns) · Total KM: ${trips.reduce((a,s) => a + ((s.endMileage||0)-(s.startMileage||0)), 0)} km</p>`;
  }

  function renderRefuelingsTable(refuelings) {
    if (refuelings.length === 0) {
      return `<div class="text-center py-12 border-2 border-dashed border-zinc-800 rounded-xl">
        <p class="text-zinc-500">Nenhum abastecimento encontrado.</p>
      </div>`;
    }

    return `
      <div class="overflow-x-auto rounded-xl border border-zinc-700/50">
        <table class="w-full text-xs">
          <thead>
            <tr class="bg-zinc-900/60 text-zinc-400 uppercase tracking-widest text-[9px] font-bold">
              <th class="text-left p-3">Data</th>
              <th class="text-left p-3">Veículo</th>
              <th class="text-right p-3">Litros</th>
              <th class="text-left p-3">Combustível</th>
              <th class="text-right p-3">Valor/L</th>
              <th class="text-right p-3">Total</th>
              <th class="text-left p-3">Posto</th>
            </tr>
          </thead>
          <tbody>
            ${refuelings.map(r => `
              <tr class="border-t border-zinc-800/30 hover:bg-zinc-900/30 transition-colors">
                <td class="p-3">${formatDate(r.date)}</td>
                <td class="p-3 text-zinc-400">${r.vehicleModel || r.licensePlate || '-'}</td>
                <td class="p-3 text-right font-mono">${r.liters ? r.liters.toFixed(1) : '-'}</td>
                <td class="p-3 text-zinc-400">${r.fuelType || '-'}</td>
                <td class="p-3 text-right font-mono">${r.price ? formatCurrency(r.price) : '-'}</td>
                <td class="p-3 text-right font-mono font-bold">${r.totalValue ? formatCurrency(r.totalValue) : '-'}</td>
                <td class="p-3 text-zinc-400">${r.gasStation || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <p class="text-[10px] text-zinc-600 text-right">${refuelings.length} abastecimento(s) · Total: ${formatCurrency(refuelings.reduce((a,r) => a + (r.totalValue||0), 0))}</p>`;
  }

  // ── Event Listeners ──────────────────────────────────────
  function setupEventListeners() {
    const o = document.getElementById('meusRelatoriosOverlay');
    if (!o) return;

    o.addEventListener('setTab', (e) => { upd({ tab: e.detail }); render(); });

    o.addEventListener('filterChange', () => {
      upd({
        dateFrom: document.getElementById('filterDateFrom')?.value || '',
        dateTo: document.getElementById('filterDateTo')?.value || '',
        statusFilter: document.getElementById('filterStatus')?.value || 'all',
      });
      render();
    });

    o.addEventListener('clearFilters', () => {
      upd({ dateFrom: '', dateTo: '', statusFilter: 'all' });
      render();
    });

    o.addEventListener('exportPDF', exportPDF);
  }

  // ── Init ─────────────────────────────────────────────────
  const unsub1 = Store.on('schedules', () => render());
  const unsub2 = Store.on('refuelings', () => render());
  const unsub3 = Store.on('user', () => render());

  // Pré-carregar template
  import('/js/pdf-template.js').then(mod => {
    mod.fetchReportTemplate().then(tmpl => upd({ template: tmpl }));
  }).catch(() => {});

  render();
  return () => { unsub1(); unsub2(); unsub3(); };
}
