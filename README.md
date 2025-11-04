
# 🚘 CityMotion - Sistema Inteligente de Gestão de Frota

Bem-vindo ao **CityMotion**, a solução completa para modernizar e otimizar o gerenciamento da frota de veículos da sua prefeitura.

Desenvolvido para ser intuitivo e eficiente, nosso sistema centraliza o controle de veículos, funcionários, viagens e solicitações em uma plataforma web amigável, garantindo mais organização, transparência e economia para a gestão pública.

---

## ✨ O que é o CityMotion?

O CityMotion é um sistema web projetado para transformar a maneira como sua prefeitura gerencia os recursos de transporte. Com ele, é possível:

-   **Acompanhar a Frota em Tempo Real:** Saiba instantaneamente quais veículos estão disponíveis, em viagem ou em manutenção.
-   **Automatizar Solicitações e Agendamentos:** Simplifique o processo de pedido e aprovação de viagens com um fluxo de trabalho inteligente.
-   **Gerenciar Recursos com Eficiência:** Tenha controle total sobre os veículos, funcionários e setores da sua prefeitura.
-   **Gerar Relatórios Detalhados:** Emita relatórios em PDF com filtros avançados para analisar o uso da frota, quilometragem e custos.
-   **Garantir a Segurança:** Implemente checklists de pré e pós-viagem para garantir a segurança dos motoristas e a manutenção dos veículos.
-   **Identificação Moderna:** Forneça crachás virtuais com QR Code para todos os funcionários, facilitando a identificação em qualquer lugar.

---

## ✅ Funcionalidades Implementadas (Versão Alpha)

O CityMotion já conta com um conjunto robusto de funcionalidades prontas para uso e demonstração:

### **1. Painel de Controle Dinâmico por Perfil**
Uma tela inicial que se adapta ao perfil do usuário (Administrador, Gestor, Motorista ou Funcionário), exibindo as informações e ações mais relevantes para cada um.

### **2. Gestão Completa de Recursos (CRUD)**
-   **Veículos:** Cadastre, edite e gerencie todos os veículos da frota, incluindo informações de modelo, placa, setor, quilometragem e status.
-   **Funcionários:** Mantenha um registro completo dos funcionários, com seus dados, documentos, setor e histórico.
-   **Setores:** Organize a prefeitura em setores (Saúde, Educação, Obras) para vincular veículos e funcionários.

### **3. Fluxo de Viagens Inteligente (Solicitação e Aprovação)**
1.  **Solicitação Rápida:** Um funcionário pode pedir um transporte através de um formulário simples.
2.  **Aprovação pelo Gestor:** O gestor do setor recebe a notificação no seu painel e pode aprovar ou rejeitar a solicitação com um clique.
3.  **Agendamento Automático:** Ao ser aprovada, a solicitação se transforma automaticamente em uma **viagem agendada**, visível para o motorista e para a gestão.

### **4. Painel de Viagens (Kanban)**
Acompanhe o ciclo de vida de cada viagem de forma visual e intuitiva nas colunas:
-   **Agendadas:** Viagens prontas para começar.
-   **Em Andamento:** Viagens que estão ocorrendo agora.
-   **Concluídas:** Histórico de viagens finalizadas.

### **5. Checklists de Segurança e Relatórios de Sinistro**
-   **Pré-viagem:** Antes de iniciar um trajeto, o motorista preenche um checklist digital (nível de óleo, pneus, etc.) e informa a quilometragem inicial.
-   **Pós-viagem:** Ao finalizar, o motorista informa a quilometragem final e preenche um checklist de chegada.
-   **Relatório de Sinistro:** Em caso de incidentes, o motorista pode abrir um chamado diretamente pela tela da viagem, anexando fotos e detalhes.

### **6. Crachá Virtual com QR Code**
-   Cada funcionário possui um **crachá virtual** acessível por um link exclusivo, com nome, foto, matrícula e um QR Code para validação online.
-   O crachá pode ser impresso para uso físico, garantindo a identificação mesmo sem acesso ao sistema.

### **7. Relatórios e Análises (KPIs)**
-   Gere relatórios em PDF com **filtros avançados** por período, setor, veículo ou motorista.
-   Acompanhe indicadores de performance (KPIs) como quilometragem total, total de viagens e veículo mais utilizado, que se ajustam dinamicamente aos filtros aplicados.

### **8. Gestão de Manutenção e Escalas**
-   **Manutenção:** Solicite e acompanhe o status das manutenções (corretivas e preventivas) e peça a compra de peças necessárias.
-   **Escalas:** Crie e gerencie escalas de trabalho, plantões e folgas para os funcionários, com opções de recorrência.

### **9. Central de Ajuda e Simulação de Perfis**
-   **Central de Ajuda:** Uma seção de documentação integrada para guiar os usuários.
-   **Login Simulado:** Uma página de login que permite demonstrar o sistema sob a perspectiva de diferentes perfis, validando as regras de permissão.

---

## 🔮 Próximos Passos (Roadmap Pós-Alpha)

Após a validação desta versão Alpha, nossas prioridades para transformar o protótipo em uma solução de produção incluem:

-   [ ] **Integração com Backend Real (Firebase):**
    -   Substituir o sistema de dados simulados (JSON) por uma integração com um banco de dados robusto em nuvem (Firebase Firestore) para garantir a persistência, segurança e escalabilidade dos dados.

-   [ ] **Sistema de Autenticação Real:**
    -   Implementar um sistema de login e senha seguro (Firebase Authentication) para substituir a simulação de perfis, garantindo que cada usuário acesse apenas suas informações.

-   [ ] **Gerenciamento de Documentos (Upload):**
    -   Implementar a funcionalidade de upload e armazenamento seguro de arquivos (como CNH, CRLV, fotos de recibos) utilizando o Firebase Storage.

-   [ ] **Notificações em Tempo Real:**
    -   Adicionar um sistema de alertas para notificar gestores sobre novas solicitações ou motoristas sobre viagens agendadas.

-   [ ] **Painel de Administração de Perfis:**
    -   Criar uma interface para que o Administrador possa gerenciar os perfis e permissões dos usuários de forma autônoma.

---

**CityMotion — Mobilidade, transparência e eficiência para a gestão pública municipal.**
