-- bootcamp.crm — schema inicial
-- Rode este arquivo no Supabase: Dashboard -> SQL Editor -> New query -> cole e clique em Run.

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  notes text,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'deal_stage') then
    create type public.deal_stage as enum (
      'novo',
      'contato_feito',
      'proposta',
      'negociacao',
      'ganho',
      'perdido'
    );
  end if;
end $$;

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  contact_id uuid references public.contacts (id) on delete set null,
  title text not null,
  value numeric(12, 2),
  stage public.deal_stage not null default 'novo',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.contacts enable row level security;
alter table public.deals enable row level security;

drop policy if exists "contacts_owner_select" on public.contacts;
create policy "contacts_owner_select" on public.contacts
  for select using (auth.uid() = owner_id);
drop policy if exists "contacts_owner_insert" on public.contacts;
create policy "contacts_owner_insert" on public.contacts
  for insert with check (auth.uid() = owner_id);
drop policy if exists "contacts_owner_update" on public.contacts;
create policy "contacts_owner_update" on public.contacts
  for update using (auth.uid() = owner_id);
drop policy if exists "contacts_owner_delete" on public.contacts;
create policy "contacts_owner_delete" on public.contacts
  for delete using (auth.uid() = owner_id);

drop policy if exists "deals_owner_select" on public.deals;
create policy "deals_owner_select" on public.deals
  for select using (auth.uid() = owner_id);
drop policy if exists "deals_owner_insert" on public.deals;
create policy "deals_owner_insert" on public.deals
  for insert with check (auth.uid() = owner_id);
drop policy if exists "deals_owner_update" on public.deals;
create policy "deals_owner_update" on public.deals
  for update using (auth.uid() = owner_id);
drop policy if exists "deals_owner_delete" on public.deals;
create policy "deals_owner_delete" on public.deals
  for delete using (auth.uid() = owner_id);

create index if not exists deals_contact_id_idx on public.deals (contact_id);
create index if not exists contacts_owner_id_idx on public.contacts (owner_id);
create index if not exists deals_owner_id_idx on public.deals (owner_id);

-- Clientes (planilha Excel) — cadastro de empresas clientes, importado/gerenciado à parte de Contatos/Negócios
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  razao_social text not null,
  cnpj text,
  telefone text,
  email text,
  instagram text,
  segmento text,
  endereco text,
  servicos_sugeridos text,
  status_contato text,
  prioridade text,
  fonte text,
  responsavel text,
  ultimo_contato_em date,
  created_at timestamptz not null default now()
);

-- Migração aditiva: adiciona as colunas de prospecção em instalações que já rodaram
-- este arquivo antes dessas colunas existirem (não afeta dados já cadastrados).
alter table public.clients add column if not exists segmento text;
alter table public.clients add column if not exists endereco text;
alter table public.clients add column if not exists servicos_sugeridos text;
alter table public.clients add column if not exists status_contato text;
alter table public.clients add column if not exists prioridade text;
alter table public.clients add column if not exists fonte text;
alter table public.clients add column if not exists responsavel text;
alter table public.clients add column if not exists ultimo_contato_em date;

alter table public.clients enable row level security;

drop policy if exists "clients_owner_select" on public.clients;
create policy "clients_owner_select" on public.clients
  for select using (auth.uid() = owner_id);
drop policy if exists "clients_owner_insert" on public.clients;
create policy "clients_owner_insert" on public.clients
  for insert with check (auth.uid() = owner_id);
drop policy if exists "clients_owner_update" on public.clients;
create policy "clients_owner_update" on public.clients
  for update using (auth.uid() = owner_id);
drop policy if exists "clients_owner_delete" on public.clients;
create policy "clients_owner_delete" on public.clients
  for delete using (auth.uid() = owner_id);

create index if not exists clients_owner_id_idx on public.clients (owner_id);
create unique index if not exists clients_owner_cnpj_idx on public.clients (owner_id, cnpj);

-- Liga um negócio ao cliente/lead de origem (usado por "Transformar em Negócio").
alter table public.deals add column if not exists client_id uuid references public.clients (id) on delete set null;
create index if not exists deals_client_id_idx on public.deals (client_id);
