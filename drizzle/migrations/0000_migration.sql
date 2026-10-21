create type public.app_role as enum ('admin');
create type public.lead_status as enum ('novo','em_contato','convertido');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

-- First registered user becomes admin; later users get no role
create or replace function public.grant_first_admin()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users
for each row execute function public.grant_first_admin();

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null check (char_length(nome) between 1 and 100),
  empresa text not null check (char_length(empresa) between 1 and 120),
  whatsapp text not null check (char_length(whatsapp) between 8 and 20),
  veiculos integer not null check (veiculos between 1 and 100000),
  dificuldade text check (dificuldade is null or char_length(dificuldade) <= 1000),
  status lead_status not null default 'novo',
  created_at timestamptz not null default now()
);
grant insert on public.leads to anon, authenticated;
grant select, update on public.leads to authenticated;
grant all on public.leads to service_role;
alter table public.leads enable row level security;
create policy "Anyone can submit lead" on public.leads for insert to anon, authenticated with check (status = 'novo');
create policy "Admins read leads" on public.leads for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update leads" on public.leads for update to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));