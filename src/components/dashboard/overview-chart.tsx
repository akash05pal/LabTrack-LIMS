
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockComponents } from '@/lib/mock-data';
import { useTheme } from 'next-themes';
import { Card, CardContent } from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

const categoryData = mockComponents.reduce((acc, component) => {
  const category = component.category;
  if (!acc[category]) {
    acc[category] = { name: category, total: 0 };
  }
  acc[category].total += 1; // Counting number of component types, not quantity
  return acc;
}, {} as Record<string, { name: string, total: number }>);

const chartData = Object.values(categoryData);

export function OverviewChart() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const chartConfig = {
        total: {
          label: "Items",
          color: "hsl(var(--chart-1))",
        },
      }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
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
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
        </BarChart>
    </ChartContainer>
  );
}
