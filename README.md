# 🚘 CityMotion - Sistema de Gerenciamento de Frota Municipal

O **CityMotion** é um sistema web desenvolvido para prefeituras que desejam gerenciar de forma organizada e eficiente suas frotas de veículos oficiais, motoristas e setores municipais.

A plataforma permite controlar viagens, escalas e status dos veículos, além de gerar relatórios mensais sobre a utilização da frota.

---

## 🚗 MÓDULO DE GESTÃO DE FROTAS

Gerencia todos os veículos da prefeitura, empresa ou frota terceirizada.

### 🔹 Cadastro e Controle de Veículos

- Cadastro de veículos (placa, modelo, marca, ano, chassi, cor, quilometragem inicial, combustível etc.)
- Registro de documentos do veículo (CRLV, seguro, IPVA, licenciamento)
- Histórico de manutenção e revisões
- Controle de abastecimentos (data, valor, local, quilometragem, tipo de combustível)
- Monitoramento de quilometragem e consumo médio
- Controle de pneus e trocas
- Alertas de vencimento (IPVA, licenciamento, seguro, revisões)

### 🔹 Manutenções e Ocorrências

- Agendamento de manutenções preventivas
- Registro de manutenções corretivas (problemas e soluções)
- Controle de oficinas e fornecedores
- Lançamento de custos e relatórios de manutenção
- Registro de acidentes, multas e sinistros

### 🔹 Controle de Escalas e Viagens

- Criação e agendamento de viagens
- Associação de veículo e motorista à viagem
- Registro de origem, destino, horário e finalidade
- Controle de quilometragem de saída e chegada
- Acompanhamento de status (em andamento, concluída, cancelada)
- Relatórios de uso da frota por período, setor ou motorista

---

## 👨‍🔧 MÓDULO DE GESTÃO DE FUNCIONÁRIOS

Gerencia motoristas, operadores e demais servidores envolvidos na frota.

### 🔹 Cadastro de Funcionários

- Dados pessoais e funcionais (nome, CPF, cargo, setor, matrícula, contato, CNH etc.)
- Histórico de treinamentos e certificações
- Controle de validade da CNH e categoria
- Associação do funcionário ao setor ou veículo principal

### 🔹 Escalas e Jornadas

- Criação e gestão de escalas de trabalho e plantões
- Atribuição de motoristas e equipes às viagens
- Controle de horários, presença e faltas
- Relatórios de horas trabalhadas e produtividade

### 🔹 Controle de Desempenho

- Registro de ocorrências e advertências
- Avaliação de desempenho de motoristas (pontualidade, condução, incidentes)
- Histórico de viagens realizadas por funcionário

---

## 🧾 MÓDULO ADMINISTRATIVO E RELATÓRIOS

### 🔹 Painel Administrativo

- Dashboard com indicadores (veículos ativos, em manutenção, viagens em andamento, custo mensal etc.)
- Filtros por período, setor e tipo de veículo
- Exportação de relatórios em PDF, Excel ou CSV

### 🔹 Relatórios e Estatísticas

- Consumo médio por veículo
- Custos totais por mês, setor ou motorista
- Quilometragem percorrida por período
- Manutenções e gastos detalhados
- Controle de rotas e produtividade da frota

---

## ⚙️ MÓDULO DE CONFIGURAÇÕES E SUPORTE

- Controle de usuários e permissões (admin, gestor, motorista etc.)
- Backup e restauração de dados
- Logs de atividades do sistema
- Notificações automáticas (e-mail ou WhatsApp, opcional)
- Integração com GPS, planilhas ou sistemas externos (opcional)

---

## 🧩 FUNCIONALIDADES OPCIONAIS AVANÇADAS

- Rastreio em tempo real (GPS)
- Aplicativo mobile para motoristas
- Checklists digitais de inspeção antes/depois da viagem
- Solicitação de viagem online (com aprovação)
- Controle de combustível com integração de cartão frota
- Módulo de orçamento e custo operacional

---

### 🧰 Tecnologias Utilizadas

| Função | Tecnologia |
|------------|-------------|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) |
| **Estilização** | [Tailwind CSS](https://tailwindcss.com/) |
| **Componentes de UI** | [ShadCN UI](https://ui.shadcn.com/) |
| **Gráficos** | [Recharts](https://recharts.org/) |
| **Formulários** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Relatórios PDF** | [jsPDF](https://github.com/parallax/jsPDF) |
| **Ícones** | [Lucide React](https://lucide.dev/) |

---

### 📂 Estrutura do Projeto

```
src/
 ├── app/
 │    ├── page.tsx                # Painel principal
 │    ├── setores/                # Páginas de gestão de setores
 │    ├── motoristas/             # Páginas de gestão de motoristas
 │    ├── veiculos/               # Páginas de gestão de veículos
 │    ├── escalas/                # Agendamento e registro de viagens
 │    ├── relatorios/             # Relatórios e exportações
 │    └── api/                    # Endpoints de integração com backend
 │
 ├── components/                  # Componentes de UI reutilizáveis
 ├── lib/                         # Funções utilitárias e dados mockados
 ├── styles/                      # Estilos globais
 └── types/                       # Tipagens e modelos de dados
```

---

### 🖥️ Instalação e Execução (Frontend)

```bash
# Clonar o repositório
git clone https://github.com/seuusuario/citymotion-frota.git
cd citymotion-frota

# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```
Acesse em: `http://localhost:3000`

---
**CityMotion — Mobilidade, transparência e eficiência para a frota pública municipal.**