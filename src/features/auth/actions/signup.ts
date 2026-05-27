"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signup(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const supabase = await createClient();

  const nome = formData.get("nome") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome } },
  });

  if (error) return { error: error.message };

  if (data.user) {
    const admin = createAdminClient();
    const { error: profileError } = await admin.from("profiles").insert({
      id: data.user.id,
      nome,
      email,
      papel: "cidadao",
      ativo: true,
    });

    if (profileError) return { error: profileError.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
