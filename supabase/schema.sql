-- Supabase Schema for CodeQuest Game
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security
alter database postgres set "app.jwt_secret" to 'your-jwt-secret';

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  email text not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create level_progress table
create table if not exists public.level_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  level_id integer not null,
  completed boolean default false,
  stars integer default 0 check (stars >= 0 and stars <= 3),
  best_moves integer,
  attempts integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  
  -- Ensure one entry per user per level
  unique(user_id, level_id)
);

-- Create indexes for better performance
create index if not exists level_progress_user_id_idx on public.level_progress(user_id);
create index if not exists level_progress_level_id_idx on public.level_progress(level_id);
create index if not exists profiles_username_idx on public.profiles(username);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.level_progress enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Level progress policies
create policy "Users can view their own progress"
  on public.level_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.level_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.level_progress for update
  using (auth.uid() = user_id);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_level_progress_updated_at
  before update on public.level_progress
  for each row execute procedure public.update_updated_at_column();
