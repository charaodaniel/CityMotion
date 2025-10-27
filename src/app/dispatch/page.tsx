import DispatchClient from "./dispatch-client";

export default function DispatchPage() {
    return (
        <div className="container mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">
                Despacho com IA
            </h1>
            <p className="text-muted-foreground mb-8 max-w-2xl">
                Otimize o despacho de táxis com base na demanda em tempo real, tráfego e disponibilidade de motoristas. Nossa IA analisa os dados para criar o plano de despacho mais eficiente, minimizando o tempo de espera e maximizando a utilização dos motoristas.
            </p>
            <DispatchClient />
        </div>
    );
}
