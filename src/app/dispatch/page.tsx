import DispatchClient from "./dispatch-client";

export default function DispatchPage() {
    return (
        <div className="container mx-auto p-4 sm:p-8">
            <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">
                AI-Powered Dispatch
            </h1>
            <p className="text-muted-foreground mb-8 max-w-2xl">
                Optimize taxi dispatch based on real-time demand, traffic, and driver availability. Our AI analyzes the data to create the most efficient dispatch plan, minimizing wait times and maximizing driver utilization.
            </p>
            <DispatchClient />
        </div>
    );
}
