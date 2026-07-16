import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Book, LifeBuoy } from "lucide-react";
import Link from "next/link";
const faqItems = [
  {
    question: "Como fa\xE7o para solicitar um ve\xEDculo?",
    answer: "Na p\xE1gina inicial, clique em 'Pedir Transporte' e preencha o formul\xE1rio r\xE1pido. Sua solicita\xE7\xE3o ser\xE1 enviada para o gestor do seu setor."
  },
  {
    question: "Quem aprova minha solicita\xE7\xE3o de viagem?",
    answer: "Viagens dentro do seu setor s\xE3o aprovadas pelo seu gestor. Trajetos para outros setores ou munic\xEDpios s\xE3o encaminhadas para o Secret\xE1rio de Transporte."
  },
  {
    question: "Como altero minha senha?",
    answer: "No momento, a altera\xE7\xE3o de senha deve ser solicitada ao administrador do sistema (TI). Em breve, essa funcionalidade estar\xE1 dispon\xEDvel no seu perfil."
  },
  {
    question: "Onde visualizo minhas viagens agendadas?",
    answer: "Todas as suas viagens, tanto as futuras quanto as j\xE1 realizadas, podem ser encontradas na p\xE1gina 'Viagens' ou na sua p\xE1gina de perfil."
  }
];
function SupportPage() {
  return /* @__PURE__ */ React.createElement("div", { className: "container mx-auto p-4 sm:p-8 max-w-4xl" }, /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold tracking-tight font-headline" }, "Central de Suporte"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground" }, "Precisa de ajuda? Encontre aqui respostas e formas de contato.")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-8" }, /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Mail, { className: "mr-2 h-5 w-5 text-primary" }), "Contato"), /* @__PURE__ */ React.createElement(CardDescription, null, "Entre em contato com nossa equipe de suporte.")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold" }, "Suporte T\xE9cnico"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground text-sm" }, "Para problemas com o sistema, bugs ou falhas."), /* @__PURE__ */ React.createElement("a", { href: "mailto:suporte.ti@prefeitura.gov.br", className: "text-primary hover:underline" }, "suporte.ti@prefeitura.gov.br")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold" }, "Administra\xE7\xE3o da Frota"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground text-sm" }, "Para d\xFAvidas sobre aprova\xE7\xF5es, escalas e ve\xEDculos."), /* @__PURE__ */ React.createElement("a", { href: "mailto:frota@prefeitura.gov.br", className: "text-primary hover:underline" }, "frota@prefeitura.gov.br")))), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, { className: "flex items-center" }, /* @__PURE__ */ React.createElement(Book, { className: "mr-2 h-5 w-5 text-primary" }), "Recursos"), /* @__PURE__ */ React.createElement(CardDescription, null, "Consulte a documenta\xE7\xE3o e os guias do sistema.")), /* @__PURE__ */ React.createElement(CardContent, { className: "space-y-2" }, /* @__PURE__ */ React.createElement(Link, { href: "/docs", className: "flex items-center text-primary hover:underline" }, /* @__PURE__ */ React.createElement(LifeBuoy, { className: "mr-2 h-4 w-4" }), " Central de Ajuda"), /* @__PURE__ */ React.createElement("a", { href: "#", className: "flex items-center text-primary hover:underline" }, /* @__PURE__ */ React.createElement(LifeBuoy, { className: "mr-2 h-4 w-4" }), " Guia do Gestor de Frota")))), /* @__PURE__ */ React.createElement(Card, null, /* @__PURE__ */ React.createElement(CardHeader, null, /* @__PURE__ */ React.createElement(CardTitle, null, "Perguntas Frequentes (FAQ)"), /* @__PURE__ */ React.createElement(CardDescription, null, "Respostas r\xE1pidas para as d\xFAvidas mais comuns.")), /* @__PURE__ */ React.createElement(CardContent, null, /* @__PURE__ */ React.createElement(Accordion, { type: "single", collapsible: true, className: "w-full" }, faqItems.map((item, index) => /* @__PURE__ */ React.createElement(AccordionItem, { key: index, value: `item-${index}` }, /* @__PURE__ */ React.createElement(AccordionTrigger, null, item.question), /* @__PURE__ */ React.createElement(AccordionContent, null, item.answer))))))));
}
export {
  SupportPage as default
};
