
export default function VirtualBadgePage() {
  return (
    <>
      <h1>Crachá Virtual com QR Code</h1>
      <p>
        O crachá virtual é uma ferramenta de identificação moderna e segura para todos os funcionários cadastrados no sistema. Ele substitui a necessidade de crachás físicos que podem se desatualizar, garantindo que as informações estejam sempre corretas.
      </p>

      <h2>Funcionalidades do Crachá</h2>
      <ul>
        <li><strong>Informações Essenciais:</strong> Exibe nome, foto, matrícula e setor do funcionário.</li>
        <li><strong>QR Code Dinâmico:</strong> Cada crachá possui um QR Code único que, ao ser escaneado, leva para a versão online daquele crachá. Isso serve como uma camada extra de verificação.</li>
        <li><strong>Sempre Atualizado:</strong> Como o QR Code aponta para uma página web, qualquer alteração nos dados do funcionário (como mudança de setor) é refletida instantaneamente no crachá online, sem a necessidade de reemissão.</li>
        <li><strong>Função de Impressão:</strong> Para situações onde um comprovante físico é útil, há um botão "Imprimir Crachá". Isso permite que o funcionário imprima o crachá para usar em um cartão de visita, colar em um crachá físico ou apresentar em locais que exigem identificação (como refeitórios conveniados).</li>
      </ul>
      
      <h2>Como Acessar e Usar</h2>
      <ol>
          <li>
              <strong>Acesso:</strong> Os administradores e gestores podem acessar o crachá de um motorista diretamente da página "Motoristas", clicando no ícone de "Ver Crachá Virtual". Cada funcionário também pode acessar o seu próprio crachá através da sua página de perfil.
          </li>
          <li>
              <strong>Validação:</strong> Para validar, basta que um terceiro (como um segurança ou atendente) aponte a câmera do celular para o QR Code. Ele será direcionado para a página do crachá, confirmando a identidade do portador.
          </li>
           <li>
              <strong>Impressão:</strong> Clique no botão "Imprimir Crachá" na parte inferior da página para gerar uma versão otimizada para impressão.
          </li>
      </ol>
    </>
  );
}
