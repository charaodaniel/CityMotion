"use client";

import { useState } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { UserCog, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { Employee } from '@/lib/types';

// Perfis que podem ser atribuídos pelo gestor técnico ou admin
const availableRoles = [
  "Funcionário", 
  "Motorista", 
  "Gestor de Setor", 
  "Administrador", 
  "Técnico de TI",
  "Desenvolvedor Global"
];

export default function ProfilesPage() {
  const { employees, setEmployees, userRole } = useApp();
  const { toast } = useToast();

  const handleRoleChange = async (employeeId: string, newRole: string) => {
    
    // Otimistic UI Update
    const originalEmployees = [...employees];
    const updatedEmployees = employees.map(emp =>
      emp.id === employeeId ? { ...emp, role: newRole } : emp
    );
    setEmployees(updatedEmployees);

    try {
      // API Call via NexusBridge
      const response = await fetch(`/api/nexus/test/db-employees/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar o perfil.');
      }

      toast({
        title: "Perfil Atualizado!",
        description: `O perfil do colaborador foi alterado para ${newRole}.`,
      });

    } catch (error) {
      // Revert on failure
      setEmployees(originalEmployees);
      toast({
        title: "Erro!",
        description: "Não foi possível salvar a alteração no banco de dados.",
        variant: "destructive",
      });
    }
  };
  
  if (!['dev', 'ti', 'admin'].includes(userRole)) {
      return (
          <div className="container mx-auto p-4 sm:p-8">
                <Card className="text-center">
                    <CardHeader>
                        <div className="flex justify-center mb-2 text-destructive"><ShieldAlert className="h-10 w-10" /></div>
                        <CardTitle>Acesso Negado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Esta página está disponível apenas para desenvolvedores, técnicos de TI e administradores.</p>
                    </CardContent>
                </Card>
            </div>
      )
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3">
                <UserCog />
                Gerenciamento de Perfis e Permissões
            </h1>
            <p className="text-muted-foreground">
              {userRole === 'dev' ? 'Modo Global: Visualizando todos os usuários do ecossistema.' : 'Controle de acesso técnico para a organização.'}
            </p>
        </div>
        {userRole === 'dev' && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 w-fit">
                Acesso Root Ativo
            </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tabela de Funcionários e Credenciais</CardTitle>
          <CardDescription>
            Alterar o cargo de um usuário modifica instantaneamente o que ele pode visualizar e executar no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Setor Principal</TableHead>
                <TableHead className="w-[250px]">Perfil de Acesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${employee.id}`} alt={employee.name} />
                            <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold">{employee.name}</p>
                            <p className="text-xs text-muted-foreground font-mono">{employee.email}</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                        {Array.isArray(employee.sector) ? employee.sector.map(s => (
                            <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                        )) : <Badge variant="secondary" className="text-[10px]">{employee.sector}</Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      defaultValue={employee.role}
                      onValueChange={(newRole) => handleRoleChange(employee.id, newRole)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRoles.map((role) => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
