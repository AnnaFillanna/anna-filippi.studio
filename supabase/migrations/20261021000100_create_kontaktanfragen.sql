-- Prepared only: do not apply automatically.
-- Source of field limits/options: api/contact.js and src/config/contact.ts.
-- Run the complete transaction as the project database administrator.
begin;

-- Intentionally no IF NOT EXISTS: stop if an existing table needs review.
create table public.kontaktanfragen (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'neu'
    constraint kontaktanfragen_status_check
    check (status in ('neu', 'in_bearbeitung', 'erledigt', 'archiviert')),
  name text not null
    constraint kontaktanfragen_name_check
    check (char_length(name) between 1 and 100
      and name ~ '[^[:space:]]' and name !~ E'[\r\n]'),
  email text not null
    constraint kontaktanfragen_email_check
    check (char_length(email) between 1 and 254
      and email ~ '^[^[:space:]@<>]+@[^[:space:]@<>]+\.[^[:space:]@<>]+$'),
  project text not null
    constraint kontaktanfragen_project_check
    check (project in ('Website / Onlineshop', 'Software / Web-App',
      'Produktfotografie', 'Etwas anderes')),
  budget text not null default ''
    constraint kontaktanfragen_budget_check
    check (budget in ('', 'Bis 500 €', '500–1.500 €', '1.500–3.000 €',
      'Über 3.000 €', 'Noch offen / Ich brauche Beratung')),
  message text not null
    constraint kontaktanfragen_message_check
    check (char_length(message) between 10 and 5000
      and message ~ '[^[:space:]]')
);

create index kontaktanfragen_status_created_at_idx
  on public.kontaktanfragen (status, created_at desc);

alter table public.kontaktanfragen enable row level security;
alter table public.kontaktanfragen force row level security;

-- Explicitly remove direct default table grants (inherited rights are checked below). No browser policies are created.
revoke all privileges on table public.kontaktanfragen
  from public, anon, authenticated, service_role;

-- Server-only ingestion. IDs, timestamps and status are assigned by the database.
-- service_role bypasses RLS, but still requires SQL privileges.
-- No SELECT/UPDATE/DELETE/TRUNCATE grants; do not append .select() to the insert.
grant insert (name, email, project, budget, message)
  on table public.kontaktanfragen to service_role;

comment on table public.kontaktanfragen is
  'Kontaktanfragen: serverseitige Erfassung; kein Zugriff für anon/authenticated.';
comment on column public.kontaktanfragen.budget is
  'Optionales Formularfeld; leerer String bedeutet keine Angabe.';
comment on column public.kontaktanfragen.status is
  'Bearbeitungsstatus, kein Nachweis eines erfolgreichen E-Mail-Versands.';

-- Abort rather than commit if project-specific role inheritance defeats the revokes.
do $$
declare
  role_name text;
  operation text;
  column_name text;
begin
  if not exists (
    select 1 from pg_roles
    where rolname = 'service_role' and rolbypassrls and not rolsuper
  ) then
    raise exception 'service_role must exist with BYPASSRLS and without SUPERUSER';
  end if;
  if not has_schema_privilege('service_role', 'public', 'USAGE') then
    raise exception 'service_role requires USAGE on schema public; review project configuration';
  end if;
  if not has_function_privilege('service_role', 'pg_catalog.gen_random_uuid()', 'EXECUTE') then
    raise exception 'service_role requires EXECUTE on gen_random_uuid()';
  end if;

  -- Table-wide INSERT would also permit overriding id, created_at and status.
  foreach operation in array array['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'] loop
    if has_table_privilege('service_role', 'public.kontaktanfragen', operation) then
      raise exception 'Unexpected service_role table privilege: %', operation;
    end if;
  end loop;
  foreach operation in array array['SELECT', 'UPDATE', 'REFERENCES'] loop
    if has_any_column_privilege('service_role', 'public.kontaktanfragen', operation) then
      raise exception 'Unexpected service_role column privilege: %', operation;
    end if;
  end loop;
  foreach column_name in array array['name', 'email', 'project', 'budget', 'message'] loop
    if not has_column_privilege('service_role', 'public.kontaktanfragen', column_name, 'INSERT') then
      raise exception 'Missing service_role INSERT privilege for column %', column_name;
    end if;
  end loop;
  foreach column_name in array array['id', 'created_at', 'status'] loop
    if has_column_privilege('service_role', 'public.kontaktanfragen', column_name, 'INSERT') then
      raise exception 'Unexpected service_role INSERT privilege for column %', column_name;
    end if;
  end loop;

  foreach role_name in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = role_name and (rolsuper or rolbypassrls)) then
      raise exception 'Unexpected SUPERUSER/BYPASSRLS attribute for role %', role_name;
    end if;
    foreach operation in array array['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'REFERENCES', 'TRIGGER'] loop
      if has_table_privilege(role_name, 'public.kontaktanfragen', operation) then
        raise exception 'Unexpected table privilege for role %: %', role_name, operation;
      end if;
    end loop;
    foreach operation in array array['SELECT', 'INSERT', 'UPDATE', 'REFERENCES'] loop
      if has_any_column_privilege(role_name, 'public.kontaktanfragen', operation) then
        raise exception 'Unexpected column privilege for role %: %', role_name, operation;
      end if;
    end loop;
  end loop;
end;
$$;

commit;
