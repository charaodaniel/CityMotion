# 🚘 CityMotion - Sistema de Gerenciamento de Frota Municipal

O **CityMotion** é um sistema web desenvolvido para prefeituras que desejam gerenciar de forma organizada e eficiente suas frotas de veículos oficiais, motoristas e setores municipais.

A plataforma permite controlar viagens, escalas e status dos veículos, além de gerar relatórios mensais sobre a utilização da frota.

## 🧭 Objetivo

O **CityMotion** foi criado para centralizar o gerenciamento da frota municipal em um único sistema, possibilitando:

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

### 🏢 2. Gestão de Setores (`/setores`)
- Cadastro e listagem dos setores municipais (ex: Saúde, Educação, Obras, Administração).
- Cada setor pode ter veículos e motoristas vinculados.
- Possibilidade de desativar ou editar setores quando necessário.

### 👨‍✈️ 3. Gestão de Motoristas (`/motoristas`)
- Cadastro de motoristas com dados pessoais, CNH, categoria e setor vinculado.
- Controle de status: disponível, em viagem, afastado.
- Histórico de viagens realizadas pelo motorista.

### 🚗 4. Gestão de Veículos (`/veiculos`)
Listagem completa da frota municipal com informações como:
- **Placa**
- **Modelo**
- **Setor responsável**
- **Status:** Disponível, Em Viagem, Manutenção
- Registro de quilometragem atual e datas de manutenção.
- Upload de documentos do veículo (licenciamento, seguro, inspeção).

### 🧭 5. Escalas e Viagens (`/escalas`)
Criação e agendamento de viagens oficiais, com informações de:
- Setor solicitante
- Motorista responsável
- Veículo designado
- Origem e destino
- Data, hora de saída e retorno previsto
- Controle de status da viagem:
  - Aguardando
  - Em andamento
  - Concluída
- Registro de quilometragem inicial e final.
- Histórico completo de deslocamentos por período e setor.

### 📊 6. Relatórios (`/relatorios`)
Geração de relatórios mensais em PDF, contendo:
- Total de viagens realizadas por setor
- Quilometragem total percorrida
- Veículos mais utilizados
- Viagens por motorista
- Filtros por data, setor ou veículo.

---

### 🧠 Perfis de Usuário
- **Administrador:** acesso total ao sistema (cadastros, relatórios, configurações).
- **Gestor de Setor:** pode visualizar e criar viagens apenas para o seu setor.
- **Motorista:** visualiza suas escalas e registra início/término das viagens.

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

### 🧾 Fluxo de Uso
1. O usuário acessa o sistema e faz login.
2. No painel principal, visualiza o status da frota e das viagens.
3. Gestores e administradores podem:
   - Criar setores, motoristas e veículos.
   - Agendar novas viagens (escala).
   - Acompanhar veículos em percurso.
4. Ao final do mês, é possível gerar relatórios em PDF para controle administrativo.

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

### 🌐 Hospedagem
O sistema pode ser hospedado:
- Em servidores locais da prefeitura (intranet).
- Em VPS Linux (como DigitalOcean ou Contabo).

O backend (API) pode ser implementado em Node.js, Python ou PHP, dependendo da infraestrutura disponível.

---

### 🧾 Licença
Este projeto é de uso institucional e administrativo, voltado para gestão pública municipal.
Distribuição e uso comercial não são permitidos sem autorização prévia.
