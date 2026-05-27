"use server";

import { createClient } from "@/lib/supabase/server";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export async function createTotem(formData: FormData) {
  const supabase = await createClient();

  const nome = formData.get("nome") as string;
  const unidadeId = formData.get("unidadeId") as string;
  const setorId = (formData.get("setorId") as string) || null;
  const localizacao = (formData.get("localizacao") as string) || null;
  const slugRaw = (formData.get("slug") as string) || slugify(nome);

  const { data: unidade } = await supabase
    .from("unidades")
    .select("municipio_id")
    .eq("id", unidadeId)
    .single();

  if (!unidade) return { error: "Unidade nao encontrada" };

  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { error: "Nao autenticado" };

  const { error } = await supabase.from("totens").insert({
    municipio_id: unidade.municipio_id,
    unidade_id: unidadeId,
    setor_id: setorId,
    nome,
    slug: slugRaw,
    localizacao,
    criado_por: user.user.id,
  });

  if (error) return { error: error.message };
  return { success: true };
}

export async function updateTotem(formData: FormData) {
  const supabase = await createClient();

  const id = formData.get("id") as string;
  const nome = (formData.get("nome") as string) || undefined;
  const setorId = (formData.get("setorId") as string) || null;
  const localizacao = (formData.get("localizacao") as string) || null;
  const ativo = formData.get("ativo") as string | null;

  const { error } = await supabase
    .from("totens")
    .update({
      ...(nome !== undefined && { nome }),
      setor_id: setorId,
      localizacao,
      ...(ativo !== null && { ativo: ativo === "true" }),
    })
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteTotem(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("totens")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function toggleTotem(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string;
  const ativo = formData.get("ativo") === "true";

  const { error } = await supabase.from("totens").update({ ativo }).eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
