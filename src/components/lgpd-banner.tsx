
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, X } from "lucide-react";
import Link from "next/link";

export function LGPDBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("citymotion_lgpd_consent");
        if (!consent) {
            // Pequeno delay para não assustar o usuário assim que abre a página
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("citymotion_lgpd_consent", "accepted");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[100] md:left-auto md:right-4 md:max-w-md animate-in slide-in-from-bottom-8 duration-500">
            <Card className="p-6 border-primary/20 shadow-2xl bg-background/95 backdrop-blur-md">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full text-primary shrink-0">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg">Privacidade e Dados</h3>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 rounded-full" 
                                onClick={() => setIsVisible(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            O CityMotion utiliza dados como sua localização e informações funcionais para otimizar a gestão da frota. Ao continuar, você concorda com nossa <Link href="/privacy" className="text-primary underline hover:text-primary/80">Política de Privacidade</Link> sob os termos da LGPD.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <Button size="sm" className="w-full" onClick={handleAccept}>
                                Entendi e Aceito
                            </Button>
                            <Button size="sm" variant="outline" className="w-full" asChild>
                                <Link href="/privacy">Saber Mais</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
