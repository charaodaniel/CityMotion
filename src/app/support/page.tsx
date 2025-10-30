import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Book, LifeBuoy } from 'lucide-react';

const faqItems = [
  {
    question: "Como faço para solicitar um veículo?",
    answer: "Na página 'Viagens', clique em 'Agendar Nova Viagem' e preencha o formulário com os detalhes do seu trajeto. Sua solicitação será enviada para aprovação."
  },
  {
    question: "Quem aprova minha solicitação de viagem?",
    answer: "Viagens dentro do seu setor são aprovadas pelo seu gestor. Trajetos para outros setores ou municípios são encaminhadas para o Secretário de Transporte."
  },
  {
    question: "Como altero minha senha?",
    answer: "No momento, a alteração de senha deve ser solicitada ao administrador do sistema (TI). Em breve, essa funcionalidade estará disponível no seu perfil."
  },
  {
    question: "Onde visualizo minhas viagens agendadas?",
    answer: "Todas as suas viagens, tanto as futuras quanto as já realizadas, podem ser encontradas na página 'Viagens' ou na sua página de perfil."
  }
]

export default function SupportPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Central de Suporte
        </h1>
        <p className="text-muted-foreground">
          Precisa de ajuda? Encontre aqui respostas e formas de contato.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                Contato
              </CardTitle>
              <CardDescription>
                Entre em contato com nossa equipe de suporte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">Suporte Técnico</h3>
                <p className="text-muted-foreground text-sm">
                  Para problemas com o sistema, bugs ou falhas.
                </p>
                <a href="mailto:suporte.ti@prefeitura.gov.br" className="text-primary hover:underline">
                  suporte.ti@prefeitura.gov.br
                </a>
              </div>
               <div>
                <h3 className="font-semibold">Administração da Frota</h3>
                <p className="text-muted-foreground text-sm">
                  Para dúvidas sobre aprovações, escalas e veículos.
                </p>
                <a href="mailto:frota@prefeitura.gov.br" className="text-primary hover:underline">
                  frota@prefeitura.gov.br
                </a>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Book className="mr-2 h-5 w-5 text-primary" />
                Recursos
              </CardTitle>
              <CardDescription>
                Consulte a documentação e os guias do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
               <a href="#" className="flex items-center text-primary hover:underline">
                  <LifeBuoy className="mr-2 h-4 w-4" /> Manual do Usuário
                </a>
                 <a href="#" className="flex items-center text-primary hover:underline">
                  <LifeBuoy className="mr-2 h-4 w-4" /> Guia do Gestor de Frota
                </a>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
            <CardDescription>
              Respostas rápidas para as dúvidas mais comuns.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
