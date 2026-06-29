
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Impede o Chrome de mostrar o prompt automático
      e.preventDefault();
      // Guarda o evento para disparar depois
      setDeferredPrompt(e);
      // Mostra o nosso botão customizado após um tempo
      setTimeout(() => setIsVisible(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Mostra o prompt nativo
    deferredPrompt.prompt();

    // Aguarda a escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('CityMotion instalado com sucesso!');
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (deferredPrompt) && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 right-4 z-[90] max-w-xs w-full"
        >
          <div className="bg-sidebar/95 backdrop-blur-md border border-primary/30 p-4 rounded-xl shadow-2xl scanlines">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-xs font-black uppercase tracking-widest text-primary">Instalar NexusOS</h4>
              <button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mb-4 leading-relaxed">
              Adicione o CityMotion à sua tela inicial para acesso rápido e modo offline no totem.
            </p>
            <Button 
              onClick={handleInstall} 
              className="w-full h-9 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px]"
            >
              <Download className="mr-2 h-3 w-3" /> Instalar Agora
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
