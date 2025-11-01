
"use client";

import Link from "next/link";
import { Logo } from "../icons";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
    const pathname = usePathname();
    
    // Header não será exibido em nenhuma página logada que usa o AppLayout
    if (pathname.startsWith('/setores') || pathname.startsWith('/motoristas') || pathname.startsWith('/veiculos') || pathname.startsWith('/viagens') || pathname.startsWith('/escalas') || pathname.startsWith('/relatorios') || pathname.startsWith('/perfil') || pathname.startsWith('/settings') || pathname.startsWith('/support') || pathname === '/login') {
        return null;
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-14 items-center">
                <Link href="/" className="flex items-center gap-2 text-foreground hover:text-foreground">
                    <Logo />
                    <span className="text-lg font-semibold tracking-tighter">
                        CityMotion
                    </span>
                </Link>
                <div className="ml-auto">
                    <Button asChild>
                        <Link href="/login">
                            <LogIn className="mr-2" />
                            Acessar Painel
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}
