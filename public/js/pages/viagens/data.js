/**
 * CityMotion — Viagens: Dados fixos e utilitários de carregamento
 */
export const CHECKLIST_START = [
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

export const CHECKLIST_END = [
  'Veículo estacionado corretamente',
  'Portas e vidros fechados e travados',
  'Chave e documentos devolvidos à frota',
  'Nível de combustível registrado',
  'Carga desembarcada por completo',
  'Itens pessoais retirados do veículo',
];

export const TRIP_CATEGORIES_BY_SECTOR = {
  'Secretaria de Saúde': [
    'Transporte de Paciente', 'Consulta Agendada', 'Entrega de Medicamentos', 'Visita Domiciliar',
  ],
  'Secretaria de Educação, Cultura, Desporto e Lazer': [
    'Transporte Escolar', 'Viagem Pedagógica', 'Transporte de Professores', 'Evento Cultural',
  ],
  'Secretaria de Obras, Viação e Urbanismo': [
    'Visita Técnica', 'Transporte de Material', 'Inspeção de Obra', 'Manutenção de Vias',
  ],
  'Secretaria de Administração e Planejamento': [
    'Entrega de Documentos', 'Reunião Externa', 'Serviço Bancário', 'Recursos Humanos',
  ],
  'Gabinete do Prefeito': [
    'Agenda Oficial', 'Visita a Comunidades', 'Reunião Governamental',
  ],
  'Secretaria da Fazenda': [
    'Coleta de Tributos', 'Fiscalização', 'Serviços de Contabilidade',
  ],
  'Secretaria de Assistência Social': [
    'Visita Domiciliar', 'Acompanhamento Familiar', 'Entrega de Benefícios',
  ],
  'Secretaria de Agricultura e Meio Ambiente': [
    'Inspeção Rural', 'Fiscalização Ambiental', 'Apoio ao Produtor',
  ],
  'Secretaria de Turismo e Desenvolvimento Econômico': [
    'Visita a Pontos Turísticos', 'Apoio a Eventos', 'Fomento ao Comércio',
  ],
};

/**
 * Carrega um script JS dinamicamente (evita duplicatas)
 */
export function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Falha ao carregar ${src}`));
    document.head.appendChild(s);
  });
}

/**
 * Carrega um CSS dinamicamente (evita duplicatas)
 */
export function loadStylesheet(href) {
  return new Promise((resolve) => {
    if (document.querySelector(`link[href="${href}"]`)) return resolve();
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.onload = () => resolve();
    document.head.appendChild(l);
  });
}
