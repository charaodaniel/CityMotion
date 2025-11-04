
export default function RequestingTripsPage() {
  return (
    <div>
      <h1>Como Solicitar um Transporte</h1>
      <p>
        Solicitar um veículo para uma viagem é um processo simples e rápido, projetado para que qualquer funcionário possa fazer um pedido com poucos cliques.
      </p>

      <h2>Passo a Passo para uma Solicitação Rápida</h2>
      <ol>
        <li>
          <strong>Acesse o Formulário:</strong> No painel principal (Dashboard) ou em outras telas principais, clique no botão "Pedir Transporte".
        </li>
        <li>
          <strong>Preencha as Informações:</strong>
          <ul>
            <li><strong>Seu Setor:</strong> Selecione o setor ao qual você pertence.</li>
            <li><strong>Motivo da Viagem:</strong> Descreva de forma breve e clara o objetivo do transporte. Ex: "Levar documentos ao Fórum".</li>
            <li><strong>Destino (Opcional):</strong> Informe o endereço ou local para onde o veículo se deslocará.</li>
            <li><strong>Data e Horário (Opcional):</strong> Se a viagem for planejada, você pode sugerir uma data e hora.</li>
            <li><strong>Observações (Opcional):</strong> Adicione qualquer informação extra que considere relevante para o gestor.</li>
          </ul>
        </li>
        <li>
          <strong>Envie o Pedido:</strong> Clique em "Enviar Pedido Rápido".
        </li>
      </ol>

      <h2>O que acontece depois?</h2>
      <p>
        Após o envio, a sua solicitação ficará com o status de "Pendente" e será enviada diretamente para o gestor do seu setor. Ele será notificado para que possa analisar e aprovar ou rejeitar o pedido.
      </p>
      <p>
        Uma vez aprovada pelo gestor, a solicitação é automaticamente convertida em uma viagem **Agendada**, e o sistema aloca um motorista e um veículo. Você poderá acompanhar o status de todas as suas viagens na página "Viagens".
      </p>
    </div>
  );
}
