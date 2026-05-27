"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { TotemScreen } from "@/features/totem/components/totem-screen";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

type TotemData = {
  id: string;
  nome: string;
  unidade_id: string;
  setor_id: string | null;
  unidade: { nome: string } | null;
};

export default function TotemSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const supabase = createClient();
  const [totem, setTotem] = useState<TotemData | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["totem-slug", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("totens")
        .select("id, nome, unidade_id, setor_id, unidade:unidades!inner(nome)")
        .eq("slug", slug)
        .eq("ativo", true)
        .is("deleted_at", null)
        .single();
      if (error) throw error;
      return data as unknown as TotemData;
    },
    enabled: !!slug,
  });

  useEffect(() => {
    if (data) setTotem(data);
  }, [data]);

  useEffect(() => {
    if (!totem?.id) return;
    const interval = setInterval(async () => {
      try {
        await fetch("/api/totem/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
      } catch {}
    }, 30000);
    fetch("/api/totem/heartbeat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    return () => clearInterval(interval);
  }, [totem?.id, slug]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !totem) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <AlertTriangle className="h-16 w-16 text-destructive" />
        <h1 className="text-3xl font-bold">Totem nao encontrado</h1>
        <p className="text-muted-foreground">
          Este totem pode estar desativado ou o link esta incorreto.
        </p>
      </div>
    );
  }

  return (
    <TotemScreen
      unidadeId={totem.unidade_id}
      setorId={totem.setor_id || undefined}
      unidadeNome={totem.unidade?.nome || totem.nome}
      totemId={totem.id}
    />
  );
}
