# 🚘 CityMotion - Sistema de Gerenciamento de Frota Municipal

O **CityMotion** é um sistema web desenvolvido para prefeituras que desejam gerenciar de forma organizada e eficiente suas frotas de veículos oficiais, motoristas e setores municipais.

A plataforma permite controlar viagens, escalas e status dos veículos, além de gerar relatórios mensais sobre a utilização da frota.

---

## 🧩 Objetivo

O CityMotion foi criado para centralizar o gerenciamento da frota municipal em um único sistema, possibilitando:

- Acompanhar em tempo real quais veículos estão disponíveis, em manutenção ou em viagem.
- Agendar e registrar viagens, informando origem, destino, motorista e setor responsável.
- Gerenciar motoristas e setores da prefeitura, com controle de vínculo e histórico de viagens.
- Emitir relatórios mensais sobre quilometragem, utilização e deslocamentos.

---

## ⚙️ Funcionalidades Principais

### 🏠 1. Painel Principal (/)
Exibe visão geral da frota e viagens em andamento.
- Indicadores com totais de veículos, motoristas e escalas do mês.
- Gráficos simples de uso da frota por setor e viagens concluídas.

### 🏢 2. Gestão de Setores (/setores)
- Cadastro e listagem dos setores municipais (ex: Saúde, Educação, Obras, Administração).
- Cada setor pode ter veículos e motoristas vinculados.
- Possibilidade de desativar ou editar setores quando necessário.

### 👨‍✈️ 3. Gestão de Motoristas (/motoristas)
- Cadastro de motoristas com dados pessoais, CNH, categoria e setor vinculado.
- Controle de status: disponível, em viagem, afastado.
- Histórico de viagens realizadas pelo motorista.

### 🚗 4. Gestão de Veículos (/veiculos)
Listagem completa da frota municipal com informações como:
- Placa
- Modelo
- Setor responsável
- Status: Disponível, Em Viagem, Manutenção
- Registro de quilometragem atual e datas de manutenção.
- Upload de documentos do veículo (licenciamento, seguro, inspeção).

### 🧭 5. Viagens e Escalas (/viagens, /escalas)
Criação e agendamento de viagens oficiais, com informações de:
- Setor solicitante
- Motorista responsável
- Veículo designado
- Origem e destino
- Data, hora de saída e retorno previsto
- Controle de status da viagem: Aguardando, Em andamento, Concluída.
- Registro de quilometragem inicial e final.
- Histórico completo de deslocamentos por período e setor.

### 📊 6. Relatórios (/relatorios)
Geração de relatórios mensais em PDF, contendo:
- Total de viagens realizadas por setor
- Quilometragem total percorrida
- Veículos mais utilizados
- Viagens por motorista
- Filtros por data, setor ou veículo.

---

## 🧠 Estrutura de Usuários e Permissões

O CityMotion é multiusuário, com perfis hierárquicos e funções específicas:

| Tipo de Usuário | Funções Principais |
|---|---|
| **Administrador (TI / Dev)** | Gerencia o sistema, cria usuários, define permissões, mantém os servidores e o banco de dados. Pode visualizar e editar todas as informações. |
| **Secretário de Transporte** | Responsável pela aprovação final de pedidos de viagem que envolvam deslocamentos entre cidades ou setores diferentes. Supervisiona relatórios gerais da frota. |
| **Gestor de Setor** | Responsável pelos veículos e motoristas vinculados ao seu setor. Pode criar escalas, aprovar solicitações de viagem internas e acompanhar status dos veículos. |
| **Motorista** | Visualiza suas escalas, registra início e término de viagens, informa quilometragem e status do veículo. |
| **Funcionário (Comum)** | Pode fazer pedidos de uso de veículo, informando o motivo e destino. Os pedidos passam por fluxo de aprovação (Gestor → Secretaria de Transporte). |
| **Supervisor (opcional)** | Figura intermediária em setores maiores; pode autorizar viagens de menor porte sem precisar acionar o Secretário. |

### 🧭 Fluxo de Solicitação de Viagem

1.  **Funcionário** cria um pedido de veículo, informando:
    - Setor
    - Motivo
    - Origem e destino
    - Data e horário desejado

2.  O **Gestor do Setor** recebe o pedido:
    - Se for uma viagem **interna ao setor**, ele mesmo aprova.
    - Se for uma viagem **entre setores ou fora do município**, o pedido é encaminhado automaticamente ao **Secretário de Transporte**.

3.  Após aprovação:
    - O Gestor ou Secretário define **veículo e motorista** disponíveis.
    - O sistema gera uma **escala de viagem** com os dados da missão.

4.  O **Motorista** visualiza sua viagem e, no dia agendado:
    - Marca **início da viagem** (registrando data, hora e quilometragem inicial).
    - Ao retornar, marca **término** (com km final, observações e status).

Todos os dados ficam registrados para relatórios mensais e auditoria.

---

## 🧰 Tecnologias Utilizadas

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

## 📂 Estrutura do Projeto

```
src/
 ├── app/
 │    ├── page.tsx                # Painel principal
 │    ├── setores/                # Páginas de gestão de setores
 │    ├── motoristas/             # Páginas de gestão de motoristas
 │    ├── veiculos/               # Páginas de gestão de veículos
 │    ├── viagens/                # Agendamento e registro de viagens
 │    ├── escalas/                # Agendamento e registro de escalas de trabalho
 │    ├── relatorios/             # Relatórios e exportações
 │    └── api/                    # Endpoints de integração com backend
 │
 ├── components/                  # Componentes de UI reutilizáveis
 ├── lib/                         # Funções utilitárias e dados mockados
 ├── styles/                      # Estilos globais
 └── types/                       # Tipagens e modelos de dados
```

---

## 🧾 Fluxo de Uso

1. O usuário acessa o sistema e faz login.
2. No painel principal, visualiza o status da frota e das viagens.
3. Gestores e administradores podem:
   - Criar setores, motoristas e veículos.
   - Agendar novas viagens (escala).
   - Acompanhar veículos em percurso.
4. Ao final do mês, é possível gerar relatórios em PDF para controle administrativo.

---

## 🖥️ Instalação e Execução (Frontend)

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
