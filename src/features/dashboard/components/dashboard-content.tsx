"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import { SatisfactionChart } from "@/features/dashboard/components/satisfaction-chart";
import { TrendChart } from "@/features/dashboard/components/trend-chart";
import { RankingTable } from "@/features/dashboard/components/ranking-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Smile, MessageSquare, Building2, Star } from "lucide-react";
import type { DashboardMetrics } from "@/features/dashboard/queries/get-metrics";

async function fetchMetrics(): Promise<DashboardMetrics> {
  const res = await fetch("/api/metrics");
  if (!res.ok) throw new Error("Failed to fetch metrics");
  return res.json();
}

export function DashboardContent({
  metrics: initialMetrics,
}: {
  metrics: DashboardMetrics;
}) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "avaliacoes" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, queryClient]);

  const { data: metrics } = useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: fetchMetrics,
    initialData: initialMetrics,
    staleTime: 30000,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Acompanhe os indicadores de satisfacao em tempo real
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Satisfacao Geral"
          value={`${metrics.satisfacaoGeral}%`}
          description="Avaliacoes positivas (Excelente + Bom)"
          icon={<Smile className="h-5 w-5" />}
        />
        <KpiCard
          title="Total de Avaliacoes"
          value={metrics.totalAvaliacoes}
          description="Avaliacoes recebidas"
          icon={<Star className="h-5 w-5" />}
        />
        <KpiCard
          title="Comentarios"
          value={metrics.totalComentarios}
          description="Feedbacks dos cidadaos"
          icon={<MessageSquare className="h-5 w-5" />}
        />
        <KpiCard
          title="Unidades"
          value={metrics.totalUnidades}
          description="Unidades cadastradas"
          icon={<Building2 className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuicao das Notas</CardTitle>
          </CardHeader>
          <CardContent>
            <SatisfactionChart distribuicao={metrics.distribuicao} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolucao da Satisfacao (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={metrics.evolucao} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ranking de Unidades</CardTitle>
        </CardHeader>
        <CardContent>
          <RankingTable data={metrics.ranking} />
        </CardContent>
      </Card>
    </div>
  );
}
