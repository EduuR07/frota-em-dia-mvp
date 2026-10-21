import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Truck, LogOut, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Multas } from "@/components/Multas";

type Lead = Database["public"]["Tables"]["leads"]["Row"];
type Status = Database["public"]["Enums"]["lead_status"];

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel administrativo — Frota em Dia" },
      { name: "description", content: "Gestão de leads interessados no Frota em Dia." },
      { property: "og:title", content: "Painel administrativo — Frota em Dia" },
      { property: "og:description", content: "Gestão de leads interessados no Frota em Dia." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const STATUS: Record<Status, string> = { novo: "Novo", em_contato: "Em contato", convertido: "Convertido" };

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!ready) return null;
  return (
    <div className="min-h-screen bg-secondary">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-primary"><Truck className="h-6 w-6 text-accent" /> Frota em Dia</Link>
          {session && (
            <Button variant="ghost" size="sm" onClick={() => supabase.auth.signOut()}><LogOut /> Sair</Button>
          )}
        </div>
      </header>
      {session ? <Panel userId={session.user.id} /> : <Login />}
    </div>
  );
}

function Login() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim();
    const password = String(f.get("password"));
    setLoading(true); setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg("E-mail ou senha inválidos.");
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setMsg(error ? error.message : "Conta criada. Confirme pelo link enviado ao seu e-mail.");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <form onSubmit={onSubmit} className="space-y-4 rounded-xl bg-card p-6 shadow-sm">
        <h1 className="text-xl font-bold">{mode === "in" ? "Entrar no painel" : "Criar conta"}</h1>
        <div className="space-y-1.5"><Label htmlFor="email">E-mail</Label><Input id="email" name="email" type="email" required /></div>
        <div className="space-y-1.5"><Label htmlFor="password">Senha</Label><Input id="password" name="password" type="password" minLength={6} required /></div>
        {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
        <Button type="submit" className="w-full" disabled={loading}>{mode === "in" ? "Entrar" : "Criar conta"}</Button>
        <button type="button" className="w-full text-sm text-muted-foreground hover:text-foreground" onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(""); }}>
          {mode === "in" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
        </button>
      </form>
    </div>
  );
}

function Panel({ userId }: { userId: string }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<"leads" | "multas">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
      setIsAdmin(!!data);
      if (data) {
        const { data: rows } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
        setLeads(rows ?? []);
      }
    })();
  }, [userId]);

  async function updateStatus(id: string, status: Status) {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (!error) setLeads((l) => l.map((x) => (x.id === id ? { ...x, status } : x)));
  }

  if (isAdmin === null) return null;
  if (!isAdmin) return <p className="p-16 text-center text-muted-foreground">Sua conta não tem acesso ao painel.</p>;

  const interessados = leads.filter((l) => l.status !== "convertido").length;

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <div className="flex gap-2">
        <Button variant={tab === "leads" ? "default" : "outline"} onClick={() => setTab("leads")}>Leads</Button>
        <Button variant={tab === "multas" ? "default" : "outline"} onClick={() => setTab("multas")}>Multas</Button>
      </div>
      {tab === "multas" ? <Multas /> : <>
      <div className="grid gap-4 sm:grid-cols-2">
        <Stat icon={Users} label="Total de leads" value={leads.length} />
        <Stat icon={UserCheck} label="Interessados (não convertidos)" value={interessados} />
      </div>
      <div className="overflow-x-auto rounded-xl bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b text-left text-muted-foreground">
            <tr><th className="p-3">Nome</th><th className="p-3">Empresa</th><th className="p-3">WhatsApp</th><th className="p-3">Veículos</th><th className="p-3">Status</th></tr>
          </thead>
          <tbody>
            {leads.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Nenhum lead ainda.</td></tr>}
            {leads.map((l) => (
              <tr key={l.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{l.nome}</td>
                <td className="p-3">{l.empresa}</td>
                <td className="p-3">{l.whatsapp}</td>
                <td className="p-3">{l.veiculos}</td>
                <td className="p-3">
                  <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value as Status)} className="rounded-md border bg-background px-2 py-1">
                    {(Object.keys(STATUS) as Status[]).map((s) => <option key={s} value={s}>{STATUS[s]}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </>}
    </main>
  );
}

function Stat({ icon: I, label, value }: { icon: typeof Users; label: string; value: number }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-card p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/15"><I className="h-5 w-5 text-accent" /></div>
      <div><p className="text-sm text-muted-foreground">{label}</p><p className="text-2xl font-bold">{value}</p></div>
    </div>
  );
}
