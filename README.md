# CityMotion - Sistema de Gestão de Frota

Bem-vindo ao CityMotion, um sistema moderno e inteligente para a gestão de frotas de táxis e motoristas de uma prefeitura. Esta aplicação foi desenvolvida para otimizar operações, melhorar a eficiência e fornecer insights valiosos através de um painel de controle intuitivo e funcionalidades baseadas em Inteligência Artificial.

## ✨ Funcionalidades Principais

O sistema é dividido em quatro seções principais:

### 1. Painel Principal (`/`)

O painel oferece uma visão geral e em tempo real das operações da frota, exibindo:
- **Cartões de Resumo:** Métricas essenciais como total de motoristas, táxis ativos, número de corridas e tempo médio de espera.
- **Gráfico de Visão Geral:** Um gráfico de barras comparando o número de corridas e o total de motoristas ao longo dos meses.
- **Gráfico de Atividade:** Um gráfico de linhas que mostra a atividade dos motoristas (ativos vs. em corrida) ao longo do dia.

### 2. Despacho com IA (`/dispatch`)

Uma ferramenta poderosa que utiliza IA generativa para otimizar o despacho de táxis. Os operadores podem inserir dados em tempo real sobre:
- Demanda de passageiros em diferentes áreas.
- Condições atuais do trânsito.
- Disponibilidade e localização dos motoristas.

Com base nessas informações, a IA gera um **plano de despacho otimizado** que visa minimizar o tempo de espera dos cidadãos e maximizar a utilização dos motoristas.

### 3. Gestão de Motoristas (`/drivers`)

Esta seção permite o gerenciamento completo dos motoristas da frota:
- **Listagem de Motoristas:** Uma tabela exibe todos os motoristas cadastrados com informações como nome, categoria, veículo, status (Verificado, Pendente, Rejeitado), avaliação e total de corridas.
- **Cadastro de Novo Motorista:** Um formulário detalhado para registrar novos motoristas, incluindo informações pessoais, dados do veículo e upload de documentos. As categorias de motorista são:
    - Taxista
    - Autônomo (tipo Uber)
    - Veículo da Prefeitura

### 4. Gestão de Táxis (`/taxis`)

Funcionalidades dedicadas ao gerenciamento da frota de veículos:
- **Listagem da Frota:** Uma tabela apresenta todos os táxis, incluindo placa, nome do motorista associado, modelo, status (Ativo, Inativo, Manutenção), avaliação e corridas do dia.
- **Cadastro de Novo Táxi:** Um formulário para adicionar novos táxis ao sistema, com campos para informações do veículo e upload de documentos de permissão e inspeção.

## 🚀 Tecnologias Utilizadas

- **Framework:** [Next.js](https://nextjs.org/) (com App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes de UI:** [ShadCN UI](https://ui.shadcn.com/)
- **Gráficos:** [Recharts](https://recharts.org/)
- **Inteligência Artificial:** [Google Genkit](https://firebase.google.com/docs/genkit)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Formulários:** [React Hook Form](https://react-hook-form.com/) com [Zod](https://zod.dev/) para validação.

## 📂 Estrutura do Projeto

- `src/app`: Contém as rotas e páginas da aplicação.
- `src/components`: Componentes React reutilizáveis, incluindo a UI (gerada pelo ShadCN) e componentes de layout.
- `src/lib`: Funções utilitárias, dados mockados e definições de tipos.
- `src/ai`: Lógica relacionada à Inteligência Artificial, incluindo os "flows" do Genkit.
