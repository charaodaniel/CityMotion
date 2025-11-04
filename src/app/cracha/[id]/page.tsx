
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { drivers } from '@/lib/data';
import type { Driver } from '@/lib/types';
import { Building, CarFront, ScanLine, User, Printer } from 'lucide-react';
import QRCode from 'qrcode.react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function BadgePage() {
  const params = useParams();
  const { id } = params;
  const [employee, setEmployee] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [badgeUrl, setBadgeUrl] = useState('');

  useEffect(() => {
    // This ensures window is defined, running only on the client side.
    setBadgeUrl(window.location.href);

    // Simulate fetching data
    const foundDriver = drivers.find(d => d.id === id);
    if (foundDriver) {
      setEmployee(foundDriver);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
            <Skeleton className="h-[450px] w-full max-w-sm" />
        </div>
    )
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
        <Card className="w-full max-w-sm text-center">
            <CardHeader>
                <h2 className="text-xl font-semibold">Funcionário Não Encontrado</h2>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">O link do crachá pode estar incorreto ou o funcionário não foi encontrado.</p>
            </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleName = (sector: string) => {
    if (sector === 'Administração') return 'Administrador';
    if (sector === 'Secretaria de Obras') return 'Gestor de Setor';
    return 'Funcionário';
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4 font-sans">
      <Card className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-background to-muted/30 border-primary/20 print:shadow-none print:border-none">
        <CardHeader className="bg-primary/10 p-6 text-center space-y-4">
            <div className="flex items-center justify-center gap-3 text-foreground">
                <div className="bg-foreground text-background p-2.5 rounded-lg">
                    <CarFront className="h-6 w-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tighter">
                    CityMotion
                </h1>
            </div>
            <p className="text-sm text-primary font-semibold">IDENTIFICAÇÃO FUNCIONAL</p>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <Avatar className="h-32 w-32 mx-auto mb-6 ring-4 ring-primary/50">
            <AvatarImage src={`https://i.pravatar.cc/300?u=${employee.id}`} alt={employee.name} />
            <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{employee.name}</h2>
          <p className="text-base text-muted-foreground">{getRoleName(employee.sector)}</p>
          
          <div className="mt-6 text-left space-y-3 text-sm">
            <div className="flex items-center">
                <Building className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>Setor: <strong>{employee.sector}</strong></span>
            </div>
            {employee.matricula && (
                 <div className="flex items-center">
                    <User className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span>Matrícula: <strong>{employee.matricula}</strong></span>
                </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 flex flex-col items-center justify-center gap-4">
          {badgeUrl ? (
             <QRCode
                value={badgeUrl}
                size={128}
                bgColor="transparent"
                fgColor="hsl(var(--foreground))"
                level="L"
              />
          ) : (
            <Skeleton className="h-32 w-32" />
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground print:hidden">
            <ScanLine className="h-4 w-4" />
            <span>Aponte a câmera para ver online</span>
          </div>
        </CardFooter>
      </Card>
      <div className="mt-6 print:hidden">
          <Button onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Crachá
          </Button>
      </div>
    </div>
  );
}
