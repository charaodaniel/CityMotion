
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";

const sidebarNavItems = [
  {
    title: "Introdução",
    href: "/docs",
  },
  {
    title: "Perfis de Usuário",
    href: "/docs/user-profiles",
  },
  {
    title: "Solicitando um Transporte",
    href: "/docs/requesting-trips",
  },
  {
    title: "Crachá Virtual",
    href: "/docs/virtual-badge",
  },
];


interface DocsLayoutProps {
  children: React.ReactNode;
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto p-4 sm:p-8">
       <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary"/>
          Central de Ajuda
        </h1>
        <p className="text-muted-foreground mt-2">
          Encontre guias, tutoriais e respostas para suas dúvidas sobre o CityMotion.
        </p>
      </div>
      <div className="flex -mx-4">
        <aside className="w-1/4 px-4">
          <nav className="sticky top-20">
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="space-y-4 pr-4">
                {sidebarNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block rounded-md p-3 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </ScrollArea>
          </nav>
        </aside>
        <main className="w-3/4 px-4">
          <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert bg-card p-8 rounded-lg border">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
