
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/app-provider';
import { CarFront, LogIn, Users, Loader2 } from 'lucide-react';
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
      const response = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
          throw new Error(data.message || 'Falha na autenticação.');
      }
      
      // Chama a função de login do contexto para salvar o token e o usuário
      await login(data.token);

      router.push('/dashboard');

    } catch (error: any) {
        toast({
            title: "Erro de Login",
            description: error.message || "Não foi possível conectar ao servidor. Verifique se ele está rodando.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleSimulatedLogin = (simulatedEmail: string) => {
    setEmail(simulatedEmail);
    setPassword('123456'); // Senha padrão para todos os usuários de teste
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
              Use suas credenciais para entrar no sistema de gestão de frota.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@prefeitura.gov.br"
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <LogIn className="mr-2 h-4 w-4" />
                )}
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/50">
          <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Perfis de Teste
              </CardTitle>
              <CardDescription>Clique em um e-mail abaixo para preencher os campos de login (a senha padrão é "123456").</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
              <p><strong>Administrador (Prefeito):</strong> <button onClick={() => handleSimulatedLogin('admin@citymotion.com')} className="text-primary hover:underline">admin@citymotion.com</button></p>
              <p><strong>Gestor (Engenheiro):</strong> <button onClick={() => handleSimulatedLogin('manager@citymotion.com')} className="text-primary hover:underline">manager@citymotion.com</button></p>
              <p><strong>Motorista:</strong> <button onClick={() => handleSimulatedLogin('driver@citymotion.com')} className="text-primary hover:underline">driver@citymotion.com</button></p>
              <p><strong>Funcionário (Professor):</strong> <button onClick={() => handleSimulatedLogin('employee@citymotion.com')} className="text-primary hover:underline">employee@citymotion.com</button></p>
          </CardContent>
        </Card>

         <p className="px-8 text-center text-sm text-muted-foreground">
            Ao clicar em continuar, você concorda com nossos{' '}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Termos de Serviço
            </a>{' '}
            e{' '}
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Política de Privacidade
            </a>
            .
          </p>
      </div>
    </div>
  );
}
