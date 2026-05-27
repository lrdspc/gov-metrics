"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface EvolucaoItem {
  periodo: string;
  satisfacao: number;
  total: number;
}

const config = {
  satisfacao: {
    label: "Satisfacao",
    color: "hsl(221, 83%, 53%)",
  },
  total: {
    label: "Total Avaliacoes",
    color: "hsl(142, 76%, 36%)",
  },
};

export function TrendChart({ data }: { data: EvolucaoItem[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        Nenhum dado disponivel
      </div>
    );
  }

  return (
    <ChartContainer config={config} className="h-[300px] w-full">
      <LineChart data={data}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="periodo"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(v) => {
            const d = new Date(v + "T00:00:00");
            return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
          tickFormatter={(v) => `${v}%`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="satisfacao"
          stroke="var(--color-satisfacao)"
          strokeWidth={2}
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
