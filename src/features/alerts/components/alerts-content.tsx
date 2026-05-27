"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { createAlert, toggleAlert } from "@/features/alerts/actions/manage-alerts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Bell, BellOff, Plus, AlertTriangle, Loader2, History } from "lucide-react";

const severidadeMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  low: { label: "Baixa", variant: "secondary" },
  medium: { label: "Média", variant: "default" },
  high: { label: "Alta", variant: "destructive" },
  critical: { label: "Crítica", variant: "destructive" },
};

export function AlertsContent() {
  const [open, setOpen] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data: alertas } = useQuery({
    queryKey: ["alertas-config"],
    queryFn: async () => {
      const { data } = await supabase
        .from("alertas_config")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const { data: historico } = useQuery({
    queryKey: ["alertas-historico"],
    queryFn: async () => {
      const { data } = await supabase
        .from("alertas_historico")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
  });

  const { data: unidades } = useQuery({
    queryKey: ["unidades-alerts"],
    queryFn: async () => {
      const { data } = await supabase.from("unidades").select("id, nome").is("deleted_at", null);
      return data ?? [];
    },
  });

  const handleToggle = async (id: string, ativo: boolean) => {
    setToggling(id);
    try {
      const form = new FormData();
      form.set("id", id);
      form.set("ativo", String(!ativo));
      await toggleAlert(form);
      queryClient.invalidateQueries({ queryKey: ["alertas-config"] });
    } finally {
      setToggling(null);
    }
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = await createAlert(form);
    if (!("error" in result)) {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["alertas-config"] });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertas</h1>
          <p className="text-muted-foreground">Configure alertas para monitorar indicadores</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Alerta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Alerta</DialogTitle>
              <DialogDescription>Configure as condições para disparo do alerta</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" placeholder="Ex: Queda de satisfação" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea id="descricao" name="descricao" placeholder="Descreva quando este alerta deve disparar" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="severidade">Severidade</Label>
                  <Select name="severidade" defaultValue="medium">
                    <SelectTrigger id="severidade">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="critical">Crítica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unidadeId">Unidade</Label>
                  <Select name="unidadeId">
                    <SelectTrigger id="unidadeId">
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
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Métrica</Label>
                  <Select name="metrica" defaultValue="satisfacao">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="satisfacao">Satisfação</SelectItem>
                      <SelectItem value="avaliacoes">Avaliações</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Operador</Label>
                  <Select name="operador" defaultValue="lt">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lt">&lt; (menor que)</SelectItem>
                      <SelectItem value="gt">&gt; (maior que)</SelectItem>
                      <SelectItem value="lte">≤ (menor igual)</SelectItem>
                      <SelectItem value="gte">≥ (maior igual)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="valor">Valor</Label>
                  <Input id="valor" name="valor" type="number" step="0.1" placeholder="75" required />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Criar Alerta</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertas Configurados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(alertas ?? []).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum alerta configurado</p>
          ) : (
            <div className="space-y-3">
              {(alertas ?? []).map((a) => {
                const sev = severidadeMap[a.severidade] ?? severidadeMap.medium;
                return (
                  <div key={a.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={sev.variant}>{sev.label}</Badge>
                        <span className="font-medium">{a.nome}</span>
                        <Badge variant={a.ativo ? "default" : "secondary"}>
                          {a.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      {a.descricao && (
                        <p className="text-sm text-muted-foreground">{a.descricao}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggle(a.id, a.ativo)}
                      disabled={toggling === a.id}
                    >
                      {toggling === a.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : a.ativo ? (
                        <BellOff className="h-4 w-4" />
                      ) : (
                        <Bell className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Histórico de Disparos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(historico ?? []).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum disparo registrado</p>
          ) : (
            <div className="space-y-2">
              {(historico ?? []).map((h) => (
                <div key={h.id} className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                  <span className="flex-1">{h.mensagem}</span>
                  <Badge variant={h.status === "triggered" ? "destructive" : "secondary"}>
                    {h.status}
                  </Badge>
                  <span className="text-muted-foreground">
                    {new Date(h.created_at).toLocaleString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
