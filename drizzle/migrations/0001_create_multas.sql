CREATE TYPE public.multa_status AS ENUM ('pendente','paga','em_recurso');
CREATE TABLE public.multas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  placa text NOT NULL,
  auto_infracao text NOT NULL,
  descricao text,
  valor numeric(10,2) NOT NULL DEFAULT 0,
  vencimento date NOT NULL,
  status public.multa_status NOT NULL DEFAULT 'pendente',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.multas TO authenticated;
GRANT ALL ON public.multas TO service_role;
ALTER TABLE public.multas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage multas" ON public.multas FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));