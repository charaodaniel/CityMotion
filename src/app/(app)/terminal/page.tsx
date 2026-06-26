
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { DevTerminal } from '@/components/dev-terminal';
import { Loader2, ShieldAlert, Terminal as TerminalIcon } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';

type LoginStep = 'username' | 'password' | 'authenticating' | 'authenticated';

export default function TerminalPage() {
  const { login, currentUser, isLoading: contextLoading } = useApp();
  const [step, setStep] = useState<LoginStep>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step !== 'authenticated') {
        inputRef.current?.focus();
    }
  }, [step]);

  useEffect(() => {
    if (currentUser && step !== 'authenticated') {
        setStep('authenticated');
    }
  }, [currentUser, step]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'username') {
      if (username.trim()) setStep('password');
    } else if (step === 'password') {
      setStep('authenticating');
      
      try {
        // Envia flag isTerminal para permitir login de usuários DEMO
        await login(username, password, false, true);
      } catch (err: any) {
        setError(err.message || 'Login incorrect');
        setStep('username');
        setUsername('');
        setPassword('');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-mono selection:bg-primary/30 relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 pointer-events-none z-50 tui-scanline opacity-10" />

      {step !== 'authenticated' ? (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md space-y-4 animate-in fade-in duration-500">
            <div className="space-y-1 mb-8 border-l-2 border-primary pl-4">
              <div className="flex items-center gap-2 text-primary font-bold text-sm sm:text-base mb-1">
                <TerminalIcon className="h-4 w-4" />
                <span>CityMotion NexusOS v2.4.0 (tty1)</span>
              </div>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Acesso Restrito: Modo Demonstração Disponível</p>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-500 text-xs bg-red-500/10 p-2 border border-red-500/20 rounded">
                    <ShieldAlert className="h-3 w-3 shrink-0" />
                    <span className="animate-pulse">{error}</span>
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3 text-sm sm:text-base">
              <div className="flex items-center gap-2">
                <span className="shrink-0 text-zinc-500">nexusos login:</span>
                <input
                  ref={step === 'username' ? inputRef : null}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={step !== 'username' && step !== 'authenticating'}
                  className="bg-transparent border-none outline-none text-white flex-1 focus:ring-0 p-0"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>

              {step === 'password' && (
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-zinc-500">Password:</span>
                  <input
                    ref={inputRef}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-transparent border-none outline-none text-white flex-1 focus:ring-0 p-0"
                    autoComplete="off"
                  />
                </div>
              )}

              {(step === 'authenticating' || contextLoading) && (
                <div className="flex items-center gap-2 pt-2 text-primary text-xs italic">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Validando credenciais na camada Nexus-Dual...</span>
                </div>
              )}
              
              <button type="submit" className="hidden" />
            </form>
            
            <div className="pt-10 opacity-20 text-[9px] uppercase tracking-[0.3em] text-center leading-relaxed">
                <p>Secure Terminal Session</p>
                <p>Demo User Auto-Purge: 24h cycle</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full w-full overflow-hidden">
             <DevTerminal 
                isOpen={true} 
                onClose={() => setStep('username')} 
             />
             
             <style jsx global>{`
                .fixed.bottom-6.right-6 {
                    position: relative !important;
                    bottom: 0 !important;
                    right: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    max-width: none !important;
                    border: none !important;
                    margin: 0 !important;
                    box-shadow: none !important;
                    flex: 1 !important;
                }
                [data-sidebar="trigger"], header {
                    display: none !important;
                }
             `}</style>
        </div>
      )}
    </div>
  );
}
