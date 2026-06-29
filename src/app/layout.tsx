
"use client";

import { AppProvider } from '@/contexts/app-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { LGPDBanner } from '@/components/lgpd-banner';
import { PWAInstaller } from '@/components/pwa-installer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="CityMotion" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CityMotion" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#09090b" />
        <link rel="manifest" href="/manifest.webmanifest" crossOrigin="use-credentials" />
      </head>
      <body className={cn("font-sans antialiased", inter.variable)}>
        <AppProvider>
            {children}
            <Toaster />
            <LGPDBanner />
            <PWAInstaller />
        </AppProvider>
      </body>
    </html>
  );
}
