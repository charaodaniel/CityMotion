/**
 * CityMotion — Página: Viagens (Missões)
 * Kanban + Mapa Leaflet + Exportação PDF + Checklist + Sinistros
 *
 * Funções exportadas:
 *   default (container, Store, API) → função de cleanup
 */

// ============================================================
//  Utilitário: carregar scripts dinamicamente
// ============================================================
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Falha ao carregar ${src}`));
    document.head.appendChild(s);
  });
}

function loadStylesheet(href) {
  return new Promise((resolve) => {
    if (document.querySelector(`link[href="${href}"]`)) return resolve();
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.onload = () => resolve();
    document.head.appendChild(l);
  });
}

// ============================================================
//  Dados fixos
// ============================================================
const CHECKLIST_START = [
  'Pneus em bom estado (calibragem e sulcos)',
  'Nível de combustível adequado para a viagem',
  'Óleo do motor verificado',
  'Documentos do veículo presentes (CRLV, IPVA)',
  'Extintor dentro da validade e lacrado',
  'Cinto de segurança funcionando em todos os bancos',
  'Luzes e faróis funcionando (alto, baixo, setas)',
  'Espelhos retrovisores ajustados',
  'Limpeza do para-brisa e nível do lavador',
  'Ferramentas e triângulo de segurança presentes',
];

const CHECKLIST_END = [
  'Veículo estacionado corretamente',
  'Portas e vidros fechados e travados',
  'Chave e documentos devolvidos à frota',
  'Nível de combustível registrado',
  'Carga desembarcada por completo',
  'Itens pessoais retirados do veículo',
];

const TRIP_CATEGORIES_BY_SECTOR = {
  'Secretaria de Saúde': [
    'Transporte de Paciente',
    'Consulta Agendada',
    'Entrega de Medicamentos',
    'Visita Domiciliar',
  ],
  'Secretaria de Educação, Cultura, Desporto e Lazer': [
    'Transporte Escolar',
    'Viagem Pedagógica',
    'Transporte de Professores',
    'Evento Cultural',
  ],
  'Secretaria de Obras, Viação e Urbanismo': [
    'Visita Técnica',
    'Transporte de Material',
    'Inspeção de Obra',
    'Manutenção de Vias',
  ],
  'Secretaria de Administração e Planejamento': [
    'Entrega de Documentos',
    'Reunião Externa',
    'Serviço Bancário',
    'Recursos Humanos',
  ],
  'Gabinete do Prefeito': [
    'Agenda Oficial',
    'Visita a Comunidades',
    'Reunião Governamental',
  ],
  'Secretaria da Fazenda': [
    'Coleta de Tributos',
    'Fiscalização',
    'Serviços de Contabilidade',
  ],
  'Secretaria de Assistência Social': [
    'Visita Domiciliar',
    'Acompanhamento Familiar',
    'Entrega de Benefícios',
  ],
  'Secretaria de Agricultura e Meio Ambiente': [
    'Inspeção Rural',
    'Fiscalização Ambiental',
    'Apoio ao Produtor',
  ],
  'Secretaria de Turismo e Desenvolvimento Econômico': [
    'Visita a Pontos Turísticos',
    'Apoio a Eventos',
    'Fomento ao Comércio',
  ],
};

// ============================================================
//  Página
// ============================================================
export default function ViagensPage(container, Store, API) {
  // ----------------------------------------------------------
  //  Estado local
  // ----------------------------------------------------------
  let state = {
    activeModal: null, // null | 'details' | 'start-checklist' | 'finish' | 'form' | 'incident'
    selectedSchedule: null,
    activeTab: 'general',
    startMileage: '',
    finalMileage: '',
    checkedItems: [],
    notes: '',
    // Geo tracking
    driverLocations: [],
    isTracking: false,
    isExporting: false,
    // Form fields
    formData: {
      title: '',
      sector: '',
      category: '',
      driver: '',
      vehicle: '',
      origin: '',
      destination: '',
      departureDate: '',
      departureTime: '',
      description: '',
      passengers: [],
    },
    // Incident form
    incidentData: {
      description: '',
      location: '',
      incidentDate: new Date().toISOString().slice(0, 16),
      photos: null,
    },
  };

  // Refs para timers do geo
  let geoIntervalRef = null;
  let geoWatchIdRef = null;
  // Ref para instância do mapa Leaflet
  let mapInstance = null;
  let mapMarkers = [];

  function upd(partial) {
    state = { ...state, ...partial };
  }

  // ----------------------------------------------------------
  //  Helpers
  // ----------------------------------------------------------
  function getStatusLabel(status) {
    const map = {
      Agendada: 'secondary',
      'Em Andamento': 'default',
      Concluída: 'outline',
      Cancelada: 'destructive',
    };
    return map[status] || 'outline';
  }

  function getFilteredSchedules() {
    const user = Store.get('user');
    const schedules = Store.get('schedules') || [];
    const userRole = Store.mapRole(user?.role);

    if (userRole === 'employee' && user?.name) {
      return schedules.filter((s) => s.driver === user.name);
    }
    return schedules;
  }

  function getActiveTrips() {
    return (Store.get('schedules') || []).filter(
      (s) => s.status === 'Em Andamento'
    );
  }

  // ----------------------------------------------------------
  //  Geo Location
  // ----------------------------------------------------------
  async function reverseGeocode(lat, lng) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt`,
        { headers: { 'User-Agent': 'CityMotion/1.0' } }
      );
      if (!res.ok) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      const data = await res.json();
      return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch {
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  }

  async function captureLocation() {
    if (!navigator.geolocation) return;
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        });
      });

      const { latitude, longitude, speed } = position.coords;
      const activeTrips = getActiveTrips();
      const user = Store.get('user');

      const address = await reverseGeocode(latitude, longitude);

      const newLocations = activeTrips.map((trip) => ({
        driverId: user?.id || 'unknown',
        driverName: user?.name || trip.driver,
        vehicleId: trip.vehicle,
        vehiclePlate: trip.vehicle,
        latitude,
        longitude,
        address,
        timestamp: new Date().toISOString(),
        tripId: trip.id,
        speed: speed || undefined,
      }));

      const prev = state.driverLocations;
      const updated = [...prev];
      for (const loc of newLocations) {
        const idx = updated.findIndex(
          (l) => l.driverId === loc.driverId && l.tripId === loc.tripId
        );
        if (idx >= 0) updated[idx] = loc;
        else updated.push(loc);
      }
      upd({ driverLocations: updated.slice(-100) });
      renderMapTab();
    } catch (err) {
      console.warn('[Geo] Erro ao capturar localização:', err);
    }
  }

  function startGeoTracking() {
    if (!navigator.geolocation) {
      console.warn('[Geo] Geolocalização não disponível');
      return;
    }
    upd({ isTracking: true });
    captureLocation();
    geoIntervalRef = setInterval(captureLocation, 30 * 60 * 1000);
    geoWatchIdRef = navigator.geolocation.watchPosition(
      (pos) => {
        upd({
          currentPosition: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
        });
      },
      (err) => console.warn('[Geo] Watch error:', err),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 120000 }
    );
  }

  function stopGeoTracking() {
    upd({ isTracking: false });
    if (geoIntervalRef) {
      clearInterval(geoIntervalRef);
      geoIntervalRef = null;
    }
    if (geoWatchIdRef !== null) {
      navigator.geolocation.clearWatch(geoWatchIdRef);
      geoWatchIdRef = null;
    }
  }

  // ----------------------------------------------------------
  //  Status Management
  // ----------------------------------------------------------
  function updateScheduleStatus(scheduleId, newStatus, details) {
    const schedules = [...(Store.get('schedules') || [])];
    const employees = [...(Store.get('employees') || [])];
    const vehicles = [...(Store.get('vehicles') || [])];

    const schedule = schedules.find((s) => s.id === scheduleId);
    if (!schedule) return;

    const driver = employees.find((d) => d.name === schedule.driver);
    const vehicle = vehicles.find((v) => schedule.vehicle?.includes(v.licensePlate));

    if (newStatus === 'Em Andamento' && driver && vehicle) {
      Store.set(
        'employees',
        employees.map((d) =>
          d.id === driver.id ? { ...d, status: 'Em Viagem' } : d
        )
      );
      Store.set(
        'vehicles',
        vehicles.map((v) =>
          v.id === vehicle.id ? { ...v, status: 'Em Viagem' } : v
        )
      );
    } else if (newStatus === 'Concluída' && driver && vehicle && details?.endMileage) {
      Store.set(
        'employees',
        employees.map((d) =>
          d.id === driver.id ? { ...d, status: 'Disponível' } : d
        )
      );
      Store.set(
        'vehicles',
        vehicles.map((v) =>
          v.id === vehicle.id
            ? { ...v, status: 'Disponível', mileage: details.endMileage }
            : v
        )
      );
    }

    const updatedSchedules = schedules.map((s) => {
      if (s.id !== scheduleId) return s;
      const base = { ...s, status: newStatus };
      if (newStatus === 'Em Andamento') {
        base.startMileage = details?.startMileage;
        base.startNotes = details?.startNotes;
        base.startChecklist = details?.startChecklist;
      }
      if (newStatus === 'Concluída') {
        base.endMileage = details?.endMileage;
        base.endNotes = details?.endNotes;
        base.endChecklist = details?.endChecklist;
        base.arrivalTime = new Date().toLocaleString('pt-BR');
      }
      return base;
    });

    Store.set('schedules', updatedSchedules);
  }

  // ----------------------------------------------------------
  //  Export PDF
  // ----------------------------------------------------------
  async function exportTripReport() {
    if (state.isExporting) return;
    upd({ isExporting: true });
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
      await loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.3/jspdf.plugin.autotable.min.js'
      );

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const schedules = getFilteredSchedules().filter(
        (s) => s.status !== 'Cancelada'
      );

      // Cabeçalho
      doc.setFillColor(9, 9, 11);
      doc.rect(0, 0, pageWidth, 35, 'F');
      doc.setTextColor(147, 197, 253);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('CityMotion', 14, 18);
      doc.setTextColor(200, 200, 210);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Relatório de Viagens — ${new Date().toLocaleDateString('pt-BR')}`,
        14,
        28
      );
      doc.text(
        new Date().toLocaleString('pt-BR'),
        pageWidth - 14,
        28,
        { align: 'right' }
      );

      // Resumo
      const agendadas = schedules.filter((s) => s.status === 'Agendada').length;
      const andamento = schedules.filter((s) => s.status === 'Em Andamento').length;
      const concluidas = schedules.filter((s) => s.status === 'Concluída').length;
      const kmTotal = schedules.reduce(
        (acc, s) => acc + ((s.endMileage || 0) - (s.startMileage || 0)),
        0
      );

      doc.setTextColor(100, 100, 120);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('RESUMO', 14, 45);
      doc.setFillColor(240, 240, 245);
      doc.rect(14, 48, pageWidth - 28, 18, 'F');
      doc.setTextColor(50, 50, 60);
      doc.setFontSize(9);
      doc.text(`Total: ${schedules.length}`, 18, 57);
      doc.text(`Agendadas: ${agendadas}`, 70, 57);
      doc.text(`Em Andamento: ${andamento}`, 120, 57);
      doc.text(`Concluídas: ${concluidas}`, 175, 57);
      doc.text(`KM Total: ${kmTotal} km`, 230, 57);

      // Tabela
      doc.setTextColor(100, 100, 120);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('VIAGENS', 14, 76);

      const tableData = schedules.map((s) => [
        s.title,
        s.departureTime,
        s.origin,
        s.destination,
        s.vehicle,
        s.startMileage?.toString() || '-',
        s.endMileage?.toString() || '-',
        s.status,
      ]);

      doc.autoTable({
        startY: 80,
        head: [
          [
            'Título',
            'Data/Hora',
            'Origem',
            'Destino',
            'Veículo',
            'KM Inicial',
            'KM Final',
            'Status',
          ],
        ],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [9, 9, 11],
          textColor: [147, 197, 253],
          fontStyle: 'bold',
          fontSize: 8,
          halign: 'center',
        },
        bodyStyles: { fontSize: 8, textColor: [50, 50, 60] },
        alternateRowStyles: { fillColor: [245, 245, 250] },
        columnStyles: {
          0: { cellWidth: 40 },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
          7: { cellWidth: 20, halign: 'center' },
        },
        margin: { left: 14, right: 14 },
      });

      // Rodapé
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setTextColor(180, 180, 190);
        doc.setFontSize(7);
        doc.text(
          `CityMotion — Gerado em ${new Date().toLocaleString('pt-BR')} | Página ${i} de ${pageCount}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 8,
          { align: 'center' }
        );
      }

      doc.save(
        `relatorio-viagens-${new Date().toISOString().split('T')[0]}.pdf`
      );
    } catch (err) {
      console.error('[Export] Erro:', err);
      Toast.show('Erro ao gerar PDF: ' + err.message, 'error');
    } finally {
      setTimeout(() => upd({ isExporting: false }), 1000);
    }
  }

  // ----------------------------------------------------------
  //  Modal
  // ----------------------------------------------------------
  function openModal(type, schedule) {
    upd({
      activeModal: type,
      selectedSchedule: schedule,
      startMileage: schedule ? schedule.startMileage || '' : '',
      finalMileage: schedule ? schedule.startMileage || '' : '',
      checkedItems: [],
      notes: '',
      incidentData: {
        ...state.incidentData,
        incidentDate: new Date().toISOString().slice(0, 16),
      },
    });
    renderModal();
  }

  function closeModal() {
    upd({
      activeModal: null,
      selectedSchedule: null,
      startMileage: '',
      finalMileage: '',
      checkedItems: [],
      notes: '',
      formData: {
        title: '',
        sector: '',
        category: '',
        driver: '',
        vehicle: '',
        origin: '',
        destination: '',
        departureDate: '',
        departureTime: '',
        description: '',
        passengers: [],
      },
      incidentData: {
        description: '',
        location: '',
        incidentDate: new Date().toISOString().slice(0, 16),
        photos: null,
      },
    });
    renderModal();
  }

  function renderModal() {
    const overlay = document.getElementById('viagensModalOverlay');
    const content = document.getElementById('viagensModalContent');
    if (!overlay || !content) return;

    if (!state.activeModal) {
      overlay.classList.add('hidden');
      return;
    }

    overlay.classList.remove('hidden');

    switch (state.activeModal) {
      case 'details':
        renderDetailsModal(content);
        break;
      case 'start-checklist':
        renderChecklistModal(content, 'start');
        break;
      case 'finish':
        renderFinishModal(content);
        break;
      case 'incident':
        renderIncidentModal(content);
        break;
      case 'form':
        renderScheduleFormModal(content);
        break;
    }
  }

  // ---- Details Modal ----
  function renderDetailsModal(el) {
    const s = state.selectedSchedule;
    if (!s) return;
    el.innerHTML = `
      <div class="h-1.5 w-full bg-[#93c5fd]"></div>
      <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-black tracking-tight">${s.title}</h2>
            <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">Visualizando telemetria de missão</p>
          </div>
          <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30 space-y-5">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</span>
            <div class="mt-1">
              <span class="badge badge-${getStatusLabel(s.status)} text-[10px] font-bold uppercase tracking-tight">${s.status}</span>
            </div>
          </div>
          <div class="border-t border-zinc-800/30 my-2"></div>
          <div class="grid grid-cols-2 gap-6">
            <div><p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Motorista</p><p class="text-sm font-bold">${s.driver}</p></div>
            <div><p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Veículo</p><p class="text-sm font-bold">${s.vehicle}</p></div>
            <div><p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Origem</p><p class="text-sm font-bold">${s.origin}</p></div>
            <div><p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Destino</p><p class="text-sm font-bold">${s.destination}</p></div>
            <div><p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Partida</p><p class="text-sm font-bold">${s.departureTime}</p></div>
            ${s.arrivalTime ? `<div><p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Chegada</p><p class="text-sm font-bold">${s.arrivalTime}</p></div>` : ''}
            ${s.category ? `<div class="col-span-2"><p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Categoria</p><p class="text-sm font-bold">${s.category}</p></div>` : ''}
          </div>
          <div class="border-t border-zinc-800/30 my-2"></div>
          <div class="flex justify-end gap-3">
            ${s.status === 'Agendada' ? `
              <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('openChecklist', {detail: '${s.id}'}))" class="btn btn-primary text-[10px] h-10 px-6">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                Executar Checklist
              </button>
            ` : ''}
            ${s.status === 'Em Andamento' ? `
              <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('openIncident', {detail: '${s.id}'}))" class="btn btn-destructive text-[10px] h-10 px-6">
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                Relatar Sinistro
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // ---- Checklist Modal ----
  function renderChecklistModal(el, type) {
    const s = state.selectedSchedule;
    if (!s) return;
    const items = type === 'start' ? CHECKLIST_START : CHECKLIST_END;
    const isStart = type === 'start';
    const mileage = isStart ? state.startMileage : state.finalMileage;
    const title = isStart ? 'Checklist de Partida' : 'Checklist de Chegada';
    const icon = isStart
      ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>'
      : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>';

    el.innerHTML = `
      <div class="h-1.5 w-full ${isStart ? 'bg-[#93c5fd]' : 'bg-emerald-500'}"></div>
      <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <span class="text-primary">${icon}</span>
            <div>
              <h2 class="text-2xl font-black tracking-tight">${title}</h2>
              <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">${s.title}</p>
            </div>
          </div>
          <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30 space-y-5">
          ${
            isStart
              ? `<div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">KM do Hodômetro</label>
                  <input type="number" id="checklistMileage" value="${mileage}" placeholder="KM atual" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
                </div>
                <div class="border-t border-zinc-800/30"></div>`
              : `<input type="hidden" id="checklistMileage" value="${mileage}" />`
          }
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">Itens de Verificação</p>
            <div class="space-y-2" id="checklistItems">
              ${items
                .map(
                  (item, i) => `
                <label class="flex items-start gap-3 p-2 rounded-lg hover:bg-zinc-800/30 cursor-pointer transition-colors">
                  <input type="checkbox" data-index="${i}" class="mt-0.5 h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-primary focus:ring-primary/30" />
                  <span class="text-xs text-zinc-400">${item}</span>
                </label>
              `
                )
                .join('')}
            </div>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Observações</label>
            <textarea id="checklistNotes" rows="3" placeholder="Observações adicionais..." class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs resize-none focus:outline-none focus:border-primary/50">${state.notes}</textarea>
          </div>
          <div class="flex justify-end gap-3 pt-2">
            <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="btn btn-ghost text-[10px] h-10 px-5">Cancelar</button>
            <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('confirmChecklist', {detail: '${isStart ? 'start' : 'end'}'}))" class="${isStart ? 'btn btn-primary' : 'btn bg-emerald-600 hover:bg-emerald-500 text-white'} text-[10px] h-10 px-6">
              ${isStart ? 'Iniciar Missão' : 'Finalizar Viagem'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ---- Finish Modal (simplificado - usa checklist com 'end') ----
  function renderFinishModal(el) {
    renderChecklistModal(el, 'end');
  }

  // ---- Incident Modal ----
  function renderIncidentModal(el) {
    const s = state.selectedSchedule;
    const inc = state.incidentData;
    if (!s) return;
    el.innerHTML = `
      <div class="h-1.5 w-full bg-red-500"></div>
      <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-black tracking-tight text-red-400">Relatório de Sinistro</h2>
            <p class="text-[10px] font-mono uppercase tracking-widest text-red-400/70 mt-1">Protocolo de incidente crítico</p>
          </div>
          <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="scanlines rounded-lg border border-red-500/30 p-6 bg-red-500/5 space-y-5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Data e Hora do Incidente</label>
              <input type="datetime-local" id="incidentDate" value="${inc.incidentDate}" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-red-500/50" />
            </div>
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Localização</label>
              <input type="text" id="incidentLocation" value="${inc.location}" placeholder="Ex: Av. Brasil com Rua das Flores" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-red-500/50" />
            </div>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Descrição Detalhada do Ocorrido</label>
            <textarea id="incidentDescription" rows="5" placeholder="Descreva o que aconteceu, os danos, se há terceiros envolvidos, etc." class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs resize-none focus:outline-none focus:border-red-500/50">${inc.description}</textarea>
          </div>
          <div>
            <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Anexar Fotos</label>
            <input type="file" id="incidentPhotos" accept="image/*" multiple class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-red-500/20 file:text-red-400 hover:file:bg-red-500/30" />
          </div>
          <div class="border-t border-red-500/20 my-2"></div>
          <div class="flex justify-end">
            <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('submitIncident'))" class="btn btn-destructive text-[10px] h-11 px-8">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
              Enviar Relatório de Sinistro
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ---- Schedule Form Modal ----
  function renderScheduleFormModal(el) {
    const employees = Store.get('employees') || [];
    const vehicles = Store.get('vehicles') || [];
    const sectors = Store.get('sectors') || [];
    const drivers = employees.filter((e) => e.role === 'Motorista');
    const fd = state.formData;

    el.innerHTML = `
      <div class="h-1.5 w-full bg-[#93c5fd]"></div>
      <div class="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-black tracking-tight">Novo Protocolo de Viagem</h2>
            <p class="text-[10px] font-mono uppercase tracking-widest text-primary/60 mt-1">Executando agendamento logístico V3</p>
          </div>
          <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('closeModal'))" class="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="scanlines rounded-lg border border-zinc-700/50 p-6 bg-zinc-900/30 space-y-6">
          <form id="scheduleTripForm">
            <!-- Título -->
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Título da Viagem</label>
              <input type="text" name="title" value="${fd.title}" placeholder="Ex: Transporte de equipe para evento" required minlength="5" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
            </div>

            <div class="border-t border-zinc-800/30"></div>

            <!-- Detalhes -->
            <div>
              <p class="text-sm font-bold mb-4 text-zinc-300">Detalhes da Viagem</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Setor Solicitante</label>
                  <select name="sector" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" onchange="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('sectorChange', {detail: this.value}))">
                    <option value="">Selecione o setor</option>
                    ${sectors
                      .map(
                        (sec) =>
                          `<option value="${sec.name}" ${fd.sector === sec.name ? 'selected' : ''}>${sec.name}</option>`
                      )
                      .join('')}
                  </select>
                </div>
                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Categoria</label>
                  <select name="category" id="formCategory" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                    <option value="">${fd.sector ? 'Selecione a categoria' : 'Selecione um setor primeiro'}</option>
                  </select>
                </div>
                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Motorista Responsável</label>
                  <select name="driver" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                    <option value="">Selecione o motorista</option>
                    ${drivers
                      .map(
                        (d) =>
                          `<option value="${d.name}" ${fd.driver === d.name ? 'selected' : ''}>${d.name}</option>`
                      )
                      .join('')}
                  </select>
                </div>
                <div>
                  <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Veículo Designado</label>
                  <select name="vehicle" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50">
                    <option value="">Selecione o veículo</option>
                    ${vehicles
                      .map(
                        (v) =>
                          `<option value="${v.vehicleModel} (${v.licensePlate})" ${fd.vehicle === `${v.vehicleModel} (${v.licensePlate})` ? 'selected' : ''}>${v.vehicleModel} (${v.licensePlate})</option>`
                      )
                      .join('')}
                  </select>
                </div>
              </div>
            </div>

            <!-- Data / Hora -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Data de Partida</label>
                <input type="date" name="departureDate" value="${fd.departureDate}" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Horário de Partida</label>
                <input type="time" name="departureTime" value="${fd.departureTime}" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
              </div>
            </div>

            <!-- Origem / Destino -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Origem</label>
                <input type="text" name="origin" value="${fd.origin}" placeholder="Local de partida" required minlength="3" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
              </div>
              <div>
                <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Destino</label>
                <input type="text" name="destination" value="${fd.destination}" placeholder="Local de chegada" required minlength="3" class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-sm focus:outline-none focus:border-primary/50" />
              </div>
            </div>

            <div class="border-t border-zinc-800/30"></div>

            <!-- Passageiros -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <p class="text-sm font-bold text-zinc-300">Passageiros</p>
                <button type="button" onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('addPassenger'))" class="btn btn-ghost btn-sm text-[10px]">
                  <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                  Adicionar
                </button>
              </div>
              <div id="passengersList" class="space-y-2">
                ${fd.passengers.length === 0
                  ? '<p class="text-xs text-zinc-600 text-center py-4 border border-dashed rounded-md italic">Nenhum passageiro adicionado.</p>'
                  : fd.passengers
                      .map(
                        (p, i) => `
                    <div class="flex items-center gap-3 p-3 border border-zinc-700/50 rounded-md bg-black/20" data-passenger-index="${i}">
                      <div class="grid grid-cols-2 gap-3 flex-1">
                        <div>
                          <label class="text-[9px] uppercase font-bold text-zinc-500">Nome</label>
                          <input type="text" value="${p.name}" placeholder="Nome completo" class="passenger-name w-full mt-0.5 px-2 py-1.5 bg-zinc-900 border border-zinc-700/50 rounded text-xs focus:outline-none focus:border-primary/50" />
                        </div>
                        <div>
                          <label class="text-[9px] uppercase font-bold text-zinc-500">CPF/RG</label>
                          <input type="text" value="${p.document}" placeholder="Número" class="passenger-doc w-full mt-0.5 px-2 py-1.5 bg-zinc-900 border border-zinc-700/50 rounded text-xs focus:outline-none focus:border-primary/50" />
                        </div>
                      </div>
                      <button type="button" onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('removePassenger', {detail: ${i}}))" class="text-red-400 hover:text-red-300 p-1">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  `
                      )
                      .join('')
                }
              </div>
            </div>

            <!-- Descrição -->
            <div>
              <label class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Motivo/Descrição</label>
              <textarea name="description" rows="4" placeholder="Descreva o motivo da viagem, pessoas envolvidas ou outras informações relevantes." class="w-full mt-1 px-3 py-2 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs resize-none focus:outline-none focus:border-primary/50">${fd.description}</textarea>
            </div>

            <div class="flex justify-end pt-2">
              <button type="button" onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('submitScheduleForm'))" class="btn btn-primary h-11 px-10 text-[10px] font-black uppercase tracking-[0.2em]">
                Confirmar Missão
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // ----------------------------------------------------------
  //  Mapa Leaflet
  // ----------------------------------------------------------
  async function initMap() {
    if (mapInstance) return; // já iniciado

    await loadStylesheet('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css');
    await loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');

    const mapDiv = document.getElementById('leafletMap');
    if (!mapDiv || mapInstance) return;

    const L = window.L;
    mapInstance = L.map(mapDiv, {
      center: [-15.7801, -47.9292],
      zoom: 5,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | CityMotion',
      maxZoom: 19,
    }).addTo(mapInstance);

    // CSS customizado para popups
    const style = document.createElement('style');
    style.id = 'leaflet-custom-style';
    style.textContent = `
      .marker-moving .leaflet-marker-icon { filter: hue-rotate(200deg) saturate(2); }
      .leaflet-popup-content-wrapper {
        border-radius: 8px !important;
        background: #1a1a2e !important;
        color: #e0e0e0 !important;
        border: 1px solid rgba(59, 130, 246, 0.3) !important;
      }
      .leaflet-popup-tip {
        background: #1a1a2e !important;
        border: 1px solid rgba(59, 130, 246, 0.3) !important;
      }
    `;
    document.head.appendChild(style);

    updateMapMarkers();
  }

  function updateMapMarkers() {
    if (!mapInstance) return;
    const L = window.L;

    // Remover marcadores antigos
    mapMarkers.forEach((m) => m.remove());
    mapMarkers = [];

    const locations = state.driverLocations;
    if (locations.length === 0) return;

    const bounds = L.latLngBounds([]);

    locations.forEach((loc) => {
      const isMoving = loc.speed && loc.speed > 0;
      const icon = L.icon({
        iconRetinaUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:
          'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
        className: isMoving ? 'marker-moving' : '',
      });

      const speedText = loc.speed
        ? `Velocidade: ${(loc.speed * 3.6).toFixed(1)} km/h<br/>`
        : '';

      const marker = L.marker([loc.latitude, loc.longitude], { icon });
      marker.bindPopup(`
        <div style="font-family: monospace; font-size: 12px; min-width: 180px;">
          <strong style="color: #3b82f6; font-size: 14px;">${loc.driverName}</strong><br/>
          ${loc.vehiclePlate ? `🚗 ${loc.vehiclePlate}<br/>` : ''}
          ${speedText}
          📍 ${loc.address || `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`}<br/>
          <span style="color: #888; font-size: 10px;">
            ${new Date(loc.timestamp).toLocaleString('pt-BR')}
          </span>
        </div>
      `);

      marker.addTo(mapInstance);
      mapMarkers.push(marker);
      bounds.extend([loc.latitude, loc.longitude]);
    });

    if (locations.length > 0) {
      mapInstance.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }

  function destroyMap() {
    if (mapInstance) {
      mapMarkers.forEach((m) => m.remove());
      mapMarkers = [];
      mapInstance.remove();
      mapInstance = null;
    }
    const style = document.getElementById('leaflet-custom-style');
    if (style) style.remove();
  }

  // ----------------------------------------------------------
  //  Renderização Principal
  // ----------------------------------------------------------
  function render() {
    const schedules = getFilteredSchedules();
    const allTrips = schedules.filter((s) => s.status !== 'Cancelada');
    const schoolTrips = allTrips.filter((s) =>
      (s.category || '').toLowerCase().includes('escolar')
    );
    const generalTrips = allTrips.filter(
      (s) => !(s.category || '').toLowerCase().includes('escolar')
    );
    const activeTrips = getActiveTrips();

    container.innerHTML = `
      <div class="animate-fade-in space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 class="text-3xl sm:text-4xl font-black tracking-tighter flex items-center gap-3">
              <svg class="w-8 h-8 sm:w-10 sm:h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Missões
            </h1>
            <p class="text-zinc-400 text-sm mt-1 font-medium">Monitoramento de tráfego e logística operacional.</p>
          </div>
          <div class="flex items-center gap-3">
            <button id="btnExportPDF" class="btn btn-ghost btn-sm text-[10px]">
              <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              ${state.isExporting ? 'Exportando...' : 'Exportar PDF'}
            </button>
            <button onclick="document.getElementById('viagensModalOverlay').dispatchEvent(new CustomEvent('openForm'))" class="btn btn-primary btn-sm text-[10px]">
              <svg class="w-3.5 h-3.5 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Agendar Viagem
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="tabs">
          <button class="tab ${state.activeTab === 'general' ? 'active' : ''}" data-tab="general">Gerais (${generalTrips.length})</button>
          <button class="tab ${state.activeTab === 'school' ? 'active' : ''}" data-tab="school">Escolares (${schoolTrips.length})</button>
          <button class="tab ${state.activeTab === 'map' ? 'active' : ''}" data-tab="map">
            <svg class="w-3.5 h-3.5 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            Mapa ao Vivo
            ${activeTrips.length > 0 ? `<span class="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500/20 text-emerald-400 rounded-full">${activeTrips.length}</span>` : ''}
          </button>
        </div>

        <!-- Tab: General -->
        <div id="tabGeneral" class="tab-content ${state.activeTab === 'general' ? 'block' : 'hidden'}">
          ${renderKanban(generalTrips)}
        </div>

        <!-- Tab: School -->
        <div id="tabSchool" class="tab-content ${state.activeTab === 'school' ? 'block' : 'hidden'}">
          ${renderKanban(schoolTrips)}
        </div>

        <!-- Tab: Map -->
        <div id="tabMap" class="tab-content ${state.activeTab === 'map' ? 'block' : 'hidden'}">
          ${renderMapContent(activeTrips)}
        </div>
      </div>

      <!-- Modal Overlay -->
      <div id="viagensModalOverlay" class="fixed inset-0 z-50 flex items-center justify-center hidden" style="background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);">
        <div id="viagensModalContent" class="bg-[#0f0f13] border border-zinc-700/50 rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
          <!-- Dynamic content goes here -->
        </div>
      </div>
    `;

    setupEventListeners();

    // Se tab do mapa, inicializar
    if (state.activeTab === 'map') {
      setTimeout(() => initMap(), 100);
    } else {
      destroyMap();
    }
  }

  // ---- Kanban ----
  function renderKanban(trips) {
    const columns = [
      { title: 'Agendadas', status: 'Agendada' },
      { title: 'Em Andamento', status: 'Em Andamento' },
      { title: 'Concluídas', status: 'Concluída' },
    ];

    return `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${columns
          .map(
            (col) => `
          <div class="flex flex-col gap-3">
            <h2 class="text-[10px] font-bold uppercase tracking-widest text-primary/60 px-2">${col.title} (${trips.filter((s) => s.status === col.status).length})</h2>
            <div class="bg-zinc-900/30 rounded-xl p-3 space-y-3 min-h-[250px] border border-zinc-800/50 scanlines">
              ${trips.filter((s) => s.status === col.status).length > 0
                ? trips
                    .filter((s) => s.status === col.status)
                    .map(
                      (s) => `
                <div class="nexus-card p-0 overflow-hidden cursor-pointer hover:border-primary/50 transition-all duration-300 group" data-schedule-id="${s.id}" data-action="open-details">
                  <div class="p-4 pb-2" data-schedule-id="${s.id}" data-action="open-details">
                    <div class="mb-3">
                      <h3 class="text-sm font-bold tracking-tight">${s.title}</h3>
                      <p class="flex items-center text-[9px] font-mono font-bold uppercase tracking-widest text-primary/50 mt-1">
                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        ${s.departureTime}
                      </p>
                    </div>
                    <div class="space-y-1.5">
                      <div class="flex items-center text-[10px] text-zinc-500">
                        <svg class="w-3 h-3 mr-1.5 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                        <span class="truncate">${s.driver}</span>
                      </div>
                      <div class="flex items-center text-[10px] text-zinc-500">
                        <svg class="w-3 h-3 mr-1.5 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        <span class="truncate">${s.vehicle}</span>
                      </div>
                    </div>
                  </div>
                  <div class="border-t border-zinc-800/10 mt-2 bg-black/20">
                    ${s.status === 'Agendada'
                      ? `<button class="w-full py-2 text-[9px] font-bold uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-colors" data-schedule-id="${s.id}" data-action="start-checklist">
                          <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/></svg>
                          Iniciar Missão
                        </button>`
                      : s.status === 'Em Andamento'
                        ? `<button class="w-full py-2 text-[9px] font-bold uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors" data-schedule-id="${s.id}" data-action="finish-trip">
                            <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            Finalizar
                          </button>`
                        : ''
                    }
                  </div>
                </div>
              `
                    )
                    .join('')
                : '<div class="flex items-center justify-center h-full text-[9px] uppercase tracking-widest text-zinc-600 opacity-30 italic">Sem registros</div>'
              }
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  // ---- Mapa Content ----
  function renderMapContent(activeTrips) {
    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold uppercase tracking-widest text-primary">🚗 Rastreamento ao Vivo</h3>
            <p class="text-[10px] text-zinc-500 mt-1">
              ${activeTrips.length > 0
                ? `${activeTrips.length} viagem(ns) em andamento — ${state.driverLocations.length} localização(ões) capturada(s)`
                : 'Nenhuma viagem em andamento no momento.'}
            </p>
          </div>
          <div class="flex items-center gap-2">
            ${state.isTracking
              ? `<button id="btnStopTracking" class="btn btn-ghost btn-sm text-[10px] border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <span class="h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2 inline-block"></span>
                  Parar Rastreio
                </button>`
              : `<button id="btnStartTracking" class="btn btn-ghost btn-sm text-[10px] border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" ${activeTrips.length === 0 ? 'disabled' : ''}>
                  <svg class="w-3 h-3 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                  Iniciar Rastreio
                </button>`
            }
          </div>
        </div>
        ${activeTrips.length > 0
          ? `<div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div class="lg:col-span-2">
                <div id="leafletMap" style="height: 500px; width: 100%; border-radius: 8px; overflow: hidden;" class="border border-zinc-800/50"></div>
              </div>
              <div class="space-y-2 max-h-[500px] overflow-y-auto">
                <h4 class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Veículos em Trânsito</h4>
                ${activeTrips.map((trip) => {
                  const loc = state.driverLocations.find((l) => l.tripId === trip.id);
                  return `
                    <div class="nexus-card p-3">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-xs font-bold truncate">${trip.title}</span>
                        <span class="badge ${loc ? 'badge-default' : 'badge-secondary'} text-[8px] h-4 px-1.5">
                          ${loc ? '📍 Rastreado' : '⏳ Aguardando'}
                        </span>
                      </div>
                      <div class="text-[10px] text-zinc-500 space-y-0.5">
                        <p>🚗 ${trip.driver} — ${trip.vehicle}</p>
                        <p>📌 ${trip.destination}</p>
                        ${loc?.address ? `<p class="text-[9px] text-primary/50 truncate" title="${loc.address}">📍 ${loc.address}</p>` : ''}
                        ${loc?.speed !== undefined ? `<p class="text-emerald-400">⚡ ${(loc.speed * 3.6).toFixed(0)} km/h</p>` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>`
          : `<div class="nexus-card p-8 text-center text-zinc-500">
              <p class="text-sm">Nenhuma viagem em andamento.</p>
              <p class="text-xs text-zinc-600 mt-1">As viagens ativas aparecerão aqui no mapa.</p>
            </div>`
        }
      </div>
    `;
  }

  // ----------------------------------------------------------
  //  Event Listeners
  // ----------------------------------------------------------
  function setupEventListeners() {
    // ---- Tabs ----
    container.querySelectorAll('.tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        upd({ activeTab: tab });
        render();
      });
    });

    // ---- Export PDF ----
    const btnExport = document.getElementById('btnExportPDF');
    if (btnExport) {
      btnExport.addEventListener('click', exportTripReport);
    }

    // ---- Start / Stop Tracking ----
    const btnStart = document.getElementById('btnStartTracking');
    const btnStop = document.getElementById('btnStopTracking');
    if (btnStart) btnStart.addEventListener('click', startGeoTracking);
    if (btnStop) btnStop.addEventListener('click', stopGeoTracking);

    // ---- Abrir detalhes (delegated) ----
    container.addEventListener('click', (e) => {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const action = target.dataset.action;
      const scheduleId = target.dataset.scheduleId;
      const schedules = Store.get('schedules') || [];
      const schedule = schedules.find((s) => s.id === scheduleId);
      if (!schedule) return;

      switch (action) {
        case 'open-details':
          openModal('details', schedule);
          break;
        case 'start-checklist':
          openModal('start-checklist', schedule);
          break;
        case 'finish-trip':
          openModal('finish', schedule);
          break;
      }
    });

    // ---- Modal Events (CustomEvent via overlay) ----
    const overlay = document.getElementById('viagensModalOverlay');
    if (overlay) {
      // Fechar ao clicar fora
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });

      // Close event
      overlay.addEventListener('closeModal', () => closeModal());

      // Open checklist from details modal
      overlay.addEventListener('openChecklist', (e) => {
        const schedId = e.detail;
        const schedules = Store.get('schedules') || [];
        const schedule = schedules.find((s) => s.id === schedId);
        if (schedule) openModal('start-checklist', schedule);
      });

      // Open incident from details modal
      overlay.addEventListener('openIncident', (e) => {
        const schedId = e.detail;
        const schedules = Store.get('schedules') || [];
        const schedule = schedules.find((s) => s.id === schedId);
        if (schedule) openModal('incident', schedule);
      });

      // Confirm checklist (start or end)
      overlay.addEventListener('confirmChecklist', (e) => {
        const type = e.detail; // 'start' or 'end'
        const s = state.selectedSchedule;
        if (!s) return;

        const mileageInput = document.getElementById('checklistMileage');
        const notesInput = document.getElementById('checklistNotes');
        const checkedBoxes = document.querySelectorAll('#checklistItems input[type="checkbox"]:checked');
        const checkedItems = Array.from(checkedBoxes).map(
          (cb) => cb.closest('label')?.querySelector('span')?.textContent || ''
        );
        const mileage = mileageInput ? parseInt(mileageInput.value) || 0 : 0;
        const notes = notesInput ? notesInput.value : '';

        if (type === 'start' && mileage <= 0) {
          Toast.show('Informe o KM do hodômetro para iniciar a viagem.', 'warning');
          return;
        }

        const details = {
          startMileage: type === 'start' ? mileage : undefined,
          endMileage: type === 'end' ? mileage : undefined,
          startNotes: type === 'start' ? notes : undefined,
          endNotes: type === 'end' ? notes : undefined,
          startChecklist: type === 'start' ? checkedItems : undefined,
          endChecklist: type === 'end' ? checkedItems : undefined,
        };

        updateScheduleStatus(
          s.id,
          type === 'start' ? 'Em Andamento' : 'Concluída',
          details
        );
        closeModal();
      });

      // Submit incident
      overlay.addEventListener('submitIncident', () => {
        const s = state.selectedSchedule;
        if (!s) return;

        const dateInput = document.getElementById('incidentDate');
        const locInput = document.getElementById('incidentLocation');
        const descInput = document.getElementById('incidentDescription');
        const photosInput = document.getElementById('incidentPhotos');

        const description = descInput?.value || '';
        const location = locInput?.value || '';
        const incidentDate = dateInput?.value || '';

        if (!description || description.length < 20) {
          Toast.show('A descrição do sinistro precisa ter pelo menos 20 caracteres.', 'warning');
          return;
        }
        if (!location || location.length < 5) {
          Toast.show('Informe a localização do incidente.', 'warning');
          return;
        }

        console.log('[Sinistro]', {
          scheduleId: s.id,
          vehicle: s.vehicle,
          driver: s.driver,
          description,
          location,
          incidentDate,
          photos: photosInput?.files ? Array.from(photosInput.files).map(f => f.name) : [],
        });

        Toast.show('✅ Relatório de sinistro registrado com sucesso!', 'success');
        closeModal();
      });

      // Add passenger
      overlay.addEventListener('addPassenger', () => {
        const fd = state.formData;
        const passengers = [...fd.passengers, { name: '', document: '' }];
        upd({ formData: { ...fd, passengers } });
        renderModal();
      });

      // Remove passenger
      overlay.addEventListener('removePassenger', (e) => {
        const index = e.detail;
        const fd = state.formData;
        const passengers = fd.passengers.filter((_, i) => i !== index);
        upd({ formData: { ...fd, passengers } });
        renderModal();
      });

      // Open form modal
      overlay.addEventListener('openForm', () => {
        openModal('form');
      });

      // Submit schedule form (via CustomEvent para sobreviver a re-renders do modal)
      overlay.addEventListener('submitScheduleForm', () => {
        const form = document.getElementById('scheduleTripForm');
        if (!form) return;
        const data = new FormData(form);

        // Validação manual (substitui HTML5 validation perdida com type=button)
        const title = (data.get('title') || '').trim();
        const driver = (data.get('driver') || '').trim();
        const vehicle = (data.get('vehicle') || '').trim();
        const origin = (data.get('origin') || '').trim();
        const destination = (data.get('destination') || '').trim();
        const departureTime = data.get('departureTime');

        if (!title || title.length < 5) { Toast.show('O título da viagem deve ter pelo menos 5 caracteres.', 'warning'); return; }
        if (!driver) { Toast.show('Selecione um motorista.', 'warning'); return; }
        if (!vehicle) { Toast.show('Selecione um veículo.', 'warning'); return; }
        if (!origin || origin.length < 3) { Toast.show('O local de origem é obrigatório.', 'warning'); return; }
        if (!destination || destination.length < 3) { Toast.show('O local de destino é obrigatório.', 'warning'); return; }
        if (!departureTime) { Toast.show('Informe o horário de partida.', 'warning'); return; }

        const schedules = Store.get('schedules') || [];

        const passengerEls = form.querySelectorAll('[data-passenger-index]');
        const passengers = Array.from(passengerEls).map((el) => {
          const name = el.querySelector('.passenger-name')?.value || '';
          const doc = el.querySelector('.passenger-doc')?.value || '';
          return { name, document: doc };
        }).filter((p) => p.name && p.document);

        const newSchedule = {
          id: 'sched-' + Date.now(),
          title: title,
          driver: driver,
          vehicle: vehicle,
          origin: origin,
          destination: destination,
          departureTime: data.get('departureDate')
            ? `${data.get('departureDate')} ${departureTime}`
            : departureTime,
          status: 'Agendada',
          category: data.get('category') || 'Geral',
          passengers: passengers,
          description: (data.get('description') || '').trim(),
        };

        Store.set('schedules', [...schedules, newSchedule]);
        closeModal();
      });

      // Atualizar categorias quando setor muda (via CustomEvent)
      overlay.addEventListener('sectorChange', (e) => {
        const catSelect = document.getElementById('formCategory');
        if (!catSelect) return;
        const sector = e.detail;
        const cats = TRIP_CATEGORIES_BY_SECTOR[sector] || [];
        catSelect.innerHTML =
          `<option value="">${cats.length > 0 ? 'Selecione a categoria' : 'Nenhuma categoria disponível'}</option>` +
          cats.map((c) => `<option value="${c}">${c}</option>`).join('');
      });
    }
  }

  // ----------------------------------------------------------
  //  Subscriptions
  // ----------------------------------------------------------
  const unsubSchedules = Store.on('schedules', () => {
    render();
  });
  const unsubVehicles = Store.on('vehicles', render);
  const unsubEmployees = Store.on('employees', render);

  // ----------------------------------------------------------
  //  Render inicial
  // ----------------------------------------------------------
  render();

  // ----------------------------------------------------------
  //  Cleanup
  // ----------------------------------------------------------
  return () => {
    stopGeoTracking();
    destroyMap();
    unsubSchedules();
    unsubVehicles();
    unsubEmployees();
  };
}
