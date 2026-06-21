
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/app-provider';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, ArrowLeft, Loader2, Info, MailCheck } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { requestPasswordRecovery } = useApp();
  const { toast } = useToast();
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsLoading(true);
    try {
      await requestPasswordRecovery(identifier);
      
      toast({
        title: "Protocolo Iniciado",
        description: "Um código de recuperação foi enviado para seu e-mail cadastrado.",
      });

      setEmailSent(true);

      // Redireciona após 4 segundos para dar tempo de ler a mensagem de sucesso
      setTimeout(() => {
        router.push(`/reset-password?id=${encodeURIComponent(identifier)}`);
      }, 4000);

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
            {!emailSent ? (
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
                  <Button type="submit" className="w-full h-11 font-bold uppercase tracking-widest text-[10px]" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Gerar Código de Acesso"}
                  </Button>
                </form>
            ) : (
                <div className="flex flex-col items-center text-center py-6 space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                        <MailCheck className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="font-bold text-lg">E-mail Despachado!</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Verifique sua caixa de entrada (e pasta de spam) para obter o código de 6 dígitos.
                        </p>
                    </div>
                    <div className="w-full h-1 bg-emerald-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 animate-progress origin-left" style={{ animationDuration: '4s' }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Redirecionando para a validação...</p>
                </div>
            )}
          </CardContent>
          <CardFooter>
              <Button variant="ghost" className="w-full text-xs" asChild>
                <Link href="/login"><ArrowLeft className="h-3 w-3 mr-2" /> Voltar ao Login</Link>
              </Button>
          </CardFooter>
        </Card>

        <div className="bg-muted/30 p-4 rounded-lg flex items-start gap-3 border border-border/30">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-[10px] text-muted-foreground leading-relaxed italic">
                <p><strong>Dica de Desenvolvimento:</strong></p>
                <p>Como estamos em modo de demonstração, o backend exibirá um link no terminal para você visualizar o e-mail enviado sem precisar de um servidor SMTP real.</p>
            </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes progress {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
        }
        .animate-progress {
            animation: progress linear forwards;
        }
      `}</style>
    </div>
  );
}
