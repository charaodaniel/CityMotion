# 🚘 CityMotion - Sistema de Gerenciamento de Frota Municipal

O **CityMotion** é um sistema moderno desenvolvido para o **gerenciamento de frotas municipais**.  
Ele permite **monitorar veículos e motoristas**, **registrar deslocamentos oficiais**, **controlar escalas de viagem** e **acompanhar em tempo real** o status da frota da prefeitura.

Ideal para **secretarias municipais, departamentos de transporte e logística pública**, o sistema oferece uma interface simples, intuitiva e eficiente.

---

## 🧭 **Objetivo do Projeto**

O **CityMotion** tem como objetivo centralizar o **controle operacional da frota da prefeitura**, garantindo:
- **Transparência** no uso de veículos públicos;
- **Eficiência** na alocação de motoristas e rotas;
- **Registro completo** de viagens, horários e destinos;
- **Redução de tempo ocioso** e **melhor uso dos recursos**.

---

## 🚗 **Funcionalidades Principais**

### 1. **Painel Principal (`/`)**
O painel apresenta uma visão geral e em tempo real de toda a frota:
- **Resumo da frota:** total de veículos, motoristas ativos, veículos em serviço e disponíveis;
- **Gráficos e indicadores:** relatórios de uso mensal, quilometragem e frequência de deslocamentos;
- **Status ao vivo:** mostra quais veículos estão na sede, em percurso ou em manutenção.

---

### 2. **Gestão de Motoristas (`/drivers`)**
Gerencie todos os motoristas vinculados à prefeitura:
- **Listagem completa:** nome, cargo, setor, CNH, veículo designado e status (Ativo, Em Serviço, Afastado);
- **Cadastro de novos motoristas:** formulário com informações pessoais, documentos e vínculo de trabalho;
- **Histórico de viagens:** cada motorista tem um histórico de deslocamentos e serviços realizados.

---

### 3. **Gestão de Veículos (`/vehicles`)**
Controle detalhado da frota municipal:
- **Cadastro de veículos:** marca, modelo, placa, quilometragem, setor responsável e status (Na sede, Em serviço, Manutenção);
- **Tabela de frota:** exibe todos os veículos cadastrados com filtros e busca rápida;
- **Documentos e manutenção:** upload de CRLV, comprovantes de vistoria e registros de manutenção.

---

### 4. **Escala e Agendamento de Viagens (`/schedule`)**
Ferramenta central para organizar os deslocamentos dos veículos públicos:
- **Criação de viagens:** defina veículo, motorista, destino, motivo e horário de saída/retorno;
- **Status de viagem:** Em andamento, Concluída ou Cancelada;
- **Rastreamento interno:** exibe no painel a localização e o status do veículo em tempo real;
- **Histórico:** registro completo de todas as viagens realizadas.

Exemplo:
```
Motorista: Maria Silva
Veículo: Fiat Strada - Placa XYZ-1234
Rota: Prefeitura → Escola Municipal São José
Horário: 09:00 às 10:30
Status: Em percurso
Motivo: Entrega de materiais escolares
```

---

### 5. **Relatórios e Indicadores**
Geração automática de relatórios administrativos:
- Quilometragem mensal por veículo;
- Frequência de uso por setor;
- Tempo total em deslocamento;
- Registros de manutenção e viagens.

Todos os relatórios podem ser exportados em **PDF ou CSV** para auditorias e prestações de contas.

---

## 🧩 **Arquitetura e Estrutura do Projeto**

```
src/
├── app/              # Páginas e rotas principais
│   ├── page.tsx      # Painel principal
│   ├── drivers/      # Gestão de motoristas
│   ├── vehicles/     # Gestão de veículos
│   └── schedule/     # Escala e agendamento de viagens
├── components/       # Componentes reutilizáveis (UI, tabelas, formulários, gráficos)
├── lib/              # Funções utilitárias, dados e tipos
└── styles/           # Estilização global (Tailwind CSS)
```

---

## 🛠️ **Tecnologias Utilizadas**

| Categoria | Tecnologia |
|------------|-------------|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) |
| **Estilização** | [Tailwind CSS](https://tailwindcss.com/) |
| **UI Components** | [ShadCN UI](https://ui.shadcn.com/) |
| **Gráficos** | [Recharts](https://recharts.org/) |
| **Ícones** | [Lucide React](https://lucide.dev/) |
| **Formulários** | [React Hook Form](https://react-hook-form.com/) |
| **Validação** | [Zod](https://zod.dev/) |

---

## ⚙️ **Instalação e Execução**

### 📋 Pré-requisitos
- Node.js 18+  
- npm ou yarn  

### 🚀 Passos para rodar o projeto
```bash
# Clonar o repositório
git clone https://github.com/seuusuario/citymotion.git

# Entrar na pasta do projeto
cd citymotion

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Acesse em:  
👉 [http://localhost:3000](http://localhost:3000)

---

## 📈 **Futuras Implementações**

- Mapa de localização dos veículos (integração com GPS);
- Controle de combustível e manutenção preventiva;
- Sistema de notificações para revisões e vencimentos de documentos;
- Aplicativo mobile para motoristas registrarem viagens;
- Dashboard de eficiência por setor.

---

## 📄 **Licença**

Este projeto está licenciado sob a **MIT License**.  
Você pode usar, modificar e distribuir livremente, desde que mantenha os créditos originais.

---

**CityMotion — Mobilidade, transparência e eficiência para a frota pública municipal.**
