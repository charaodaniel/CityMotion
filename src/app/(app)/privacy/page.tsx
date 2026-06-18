
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText, Database, Share2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-4xl space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight font-headline flex items-center gap-3">
          <Shield className="h-10 w-10 text-primary" />
          Política de Privacidade (LGPD)
        </h1>
        <p className="text-muted-foreground text-lg italic">
          Última atualização: Março de 2024
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Compromisso com a Proteção de Dados</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
          <p>
            O <strong>CityMotion</strong>, enquanto ferramenta de gestão de frota para organizações, leva a sério a segurança das informações de seus colaboradores. Esta política descreve como coletamos e protegemos seus dados em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoal (Lei nº 13.709/2018)</strong>.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Eye className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">O que coletamos</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Dados de Identificação: Nome, Matrícula, E-mail corporativo.</p>
            <p>• Dados Técnicos: CNH (para motoristas), Foto funcional.</p>
            <p>• Dados de Geolocalização: Origem e destino de viagens.</p>
            <p>• Atividade: Histórico de uso do sistema e abastecimentos.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center gap-4 space-y-0">
            <Database className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl">Finalidade do Uso</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>• Operacionalizar o transporte de colaboradores.</p>
            <p>• Garantir a segurança jurídica da organização em viagens.</p>
            <p>• Controle de manutenção e conservação do patrimônio.</p>
            <p>• Prestação de contas e auditorias internas.</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-primary" />
            Seus Direitos como Titular
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-muted-foreground">
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-foreground">Acesso e Correção</h4>
              <p>Você pode solicitar a qualquer momento o acesso aos seus dados cadastrados e a correção de informações desatualizadas através do seu gestor ou RH.</p>
            </div>
            <div>
              <h4 className="font-bold text-foreground">Eliminação de Dados</h4>
              <p>O titular pode solicitar a eliminação de dados desnecessários ou excessivos, respeitando os prazos legais de guarda de documentos trabalhistas e fiscais.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-foreground">Segurança</h4>
              <p>Os dados são armazenados em ambiente controlado (SQLite Local ou Servidor Protegido) com acesso restrito por perfil de usuário (Admin/Gestor).</p>
            </div>
            <div>
                <h4 className="font-bold text-foreground">Compartilhamento</h4>
                <p>O CityMotion não compartilha dados com terceiros para fins comerciais. Os dados podem ser compartilhados apenas com órgãos de controle e fiscalização por dever legal.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="bg-primary text-primary-foreground p-4 rounded-xl shrink-0">
            <FileText className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Dúvidas sobre Privacidade?</h3>
            <p className="text-sm text-muted-foreground">
              Se você tiver dúvidas sobre como seus dados estão sendo tratados no CityMotion, entre em contato com o Encarregado de Dados (DPO) da sua organização ou envie um e-mail para <a href="mailto:privacidade@citymotion.com" className="text-primary font-semibold underline">privacidade@citymotion.com</a>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
