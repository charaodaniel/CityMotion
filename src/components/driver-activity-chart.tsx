"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { driverActivity } from '@/lib/data';

export function DriverActivityChart() {
    return (
        <ChartContainer config={{}} className="h-[350px] w-full">
            <LineChart
                data={driverActivity}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="activeDrivers" stroke="var(--color-chart-1)" strokeWidth={2} />
                <Line type="monotone" dataKey="onRide" stroke="var(--color-chart-2)" strokeWidth={2} />
            </LineChart>
        </ChartContainer>
    );
}
