"use server";

import { createAdminClient } from "@/lib/supabase/server";

export async function submitEvaluation(formData: FormData) {
  try {
    console.log("[submitEvaluation] starting...");
    const supabase = createAdminClient();

    const unidadeId = formData.get("unidadeId") as string;
    const setorId = (formData.get("setorId") as string) || null;
    const notaRaw = formData.get("nota") as string;
    const comentario = (formData.get("comentario") as string) || null;
    const canal = (formData.get("canal") as string) || "totem";
    const sessionId = (formData.get("sessionId") as string) || null;
    const totemId = (formData.get("totemId") as string) || null;

    console.log("[submitEvaluation] nota:", notaRaw, "unidade:", unidadeId);

    if (!["excellent", "good", "regular", "bad"].includes(notaRaw)) {
      console.log("[submitEvaluation] nota invalida");
      return { error: "Nota invalida" };
    }
    const nota = notaRaw as "excellent" | "good" | "regular" | "bad";

    const { data: unidade, error: errUnidade } = await supabase
      .from("unidades")
      .select("id, municipio_id, secretaria_id")
      .eq("id", unidadeId)
      .single();

    if (errUnidade || !unidade) {
      console.log("[submitEvaluation] erro unidade:", errUnidade?.message ?? "nao encontrada");
      return { error: "Unidade nao encontrada" };
    }

    console.log("[submitEvaluation] unidade ok:", unidade.id);

    const { error: errAvaliacao } = await supabase.from("avaliacoes").insert({
      municipio_id: unidade.municipio_id,
      secretaria_id: unidade.secretaria_id,
      unidade_id: unidadeId,
      setor_id: setorId || null,
      nota,
      canal,
      session_id: sessionId,
      totem_id: totemId,
    });

    if (errAvaliacao) {
      console.log("[submitEvaluation] erro avaliacao:", errAvaliacao.message);
      return { error: errAvaliacao.message };
    }

    console.log("[submitEvaluation] avaliacao ok");

    if (comentario && comentario.trim()) {
      const { error: errComentario } = await supabase.from("comentarios").insert({
        municipio_id: unidade.municipio_id,
        secretaria_id: unidade.secretaria_id,
        unidade_id: unidadeId,
        setor_id: setorId || null,
        comentario: comentario.trim(),
        anonimo: true,
      });

      if (errComentario) {
        console.log("[submitEvaluation] erro comentario:", errComentario.message);
        return { error: errComentario.message };
      }
    }

    console.log("[submitEvaluation] sucesso");
    return { success: true };
  } catch (err) {
    console.error("[submitEvaluation] exception:", err);
    return { error: err instanceof Error ? err.message : "Erro interno" };
  }
}
