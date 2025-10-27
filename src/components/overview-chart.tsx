"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { chartData } from '@/lib/data';

export function OverviewChart() {
    return (
        <ChartContainer config={{}} className="h-[350px] w-full">
            <BarChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="rides" fill="var(--color-chart-1)" radius={4} />
                <Bar dataKey="drivers" fill="var(--color-chart-2)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
