  -- ==========================================
  -- SUPABASE DATABASE SETUP FOR CRM PETCARE
  -- Run this script in the Supabase SQL Editor
  -- ==========================================

  -- Drop table if exists
  drop table if exists public.users cascade;

  -- Create users table
  create table public.users (
    id uuid default gen_random_uuid() primary key,
    auth_user_id uuid references auth.users(id) on delete cascade not null unique,
    full_name text not null,
    email text not null unique,
    phone_number text,
    role text default 'customer' check (role in ('admin', 'staff', 'customer')) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
  );

  -- Helper function to fetch user roles (security definer runs with creator privileges, bypassing RLS to avoid recursion)
  create or replace function public.get_user_role(user_uuid uuid)
  returns text
  language plpgsql
  security definer
  stable
  as $$
  declare
    user_role text;
  begin
    select role into user_role from public.users where auth_user_id = user_uuid;
    return user_role;
  end;
  $$;

  -- Enable Row Level Security (RLS)
  alter table public.users enable row level security;

  -- Policies for public.users table

  -- 1. Anyone can insert their profile during registration
  create policy "Allow user profile creation during registration"
  on public.users
  for insert
  with check (true);

  -- 2. Users can view their own profile
  create policy "Users can view own profile"
  on public.users
  for select
  using (auth.uid() = auth_user_id);

  -- 3. Users can update their own profile (full_name, phone_number)
  create policy "Users can update own profile"
  on public.users
  for update
  using (auth.uid() = auth_user_id)
  with check (auth.uid() = auth_user_id);

  -- 4. Staff can view all user profiles (for CRM and pet owner checking)
  create policy "Staff can view all profiles"
  on public.users
  for select
  using (public.get_user_role(auth.uid()) in ('staff', 'admin'));

  -- 5. Admin has full access (CRUD) on all profiles
  create policy "Admin has full access on all profiles"
  on public.users
  for all
  using (public.get_user_role(auth.uid()) = 'admin')
  with check (public.get_user_role(auth.uid()) = 'admin');

