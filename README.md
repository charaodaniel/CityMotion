
🚘 CityMotion - Sistema Inteligente de Gestão de Frota Municipal

O CityMotion é um sistema completo e moderno para gestão de frotas, táxis, motoristas de aplicativo e veículos municipais.
Desenvolvido para prefeituras e cooperativas urbanas, ele oferece controle operacional, agendamento de viagens e relatórios detalhados, tudo em uma interface intuitiva e responsiva.

🧭 Objetivo do Projeto

O CityMotion foi criado para centralizar e simplificar o gerenciamento da frota urbana, permitindo:

Monitorar veículos em tempo real (locais e trajetos);

Agendar viagens e rotas com motoristas designados;

Registrar ganhos de motoristas de táxi e aplicativos;

Manter histórico de deslocamentos da frota municipal;

Gerar relatórios de desempenho e utilização.

A plataforma busca trazer transparência, eficiência e organização ao transporte urbano, tanto público quanto privado.

🚗 Tipos de Veículos e Casos de Uso

O sistema abrange três categorias principais de motoristas e veículos:

1. 🟡 Taxistas

Registram corridas e ganhos diários;

Visualizam relatórios de desempenho e produtividade mensal;

Gerenciam histórico de corridas e avaliações.

2. 🔵 Motoristas de Aplicativo (Autônomos)

Podem controlar ganhos, despesas e número de viagens;

Acompanham estatísticas individuais e gráficos comparativos;

Ideal para cooperativas de transporte urbano.

3. 🟢 Veículos Municipais / Prefeitura

Focados em controle de localização e status em tempo real;

Indicam se o veículo está na sede, em deslocamento ou em serviço externo (exemplo: “Prefeitura → ESF2”);

Registram rotas, horários e destinos;

Melhoram a gestão de frota pública e transparência administrativa.

✨ Principais Funcionalidades
1. Painel Principal (/)

Interface inicial que exibe uma visão geral da frota:

Cartões de resumo: número total de motoristas, táxis ativos, viagens concluídas e tempo médio de espera;

Gráfico de visão geral: comparativo mensal de motoristas e viagens;

Gráfico de atividade: monitoramento do status dos motoristas (ativos, em corrida, parados).

2. Escala e Agendamento de Viagens (/schedule)

Ferramenta para criar e gerenciar escalas de viagem:

Permite agendar deslocamentos com horário, motorista e veículo específicos;

Visualiza viagens em andamento, concluídas e pendentes;

Possibilita cancelamento ou reagendamento rápido;

Facilita o controle da frota municipal em serviços internos e externos.

Exemplo de uso:

Motorista: João Pereira
Veículo: VW Gol - Placa ABC-1234
Rota: Prefeitura → ESF2
Horário: 08:30 - 10:00
Status: Em percurso

3. Gestão de Motoristas (/drivers)

Controle completo dos motoristas cadastrados:

Listagem completa com nome, categoria, veículo e status (Ativo, Inativo, Pendente);

Formulário de cadastro com dados pessoais, CNH, veículo e documentos;

Filtro por categoria: Taxista, Autônomo, Prefeitura;

Avaliação e desempenho: sistema de notas e histórico de viagens.

4. Gestão de Veículos (/taxis)

Gerenciamento central da frota:

Listagem de veículos: placa, motorista, modelo, status (Ativo, Inativo, Manutenção);

Cadastro de novos veículos: com upload de documentos e inspeções;

Monitoramento de uso: identifica se está na sede, em rota ou em serviço;

Histórico de viagens: relatórios automáticos por veículo.

5. Relatórios e Indicadores

O sistema gera relatórios automáticos de:

Ganhos diários, semanais e mensais;

Deslocamentos realizados pela frota municipal;

Utilização de veículos e tempo ocioso;

Desempenho de motoristas.

🧩 Arquitetura e Estrutura do Projeto
src/
├── app/              # Páginas e rotas principais do sistema
│   ├── page.tsx      # Painel principal
│   ├── drivers/      # Gestão de motoristas
│   ├── taxis/        # Gestão de veículos
│   └── schedule/     # Escala e agendamento de viagens
├── components/       # Componentes reutilizáveis (UI, tabelas, formulários, gráficos)
├── lib/              # Funções auxiliares, tipos, dados mockados
└── styles/           # Arquivos de estilização global (Tailwind)

🛠️ Tecnologias Utilizadas
Categoria	Tecnologia
Framework	Next.js
 com App Router
Linguagem	TypeScript

Estilização	Tailwind CSS

UI Components	ShadCN UI

Gráficos	Recharts

Ícones	Lucide React

Formulários	React Hook Form

Validação	Zod
⚙️ Requisitos de Instalação
📦 Dependências

Node.js 18 ou superior

npm ou yarn

🧰 Instalação
# Clonar o repositório
git clone https://github.com/seuusuario/citymotion.git

# Acessar a pasta do projeto
cd citymotion

# Instalar dependências
npm install

# Rodar em modo desenvolvimento
npm run dev

🌐 Acesso

Abra no navegador:
http://localhost:3000

🧾 Possíveis Extensões Futuras

Integração com GPS em tempo real (para frota municipal);

Relatórios exportáveis em PDF e Excel;

Controle de combustível e manutenção preventiva;

Aplicativo mobile para motoristas (Android/iOS);

Painel administrativo com permissões de acesso por nível.

📄 Licença

Este projeto está sob a licença MIT.
Sinta-se livre para usar, modificar e distribuir conforme necessário.

CityMotion — Mobilidade e gestão inteligente para o transporte urbano municipal.
