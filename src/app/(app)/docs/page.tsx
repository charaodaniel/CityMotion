
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  BookOpen, 
  Users, 
  Car, 
  ShieldCheck, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2,
  Info,
  Smartphone,
  LayoutDashboard,
  Route,
  Wrench,
  FileText,
  CalendarClock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function DocsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8 space-y-8 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tighter flex items-center gap-4">
          <BookOpen className="h-10 w-10 text-primary" />
          Central de Ajuda // CityMotion
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          Guia completo para utilização e gerenciamento da frota inteligente.
        </p>
      </div>

      <Tabs defaultValue="intro" className="space-y-6">
        <TabsList className="bg-sidebar border border-border/50 p-1 w-full lg:w-fit justify-start overflow-x-auto h-auto gap-1">
          <TabsTrigger value="intro" className="text-xs font-bold uppercase tracking-widest gap-2">
            <Info className="h-3 w-3" /> Introdução
          </TabsTrigger>
          <TabsTrigger value="roles" className="text-xs font-bold uppercase tracking-widest gap-2">
            <Users className="h-3 w-3" /> Perfis
          </TabsTrigger>
          <TabsTrigger value="trips" className="text-xs font-bold uppercase tracking-widest gap-2">
            <Route className="h-3 w-3" /> Missões
          </TabsTrigger>
          <TabsTrigger value="badge" className="text-xs font-bold uppercase tracking-widest gap-2">
            <Smartphone className="h-3 w-3" /> Crachá Virtual
          </TabsTrigger>
          <TabsTrigger value="faq" className="text-xs font-bold uppercase tracking-widest gap-2 text-primary">
            <HelpCircle className="h-3 w-3" /> FAQ
          </TabsTrigger>
        </TabsList>

        {/* INTRODUÇÃO */}
        <TabsContent value="intro" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-sidebar/50 border-border/50 col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Bem-vindo ao CityMotion</CardTitle>
                <CardDescription>O sistema operacional para a logística da sua organização.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  O CityMotion é um ecossistema SaaS desenvolvido para modernizar a gestão de frotas públicas e privadas. Nossa plataforma centraliza desde a solicitação de transporte por colaboradores até o controle técnico de manutenção em oficina.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-border/30">
                    <LayoutDashboard className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Dashboards</h4>
                      <p className="text-xs">Visão em tempo real de toda a operação.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10 border border-border/30">
                    <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Segurança</h4>
                      <p className="text-xs">Conformidade total com a LGPD e auditoria.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Status do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span>Engine NexusBridge</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Operacional</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span>Banco de Dados</span>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Sincronizado</Badge>
                </div>
                <Separator className="bg-primary/10" />
                <p className="text-[10px] text-muted-foreground italic">
                  Sua sessão está protegida por criptografia de ponta a ponta via protocolo JWT.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PERFIS E PERMISSÕES */}
        <TabsContent value="roles" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                role: "Administrador", 
                desc: "Gestão estratégica total da frota, faturamento e configurações globais do sistema.",
                icon: ShieldCheck,
                color: "text-amber-500"
              },
              { 
                role: "Gestor de Unidade", 
                desc: "Responsável por aprovar solicitações e gerenciar a escala local de motoristas e veículos.",
                icon: Users,
                color: "text-primary"
              },
              { 
                role: "Motorista", 
                desc: "Executa missões, realiza checklists de segurança e registra ocorrências de campo.",
                icon: Car,
                color: "text-emerald-500"
              },
              { 
                role: "Colaborador", 
                desc: "Perfil de uso geral para solicitar transportes corporativos de forma rápida.",
                icon: Info,
                color: "text-zinc-400"
              },
              { 
                role: "Técnico Mecânico", 
                desc: "Gerencia ordens de serviço, manutenção preventiva e compra de componentes.",
                icon: Wrench,
                color: "text-primary"
              }
            ].map((item, idx) => (
              <Card key={idx} className="bg-sidebar/50 border-border/50 overflow-hidden">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className={cn("p-2 rounded-lg bg-background border border-border/50", item.color)}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{item.role}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* SOLICITANDO VIAGENS */}
        <TabsContent value="trips" className="space-y-6">
          <Card className="bg-sidebar/50 border-border/50">
            <CardHeader>
              <CardTitle>Fluxo de Missões Logísticas</CardTitle>
              <CardDescription>Como transformar um pedido em uma viagem concluída.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                {[
                  { title: "Solicitação", desc: "O colaborador preenche o formulário 'Pedir Transporte' informando motivo e destino.", icon: FileText },
                  { title: "Análise", desc: "O gestor do setor analisa a prioridade e aprova ou rejeita o pedido no painel.", icon: CheckCircle2 },
                  { title: "Escala", desc: "O sistema aloca automaticamente um motorista disponível e um veículo da frota.", icon: CalendarClock },
                  { title: "Execução", desc: "O motorista realiza o checklist de saída no app e inicia o trajeto.", icon: Play },
                  { title: "Conclusão", desc: "Ao chegar, a quilometragem é registrada e o veículo retorna ao status 'Disponível'.", icon: Flag }
                ].map((step, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary bg-background text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-xs">
                      {i + 1}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-border/50 bg-accent/5">
                      <h4 className="font-bold text-foreground flex items-center gap-2">
                        <step.icon className="h-4 w-4 text-primary" />
                        {step.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CRACHÁ VIRTUAL */}
        <TabsContent value="badge" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">Identificação Digital Inviolável</h2>
              <p className="text-muted-foreground">
                O Crachá Virtual CityMotion substitui o plástico tradicional por uma identidade dinâmica protegida por QR Code criptografado.
              </p>
              <ul className="space-y-3">
                {[
                  "Validação em tempo real via NexusBridge",
                  "Histórico de acesso vinculado à matrícula",
                  "Otimizado para leitura em tablets de guarita",
                  "Modo Offline para situações de baixa conectividade"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <Card className="bg-zinc-950 border-primary/20 relative overflow-hidden p-8 aspect-[3/4] max-w-sm mx-auto flex flex-col items-center justify-center text-center">
               <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
               <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 mb-4" />
               <div className="h-4 w-32 bg-primary/20 rounded mb-2" />
               <div className="h-3 w-20 bg-muted rounded mb-8" />
               <div className="w-32 h-32 bg-white rounded-lg opacity-80 mb-4" />
               <p className="text-[10px] font-mono text-primary/50 uppercase tracking-widest">Digital Badge Preview</p>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ / RESOLUÇÃO DE PROBLEMAS */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="bg-sidebar/50 border-border/50">
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription>Respostas rápidas para as dúvidas mais comuns da operação.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-border/30">
                  <AccordionTrigger>Como alterar minha senha?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Para garantir a segurança, a alteração de senha deve ser solicitada ao administrador de TI da sua organização. Em breve, permitiremos a troca direta pelo painel de perfil.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-border/30">
                  <AccordionTrigger>O que fazer se o veículo apresentar defeito durante a viagem?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Acesse o menu 'Missões', selecione sua viagem ativa e clique em 'Relatar Sinistro'. Isso notificará instantaneamente a oficina e o seu gestor imediato.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-border/30">
                  <AccordionTrigger>Minha solicitação foi rejeitada. Por quê?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    As solicitações podem ser rejeitadas por falta de disponibilidade de veículos no setor, manutenção agendada ou baixa prioridade frente a emergências de saúde e segurança pública.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper icons for the timeline
function Play(props: any) { return <ArrowRight {...props} /> }
function Flag(props: any) { return <CheckCircle2 {...props} /> }
