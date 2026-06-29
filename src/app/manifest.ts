
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CityMotion - Gestão de Frota',
    short_name: 'CityMotion',
    description: 'Sistema Operacional de Gestão Inteligente de Frota e Mobilidade',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#93c5fd',
    icons: [
      {
        src: 'https://picsum.photos/seed/citymotion1/192/192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: 'https://picsum.photos/seed/citymotion2/512/512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
