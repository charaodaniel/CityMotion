"use client";

import { useState } from 'react';
import { useApp } from '@/contexts/app-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UserCog } from 'lucide-react';
import type { Employee } from '@/lib/types';

// Simula os perfis que podem ser atribuídos
const availableRoles = ["Funcionário", "Motorista", "Gestor de Setor", "Administrador"];

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
      // API Call
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId, newRole }),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar o perfil.');
      }

      const result = await response.json();
      
      // Update state with the confirmed data from the server
      setEmployees(result.employees);

      toast({
        title: "Perfil Atualizado!",
        description: `O perfil de ${result.updatedEmployee.name} foi alterado para ${result.updatedEmployee.role}.`,
      });

    } catch (error) {
      // Revert on failure
      setEmployees(originalEmployees);
      toast({
        title: "Erro!",
        description: "Não foi possível salvar a alteração. Tente novamente.",
        variant: "destructive",
      });
    }
  };
  
  if (userRole !== 'admin') {
      return (
          <div className="container mx-auto p-4 sm:p-8">
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle>Acesso Negado</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Esta página está disponível apenas para administradores.</p>
                    </CardContent>
                </Card>
            </div>
      )
  }

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-3">
            <UserCog />
            Gerenciamento de Perfis
        </h1>
        <p className="text-muted-foreground">
          Atribua perfis de acesso e permissões para os funcionários do sistema.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tabela de Funcionários e Perfis</CardTitle>
          <CardDescription>
            Selecione um novo perfil para um funcionário para atualizar suas permissões.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Funcionário</TableHead>
                <TableHead>Setor</TableHead>
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
                            <p className="text-sm text-muted-foreground">{employee.matricula}</p>
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.sector}</TableCell>
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
