
import { Header } from '@/components/layout/header';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-background">
        <div className="container mx-auto flex h-14 items-center justify-center">
          <Link href="/docs" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Central de Ajuda</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}
