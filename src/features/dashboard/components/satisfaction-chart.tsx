"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

interface Distribuicao {
  excellent: number;
  good: number;
  regular: number;
  bad: number;
}

const config = {
  excellent: { label: "Excelente", color: "hsl(142, 76%, 36%)" },
  good: { label: "Bom", color: "hsl(221, 83%, 53%)" },
  regular: { label: "Regular", color: "hsl(48, 96%, 53%)" },
  bad: { label: "Ruim", color: "hsl(0, 84%, 60%)" },
};

export function SatisfactionChart({
  distribuicao,
}: {
  distribuicao: Distribuicao;
}) {
  const data = [
    { name: "Excelente", value: distribuicao.excellent, fill: config.excellent.color },
    { name: "Bom", value: distribuicao.good, fill: config.good.color },
    { name: "Regular", value: distribuicao.regular, fill: config.regular.color },
    { name: "Ruim", value: distribuicao.bad, fill: config.bad.color },
  ];

  return (
    <ChartContainer config={config} className="h-[300px] w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
