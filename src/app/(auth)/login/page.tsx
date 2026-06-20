
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/app-provider';
import { CarFront, LogIn, Users, Loader2, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const { toast } = useToast();
  const [email, setEmail] = useState('admin@citymotion.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // Correção: Passando email, password e o flag de redirecionamento como true
      await login(email, password, true);

    } catch (error: any) {
        toast({
            title: "Erro no Acesso",
            description: error.message || "Não foi possível realizar o login.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleSimulatedLogin = (simulatedEmail: string, simulatedPass: string = '123456') => {
    setEmail(simulatedEmail);
    setPassword(simulatedPass); 
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
            <Link href="/home" className="flex items-center gap-3 text-foreground">
                <div className="bg-foreground text-background p-2.5 rounded-lg">
                    <CarFront className="h-7 w-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tighter">
                CityMotion
                </h1>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Acessar o Painel</CardTitle>
            <CardDescription>
              Entre com suas credenciais para gerenciar a frota da sua organização.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Identificador (E-mail ou Matrícula)</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="seu.nome@empresa.com ou MAT-123"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                   <a href="#" className="text-sm text-primary hover:underline">
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full h-11 font-bold uppercase tracking-widest text-xs" disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                )}
                Entrar no Sistema
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/50 border-dashed">
          <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center">
                <Users className="mr-2 h-4 w-4" />
                MODO DEMONSTRAÇÃO (Perfis SaaS)
              </CardTitle>
              <CardDescription className="text-xs">Simule acessos de diferentes cargos em uma organização cliente.</CardDescription>
          </CardHeader>
          <CardContent className="text-xs space-y-1.5 pt-2">
              <p className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-amber-500" />
                <strong>Desenvolvedor Root:</strong> 
                <button onClick={() => handleSimulatedLogin('dev@dev.com', '123456789')} className="text-primary hover:underline ml-1">dev@dev.com</button>
              </p>
              <p><strong>Admin Geral:</strong> <button onClick={() => handleSimulatedLogin('admin@citymotion.com')} className="text-primary hover:underline">admin@citymotion.com</button></p>
              <p><strong>Gestor de Setor:</strong> <button onClick={() => handleSimulatedLogin('manager@citymotion.com')} className="text-primary hover:underline">manager@citymotion.com</button></p>
              <p><strong>Motorista:</strong> <button onClick={() => handleSimulatedLogin('driver@citymotion.com')} className="text-primary hover:underline">driver@citymotion.com</button></p>
              <p><strong>Colaborador:</strong> <button onClick={() => handleSimulatedLogin('employee@citymotion.com')} className="text-primary hover:underline">employee@citymotion.com</button></p>
              <p><strong>Técnico Mecânico:</strong> <button onClick={() => handleSimulatedLogin('mecanico@citymotion.com')} className="text-primary hover:underline">mecanico@citymotion.com</button></p>
          </CardContent>
        </Card>

         <p className="px-8 text-center text-xs text-muted-foreground">
            Ao acessar o sistema, você concorda com nossos{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary">Termos de Uso</a> e{' '}
            <a href="#" className="underline underline-offset-4 hover:text-primary">Privacidade</a>.
          </p>
      </div>
    </div>
  );
}
