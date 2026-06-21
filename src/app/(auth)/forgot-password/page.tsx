
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/app-provider';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, ArrowLeft, Loader2, Info } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { requestPasswordRecovery } = useApp();
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugCode, setDebugCode] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsLoading(true);
    try {
      const data = await requestPasswordRecovery(identifier);
      
      toast({
        title: "Protocolo Iniciado",
        description: "Um código de recuperação foi gerado para sua conta.",
      });

      // No protótipo, capturamos o código para facilitar o teste
      if (data.debugCode) {
        setDebugCode(data.debugCode);
      }

      // Pequeno delay para o usuário ver a mensagem antes de ir para a próxima tela
      setTimeout(() => {
        router.push(`/reset-password?id=${encodeURIComponent(identifier)}`);
      }, 3000);

    } catch (error: any) {
      toast({
        title: "Falha na Solicitação",
        description: error.message || "Usuário não localizado no sistema.",
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
            <div className="bg-primary/10 text-primary p-3 rounded-full mb-2">
                <KeyRound className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Recuperar Acesso</h1>
            <p className="text-muted-foreground">Informe seus dados para receber o protocolo de redefinição.</p>
        </div>

        <Card className="border-border/50 bg-sidebar/50">
          <CardHeader>
            <CardTitle className="text-lg">Protocolo de Segurança</CardTitle>
            <CardDescription>Insira o e-mail corporativo ou sua matrícula.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">Identificador</Label>
                <Input 
                  id="id" 
                  placeholder="Ex: admin@citymotion.com ou MAT-001" 
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-11 font-bold uppercase tracking-widest text-[10px]" disabled={isLoading || !!debugCode}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Gerar Código de Acesso"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
              {debugCode && (
                  <div className="w-full p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center animate-in fade-in zoom-in duration-300">
                      <p className="text-[10px] uppercase font-bold text-emerald-500 mb-1">Código Gerado (Modo Prototipagem):</p>
                      <span className="text-3xl font-black tracking-[0.5em] text-foreground">{debugCode}</span>
                      <p className="text-[9px] text-muted-foreground mt-2">Redirecionando para tela de redefinição...</p>
                  </div>
              )}
              <Button variant="ghost" className="w-full text-xs" asChild>
                <Link href="/login"><ArrowLeft className="h-3 w-3 mr-2" /> Voltar ao Login</Link>
              </Button>
          </CardFooter>
        </Card>

        <div className="bg-muted/30 p-4 rounded-lg flex items-start gap-3 border border-border/30">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                Caso não possua mais acesso ao seu e-mail corporativo, entre em contato com o administrador de TI da sua unidade para realizar a redefinição manual via Terminal Kernel.
            </p>
        </div>
      </div>
    </div>
  );
}
