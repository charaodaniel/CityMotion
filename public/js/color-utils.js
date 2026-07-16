/**
 * CityMotion — Color Utilities
 * Funções compartilhadas para manipulação de cores entre páginas e PDFs
 */

/**
 * Converte cor hex (#fff, #ffffff) para objeto RGB.
 * @param {string} hex - Cor em formato hexadecimal (ex: "#3b82f6" ou "#fff")
 * @returns {{ r: number, g: number, b: number }} Objeto com valores RGB 0-255
 */
function hexToRgb(hex) {
  if (!hex) return { r: 59, g: 130, b: 246 }; // fallback: primary blue

  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 59, g: 130, b: 246 }; // fallback: primary blue
}

export {
  hexToRgb
};
