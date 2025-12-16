-- Create the registrations table
create table public.registrations (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  full_name text not null,
  email text not null,
  whatsapp text not null,
  job_title text not null,
  institution text not null,
  referral_source text not null,
  constraint registrations_pkey primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.registrations enable row level security;

-- POLICY: Allow anonymous users to insert data (Registration)
create policy "Allow public inserts" on public.registrations
  for insert
  with check (true);

-- POLICY: Allow anonymous users to view data (Admin Dashboard)
-- NOTE: Since we are using a simple hardcoded login in the frontend and not real Supabase Auth,
-- we must allow public read access for the dashboard to fetch data using the public anon key.
-- In a real production app, you would restrict this to 'authenticated' users only.
create policy "Allow public read" on public.registrations
  for select
  using (true);

-- POLICY: Allow anonymous users to delete data (Admin Dashboard)
create policy "Allow public delete" on public.registrations
  for delete
  using (true);
