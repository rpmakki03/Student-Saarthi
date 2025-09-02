-- Supabase schema for Student Saarthi MVP

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  language_pref text default 'en',
  created_at timestamp with time zone default now()
);

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  answer text not null,
  created_at timestamp with time zone default now()
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  stream text not null,
  result jsonb not null,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;
alter table public.responses enable row level security;
alter table public.recommendations enable row level security;

create policy "Profiles are viewable by owner" on public.profiles for select using (auth.uid() = id);
create policy "Profiles can be updated by owner" on public.profiles for update using (auth.uid() = id);
create policy "Responses are viewable by owner" on public.responses for select using (auth.uid() = user_id);
create policy "Responses can be inserted by owner" on public.responses for insert with check (auth.uid() = user_id);
create policy "Recommendations are viewable by owner" on public.recommendations for select using (auth.uid() = user_id);
create policy "Recommendations can be inserted by owner" on public.recommendations for insert with check (auth.uid() = user_id);




