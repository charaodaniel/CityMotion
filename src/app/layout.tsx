import type { Metadata } from 'next';
import { AppProvider } from '@/contexts/app-provider';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import 'jwt-decode';


const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'CityMotion',
  description: 'Gestão de motoristas e táxis para uma prefeitura',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={cn("font-sans antialiased", inter.variable)}>
        <AppProvider>
            {children}
            <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
