
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockLogs } from '@/lib/mock-data';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { subDays, format, startOfDay } from 'date-fns';

const processChartData = () => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    const relevantLogs = mockLogs.filter(log => new Date(log.timestamp) >= thirtyDaysAgo && (log.action === 'Added' || log.action === 'Issued'));

    const dataByDay = relevantLogs.reduce((acc, log) => {
        const day = format(startOfDay(new Date(log.timestamp)), 'MMM d');
        if (!acc[day]) {
            acc[day] = { name: day, inward: 0, outward: 0 };
        }

        if (log.action === 'Added') {
            acc[day].inward += log.quantity || 0;
        } else if (log.action === 'Issued') {
            acc[day].outward += log.quantity || 0;
        }
        return acc;
    }, {} as Record<string, { name: string, inward: number, outward: number }>);
    
    // Fill in missing days
    for (let i = 0; i < 30; i++) {
        const day = format(subDays(new Date(), i), 'MMM d');
        if (!dataByDay[day]) {
            dataByDay[day] = { name: day, inward: 0, outward: 0 };
        }
    }

    return Object.values(dataByDay).sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
}

export function InwardOutwardChart() {
    const chartData = processChartData();

    const chartConfig = {
        inward: {
          label: "Inward",
          color: "hsl(var(--chart-3))",
        },
        outward: {
          label: "Outward",
          color: "hsl(var(--destructive))",
        },
    }

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
                top: 5,
                right: 20,
                left: -10,
                bottom: 5,
            }}
        >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} allowDecimals={false} />
            <ChartTooltip 
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />} 
            />
            <Legend />
            <Bar dataKey="inward" fill="var(--color-inward)" radius={4} />
            <Bar dataKey="outward" fill="var(--color-outward)" radius={4} />
        </BarChart>
    </ChartContainer>
  );
}

