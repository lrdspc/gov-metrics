"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { moderateComment } from "@/features/comments/actions/moderate-comment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Database } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CheckCircle2, XCircle, Search, Loader2 } from "lucide-react";

type Sentimento = Database["public"]["Enums"]["sentimento"];

const sentimentoMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  positive: { label: "Positivo", variant: "default" },
  neutral: { label: "Neutro", variant: "secondary" },
  negative: { label: "Negativo", variant: "destructive" },
  mixed: { label: "Misto", variant: "outline" },
  not_analyzed: { label: "Não analisado", variant: "outline" },
};

export function CommentsContent() {
  const [unidadeFiltro, setUnidadeFiltro] = useState("");
  const [sentimentoFiltro, setSentimentoFiltro] = useState("");
  const [search, setSearch] = useState("");
  const [moderating, setModerating] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data: comentarios } = useQuery({
    queryKey: ["comentarios", unidadeFiltro, sentimentoFiltro, search],
    queryFn: async () => {
      let query = supabase
        .from("comentarios")
        .select("*, unidades!inner(nome)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (unidadeFiltro) query = query.eq("unidade_id", unidadeFiltro);
      if (sentimentoFiltro) query = query.eq("sentimento", sentimentoFiltro as Sentimento);
      if (search) query = query.ilike("comentario", `%${search}%`);

      const { data } = await query;
      return data ?? [];
    },
  });

  const { data: unidades } = useQuery({
    queryKey: ["unidades-list"],
    queryFn: async () => {
      const { data } = await supabase.from("unidades").select("id, nome").is("deleted_at", null);
      return data ?? [];
    },
  });

  const handleModerate = async (commentId: string, moderado: boolean) => {
    setModerating(commentId);
    try {
      const form = new FormData();
      form.set("commentId", commentId);
      form.set("moderado", String(moderado));
      await moderateComment(form);
      queryClient.invalidateQueries({ queryKey: ["comentarios"] });
    } finally {
      setModerating(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comentários</h1>
        <p className="text-muted-foreground">Visualize e modere os comentários dos cidadãos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Unidade</Label>
              <Select value={unidadeFiltro} onValueChange={(v) => setUnidadeFiltro(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {(unidades ?? []).map((u) => (
                    <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sentimento</Label>
              <Select value={sentimentoFiltro} onValueChange={(v) => setSentimentoFiltro(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="positive">Positivo</SelectItem>
                  <SelectItem value="neutral">Neutro</SelectItem>
                  <SelectItem value="negative">Negativo</SelectItem>
                  <SelectItem value="mixed">Misto</SelectItem>
                  <SelectItem value="not_analyzed">Não analisado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Busca</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar comentário..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {(comentarios ?? []).length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <MessageSquare className="mb-2 h-8 w-8" />
              <p>Nenhum comentário encontrado</p>
            </CardContent>
          </Card>
        )}
        {(comentarios ?? []).map((c) => {
          const sent = sentimentoMap[c.sentimento] ?? sentimentoMap.not_analyzed;
          return (
            <Card key={c.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={sent.variant}>{sent.label}</Badge>
                      <Badge variant="outline">{c.unidades?.nome ?? "N/A"}</Badge>
                      {c.moderado && <Badge variant="secondary">Moderado</Badge>}
                    </div>
                    <p className="text-sm">{c.comentario}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleString("pt-BR")}
                      {c.anonimo && " • Anônimo"}
                    </p>
                  </div>
                  {!c.moderado && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleModerate(c.id, true)}
                        disabled={moderating === c.id}
                      >
                        {moderating === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => handleModerate(c.id, false)}
                        disabled={moderating === c.id}
                      >
                        <XCircle className="h-3 w-3" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
