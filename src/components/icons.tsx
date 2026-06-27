import { CarFront, Truck, CalendarClock, LineChart } from 'lucide-react';

export const Logo = () => (
    <div className="bg-foreground text-background p-1.5 rounded-md">
        <CarFront className="h-5 w-5" />
    </div>
);

export const Icons = {
    logo: CarFront,
    truck: Truck,
    calendar: CalendarClock,
    chart: LineChart,
};