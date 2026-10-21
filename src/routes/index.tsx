import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import {
  Truck, FolderKanban, Zap, CalendarClock, FileSpreadsheet, AlertTriangle,
  ClipboardList, Bell, CheckCircle2, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Frota em Dia — Menos planilhas. Mais controle." },
      { name: "description", content: "Organize multas e acompanhe vencimentos da sua transportadora sem planilhas." },
      { property: "og:title", content: "Frota em Dia — Menos planilhas. Mais controle." },
      { property: "og:description", content: "Organize multas e acompanhe vencimentos da sua transportadora sem planilhas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const WHATSAPP = (import.meta.env['VITE_WHATSAPP_NUMBER'] as string | undefined)?.replace(/\D/g, "");

const schema = z.object({
  nome: z.string().trim().min(1, "Informe seu nome").max(100),
  empresa: z.string().trim().min(1, "Informe a empresa").max(120),
  whatsapp: z.string().trim().regex(/^[\d\s()+-]{8,20}$/, "WhatsApp inválido"),
  veiculos: z.coerce.number().int().min(1, "Mínimo 1 veículo").max(100000),
  dificuldade: z.string().trim().max(1000).optional(),
});

function Index() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 font-bold text-primary">
            <Truck className="h-6 w-6 text-accent" /> Frota em Dia
          </div>
          <Button asChild variant="cta" size="sm"><a href="#interesse">Quero conhecer</a></Button>
        </div>
      </header>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">Para pequenas transportadoras</p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">Menos planilhas. Mais controle.</h1>
          <p className="mt-6 max-w-2xl text-lg opacity-80">
            O Frota em Dia reúne as multas da sua frota em um só lugar e avisa antes dos vencimentos.
          </p>
          <Button asChild variant="cta" size="lg" className="mt-8"><a href="#interesse">Quero conhecer</a></Button>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">O problema</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { i: AlertTriangle, t: "Multas desorganizadas", d: "Notificações espalhadas entre e-mails, papéis e motoristas." },
            { i: FileSpreadsheet, t: "Planilhas sem fim", d: "Controles manuais que ninguém atualiza e que geram erros." },
            { i: CalendarClock, t: "Vencimentos esquecidos", d: "Prazos perdidos significam juros e descontos desperdiçados." },
          ].map(({ i: I, t, d }) => (
            <div key={t} className="rounded-xl border bg-card p-6">
              <I className="h-6 w-6 text-destructive" />
              <h3 className="mt-3 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold">Benefícios</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { i: FolderKanban, t: "Organização", d: "Todas as multas por veículo, em um só painel." },
              { i: Zap, t: "Praticidade", d: "Cadastro rápido, sem treinamento e sem planilhas." },
              { i: CalendarClock, t: "Controle de prazos", d: "Saiba o que vence e não perca mais datas." },
            ].map(({ i: I, t, d }) => (
              <div key={t} className="rounded-xl bg-card p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent/15"><I className="h-5 w-5 text-accent" /></div>
                <h3 className="mt-4 text-lg font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold">Como funciona</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { i: Truck, t: "Cadastre sua frota", d: "Adicione os veículos da empresa." },
            { i: ClipboardList, t: "Registre as multas", d: "Lance cada multa com valor e vencimento." },
            { i: Bell, t: "Acompanhe os prazos", d: "Veja o que vence primeiro e mantenha tudo em dia." },
          ].map(({ i: I, t, d }, n) => (
            <li key={t} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{n + 1}</span>
              <div>
                <h3 className="flex items-center gap-2 font-semibold"><I className="h-4 w-4 text-accent" />{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section id="interesse" className="bg-secondary">
        <div className="mx-auto max-w-xl px-4 py-16">
          <h2 className="text-center text-3xl font-bold">Quero conhecer</h2>
          <p className="mt-2 text-center text-muted-foreground">Deixe seus dados e entraremos em contato.</p>
          <LeadForm />
        </div>
      </section>

      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Frota em Dia. Menos planilhas. Mais controle.</span>
          <Link to="/admin" className="hover:text-foreground">Área administrativa</Link>
        </div>
      </footer>
    </div>
  );
}

function LeadForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError("");
    const raw = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    const { dificuldade, ...rest } = parsed.data;
    const { error } = await supabase.from("leads").insert({ ...rest, dificuldade: dificuldade || null });
    setLoading(false);
    if (error) return setSubmitError("Não foi possível enviar. Tente novamente.");
    setDone(rest.nome);
  }

  if (done) {
    const msg = encodeURIComponent(`Olá! Sou ${done} e tenho interesse no Frota em Dia.`);
    return (
      <div className="mt-8 rounded-xl bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
        <h3 className="mt-4 text-xl font-semibold">Recebemos seu interesse!</h3>
        <p className="mt-2 text-muted-foreground">Em breve entraremos em contato.</p>
        {WHATSAPP && (
          <Button asChild variant="cta" className="mt-6">
            <a href={`https://wa.me/${WHATSAPP}?text=${msg}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle /> Continuar pelo WhatsApp
            </a>
          </Button>
        )}
      </div>
    );
  }

  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
      {errors[name] && <p className="text-sm text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-xl bg-card p-6 shadow-sm" noValidate>
      {field("nome", "Nome", { maxLength: 100 })}
      {field("empresa", "Empresa", { maxLength: 120 })}
      {field("whatsapp", "WhatsApp", { type: "tel", placeholder: "(11) 90000-0000", maxLength: 20 })}
      {field("veiculos", "Quantidade de veículos", { type: "number", min: 1 })}
      <div className="space-y-1.5">
        <Label htmlFor="dificuldade">Principal dificuldade (opcional)</Label>
        <Textarea id="dificuldade" name="dificuldade" maxLength={1000} rows={3} />
      </div>
      {submitError && <p className="text-sm text-destructive">{submitError}</p>}
      <Button type="submit" variant="cta" size="lg" className="w-full" disabled={loading}>
        {loading ? "Enviando..." : "Enviar"}
      </Button>
    </form>
  );
}
