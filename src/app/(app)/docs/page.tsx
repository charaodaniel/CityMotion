
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Documentação do Sistema
        </h1>
        <p className="text-muted-foreground">
          Guias e manuais para utilizar o CityMotion.
        </p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-primary" />
                Manual do Usuário
            </CardTitle>
            <CardDescription>
                Este guia abrange as funcionalidades essenciais para todos os usuários do sistema.
            </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base max-w-none dark:prose-invert">
            <h2 className="text-xl font-bold">1. Acesso ao Sistema</h2>
            <p>
                Para acessar o sistema, utilize o e-mail e a senha fornecidos pelo departamento de TI. Na tela de login, você pode usar os e-mails de teste para simular o acesso com diferentes perfis (Administrador, Gestor, Motorista e Funcionário).
            </p>

            <h2 className="text-xl font-bold">2. Como Solicitar um Transporte</h2>
            <p>
                Qualquer funcionário, gestor ou administrador pode solicitar um transporte de forma rápida:
            </p>
            <ol>
                <li>No painel principal, clique no botão "Pedir Transporte".</li>
                <li>Preencha o formulário informando seu setor, o motivo da viagem e, opcionalmente, o destino e a data/hora desejada.</li>
                <li>Clique em "Enviar Pedido Rápido". Sua solicitação será enviada para o gestor do seu setor para aprovação.</li>
            </ol>

            <h2 className="text-xl font-bold">3. Acompanhando Viagens</h2>
            <p>
                Na página "Viagens", você pode visualizar todas as viagens em um painel Kanban, divididas por status: Agendadas, Em Andamento e Concluídas.
            </p>
            <ul>
                <li><strong>Agendadas:</strong> Viagens que foram aprovadas e aguardam o início.</li>
                <li><strong>Em Andamento:</strong> Viagens que já começaram.</li>
                <li><strong>Concluídas:</strong> Histórico de viagens finalizadas.</li>
            </ul>

            <h2 className="text-xl font-bold">4. Crachá Virtual</h2>
            <p>
                Cada funcionário possui um crachá virtual com um QR Code único para identificação.
            </p>
            <ul>
                <li>Acesse seu crachá através do link na página "Motoristas" ou no seu perfil.</li>
                <li>O QR Code pode ser escaneado para verificar suas informações online, garantindo que os dados estejam sempre atualizados.</li>
                <li>Utilize o botão "Imprimir Crachá" para gerar uma versão física, ideal para cartões de visita ou para apresentar em locais que exigem identificação.</li>
            </ul>
        </CardContent>
      </Card>
    </div>
  );
}
