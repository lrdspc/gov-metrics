"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { TotemScreen } from "@/features/totem/components/totem-screen";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export default function TotemPage() {
  const [selected, setSelected] = useState<{ id: string; nome: string } | null>(null);
  const supabase = createClient();

  const { data: unidades } = useQuery({
    queryKey: ["totem-unidades"],
    queryFn: async () => {
      const { data } = await supabase
        .from("unidades")
        .select("id, nome")
        .is("deleted_at", null)
        .order("nome");
      return data ?? [];
    },
  });

  if (selected) {
    return <TotemScreen unidadeId={selected.id} unidadeNome={selected.nome} />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-6">
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
        <Building2 className="h-8 w-8 text-white" />
      </div>
      <h1 className="mb-2 text-4xl font-bold">GovMetrics</h1>
      <p className="mb-10 text-xl text-muted-foreground">Selecione a unidade para avaliar</p>
      <div className="grid w-full max-w-lg gap-4">
        {(unidades ?? []).length === 0 && (
          <p className="text-center text-muted-foreground">Carregando unidades...</p>
        )}
        {(unidades ?? []).map((u) => (
          <Button
            key={u.id}
            onClick={() => setSelected({ id: u.id, nome: u.nome })}
            className="h-24 text-2xl rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-transform"
          >
            {u.nome}
          </Button>
        ))}
      </div>
    </div>
  );
}
