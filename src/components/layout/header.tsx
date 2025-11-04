
"use client";

import Link from "next/link";
import { Logo } from "../icons";
import { Button } from "../ui/button";
import { LogIn, LayoutDashboard } from "lucide-react";
import { useApp } from "@/contexts/app-provider";

export function Header() {
    const { currentUser } = useApp();
    
    // Consider the user logged in if it's not the default simulated "logged out" user.
    const isLoggedIn = currentUser && currentUser.name !== 'Ana Souza';

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-14 items-center">
                <Link href="/home" className="flex items-center gap-2 text-foreground hover:text-foreground">
                    <Logo />
                    <span className="text-lg font-semibold tracking-tighter">
                        CityMotion
                    </span>
                </Link>
                <div className="ml-auto">
                    {isLoggedIn ? (
                        <Button asChild>
                            <Link href="/dashboard">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Ir para o Painel
                            </Link>
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link href="/login">
                                <LogIn className="mr-2 h-4 w-4" />
                                Acessar Painel
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
}
