import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "slug invalido" }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .rpc("fn_totem_heartbeat", { p_slug: slug });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "requisicao invalida" }, { status: 400 });
  }
}
