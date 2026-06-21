
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/app-provider';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useApp();
  const { toast } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) setIdentifier(idParam);
  }, [searchParams]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      return toast({
        title: "Erro de Validação",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
    }

    if (newPassword.length < 6) {
        return toast({
          title: "Segurança Fraca",
          description: "A senha deve ter no mínimo 6 caracteres.",
          variant: "destructive",
        });
    }

    setIsLoading(true);
    try {
      await resetPassword(identifier, token, newPassword);
      
      toast({
        title: "Senha Redefinida!",
        description: "Seu acesso foi atualizado. Use sua nova senha para entrar.",
      });

      router.push('/login');
    } catch (error: any) {
      toast({
        title: "Falha na Redefinição",
        description: error.message || "Código inválido ou expirado.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
            <div className="bg-emerald-500/10 text-emerald-500 p-3 rounded-full mb-2 border border-emerald-500/20">
                <ShieldCheck className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Redefinir Senha</h1>
            <p className="text-muted-foreground">Insira o protocolo e escolha sua nova credencial.</p>
        </div>

        <Card className="border-border/50 bg-sidebar/50">
          <CardHeader>
            <CardTitle className="text-lg">Nova Credencial</CardTitle>
            <CardDescription>Para o usuário: <span className="text-foreground font-bold">{identifier}</span></CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="token">Código de 6 Dígitos</Label>
                <Input 
                  id="token" 
                  placeholder="000000" 
                  className="text-center text-2xl font-black tracking-[0.5em] h-14"
                  maxLength={6}
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                    <Label htmlFor="pass">Nova Senha</Label>
                    <div className="relative">
                        <Input 
                        id="pass" 
                        type={showPass ? "text" : "password"}
                        placeholder="Mínimo 6 caracteres" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={isLoading}
                        required
                        />
                        <button 
                            type="button" 
                            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                            onClick={() => setShowPass(!showPass)}
                        >
                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="confirm">Confirmar Nova Senha</Label>
                    <Input 
                      id="confirm" 
                      type={showPass ? "text" : "password"}
                      placeholder="Repita a senha" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 font-bold uppercase tracking-widest text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Atualizar Acesso"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
              <Button variant="ghost" className="w-full text-xs" asChild>
                <Link href="/login"><ArrowLeft className="h-3 w-3 mr-2" /> Cancelar e Voltar</Link>
              </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
