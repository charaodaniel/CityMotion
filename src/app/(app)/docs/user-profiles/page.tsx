
export default function UserProfilesPage() {
  return (
    <div>
      <h1>Perfis de Usuário e Permissões</h1>
      <p>
        O CityMotion opera com diferentes perfis de acesso, garantindo que cada pessoa na organização veja apenas as informações e ferramentas relevantes para sua função.
      </p>

      <h2>Os Perfis do Sistema</h2>
      <p>
        Nossa arquitetura SaaS permite definir papéis claros para cada membro da equipe. No ambiente de demonstração, você pode alternar entre eles na tela de login.
      </p>

      <h3>1. Administrador (Admin)</h3>
      <p>
        Responsável pelo gerenciamento estratégico da frota e configurações globais.
      </p>
      <ul>
        <li>Visualização completa de dashboards e KPIs.</li>
        <li>Gerenciamento de todos os Veículos, Colaboradores e Setores.</li>
        <li>Configuração de regras de negócio e identidade visual.</li>
      </ul>

      <h3>2. Gestor de Setor (Manager)</h3>
      <p>
        Responsável por operacionalizar os recursos de uma unidade ou departamento específico.
      </p>
      <ul>
        <li>Aprova ou rejeita solicitações de veículos feitas por sua equipe.</li>
        <li>Visualiza a disponibilidade de motoristas e veículos do seu setor.</li>
        <li>Atua de forma híbrida: pode gerenciar e também solicitar transportes.</li>
      </ul>

      <h3>3. Colaborador (Employee)</h3>
      <p>
        Perfil de uso geral para membros da empresa que necessitam de mobilidade.
      </p>
      <ul>
        <li>Principal função: Solicitar transporte de forma rápida e intuitiva.</li>
        <li>Acesso ao crachá virtual funcional com QR Code.</li>
      </ul>

      <h3>4. Motorista e Mecânico</h3>
      <p>
        Perfis técnicos com interfaces específicas para a execução de viagens e serviços de manutenção, incluindo checklists e controle de quilometragem.
      </p>
    </div>
  );
}
