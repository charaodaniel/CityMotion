
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/app-provider';
import { CarFront, LogIn, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const { setUserRole } = useApp();
  const [email, setEmail] = useState('admin@citymotion.com');

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    if (email.startsWith('admin')) {
      setUserRole('admin');
    } else if (email.startsWith('manager')) {
      setUserRole('manager');
    } else if (email.startsWith('driver')) {
      setUserRole('driver');
    } else {
      setUserRole('employee');
    }

    router.push('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
            <div className="flex items-center gap-3 text-foreground">
                <div className="bg-foreground text-background p-2.5 rounded-lg">
                    <CarFront className="h-7 w-7" />
                </div>
                <h1 className="text-3xl font-bold tracking-tighter">
                CityMotion
                </h1>
          </div>
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
                    defaultValue="123456"
                />
              </div>
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/50">
          <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Credenciais de Teste
              </CardTitle>
              <CardDescription>Use os e-mails abaixo para acessar como diferentes perfis (a senha pode ser qualquer uma).</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
              <p><strong>Admin:</strong> <button onClick={() => setEmail('admin@citymotion.com')} className="text-primary hover:underline">admin@citymotion.com</button></p>
              <p><strong>Gestor:</strong> <button onClick={() => setEmail('manager@citymotion.com')} className="text-primary hover:underline">manager@citymotion.com</button></p>
              <p><strong>Motorista:</strong> <button onClick={() => setEmail('driver@citymotion.com')} className="text-primary hover:underline">driver@citymotion.com</button></p>
              <p><strong>Funcionário:</strong> <button onClick={() => setEmail('employee@citymotion.com')} className="text-primary hover:underline">employee@citymotion.com</button></p>
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
