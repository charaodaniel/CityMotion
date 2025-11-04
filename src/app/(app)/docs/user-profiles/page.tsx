
export default function UserProfilesPage() {
  return (
    <>
      <h1>Perfis de Usuário e Permissões</h1>
      <p>
        O CityMotion opera com diferentes perfis de usuário, cada um com acesso e permissões específicas, garantindo que cada pessoa veja apenas as informações e ferramentas relevantes para sua função.
      </p>

      <h2>Os Quatro Perfis Principais</h2>
      <p>
        O sistema possui quatro tipos de perfis. No ambiente de teste, você pode alternar entre eles usando os e-mails de teste na página de login.
      </p>

      <h3>1. Administrador (Admin)</h3>
      <p>
        O Administrador tem controle total sobre o sistema. Este perfil é geralmente destinado à equipe de TI ou ao gestor geral da frota.
      </p>
      <ul>
        <li>Visualiza todos os dashboards.</li>
        <li>Gerencia Veículos, Motoristas e Setores.</li>
        <li>Acessa todos os relatórios e configurações do sistema.</li>
        <li>Pode solicitar e agendar viagens.</li>
      </ul>

      <h3>2. Gestor de Setor (Manager)</h3>
      <p>
        O Gestor é responsável por aprovar as solicitações de transporte do seu próprio setor e gerenciar os recursos vinculados a ele.
      </p>
      <ul>
        <li>Aprova ou rejeita solicitações de veículos feitas por funcionários do seu setor.</li>
        <li>Visualiza e gerencia os motoristas e veículos do seu setor.</li>
        <li>Pode agendar viagens e acessar relatórios.</li>
      </ul>

      <h3>3. Motorista (Driver)</h3>
      <p>
        O Motorista é o perfil focado na execução das viagens.
      </p>
      <ul>
        <li>Visualiza seu painel com as próximas viagens agendadas.</li>
        <li>Inicia e finaliza viagens, preenchendo os checklists de pré e pós-viagem.</li>
        <li>Registra abastecimentos e informa a quilometragem.</li>
        <li>Acessa seu histórico de viagens.</li>
      </ul>

       <h3>4. Funcionário (Employee)</h3>
      <p>
        Qualquer servidor público que precisa de transporte para realizar suas atividades.
      </p>
      <ul>
        <li>Sua principal função é solicitar transporte através do formulário rápido.</li>
        <li>Pode visualizar o status de suas solicitações e seu histórico.</li>
        <li>Tem acesso ao seu próprio crachá virtual.</li>
      </ul>
    </>
  );
}
