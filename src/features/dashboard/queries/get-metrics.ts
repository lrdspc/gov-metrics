import { createAdminClient } from "@/lib/supabase/server";

export type DashboardMetrics = {
  totalAvaliacoes: number;
  totalComentarios: number;
  totalUnidades: number;
  satisfacaoGeral: number;
  distribuicao: {
    excellent: number;
    good: number;
    regular: number;
    bad: number;
  };
  evolucao: Array<{
    periodo: string;
    satisfacao: number;
    total: number;
  }>;
  ranking: Array<{
    unidade_id: string;
    unidade_nome: string;
    tipo: string;
    satisfacao: number;
    total: number;
    media: number;
  }>;
};

export async function getDashboardMetrics(
  municipioId?: string
): Promise<DashboardMetrics> {
  const supabase = createAdminClient();

  const totalQuery = supabase.from("avaliacoes").select("*", { count: "exact", head: true });
  const comentariosQuery = supabase.from("comentarios").select("*", { count: "exact", head: true });
  const unidadesQuery = supabase.from("unidades").select("*", { count: "exact", head: true });

  const [totalRes, comentariosRes, unidadesRes] = await Promise.all([
    totalQuery,
    comentariosQuery,
    unidadesQuery,
  ]);

  const totalAvaliacoes = totalRes.count ?? 0;
  const totalComentarios = comentariosRes.count ?? 0;
  const totalUnidades = unidadesRes.count ?? 0;

  const { data: distribuicao } = await supabase.rpc("fn_distribuicao_notas");
  const { data: evolucao } = await supabase.rpc("fn_evolucao_satisfacao");
  const { data: ranking } = await supabase.rpc("fn_ranking_unidades");

  const dist = {
    excellent: 0,
    good: 0,
    regular: 0,
    bad: 0,
  };
  if (distribuicao) {
    for (const row of distribuicao as any[]) {
      dist[row.nota as keyof typeof dist] = Number(row.total);
    }
  }

  const satisfacaoGeral =
    totalAvaliacoes > 0
      ? Math.round(
          ((dist.excellent + dist.good) / totalAvaliacoes) * 100
        )
      : 0;

  return {
    totalAvaliacoes,
    totalComentarios,
    totalUnidades,
    satisfacaoGeral,
    distribuicao: dist,
    evolucao: (evolucao as any[]) || [],
    ranking: (ranking as any[]) || [],
  };
}
