
export default function UserProfilesPage() {
  return (
    <div>
      <h1>Perfis de Usuário e Permissões</h1>
      <p>
        O CityMotion opera com diferentes perfis de usuário, cada um com acesso e permissões específicas, garantindo que cada pessoa veja apenas as informações e ferramentas relevantes para sua função.
      </p>

      <h2>Os Três Perfis Principais</h2>
      <p>
        O sistema possui três tipos de perfis de acesso. No ambiente de teste, você pode alternar entre eles usando os e-mails de teste na página de login.
      </p>

      <h3>1. Administrador (Admin)</h3>
      <p>
        O Administrador tem controle total sobre o sistema. Este perfil é geralmente destinado à equipe de TI ou ao gestor geral da frota.
      </p>
      <ul>
        <li>Visualiza todos os dashboards.</li>
        <li>Gerencia todos os Veículos, Funcionários e Setores.</li>
        <li>Acessa todos os relatórios e configurações do sistema.</li>
        <li>Pode solicitar e agendar viagens.</li>
      </ul>

      <h3>2. Gestor de Setor (Manager)</h3>
      <p>
        O Gestor (geralmente um Secretário de pasta) é responsável por aprovar as solicitações de transporte do seu próprio setor e gerenciar os recursos vinculados a ele.
      </p>
      <ul>
        <li>Aprova ou rejeita solicitações de veículos feitas por funcionários do seu setor.</li>
        <li>Visualiza e gerencia os funcionários e veículos do seu setor.</li>
        <li>Pode agendar viagens e acessar relatórios restritos ao seu setor.</li>
      </ul>

      <h3>3. Funcionário (Employee)</h3>
      <p>
        Este é o perfil padrão para todos os outros servidores públicos, como professores, médicos, técnicos e, inclusive, **motoristas**. A interface se adapta com base no cargo do funcionário.
      </p>
      <ul>
        <li>A principal função é solicitar transporte através do formulário rápido.</li>
        <li>Pode visualizar o status de suas solicitações e seu histórico.</li>
        <li>Tem acesso ao seu próprio crachá virtual.</li>
        <li>
          <strong>Se o cargo for "Motorista":</strong> A interface é enriquecida para incluir um painel de viagens, a capacidade de iniciar/finalizar viagens com checklists e acesso ao seu histórico de condução.
        </li>
      </ul>
    </div>
  );
}
