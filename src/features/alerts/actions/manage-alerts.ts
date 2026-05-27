"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export async function createAlert(formData: FormData) {
  const supabase = await createClient();

  const nome = formData.get("nome") as string;
  const descricao = formData.get("descricao") as string;
  const severidade = formData.get("severidade") as Database["public"]["Enums"]["alerta_severidade"];
  const unidadeId = formData.get("unidadeId") as string;
  const metrica = formData.get("metrica") as string;
  const operador = formData.get("operador") as string;
  const valor = parseFloat(formData.get("valor") as string);

  const condicoes = { metrica, operador, valor };

  const { error } = await supabase.from("alertas_config").insert({
    municipio_id: "00000000-0000-0000-0000-000000000001",
    unidade_id: unidadeId || null,
    nome,
    descricao,
    ativo: true,
    severidade,
    condicoes,
    notificar_por: ["email"],
    notificar_para: null,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function toggleAlert(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const ativo = formData.get("ativo") === "true";

  const { error } = await supabase.from("alertas_config").update({ ativo }).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
