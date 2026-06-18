# 📋 CityMotion - Lista de Tarefas (Recapitulação e Roadmap)

Este arquivo organiza o que já foi construído e o que ainda pode ser explorado no CityMotion.

## ✅ Funcionalidades Implementadas (Protótipo Completo)

### **Autenticação e Perfis**
- [x] **Login Simulado:** Troca rápida de perfis para demonstração.
- [x] **Hierarquia de Permissões:** Admin, Gestor, Motorista, Funcionário e Mecânico.
- [x] **Multi-setor:** Seleção de secretaria para gestores com acúmulo de cargos.
- [x] **Perfil Híbrido:** Gestor pode fazer solicitações como funcionário comum.

### **Dashboard e UI/UX**
- [x] **Loading Skeletons:** Animações de carregamento em todas as páginas principais.
- [x] **Layout Adaptativo:** Menu lateral inteligente que muda conforme o cargo.
- [x] **Gráficos:** Visão geral de viagens e atividade de motoristas (Recharts).
- [x] **Performance:** Otimização do fluxo de login e redirecionamento.

### **Operações de Frota**
- [x] **Painel Kanban:** Gestão de viagens em tempo real.
- [x] **Checklists Digitais:** Verificação obrigatória antes e depois de cada trajeto.
- [x] **Relatórios de Campo:** Registro de sinistros e abastecimentos durante a viagem.
- [x] **Gestão de Escalas:** Calendário de plantões e folgas.

### **Setor de Mecânica**
- [x] **Dashboard Exclusivo:** KPIs de manutenção e atalhos rápidos.
- [x] **Chamados de Manutenção:** Fluxo de abertura e conclusão de serviços.
- [x] **Pedido de Peças:** Integração com o setor de compras.

### **Recursos Especiais**
- [x] **Relatórios PDF:** Geração de documentos com filtros avançados.
- [x] **Crachá Virtual:** Identificação online via QR Code (página pública).
- [x] **Desktop (Electron):** Janela moderna e clean para uso em computadores da prefeitura.

## 🛠️ Próximos Passos Sugeridos

- [ ] **Integração de Back-end (Produção):**
    - Conectar definitivamente o front-end ao servidor Node.js/SQLite criado.
    - Implementar persistência real de dados (atualmente os dados resetam ao recarregar).
- [ ] **Notificações em Tempo Real:**
    - Alertar motoristas sobre novas viagens e gestores sobre novos pedidos.
- [ ] **Módulo de Combustível Avançado:**
    - Controle de média de consumo (KM/L) por veículo.
- [ ] **Upload Real de Arquivos:**
    - Implementar o salvamento de fotos de CNH e documentos no servidor.

---
**CityMotion — Mobilidade, transparência e eficiência para a gestão pública municipal.**
