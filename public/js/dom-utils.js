/**
 * CityMotion — DOM Utilities
 * Funções compartilhadas para manipulação dinâmica de scripts e estilos.
 */

/**
 * Carrega um script JS dinamicamente (evita duplicatas)
 * @param {string} src  URL do script
 * @returns {Promise<void>}
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
 * @param {string} href  URL do stylesheet
 * @returns {Promise<void>}
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
