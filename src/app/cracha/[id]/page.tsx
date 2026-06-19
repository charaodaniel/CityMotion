
"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Employee } from '@/lib/types';
import { Building, CarFront, ScanLine, User, Printer, Briefcase, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function BadgePage() {
  const params = useParams();
  const { id } = params;
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);
  const [badgeUrl, setBadgeUrl] = useState('');

  useEffect(() => {
    // Define a URL do crachá para o QR Code
    if (typeof window !== 'undefined') {
      setBadgeUrl(window.location.href);
    }

    if (id) {
        setLoading(true);
        // Busca os dados diretamente da API pública de dados
        // Isso garante que o crachá abra mesmo sem o usuário estar logado no sistema
        fetch('/api/data?type=employees')
            .then(res => res.json())
            .then((employees: Employee[]) => {
                const foundEmployee = employees.find(d => String(d.id) === String(id));
                if (foundEmployee) {
                    setEmployee(foundEmployee);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch employee data:", err);
                setLoading(false);
            });
    }
  }, [id]);


  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Validando Identificação...</p>
        </div>
    )
  }

  if (!employee) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
        <Card className="w-full max-w-sm text-center">
            <CardHeader>
                <h2 className="text-xl font-semibold">Identificação Não Encontrada</h2>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">O link do crachá pode ter expirado ou o registro foi removido do sistema.</p>
            </CardContent>
            <CardFooter className="justify-center">
                <Button variant="outline" onClick={() => window.location.href = '/'}>Voltar ao Início</Button>
            </CardFooter>
        </Card>
      </div>
    );
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
          <p className="text-base text-muted-foreground">{employee.role}</p>
          
          <div className="mt-6 text-left space-y-3 text-sm">
            <div className="flex items-center">
                <Building className="mr-3 h-4 w-4 text-muted-foreground" />
                <span>Setor(es): <strong>{Array.isArray(employee.sector) ? employee.sector.join(', ') : employee.sector}</strong></span>
            </div>
            {employee.matricula && (
                 <div className="flex items-center">
                    <User className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span>Matrícula: <strong>{employee.matricula}</strong></span>
                </div>
            )}
             {employee.role && (
                 <div className="flex items-center">
                    <Briefcase className="mr-3 h-4 w-4 text-muted-foreground" />
                    <span>Cargo: <strong>{employee.role}</strong></span>
                </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 flex flex-col items-center justify-center gap-4">
          {badgeUrl ? (
             <div className="bg-white p-2 rounded-lg shadow-sm">
                <QRCodeSVG
                    value={badgeUrl}
                    size={140}
                    level="H"
                    includeMargin={false}
                />
             </div>
          ) : (
            <Skeleton className="h-32 w-32" />
          )}
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest print:hidden">
            <ScanLine className="h-3 w-3" />
            <span>Validação Online Disponível</span>
          </div>
        </CardFooter>
      </Card>
      
      <div className="mt-8 flex gap-3 print:hidden">
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {
              if (navigator.share) {
                  navigator.share({
                      title: `Crachá Virtual - ${employee.name}`,
                      url: badgeUrl
                  });
              }
          }}>
             Compartilhar
          </Button>
      </div>
      
      <p className="mt-12 text-[10px] text-muted-foreground text-center max-w-[250px] leading-tight">
        Documento gerado pelo sistema CityMotion. A autenticidade pode ser verificada através do escaneamento do código acima.
      </p>
    </div>
  );
}
