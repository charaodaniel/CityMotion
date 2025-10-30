
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApp } from "@/contexts/app-provider";
import { drivers, schedules } from "@/lib/data";
import type { Schedule, ScheduleStatus } from "@/lib/types";
import { User, Mail, Building, ShieldCheck } from "lucide-react";

function getStatusVariant(status: ScheduleStatus) {
  switch (status) {
    case 'Agendada':
      return 'secondary';
    case 'Em Andamento':
      return 'default';
    case 'Concluída':
      return 'outline';
    default:
      return 'outline';
  }
}

export default function ProfilePage() {
  const { userRole } = useApp();
  
  // Simulating fetching the logged-in user's data
  // In a real app, this would come from an authentication context
  const currentUser = drivers.find(d => d.name === 'João da Silva');
  const userSchedules = schedules.filter(s => s.driver === currentUser?.name);

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
      case 'manager': return 'Gestor';
      case 'driver': return 'Motorista';
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
                        <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
                    <CardDescription>{getRoleName(userRole)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center">
                        <Mail className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span>{currentUser.name.toLowerCase().replace(' ', '.')}@citymotion.com</span>
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
                    <CardTitle>Histórico de Viagens</CardTitle>
                    <CardDescription>
                        {userSchedules.length > 0 
                            ? 'Suas viagens mais recentes realizadas no sistema.'
                            : 'Você ainda não realizou nenhuma viagem.'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {userSchedules.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Viagem</TableHead>
                                    <TableHead>Veículo</TableHead>
                                    <TableHead>Data</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userSchedules.map((schedule) => (
                                    <TableRow key={schedule.id}>
                                        <TableCell className="font-medium">{schedule.title}</TableCell>
                                        <TableCell>{schedule.vehicle}</TableCell>
                                        <TableCell>{schedule.time.split(' - ')[0]}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(schedule.status)}>{schedule.status}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                         <div className="text-center text-muted-foreground py-8">
                            <p>Nenhum histórico de viagens para exibir.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
