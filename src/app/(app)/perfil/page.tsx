
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/contexts/app-provider";
import type { Driver, VehicleRequest, VehicleRequestStatus } from "@/lib/types";
import { User, Mail, Building, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function getStatusVariant(status: VehicleRequestStatus) {
  switch (status) {
    case 'Pendente':
      return 'secondary';
    case 'Aprovada':
      return 'default';
    case 'Rejeitada':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function ProfilePage() {
  const { userRole, drivers, vehicleRequests } = useApp();
  
  const { currentUser, userEmail } = useMemo(() => {
    let user: Driver | undefined;
    let email: string = 'user@citymotion.com';

    // This simulation should be replaced by real auth data
    switch (userRole) {
      case 'admin':
        user = drivers.find(d => d.name === 'Pedro Santos');
        email = 'admin@citymotion.com';
        break;
      case 'manager':
        user = drivers.find(d => d.name === 'João da Silva');
        email = 'manager@citymotion.com';
        break;
      case 'driver':
        user = drivers.find(d => d.name === 'Maria Oliveira');
        email = 'driver@citymotion.com';
        break;
      case 'employee':
        user = drivers.find(d => d.name === 'Ana Souza');
        email = 'employee@citymotion.com';
        break;
      default:
        user = drivers[0];
        if (user) {
          email = `${user.name.toLowerCase().replace(/\s+/g, '.')}@citymotion.com`;
        }
    }
    return { currentUser: user, userEmail: email };
  }, [userRole, drivers]);

  const userRequests = useMemo(() => {
    // This is a simulation. In a real app, you'd filter by the logged-in user's ID.
    if (!currentUser) return [];
    
    if (userRole === 'employee') {
      // Find requests made by 'Ana Souza' (our simulated employee)
      return vehicleRequests.filter(req => 
        req.requester?.toLowerCase().includes('ana souza')
      );
    }
    
    // For drivers, managers, admins, find trips they are the driver for
    return vehicleRequests.filter(req => req.requester === currentUser.name);

  }, [currentUser, userRole, vehicleRequests]);


  if (!currentUser) {
    return (
      <div className="container mx-auto p-4 sm:p-8">
        <p>Usuário não encontrado.</p>
      </div>
    );
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'manager': return 'Gestor de Setor';
      case 'driver': return 'Motorista';
      case 'employee': return 'Funcionário';
      default: return 'Desconhecido';
    }
  }

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Meu Perfil
        </h1>
        <p className="text-muted-foreground">
          Suas informações pessoais e histórico de atividades.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="md:col-span-1 space-y-8">
            <Card>
                <CardHeader className="items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${currentUser.id}`} alt={currentUser.name} />
                        <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
                    <CardDescription>{getRoleName(userRole)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center">
                        <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span>{userEmail}</span>
                    </div>
                     <div className="flex items-center">
                        <Building className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span>Setor: <strong>{currentUser.sector}</strong></span>
                    </div>
                    {currentUser.cnh && (
                        <div className="flex items-center">
                            <ShieldCheck className="mr-3 h-4 w-4 text-muted-foreground" />
                            <span>CNH: {currentUser.cnh}</span>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

        {/* Activity History Card */}
        <div className="md:col-span-2">
             <Card>
                <CardHeader>
                    <CardTitle>Histórico de Solicitações</CardTitle>
                    <CardDescription>
                        {userRequests.length > 0 
                            ? 'Suas solicitações de viagem mais recentes.'
                            : 'Você ainda não fez nenhuma solicitação de viagem.'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {userRequests.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Motivo</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userRequests.map((request) => (
                                    <TableRow key={request.id}>
                                        <TableCell className="font-medium">{request.title}</TableCell>
                                        <TableCell>{format(new Date(request.requestDate), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(request.status)}>{request.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                         <div className="text-center text-muted-foreground py-8">
                            <p>Nenhum histórico para exibir.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
