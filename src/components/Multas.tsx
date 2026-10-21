import { useEffect, useState } from "react";
import { FileWarning, Clock, AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Multa = Database["public"]["Tables"]["multas"]["Row"];
type MStatus = Database["public"]["Enums"]["multa_status"];

const STATUS: Record<MStatus, string> = { pendente: "Pendente", paga: "Paga", em_recurso: "Em recurso" };
const empty = { placa: "", auto_infracao: "", descricao: "", valor: "", vencimento: "", status: "pendente" as MStatus };

function daysUntil(d: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((new Date(d + "T00:00:00").getTime() - today.getTime()) / 86400000);
}

const BADGE = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 whitespace-nowrap";

function dueBadge(status: MStatus, d: number) {
  if (status === "paga") return { text: "Multa paga", cls: `${BADGE} bg-due-paid text-due-paid-foreground ring-due-paid-foreground/25` };
  if (status !== "pendente") return null;
  if (d < 0) return { text: "Multa vencida", cls: `${BADGE} bg-due-over text-due-over-foreground ring-due-over-foreground/25` };
  const text = d === 0 ? "Vence hoje" : `Vence em ${d} ${d === 1 ? "dia" : "dias"}`;
  return d <= 3
    ? { text, cls: `${BADGE} bg-due-soon text-due-soon-foreground ring-due-soon-foreground/25` }
    : { text, cls: `${BADGE} bg-due-ok text-due-ok-foreground ring-due-ok-foreground/25` };
}

export function Multas() {
  const [rows, setRows] = useState<Multa[]>([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  async function load() {
    const { data } = await supabase.from("multas").select("*").order("vencimento");
    setRows(data ?? []);
  }
  useEffect(() => { load(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, placa: form.placa.toUpperCase().trim(), valor: Number(form.valor), descricao: form.descricao || null };
    const { error } = editId
      ? await supabase.from("multas").update(payload).eq("id", editId)
      : await supabase.from("multas").insert(payload);
    if (error) return setMsg("Não foi possível salvar.");
    setMsg(""); setForm(empty); setEditId(null); load();
  }

  async function remove(id: string) {
    if (!confirm("Excluir esta multa?")) return;
    await supabase.from("multas").delete().eq("id", id);
    load();
  }

  async function setStatus(id: string, status: MStatus) {
    const { error } = await supabase.from("multas").update({ status }).eq("id", id);
    if (!error) setRows((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  function edit(m: Multa) {
    setEditId(m.id);
    setForm({ placa: m.placa, auto_infracao: m.auto_infracao, descricao: m.descricao ?? "", valor: String(m.valor), vencimento: m.vencimento, status: m.status });
  }

  const pendentes = rows.filter((m) => m.status === "pendente");
  const vencendo = pendentes.filter((m) => { const d = daysUntil(m.vencimento); return d >= 0 && d <= 7; }).length;
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat icon={FileWarning} label="Total de multas" value={rows.length} />
        <Stat icon={Clock} label="Multas pendentes" value={pendentes.length} />
        <Stat icon={AlertTriangle} label="Vencendo em 7 dias" value={vencendo} />
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 rounded-xl bg-card p-5 shadow-sm sm:grid-cols-3">
        <div className="space-y-1.5"><Label htmlFor="placa">Placa</Label><Input id="placa" value={form.placa} onChange={set("placa")} required /></div>
        <div className="space-y-1.5"><Label htmlFor="auto">Nº do auto de infração</Label><Input id="auto" value={form.auto_infracao} onChange={set("auto_infracao")} required /></div>
        <div className="space-y-1.5"><Label htmlFor="valor">Valor (R$)</Label><Input id="valor" type="number" step="0.01" min="0" value={form.valor} onChange={set("valor")} required /></div>
        <div className="space-y-1.5 sm:col-span-3"><Label htmlFor="desc">Descrição</Label><Input id="desc" value={form.descricao} onChange={set("descricao")} /></div>
        <div className="space-y-1.5"><Label htmlFor="venc">Vencimento</Label><Input id="venc" type="date" value={form.vencimento} onChange={set("vencimento")} required /></div>
        <div className="space-y-1.5"><Label htmlFor="st">Status</Label>
          <select id="st" value={form.status} onChange={set("status")} className="h-9 w-full rounded-md border bg-background px-2">
            {(Object.keys(STATUS) as MStatus[]).map((s) => <option key={s} value={s}>{STATUS[s]}</option>)}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <Button type="submit">{editId ? "Salvar alterações" : "Cadastrar multa"}</Button>
          {editId && <Button type="button" variant="ghost" onClick={() => { setEditId(null); setForm(empty); }}>Cancelar</Button>}
        </div>
        {msg && <p className="text-sm text-destructive sm:col-span-3">{msg}</p>}
      </form>

      <div className="overflow-x-auto rounded-xl bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-muted-foreground">
            <tr><th className="p-3">Placa</th><th className="p-3">Auto</th><th className="p-3">Descrição</th><th className="p-3">Valor</th><th className="p-3">Vencimento</th><th className="p-3">Status</th><th className="p-3"></th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={7} className="p-6 text-center text-muted-foreground">Nenhuma multa cadastrada.</td></tr>}
            {rows.map((m) => {
              const d = daysUntil(m.vencimento);
              const pend = m.status === "pendente";
              const vencida = pend && d < 0;
              const proxima = pend && d >= 0 && d <= 7;
              const badge = dueBadge(m.status, d);
              return (
                <tr key={m.id} className={`border-b last:border-0 ${vencida ? "bg-destructive/10" : proxima ? "bg-accent/15" : ""}`}>
                  <td className="p-3 font-medium">{m.placa}</td>
                  <td className="p-3">{m.auto_infracao}</td>
                  <td className="p-3">{m.descricao}</td>
                  <td className="p-3">{Number(m.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</td>
                  <td className="p-3">
                    <div className="flex flex-col items-start gap-1.5">
                      <span>{new Date(m.vencimento + "T00:00:00").toLocaleDateString("pt-BR")}</span>
                      {badge && <span className={badge.cls}>{badge.text}</span>}
                    </div>
                  </td>
                  <td className="p-3">
                    <select value={m.status} onChange={(e) => setStatus(m.id, e.target.value as MStatus)} className="rounded-md border bg-background px-2 py-1">
                      {(Object.keys(STATUS) as MStatus[]).map((s) => <option key={s} value={s}>{STATUS[s]}</option>)}
                    </select>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <Button size="icon" variant="ghost" aria-label="Editar" onClick={() => edit(m)}><Pencil /></Button>
                    <Button size="icon" variant="ghost" aria-label="Excluir" onClick={() => remove(m.id)}><Trash2 /></Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ icon: I, label, value }: { icon: typeof Clock; label: string; value: number }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-card p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/15"><I className="h-5 w-5 text-accent" /></div>
      <div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold">{value}</p></div>
    </div>
  );
}
