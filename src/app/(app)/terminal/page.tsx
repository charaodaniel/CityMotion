
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { DevTerminal } from '@/components/dev-terminal';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useApp } from '@/contexts/app-provider';

type LoginStep = 'username' | 'password' | 'authenticating' | 'authenticated';

export default function TerminalPage() {
  const { login } = useApp();
  const [step, setStep] = useState<LoginStep>('username');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (step !== 'authenticated') {
        inputRef.current?.focus();
    }
  }, [step]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'username') {
      if (username.trim()) setStep('password');
    } else if (step === 'password') {
      setStep('authenticating');
      
      try {
        // Validação Real via API do Sistema
        const res = await fetch('/api/nexus/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: username, password: password })
        });

        const data = await res.json();

        if (res.ok && data.user) {
            const roleStr = data.user.role.toLowerCase();
            // Verifica se o usuário tem cargo técnico ou administrativo (incluindo global/root)
            const isAuthorized = roleStr.includes('dev') || 
                               roleStr.includes('ti') || 
                               roleStr.includes('admin') || 
                               roleStr.includes('global') ||
                               roleStr.includes('root');

            if (isAuthorized) {
                // Sucesso: Carrega info do sistema para o boot
                const sysRes = await fetch('/api/nexus/system/resources');
                const sysData = await sysRes.json().catch(() => ({}));
                setSystemInfo(sysData);
                
                // Loga no contexto global também
                await login(username, false);
                setStep('authenticated');
            } else {
                throw new Error('Acesso negado: privilégios insuficientes.');
            }
        } else {
            throw new Error(data.message || 'Login incorrect');
        }
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
      {/* Scanline Overlay Global */}
      <div className="absolute inset-0 pointer-events-none z-50 tui-scanline opacity-10" />

      {step !== 'authenticated' ? (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md space-y-4 animate-in fade-in duration-500">
            <div className="space-y-1 mb-8 border-l-2 border-primary pl-4">
              <p className="text-primary font-bold text-sm sm:text-base">CityMotion(tm) NexusOS v2.4.0 (tty1)</p>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest">Kernel 6.1.0-21-nexus-x86_64</p>
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
                  disabled={step !== 'username'}
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

              {step === 'authenticating' && (
                <div className="flex items-center gap-2 pt-2 text-primary text-xs italic">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Validando credenciais no banco SQLite...</span>
                </div>
              )}
              
              <button type="submit" className="hidden" />
            </form>
            
            <div className="pt-10 opacity-20 text-[9px] uppercase tracking-[0.3em] text-center">
                Secure Terminal Session // Auth Required
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
