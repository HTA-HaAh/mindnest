-- Run in Supabase SQL Editor. Enable RLS before using production data.
create extension if not exists pgcrypto;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default 'Friend',
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create table if not exists public.mood_entries (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 mood text not null, intensity int not null check(intensity between 1 and 10), energy int not null check(energy between 1 and 10),
 contexts text[] not null default '{}', note text not null default '', created_at timestamptz not null default now()
);
create table if not exists public.untangle_sessions (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null, category text not null, answers jsonb not null default '[]', action text not null default '',
 status text not null default 'active', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.reflections (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 grateful text not null default '', challenge text not null default '', tomorrow text not null default '', created_at timestamptz not null default now()
);
create table if not exists public.growth_milestones (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null, detail text not null default '', created_at timestamptz not null default now()
);
create table if not exists public.ai_conversations (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 title text not null default 'Mindy conversation', created_at timestamptz not null default now()
);
create table if not exists public.ai_messages (
 id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade, role text not null check(role in ('user','assistant')),
 content text not null, created_at timestamptz not null default now()
);
create table if not exists public.user_preferences (
 user_id uuid primary key references auth.users(id) on delete cascade,
 ai_memory_enabled boolean not null default false, analytics_consent boolean not null default false,
 retention_days int not null default 365, updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
alter table public.mood_entries enable row level security;
alter table public.untangle_sessions enable row level security;
alter table public.reflections enable row level security;
alter table public.growth_milestones enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.user_preferences enable row level security;
create policy "profile owner" on public.profiles for all using (auth.uid()=id) with check(auth.uid()=id);
create policy "moods owner" on public.mood_entries for all using (auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "untangle owner" on public.untangle_sessions for all using (auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "reflections owner" on public.reflections for all using (auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "milestones owner" on public.growth_milestones for all using (auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "conversations owner" on public.ai_conversations for all using (auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "messages owner" on public.ai_messages for all using (auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "preferences owner" on public.user_preferences for all using (auth.uid()=user_id) with check(auth.uid()=user_id);
