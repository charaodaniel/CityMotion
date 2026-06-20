
"use client";

import type { Employee, EmployeeStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PlusCircle, ShieldCheck, Edit, FileText, Link as LinkIcon, Briefcase, Users, Loader2, Trash2 } from 'lucide-react';
import { RegisterEmployeeForm } from '@/components/forms/register-employee-form';
import { useState, useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useApp } from '@/contexts/app-provider';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

function getStatusVariant(status: EmployeeStatus | string) {
  switch (status) {
    case 'Disponível':
      return 'secondary';
    case 'Em Serviço':
    case 'Em Viagem':
      return 'default';
    case 'Afastado':
    case 'Desativado':
      return 'destructive';
    default:
      return 'outline';
  }
}

export default function EmployeesPage() {
  const { employees, userRole, selectedSector, updateEmployee, addEmployee, deleteEmployee } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'register' | 'details' | 'edit'>('register');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const visibleEmployees = useMemo(() => {
    // Desenvolvedores veem todos, inclusive desativados
    if (userRole === 'dev') return employees;
    
    // Gestores e Admins veem apenas os ativos (ou do seu setor)
    let list = employees.filter(e => e.status !== 'Desativado');
    if (userRole === 'manager' && selectedSector) {
      return list.filter(d => d.sector.includes(selectedSector));
    }
    return list;
  }, [employees, userRole, selectedSector]);


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
    if (isProcessing) return;
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleFormSubmit = async (newEmployeeData: Partial<Employee>) => {
    setIsProcessing(true);
    try {
        if (modalMode === 'edit' && selectedEmployee) {
            await updateEmployee(selectedEmployee.id, newEmployeeData);
        } else {
            await addEmployee({
                ...newEmployeeData,
                status: 'Disponível'
            });
        }
        setIsModalOpen(false);
        setSelectedEmployee(null);
    } catch (e) {
        console.error("Falha ao salvar funcionário");
    } finally {
        setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsProcessing(true);
    try {
        await deleteEmployee(id);
        setIsModalOpen(false);
    } finally {
        setIsProcessing(false);
    }
  };
  
  const getModalContent = () => {
    switch (modalMode) {
      case 'register':
        return {
          title: 'Cadastro de Funcionário',
          description: 'Preencha o formulário para cadastrar um novo funcionário.',
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
                  <Avatar className="h-24 w-24 mb-4 border-2 border-primary/20">
                      <AvatarImage src={`https://i.pravatar.cc/150?u=${selectedEmployee?.id}`} alt={selectedEmployee?.name} />
                      <AvatarFallback>{selectedEmployee?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <DialogTitle className="text-2xl font-bold tracking-tight">{selectedEmployee?.name}</DialogTitle>
                  <DialogDescription className="text-xs uppercase tracking-widest font-mono text-primary/70">
                      {selectedEmployee?.role} • {selectedEmployee?.sector.join(', ')}
                  </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 pr-4 mt-6">
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Nome Completo</span>
                    <p className="text-lg font-bold">{selectedEmployee?.name}</p>
                </div>
                <Separator className="bg-border/30" />
                {selectedEmployee?.email && (
                  <>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email de Acesso</span>
                        <p className="text-base font-mono">{selectedEmployee.email}</p>
                    </div>
                    <Separator className="bg-border/30" />
                  </>
                )}
                {selectedEmployee?.matricula && (
                  <>
                      <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Matrícula</span>
                          <p className="text-base font-mono font-bold text-primary">{selectedEmployee.matricula}</p>
                      </div>
                      <Separator className="bg-border/30" />
                  </>
                )}
                <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</span>
                    <div className="mt-1">
                        {selectedEmployee && <Badge variant={getStatusVariant(selectedEmployee.status)}>{selectedEmployee.status}</Badge>}
                    </div>
                </div>

                <div className="flex justify-between items-center pt-8">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs font-bold uppercase tracking-widest">
                                <Trash2 className="mr-2 h-3.5 w-3.5"/>
                                {userRole === 'dev' ? 'Remover Definitivo' : 'Desativar Registro'}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-sidebar border-border/50">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {userRole === 'dev' 
                                        ? "Esta ação removerá permanentemente o funcionário do banco de dados SQLite. Esta ação não pode ser desfeita." 
                                        : "O funcionário será marcado como 'Desativado' e não aparecerá mais nas listagens operacionais, mas o histórico será preservado."}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="border-border/50">Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={() => selectedEmployee && handleDelete(selectedEmployee.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    Confirmar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(selectedEmployee!)} className="text-xs uppercase font-bold tracking-widest">
                        <Edit className="mr-2 h-3.5 w-3.5"/>
                        Editar Registro
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
    <div className="container mx-auto p-4 sm:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
            <h1 className="text-5xl font-black tracking-tighter text-on-surface flex items-center gap-4">
                <Users className="h-10 w-10 text-primary" />
                Funcionários
            </h1>
            <p className="text-muted-foreground text-lg mt-1 font-medium">
              {userRole === 'manager'
                ? `Gestão de equipe para o setor de ${selectedSector}.`
                : 'Controle de acesso e identificação NexusOS.'
              }
            </p>
        </div>
        <Button onClick={handleOpenRegisterModal} className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6 rounded-lg font-bold uppercase tracking-widest text-xs">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Colaborador
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleEmployees.map((employee) => (
          <Card 
            key={employee.id} 
            className={cn(
                "cursor-pointer hover:border-primary transition-all duration-300 bg-sidebar/50 border-border/50 overflow-hidden group",
                employee.status === 'Desativado' && "opacity-60 grayscale border-destructive/20"
            )}
          >
            <div onClick={() => handleCardClick(employee)} className="p-6">
                <CardHeader className="p-0 mb-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 border-2 border-primary/20">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${employee.id}`} alt={employee.name} />
                            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                            <CardTitle className="text-lg font-bold truncate leading-tight">{employee.name}</CardTitle>
                            <CardDescription className="text-[10px] uppercase tracking-widest font-mono text-primary/70 truncate">{employee.role}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0 flex items-center justify-between">
                    <Badge variant={getStatusVariant(employee.status)} className="text-[10px] font-bold uppercase tracking-tight">{employee.status}</Badge>
                    {employee.cnh && (
                        <div className="flex items-center text-[10px] font-mono font-bold text-emerald-500/70">
                            <ShieldCheck className="mr-1.5 h-3 w-3" />
                            <span>CNH_OK</span>
                        </div>
                    )}
                </CardContent>
            </div>
             <CardContent className="p-2 pt-0">
                <Button variant="ghost" size="sm" className="w-full justify-start text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors" asChild>
                    <Link href={`/cracha/${employee.id}`} target="_blank">
                        <Briefcase className="mr-2 h-3.5 w-3.5" />
                        Ver Crachá Virtual
                    </Link>
                </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {visibleEmployees.length === 0 && (
        <div className="text-center text-muted-foreground py-20 border-dashed border-2 rounded-xl bg-sidebar/30">
            <p className="text-lg italic">Nenhum funcionário cadastrado no momento.</p>
            <Button variant="link" onClick={handleOpenRegisterModal} className="mt-2 text-primary font-bold uppercase tracking-widest text-xs">Cadastrar agora</Button>
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className={modalMode !== 'details' ? 'sm:max-w-3xl border-border/50 bg-sidebar p-0 overflow-hidden' : 'border-border/50 bg-sidebar p-0 overflow-hidden'}>
          <div className="h-1.5 w-full bg-primary" />
          <ScrollArea className="max-h-[80vh] p-8">
              {modalMode === 'details' ? content : (
                <>
                  <DialogHeader className="mb-6">
                      <DialogTitle className="text-2xl font-black tracking-tight">{title}</DialogTitle>
                      <DialogDescription className="text-xs font-mono uppercase tracking-widest text-primary/70">{description}</DialogDescription>
                  </DialogHeader>
                  <div className="scanlines rounded-lg border border-border/50 p-6 bg-accent/10 relative">
                    {isProcessing && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center rounded-lg">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                    {content}
                  </div>
                </>
              )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

    </div>
  );
}
