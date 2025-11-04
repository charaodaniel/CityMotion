
"use client";

import type { Employee, EmployeeStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, User, ShieldCheck, Edit, FileText, Link as LinkIcon, Briefcase, Users, Mail } from 'lucide-react';
import { RegisterEmployeeForm } from '@/components/register-employee-form';
import { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useApp } from '@/contexts/app-provider';

function getStatusVariant(status: EmployeeStatus) {
  switch (status) {
    case 'Disponível':
      return 'secondary';
    case 'Em Serviço':
    case 'Em Viagem':
      return 'default';
    case 'Afastado':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function EmployeesPage() {
  const { employees, setEmployees, userRole } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'register' | 'details' | 'edit'>('register');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  const managerSector = "Secretaria de Obras, Viação e Urbanismo"; // Simulating manager's sector for filtering

  const visibleEmployees = useMemo(() => {
    if (userRole === 'manager') {
      return employees.filter(d => d.sector === managerSector);
    }
    return employees;
  }, [employees, userRole, managerSector]);


  const handleCardClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('details');
    setIsModalOpen(true);
  };
  
  const handleOpenRegisterModal = () => {
    setSelectedEmployee(null);
    setModalMode('register');
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('edit');
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleFormSubmit = (newEmployeeData: Partial<Employee>) => {
    if (modalMode === 'edit' && selectedEmployee) {
      setEmployees(employees.map(d => d.id === selectedEmployee.id ? { ...d, ...newEmployeeData } as Employee : d));
    } else {
      const newEmployee: Employee = {
        id: `${employees.length + 1}`,
        status: 'Disponível',
        ...newEmployeeData
      } as Employee;
      setEmployees([...employees, newEmployee]);
    }
    closeModal();
  };
  
  const getModalContent = () => {
    switch (modalMode) {
      case 'register':
        return {
          title: 'Cadastro de Funcionário',
          description: 'Preencha o formulário para cadastrar um novo funcionário da prefeitura.',
          content: <RegisterEmployeeForm onFormSubmit={handleFormSubmit} />
        };
      case 'edit':
         return {
          title: 'Editar Funcionário',
          description: 'Altere as informações do funcionário.',
          content: <RegisterEmployeeForm onFormSubmit={handleFormSubmit} existingEmployee={selectedEmployee} />
        };
      case 'details':
      default:
        return {
          title: selectedEmployee?.name || '',
          description: 'Detalhes do funcionário.',
          content: (
            <>
              <DialogHeader className="items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedEmployee?.id}`} alt={selectedEmployee?.name} />
                      <AvatarFallback>{selectedEmployee?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <DialogTitle className="text-2xl">{selectedEmployee?.name}</DialogTitle>
                  <DialogDescription>
                      {selectedEmployee?.role} • {selectedEmployee?.sector}
                  </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 pr-4">
                <div>
                    <span className="text-sm font-semibold text-muted-foreground">Nome Completo</span>
                    <p className="text-lg">{selectedEmployee?.name}</p>
                </div>
                <Separator />
                {selectedEmployee?.email && (
                  <>
                    <div>
                        <span className="text-sm font-semibold text-muted-foreground">Email de Acesso</span>
                        <p className="text-lg">{selectedEmployee.email}</p>
                    </div>
                    <Separator />
                  </>
                )}
                {selectedEmployee?.matricula && (
                  <>
                      <div>
                          <span className="text-sm font-semibold text-muted-foreground">Matrícula</span>
                          <p className="text-lg">{selectedEmployee.matricula}</p>
                      </div>
                      <Separator />
                  </>
                )}
                 {selectedEmployee?.role && (
                  <>
                      <div>
                          <span className="text-sm font-semibold text-muted-foreground">Cargo</span>
                          <p className="text-lg">{selectedEmployee.role}</p>
                      </div>
                      <Separator />
                  </>
                )}
                {selectedEmployee?.cnh && (
                  <>
                      <div>
                          <span className="text-sm font-semibold text-muted-foreground">CNH</span>
                          <p className="text-lg">{selectedEmployee.cnh}</p>
                      </div>
                      <Separator />
                  </>
                )}
                <div>
                    <span className="text-sm font-semibold text-muted-foreground">Status</span>
                    <div>
                        {selectedEmployee && <Badge variant={getStatusVariant(selectedEmployee.status)}>{selectedEmployee.status}</Badge>}
                    </div>
                </div>
                {(selectedEmployee?.idPhoto || selectedEmployee?.cnhPhoto) && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-base font-semibold mb-3 flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        Documentos
                      </h3>
                      <div className="space-y-2 text-sm">
                        {selectedEmployee.idPhoto && (
                          <Link href="#" className="flex items-center text-primary hover:underline" onClick={(e) => e.preventDefault()}>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            <span>Foto 3x4: {selectedEmployee.idPhoto}</span>
                          </Link>
                        )}
                        {selectedEmployee.cnhPhoto && (
                          <Link href="#" className="flex items-center text-primary hover:underline" onClick={(e) => e.preventDefault()}>
                            <LinkIcon className="mr-2 h-4 w-4" />
                            <span>CNH: {selectedEmployee.cnhPhoto}</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div className="flex justify-end pt-4">
                    <Button variant="outline" onClick={() => handleOpenEditModal(selectedEmployee!)}>
                        <Edit className="mr-2 h-4 w-4"/>
                        Editar
                    </Button>
                </div>
              </div>
            </>
          )
        };
    }
  }
  
  const { title, description, content } = getModalContent();


  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
                <Users />
                Gestão de Funcionários
            </h1>
            <p className="text-muted-foreground">
              {userRole === 'manager'
                ? `Veja e gerencie os funcionários do setor de ${managerSector}.`
                : 'Veja, gerencie e cadastre os funcionários da prefeitura.'
              }
            </p>
        </div>
        <Button onClick={handleOpenRegisterModal} className="bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Cadastrar Novo Funcionário
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleEmployees.map((employee) => (
          <Card 
            key={employee.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <div onClick={() => handleCardClick(employee)}>
                <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${employee.id}`} alt={employee.name} />
                    <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{employee.name}</span>
                </CardTitle>
                <CardDescription>{employee.role} • {employee.sector}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                <Badge variant={getStatusVariant(employee.status)}>{employee.status}</Badge>
                {employee.cnh && (
                    <div className="flex items-center text-xs text-muted-foreground">
                        <ShieldCheck className="mr-1.5 h-3 w-3" />
                        <span>CNH Válida</span>
                    </div>
                )}
                </CardContent>
            </div>
             <CardContent className="p-2 pt-0">
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" asChild>
                    <Link href={`/cracha/${employee.id}`} target="_blank">
                        <Briefcase className="mr-2 h-4 w-4" />
                        Ver Crachá Virtual
                    </Link>
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {visibleEmployees.length === 0 && (
        <div className="text-center text-muted-foreground py-8 border-dashed border-2 rounded-lg col-span-full">
            <p>Nenhum funcionário cadastrado no momento.</p>
            <p className="text-sm mt-2">Clique em "Cadastrar Novo Funcionário" para começar.</p>
        </div>
      )}

      {/* Employee Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className={modalMode !== 'details' ? 'sm:max-w-3xl' : ''}>
          <ScrollArea className="max-h-[80vh] p-4">
              {modalMode === 'details' ? content : (
                <>
                  <DialogHeader>
                      <DialogTitle className="text-2xl">{title}</DialogTitle>
                      <DialogDescription>{description}</DialogDescription>
                  </DialogHeader>
                  {content}
                </>
              )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

    </div>
  );
}
