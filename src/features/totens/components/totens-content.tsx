"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  createTotem,
  deleteTotem,
  toggleTotem,
} from "@/features/totens/actions/manage-totens";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus, Copy, ExternalLink, QrCode, Tablet, Trash2,
  Loader2, Power, PowerOff, Check,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

type TotemRow = {
  id: string;
  nome: string;
  slug: string;
  localizacao: string | null;
  status: string;
  ativo: boolean;
  total_avaliacoes: number;
  ultimo_heartbeat: string | null;
  ultima_avaliacao_em: string | null;
  created_at: string;
  unidade: { nome: string } | null;
  setor: { nome: string } | null;
};

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  online: { label: "Online", variant: "default" },
  offline: { label: "Offline", variant: "secondary" },
  disabled: { label: "Desativado", variant: "destructive" },
};

export function TotensContent() {
  const [open, setOpen] = useState(false);
  const [qrTotemId, setQrTotemId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const supabase = createClient();

  const { data: totens } = useQuery({
    queryKey: ["totens-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("totens")
        .select("id, nome, slug, localizacao, status, ativo, total_avaliacoes, ultimo_heartbeat, ultima_avaliacao_em, created_at, unidade:unidades!inner(nome), setor:setores!left(nome)")
        .is("deleted_at", null)
        .order("created_at", { ascending: false });
      return (data ?? []) as TotemRow[];
    },
  });

  const { data: unidades } = useQuery({
    queryKey: ["unidades-totens"],
    queryFn: async () => {
      const { data } = await supabase
        .from("unidades")
        .select("id, nome")
        .is("deleted_at", null)
        .order("nome");
      return data ?? [];
    },
  });

  const { data: setores } = useQuery({
    queryKey: ["setores-totens"],
    queryFn: async () => {
      const { data } = await supabase
        .from("setores")
        .select("id, nome, unidade_id")
        .is("deleted_at", null)
        .order("nome");
      return data ?? [];
    },
  });

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const result = await createTotem(form);
    if (!("error" in result)) {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["totens-list"] });
    }
  };

  const handleToggle = async (id: string, ativo: boolean) => {
    setTogglingId(id);
    const form = new FormData();
    form.set("id", id);
    form.set("ativo", String(!ativo));
    await toggleTotem(form);
    queryClient.invalidateQueries({ queryKey: ["totens-list"] });
    setTogglingId(null);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const form = new FormData();
    form.set("id", id);
    await deleteTotem(form);
    queryClient.invalidateQueries({ queryKey: ["totens-list"] });
    setDeletingId(null);
  };

  const handleCopyLink = async (slug: string) => {
    const url = `${window.location.origin}/totem/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopiedId(slug);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Totens</h1>
          <p className="text-muted-foreground">Gerencie os totens de avaliacao</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Totem
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Totem</DialogTitle>
              <DialogDescription>Configure um novo ponto de avaliacao</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" name="nome" placeholder="Ex: Totem Recepcao UPA" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidadeId">Unidade</Label>
                <Select name="unidadeId" required>
                  <SelectTrigger id="unidadeId">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {(unidades ?? []).map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="setorId">Setor (opcional)</Label>
                <Select name="setorId">
                  <SelectTrigger id="setorId">
                    <SelectValue placeholder="Nenhum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {(setores ?? []).map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="localizacao">Localizacao (opcional)</Label>
                <Input id="localizacao" name="localizacao" placeholder="Ex: Ao lado da recepcao" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input id="slug" name="slug" placeholder="Deixe em branco para auto-gerar" />
              </div>
              <DialogFooter>
                <Button type="submit">Criar Totem</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* QR Code Dialog */}
      <Dialog open={!!qrTotemId} onOpenChange={(v) => !v && setQrTotemId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Code do Totem</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            {qrTotemId && (
              <>
                <QRCodeSVG
                  value={`${typeof window !== "undefined" ? window.location.origin : ""}/totem/${qrTotemId}`}
                  size={200}
                  level="M"
                />
                <p className="text-sm text-muted-foreground text-center break-all">
                  {typeof window !== "undefined" ? window.location.origin : ""}/totem/{qrTotemId}
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tablet className="h-5 w-5" />
            Totens Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(totens ?? []).length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhum totem cadastrado. Crie seu primeiro totem!
            </p>
          ) : (
            <div className="space-y-3">
              {(totens ?? []).map((t: TotemRow) => {
                const status = statusMap[t.status] ?? statusMap.offline;
                const unidadeNome = t.unidade?.nome ?? "";
                const setorNome = t.setor?.nome ?? null;
                const isOnline = t.status === "online";
                const heartbeatAtrasado = t.ultimo_heartbeat
                  ? Date.now() - new Date(t.ultimo_heartbeat).getTime() > 120000
                  : true;

                return (
                  <div key={t.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${isOnline && !heartbeatAtrasado ? "bg-green-500" : heartbeatAtrasado && t.status === "online" ? "bg-yellow-500" : "bg-muted-foreground"}`} />
                        <span className="font-medium">{t.nome}</span>
                        <Badge variant={t.ativo ? "default" : "secondary"}>
                          {t.ativo ? "Ativo" : "Inativo"}
                        </Badge>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {unidadeNome}
                        {setorNome && <> &middot; {setorNome}</>}
                        {t.localizacao && <> &middot; {t.localizacao}</>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.total_avaliacoes} avaliacoes
                        {t.ultima_avaliacao_em && (
                          <> &middot; Ultima: {new Date(t.ultima_avaliacao_em).toLocaleString("pt-BR")}</>
                        )}
                        {t.ultimo_heartbeat && (
                          <> &middot; Heartbeat: {new Date(t.ultimo_heartbeat).toLocaleString("pt-BR")}</>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCopyLink(t.slug)}
                        title="Copiar link"
                      >
                        {copiedId === t.slug ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setQrTotemId(t.slug)}
                        title="QR Code"
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <a
                        href={`/totem/${t.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="ghost" title="Abrir totem">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleToggle(t.id, t.ativo)}
                        disabled={togglingId === t.id}
                        title={t.ativo ? "Desativar" : "Ativar"}
                      >
                        {togglingId === t.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : t.ativo ? (
                          <Power className="h-4 w-4 text-green-500" />
                        ) : (
                          <PowerOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(t.id)}
                        disabled={deletingId === t.id}
                        title="Excluir"
                      >
                        {deletingId === t.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
