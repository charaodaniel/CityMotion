function generateSvgIcon(size, isMaskable = false) {
  const color = isMaskable ? "#1a1a2e" : "#93c5fd";
  const textColor = isMaskable ? "#93c5fd" : "#1a1a2e";
  const fontSize = Math.round(size * 0.35);
  const circleSize = Math.round(size * 0.85);
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'%3E%3Crect width='${size}' height='${size}' rx='${Math.round(size * 0.2)}' fill='%23${isMaskable ? "1a1a2e" : "09090b"}'/%3E%3Ccircle cx='${size / 2}' cy='${size / 2}' r='${size / 2 - 4}' fill='%23${isMaskable ? "09090b" : "1a1a2e"}'/%3E%3Ctext x='${size / 2}' y='${size / 2 + fontSize / 3}' text-anchor='middle' font-family='sans-serif' font-size='${fontSize}' font-weight='bold' fill='%2393c5fd'%3ECM%3C/text%3E%3C/svg%3E`;
}
function manifest() {
  return {
    name: "CityMotion - Gest\xE3o Inteligente de Frota",
    short_name: "CityMotion",
    description: "Sistema Operacional de Gest\xE3o Inteligente de Frota e Mobilidade Corporativa",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#93c5fd",
    orientation: "any",
    categories: ["business", "transportation", "productivity"],
    lang: "pt-BR",
    scope: "/",
    icons: [
      {
        src: generateSvgIcon(192),
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: generateSvgIcon(192, true),
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable"
      },
      {
        src: generateSvgIcon(512),
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: generateSvgIcon(512, true),
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ],
    screenshots: [],
    prefer_related_applications: false,
    related_applications: []
  };
}
export {
  manifest as default
};
