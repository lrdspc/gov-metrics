"use server";

import { createClient } from "@/lib/supabase/server";

export async function moderateComment(formData: FormData) {
  const supabase = await createClient();
  const commentId = formData.get("commentId") as string;
  const moderado = formData.get("moderado") === "true";

  const { error } = await supabase
    .from("comentarios")
    .update({ moderado, moderado_por: (await supabase.auth.getUser()).data.user?.id })
    .eq("id", commentId);

  if (error) return { error: error.message };
  return { success: true };
}
