import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createAdminClient();

  const { count: totalAvaliacoes } = await supabase
    .from("avaliacoes")
    .select("*", { count: "exact", head: true });

  const { count: totalComentarios } = await supabase
    .from("comentarios")
    .select("*", { count: "exact", head: true });

  const { count: totalUnidades } = await supabase
    .from("unidades")
    .select("*", { count: "exact", head: true });

  const { data: distribuicao } = await supabase.rpc("fn_distribuicao_notas");
  const { data: evolucao } = await supabase.rpc("fn_evolucao_satisfacao");
  const { data: ranking } = await supabase.rpc("fn_ranking_unidades");

  const dist = { excellent: 0, good: 0, regular: 0, bad: 0 };
  if (distribuicao) {
    for (const row of distribuicao as any[]) {
      dist[row.nota as keyof typeof dist] = Number(row.total);
    }
  }

  const satisfacaoGeral =
    totalAvaliacoes && totalAvaliacoes > 0
      ? Math.round(((dist.excellent + dist.good) / totalAvaliacoes) * 100)
      : 0;

  return NextResponse.json({
    totalAvaliacoes: totalAvaliacoes ?? 0,
    totalComentarios: totalComentarios ?? 0,
    totalUnidades: totalUnidades ?? 0,
    satisfacaoGeral,
    distribuicao: dist,
    evolucao: evolucao ?? [],
    ranking: ranking ?? [],
  });
}
