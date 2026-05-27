-- ═══════════════════════════════════════════════════════════════
--  SCHOOL VOTING SYSTEM — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════


-- ── 1. Contestants ───────────────────────────────────────────────
--  You manually update total_votes here via the admin panel.
--  The frontend reads from this table for the live leaderboard.

create table public.contestants (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  department  text,
  image_url   text,
  total_votes integer not null default 0,
  created_at  timestamptz not null default now()
);

-- Allow public read access (for the voting frontend leaderboard)
alter table public.contestants enable row level security;

create policy "Public can read contestants"
  on public.contestants for select
  using (true);

create policy "Authenticated users can update contestants"
  on public.contestants for update
  using (auth.role() = 'authenticated');


-- ── 2. Vote Logs ─────────────────────────────────────────────────
--  Append-only audit trail. One row per manual vote entry.
--  Never updated — only inserted.
--  Use SUM(votes_added) WHERE contestant_id = x to cross-check
--  against contestants.total_votes at any time.

create table public.vote_logs (
  id             bigint generated always as identity primary key,
  contestant_id  uuid not null references public.contestants(id),
  amount_paid    integer not null,    -- in Naira (whole number)
  votes_added    integer not null,
  reference_code text,               -- optional Paystack ref or note
  recorded_at    timestamptz not null default now()
);

create index on public.vote_logs (contestant_id);
create unique index on public.vote_logs (reference_code)
  where reference_code is not null;  -- prevents double-crediting same ref

-- Authenticated users can insert, but NOT update or delete
alter table public.vote_logs enable row level security;

create policy "Authenticated users can insert vote logs"
  on public.vote_logs for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can read vote logs"
  on public.vote_logs for select
  using (auth.role() = 'authenticated');

-- ── No UPDATE or DELETE policies = truly immutable ───────────────


-- ── 3. Seed some contestants (edit as needed) ────────────────────

insert into public.contestants (name, department) values
  ('Ada Okafor',   'Computer Science'),
  ('Emeka Nwosu',  'Mechanical Engineering'),
  ('Zainab Yusuf', 'Medicine & Surgery'),
  ('Tunde Balogun','Law'),
  ('Ngozi Eze',    'Economics');


-- ═══════════════════════════════════════════════════════════════
--  AUDIT QUERY — paste in SQL editor anytime to verify integrity
-- ═══════════════════════════════════════════════════════════════
--
--  select
--    c.name,
--    c.total_votes                        as counter,
--    coalesce(sum(l.votes_added), 0)      as log_sum,
--    c.total_votes - coalesce(sum(l.votes_added), 0) as discrepancy
--  from public.contestants c
--  left join public.vote_logs l on l.contestant_id = c.id
--  group by c.id, c.name, c.total_votes
--  order by c.name;
--
-- ═══════════════════════════════════════════════════════════════
