
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/contexts/app-provider';
import { DevTerminal } from '@/components/dev-terminal';
import { Loader2, ShieldAlert } from 'lucide-react';

type LoginStep = 'username' | 'password' | 'authenticating' | 'authenticated';

export default function TerminalPage() {
  const { userRole } = useApp();
  const [step, setStep] = useState<LoginStep>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Acesso permitido apenas para perfis de alta criticidade técnica
  const hasPermission = ['dev', 'ti'].includes(userRole);

  useEffect(() => {
    if (step !== 'authenticated') {
        inputRef.current?.focus();
    }
  }, [step]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'username') {
      if (username.trim()) setStep('password');
    } else if (step === 'password') {
      setStep('authenticating');
      
      // Simulação de autenticação de baixo nível (Kernel Login)
      setTimeout(() => {
        // Credenciais de segurança do console
        if ((username === 'root' || username === 'admin') && (password === '123456789' || password === '123456')) {
            setStep('authenticated');
        } else {
            setError('Login incorrect');
            setStep('username');
            setUsername('');
            setPassword('');
            setTimeout(() => setError(''), 3000);
        }
      }, 1200);
    }
  };

  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-black text-destructive font-mono p-4">
        <ShieldAlert className="h-16 w-16 mb-4" />
        <h1 className="text-xl font-bold uppercase tracking-widest">Access Denied</h1>
        <p className="mt-2 text-sm text-center max-w-md">Sua conta não possui privilégios de acesso ao kernel do NexusOS. Esta violação foi registrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-mono selection:bg-primary/30 relative overflow-hidden">
      {/* Scanline Overlay Global */}
      <div className="absolute inset-0 pointer-events-none z-50 tui-scanline opacity-10" />

      {step !== 'authenticated' ? (
        <div className="p-8 max-w-2xl mx-auto space-y-4 pt-20">
          <div className="space-y-1 mb-8">
            <p className="text-primary font-bold">CityMotion(tm) NexusOS v2.4.0 (tty1)</p>
            <p className="text-zinc-500 text-xs">Kernel 6.1.0-21-nexus-x86_64 on an x86_64</p>
          </div>

          {error && <p className="text-red-500 animate-pulse">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="shrink-0">nexusos login:</span>
              <input
                ref={step === 'username' ? inputRef : null}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={step !== 'username'}
                className="bg-transparent border-none outline-none text-white flex-1"
                autoComplete="off"
                autoFocus
              />
            </div>

            {step !== 'username' && (
              <div className="flex items-center gap-2">
                <span className="shrink-0">Password:</span>
                <input
                  ref={step === 'password' ? inputRef : null}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={step !== 'password'}
                  className="bg-transparent border-none outline-none text-white flex-1"
                  autoComplete="off"
                />
              </div>
            )}

            {step === 'authenticating' && (
              <div className="flex items-center gap-2 pt-4 text-primary">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Validando credenciais de criptografia...</span>
              </div>
            )}
            
            <button type="submit" className="hidden" />
          </form>
        </div>
      ) : (
        <div className="h-screen w-screen flex flex-col">
             <DevTerminal 
                isOpen={true} 
                onClose={() => setStep('username')} 
             />
             
             {/* Estilo para forçar o terminal a ser full-screen nesta rota */}
             <style jsx global>{`
                .fixed.bottom-6.right-6 {
                    position: relative !important;
                    bottom: 0 !important;
                    right: 0 !important;
                    width: 100% !important;
                    height: 100vh !important;
                    max-width: none !important;
                    border: none !important;
                    margin: 0 !important;
                    box-shadow: none !important;
                }
                [data-sidebar="trigger"] {
                    display: none !important;
                }
             `}</style>
        </div>
      )}
    </div>
  );
}
