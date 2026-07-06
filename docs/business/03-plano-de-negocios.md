# 📋 Plano de Negócios — CityMotion

**Sistema SaaS de Gestão Inteligente de Frota e Mobilidade Corporativa**

> **Versão:** 2.0  
> **Data:** Julho de 2026  
> **Empresa:** CityMotion Tecnologia Ltda.  
> **Modelo de Negócio:** B2B SaaS + Licenciamento White Label

---

## 1. Sumário Executivo

### 1.1 Visão Geral

O **CityMotion** é uma plataforma SaaS de gestão de frotas veiculares que oferece uma solução completa e modular para organizações que possuem frotas de veículos — desde prefeituras e órgãos públicos até empresas privadas de logística, transporte e serviços.

Diferentemente de concorrentes que oferecem apenas rastreamento básico, o CityMotion funciona como um **sistema operacional completo para a logística da organização**, integrando em uma única plataforma: controle de veículos, gestão de colaboradores, agendamento de viagens, abastecimento, manutenção, relatórios, comunicação interna e notificações em tempo real.

### 1.2 Proposta de Valor

> "Reduzir custos operacionais de frota em até 30% enquanto aumenta a transparência, a conformidade regulatória e a eficiência logística — tudo em uma plataforma white label que carrega a marca do cliente."

### 1.3 Diferenciais Estratégicos

| Diferencial | Vantagem Competitiva |
| :--- | :--- |
| **White Label** | Cliente usa a própria marca — ideal para revenda e grandes contas |
| **Dual Engine (SQLite + PostgreSQL)** | Funciona offline ou em nuvem — único no mercado |
| **Tempo Real (Socket.IO)** | Notificações instantâneas sem polling |
| **LGPD Nativa** | Conformidade integrada — reduz risco legal do cliente |
| **189+ Testes Automatizados** | Qualidade e confiabilidade garantidas |
| **Deploy Simplificado** | Docker + Render Blueprint — deploy em 1 comando |

---

## 2. Análise de Mercado

### 2.1 Tamanho do Mercado

| Indicador | Valor |
| :--- | :--- |
| **Mercado Global de Gestão de Frotas (2026)** | ~US$ 35 bilhões |
| **CAGR (2024-2030)** | 15-18% ao ano |
| **Mercado Brasileiro** | ~R$ 5 bilhões |
| **Frota Total de Veículos Corporativos no Brasil** | ~4,5 milhões de unidades |
| **Prefeituras Brasileiras** | 5.570 municípios |

### 2.2 Segmentos-Alvo Priorizados

| Segmento | TAM (Brasil) | Prioridade | Estratégia de Entrada |
| :--- | :--- | :---: | :--- |
| 🏛️ **Prefeituras (Pequenas/Médias)** | ~4.500 municípios | ⭐⭐⭐⭐⭐ | Licitação + Convênio |
| 🚚 **Transportadoras e Logística** | ~100.000 empresas | ⭐⭐⭐⭐ | Venda direta + Parceiros |
| 🏥 **Planos de Saúde / Hospitais** | ~1.500 operadoras | ⭐⭐⭐⭐ | Vertical saúde |
| 🏗️ **Construtoras (Médio Porte)** | ~50.000 empresas | ⭐⭐⭐ | Venda direta |
| 🏫 **Redes de Ensino (Transporte Escolar)** | ~5.000 redes | ⭐⭐⭐ | Parcerias educacionais |
| 🛒 **Varejo com Frota Própria** | ~20.000 empresas | ⭐⭐ | Indireto |

### 2.3 Concorrência

| Concorrente | Força | Fraqueza | Como o CityMotion Ganha |
| :--- | :--- | :--- | :--- |
| **Sascar** | Líder de mercado, rastreamento | Caro, fechado, sem white label | Preço acessível + White Label |
| **Omnilink** | Rastreamento consolidado | Sem gestão de manutenção/abastecimento | Ecossistema completo |
| **Sistemas de Planilhas** | Gratuito, customizável | Erro humano, sem automação | Automatização total |
| **Soluções Customizadas** | Feito sob medida | Caro, lento, difícil manutenção | SaaS pronto + customizável |

### 2.4 Análise SWOT

| Forças (S) | Fraquezas (W) |
| :--- | :--- |
| • Arquitetura dual engine (SQLite + PG) | • Marca ainda não consolidada |
| • White Label nativo | • Equipe comercial reduzida |
| • LGPD integrado | • Sem aplicativo mobile nativo (ainda) |
| • Custo competitivo | • Dependência de canal de revenda |
| • Stack moderna (Fastify/Drizzle/Vitest) | |
| • 189+ testes automatizados | |

| Oportunidades (O) | Ameaças (T) |
| :--- | :--- |
| • Mercado em crescimento 15%+ ao ano | • Concorrentes com budget de marketing maior |
| • Lei de licitações exige transparência | • Mudanças na LGPD |
| • Prefeituras digitalizando gestão | • Soluções open source emergindo |
| • ESG e sustentabilidade como driver | • Crise econômica reduzindo orçamento |

---

## 3. Modelo de Negócio

### 3.1 Planos e Preços

| Característica | 🟢 Basic | 🔵 Pro | ⭐ Enterprise |
| :--- | :---: | :---: | :---: |
| **Preço Mensal** | R$ 497 | R$ 1.497 | R$ 4.997+ |
| **Veículos** | Até 5 | Até 20 | Ilimitado |
| **Usuários** | Até 10 | Até 50 | Ilimitado |
| **Módulos** | Essenciais | Todos | Todos + Premium |
| **White Label** | ❌ | ❌ | ✅ |
| **Suporte** | Email | Email + Chat | Dedicado 24/7 |
| **SLA** | 99.0% | 99.5% | 99.9% |
| **Treinamento** | Guia online | Online ao vivo | Presencial |

### 3.2 Fontes de Receita

| Fonte | % Receita Projetada | Descrição |
| :--- | :---: | :--- |
| **Assinaturas SaaS** | 70% | Mensalidades recorrentes dos planos |
| **Setup/Implantação** | 10% | Taxa única de implantação e migração |
| **White Label** | 10% | Taxa adicional para personalização total |
| **Treinamento** | 5% | Cursos e workshops presenciais |
| **Suporte Premium** | 5% | Suporte dedicado além do plano |

### 3.3 Projeção Financeira (3 Anos)

| Ano | Clientes | MRR (R$) | ARR (R$) | Custos (R$) | Lucro (R$) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Ano 1** | 25 | 37.425 | 449.100 | 380.000 | 69.100 |
| **Ano 2** | 80 | 119.760 | 1.437.120 | 720.000 | 717.120 |
| **Ano 3** | 200 | 299.400 | 3.592.800 | 1.500.000 | 2.092.800 |

*Premissas: Ticket médio ponderado de R$ 1.497/mês. Churn rate de 3% ao mês (média SaaS).*

### 3.4 Métricas-Chave (KPIs)

| KPI | Meta Ano 1 | Meta Ano 2 | Meta Ano 3 |
| :--- | :---: | :---: | :---: |
| **MRR** | R$ 37.425 | R$ 119.760 | R$ 299.400 |
| **ARR** | R$ 449.100 | R$ 1.437.120 | R$ 3.592.800 |
| **CAC** | R$ 5.000 | R$ 3.000 | R$ 2.000 |
| **LTV** | R$ 53.892 | R$ 53.892 | R$ 53.892 |
| **LTV/CAC** | 10.8x | 18x | 27x |
| **Churn Rate** | 5% | 3% | 2% |
| **NPS** | 50 | 65 | 75+ |

---

## 4. Estratégia de Go-to-Market

### 4.1 Canais de Distribuição

```
🎯 CANAIS PRINCIPAIS
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. VENDA DIRETA (40%)                                  │
│     → Equipe comercial própria                          │
│     → Demonstrações personalizadas                      │
│     → Foco em prefeituras de médio porte                │
│                                                         │
│  2. PARCEIROS DE REVENDA (35%)                          │
│     → Empresas de software contábil                     │
│     → Consultorias de gestão pública                    │
│     → Fornecedores de equipamentos de rastreamento      │
│                                                         │
│  3. MARKETING DIGITAL (15%)                             │
│     → LinkedIn Ads (gestores de frota)                  │
│     → Google Ads (palavras-chave: gestão de frota)      │
│     → Conteúdo SEO (LGPD, frota pública)               │
│                                                         │
│  4. LICITAÇÕES PÚBLICAS (10%)                           │
│     → Pregões eletrônicos                               │
│     → Convênios com entidades municipalistas            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Funil de Vendas (Pipeline)

| Estágio | Taxa de Conversão | Dias no Estágio |
| :--- | :---: | :---: |
| Lead → Demonstração | 30% | 2 |
| Demo → Trial | 60% | 1 |
| Trial → Proposta | 50% | 5 |
| Proposta → Fechamento | 40% | 10 |
| **Lead → Cliente** | **3,6%** | **18 dias** |

### 4.3 Estratégia de Precificação

**Filosofia:** Preço baseado em valor, não em custo. O CityMotion reduz custos de frota em ~30%, o que para uma frota de 20 veículos representa economia de ~R$ 200.000+/ano. O investimento de R$ 1.497/mês (Pro) representa **~9% da economia gerada**.

**Estratégia de penetração:** Preço competitivo no primeiro ano para acelerar adoção, com aumentos anuais de 10-15%.

---

## 5. Operações

### 5.1 Estrutura da Equipe

| Ano 1 | Função | Qtde | Custo Mensal (R$) |
| :--- | :--- | :---: | :---: |
| 🛠️ | Desenvolvimento (Full Stack) | 2 | 24.000 |
| 💼 | Comercial (SDR + Account Exec) | 2 | 12.000 |
| 🎨 | UI/UX (Meio período) | 1 | 5.000 |
| ☁️ | DevOps/Infra (Meio período) | 1 | 5.000 |
| 📞 | Suporte (Meio período) | 1 | 3.000 |
| **Total** | | **7** | **R$ 49.000** |

### 5.2 Custos Operacionais Mensais (Ano 1)

| Categoria | Valor Mensal (R$) |
| :--- | :---: |
| Folha de Pagamento | 49.000 |
| Infraestrutura (Cloud/Hospedagem) | 3.000 |
| Marketing (Ads, conteúdo) | 5.000 |
| Ferramentas (SaaS, licenças) | 2.000 |
| Despesas Gerais | 3.000 |
| **Total** | **R$ 62.000** |

### 5.3 Tecnologia e Infraestrutura

| Recurso | Fornecedor | Custo Mensal |
| :--- | :--- | :---: |
| **Hospedagem** | Render / VPS próprio | R$ 500 - 2.000 |
| **Domínio** | Registro.br | R$ 40/ano |
| **Email** | Google Workspace | R$ 30/usuario |
| **Monitoramento** | Sentry (gratuito inicial) | Grátis |
| **CDN** | Cloudflare | Grátis |

---

## 6. Riscos e Mitigações

### 6.1 Matriz de Riscos

| Risco | Probabilidade | Impacto | Mitigação |
| :--- | :---: | :---: | :--- |
| **Baixa adoção no segmento público** | Média | Alto | Parcerias com consultorias de licitação |
| **Concorrência reduz preços** | Média | Médio | Foco em White Label + LGPD (diferenciais únicos) |
| **Dependência de um grande cliente** | Baixa | Alto | Pulverizar base (máx 20% receita por cliente) |
| **Problemas de segurança** | Baixa | Crítico | Auditoria externa, 189+ testes automatizados |
| **Churn alto** | Média | Alto | Programa de Customer Success estruturado |
| **Mudança regulatória (LGPD)** | Baixa | Médio | Assessoria jurídica especializada |
| **Crise econômica** | Média | Médio | Plano Basic acessível mantém receita base |

### 6.2 Plano de Contingência

| Cenário | Ação |
| :--- | :--- |
| **MRR abaixo de 50% da meta no mês 6** | Reduzir custos de marketing, focar em venda direta |
| **Churn > 8% ao mês** | Investigar causas, implementar programa de fidelidade |
| **Concorrente lança white label** | Acelerar roadmap de IA e IoT como novo diferencial |
| **Demanda explode (> 200 clientes)** | Migrar para infraestrutura escalável na AWS/GCP |

---

## 7. Marcos e Metas (Milestones)

### Ano 1 — Validação e Tração

| Mês | Marco | Meta |
| :--- | :--- | :---: |
| **Mês 1** | MVP completo validado | 0 clientes |
| **Mês 2** | Primeiro cliente pago | 1 cliente |
| **Mês 3** | Programa de parceiros lançado | 3 clientes |
| **Mês 6** | 10 clientes ativos | 10 clientes |
| **Mês 9** | Break-even operacional | 15 clientes |
| **Mês 12** | 25 clientes, MRR R$ 37k | 25 clientes |

### Ano 2 — Crescimento

| Trimestre | Marco | Meta |
| :--- | :--- | :---: |
| **Q1** | App mobile nativo (React Native) | 35 clientes |
| **Q2** | IA Preditiva em beta | 50 clientes |
| **Q3** | Otimização de rotas (Google Maps) | 65 clientes |
| **Q4** | 80 clientes ativos | 80 clientes |

### Ano 3 — Escala

| Trimestre | Marco | Meta |
| :--- | :--- | :---: |
| **Q1** | Expansão internacional (América Latina) | 100 clientes |
| **Q2** | Marketplace de integrações | 130 clientes |
| **Q3** | 150 clientes | 150 clientes |
| **Q4** | 200 clientes, ARR R$ 3,6M | 200 clientes |

---

## 8. Análise de ROI para o Cliente

### 8.1 Calculadora de ROI

**Exemplo: Frota de 20 veículos — Prefeitura de Médio Porte**

| Item | Antes (sem CityMotion) | Depois (com CityMotion) | Economia Anual |
| :--- | :---: | :---: | :---: |
| Combustível (R$) | 360.000 | 270.000 | 90.000 (25%) |
| Manutenção (R$) | 120.000 | 84.000 | 36.000 (30%) |
| Horas Administrativas | 80h/mês | 15h/mês | 65h/mês |
| Multas/Infrações | 15/ano | 3/ano | 12/ano |
| Veículos Parados | 12 dias/ano | 4 dias/ano | 8 dias/ano |
| **Custo Operacional Total** | **R$ 580.000** | **R$ 405.000** | **R$ 175.000** |

> **Investimento CityMotion (Pro):** R$ 17.964/ano  
> **ROI:** **974%** (economia de R$ 175.000 ÷ investimento de R$ 17.964)  
> **Payback:** Menos de 2 meses

### 8.2 Benefícios Não-Financeiros

- ✅ **Transparência pública** — Atende Lei de Acesso à Informação
- ✅ **Conformidade LGPD** — Evita multas de até 2% do faturamento
- ✅ **Sustentabilidade** — Redução de emissões por otimização de rotas  
- ✅ **Segurança dos colaboradores** — Checklist obrigatório antes de cada viagem
- ✅ **Digitalização** — Elimina papel e planilhas manuais
- ✅ **Tomada de decisão** — Dados em tempo real para gestores

---

## 9. Aspectos Legais

### 9.1 Estrutura Societária

- **Tipo:** Sociedade Limitada (LTDA)
- **CNPJ:** A definir
- **Sócios:** A definir
- **Capital Social:** A definir

### 9.2 Contratos

- **Contrato de Adesão SaaS:** Termos de uso e SLA
- **Contrato White Label:** Direitos de marca e personalização
- **LGPD:** DPO (Encarregado de Dados) designado
- **Termos de Privacidade:** Política em conformidade com Lei 13.709/2018

### 9.3 Propriedade Intelectual

- **Código-fonte:** Propriedade exclusiva da CityMotion Tecnologia
- **Marca:** Registro INPI (Classes 9, 38, 42)
- **Licenciamento:** Concedido por assinatura, não por venda

---

## 10. Conclusão

### 10.1 Resumo da Oportunidade

O CityMotion está posicionado em um mercado de **R$ 5 bilhões no Brasil**, crescendo 15%+ ao ano, com um produto que oferece **diferenciais competitivos únicos** (White Label, SQLite+PostgreSQL, LGPD Nativa, Socket.IO Real-time). O modelo de negócio SaaS gera **receita recorrente previsível** com margens crescentes.

### 10.2 Fatores Críticos de Sucesso

1. ✅ **Produto maduro** — 12+ módulos funcionais, 189+ testes
2. ✅ **Diferenciais únicos** — White Label + Dual Engine + LGPD + Tempo Real
3. ✅ **TAM significativo** — Milhares de prefeituras e empresas
4. ✅ **ROI comprovado** — 974% de retorno para o cliente
5. ✅ **Stack moderna** — Fastify + Drizzle + Socket.IO + Docker

### 10.3 Pedido de Investimento (Se Aplicável)

Para acelerar o crescimento, o CityMotion busca:

| Item | Valor |
| :--- | :---: |
| **Rodada Seed** | R$ 500.000 |
| **Equity Offering** | 15-20% |
| **Uso dos Recursos** | Equipe comercial (40%), Marketing (30%), Desenvolvimento (20%), Operações (10%) |

---

> **"Mobilidade, transparência e eficiência para a gestão moderna."**

---

*Documento confidencial — CityMotion Tecnologia Ltda.*  
*Este plano de negócios contém informações proprietárias. Não distribuir sem autorização.*

---

## 📋 Apêndices

### A. Glossário

| Termo | Definição |
| :--- | :--- |
| **SaaS** | Software as a Service — software por assinatura |
| **White Label** | Produto que pode ser rebranded com a marca do cliente |
| **RBAC** | Role-Based Access Control — controle por papéis |
| **LGPD** | Lei Geral de Proteção de Dados (Lei 13.709/2018) |
| **Fastify** | Framework Node.js de alto desempenho para APIs |
| **Drizzle ORM** | ORM type-safe para TypeScript |
| **Socket.IO** | Biblioteca para WebSockets e tempo real |
| **MRR** | Monthly Recurring Revenue — receita mensal recorrente |
| **ARR** | Annual Recurring Revenue — receita anual recorrente |
| **CAC** | Customer Acquisition Cost — custo de aquisição de cliente |
| **LTV** | Lifetime Value — valor do tempo de vida do cliente |
| **Churn** | Taxa de cancelamento de clientes |

### B. Referências

- Lei 13.709/2018 (LGPD)
- Lei 12.527/2011 (Lei de Acesso à Informação)
- Lei 8.666/1993 (Lei de Licitações)
- ISO 55000 (Gestão de Ativos)

---

**CityMotion — Inteligência em mobilidade para a gestão corporativa moderna.**
