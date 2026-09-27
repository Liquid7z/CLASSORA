-- CLASSORA v0.2 core schema
create extension if not exists pgcrypto;
create type public.app_role as enum ('student','teacher','admin');

create table public.institutions (id uuid primary key default gen_random_uuid(), name text not null, slug text unique not null, created_at timestamptz default now());
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, institution_id uuid references public.institutions(id) on delete set null, full_name text not null default '', role public.app_role not null default 'student', department text, semester int, section text, created_at timestamptz default now());
create table public.subjects (id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.institutions(id) on delete cascade, name text not null, code text, created_at timestamptz default now());
create table public.notes (id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.institutions(id) on delete cascade, subject_id uuid references public.subjects(id) on delete set null, uploaded_by uuid not null references public.profiles(id) on delete restrict, title text not null, description text, file_path text not null, file_type text, created_at timestamptz default now());
create table public.announcements (id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.institutions(id) on delete cascade, author_id uuid not null references public.profiles(id) on delete restrict, title text not null, message text not null, priority text not null default 'normal' check (priority in ('normal','important','urgent')), created_at timestamptz default now());

alter table public.institutions enable row level security;
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.notes enable row level security;
alter table public.announcements enable row level security;

create or replace function public.my_institution() returns uuid language sql stable security definer set search_path=public as $$ select institution_id from public.profiles where id=auth.uid() $$;
create or replace function public.my_role() returns public.app_role language sql stable security definer set search_path=public as $$ select role from public.profiles where id=auth.uid() $$;

create policy "profiles same institution" on public.profiles for select using (institution_id=public.my_institution() or id=auth.uid());
create policy "subjects same institution" on public.subjects for select using (institution_id=public.my_institution());
create policy "notes same institution" on public.notes for select using (institution_id=public.my_institution());
create policy "teachers and admins create notes" on public.notes for insert with check (institution_id=public.my_institution() and public.my_role() in ('teacher','admin') and uploaded_by=auth.uid());
create policy "announcements same institution" on public.announcements for select using (institution_id=public.my_institution());
create policy "teachers and admins create announcements" on public.announcements for insert with check (institution_id=public.my_institution() and public.my_role() in ('teacher','admin') and author_id=auth.uid());

insert into storage.buckets (id,name,public) values ('notes','notes',false) on conflict (id) do nothing;
