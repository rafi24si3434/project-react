    -- =========================================================================
    -- UNIFIED DATABASE SETUP SCRIPT FOR CRM PETCARE
    -- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
    -- =========================================================================

    -- Enable PGCrypto extension for password hashing
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    -- ─── 1. CLEANUP PUBLIC TABLES (TO REMOVE ALL REFERENCES) ─────────────────
    DROP TABLE IF EXISTS public.activity_logs cascade;
    DROP TABLE IF EXISTS public.medical_records cascade;
    DROP TABLE IF EXISTS public.order_items cascade;
    DROP TABLE IF EXISTS public.orders cascade;
    DROP TABLE IF EXISTS public.products cascade;
    DROP TABLE IF EXISTS public.appointments cascade;
    DROP TABLE IF EXISTS public.pets cascade;
    DROP TABLE IF EXISTS public.users cascade;
    DROP FUNCTION IF EXISTS public.get_user_role cascade;

    -- ─── 2. CLEANUP ALL AUTH USERS (CLEAN SLATE FOR AUTHENTICATION) ──────────
    DELETE FROM auth.users;

    -- ─── 3. CREATE USERS PROFILE TABLE ───────────────────────────────────────
    CREATE TABLE public.users (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
      full_name text NOT NULL,
      email text NOT NULL UNIQUE,
      phone_number text,
      address text,
      role text DEFAULT 'customer' CHECK (role IN ('admin', 'staff', 'customer')) NOT NULL,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- ─── 4. USER ROLE HELPER FUNCTION (SECURITY DEFINER) ─────────────────────
    CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
    RETURNS text
    LANGUAGE plpgsql
    SECURITY DEFINER
    STABLE
    AS $$
    DECLARE
      user_role text;
    BEGIN
      SELECT role INTO user_role FROM public.users WHERE auth_user_id = user_uuid;
      RETURN COALESCE(user_role, 'customer');
    END;
    $$;

    -- ─── 5. CREATE OTHER RELATIONAL TABLES ───────────────────────────────────

    -- Pets Table (references public.users(auth_user_id) for joins)
    CREATE TABLE public.pets (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      owner_id uuid REFERENCES public.users(auth_user_id) ON DELETE CASCADE NOT NULL,
      name text NOT NULL,
      type text NOT NULL,
      breed text DEFAULT 'Campuran',
      gender text CHECK (gender IN ('Male', 'Female', 'Jantan', 'Betina')),
      birth_date date,
      weight numeric,
      health_notes text,
      photo_url text,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Appointments Table (references public.users(auth_user_id) for joins)
    CREATE TABLE public.appointments (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      owner_id uuid REFERENCES public.users(auth_user_id) ON DELETE CASCADE NOT NULL,
      pet_id uuid REFERENCES public.pets(id) ON DELETE CASCADE,
      doctor text,
      date date NOT NULL,
      time text NOT NULL,
      type text NOT NULL,
      notes text, -- keluhan
      status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')) NOT NULL,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Products Pharmacy Table
    CREATE TABLE public.products (
      id text PRIMARY KEY, -- INV-01, INV-02 etc.
      name text NOT NULL,
      category text NOT NULL,
      stock integer NOT NULL DEFAULT 0,
      unit text NOT NULL,
      price numeric NOT NULL DEFAULT 0,
      description text,
      image_url text,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Orders Table (references public.users(auth_user_id) for joins)
    CREATE TABLE public.orders (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      customer_id uuid REFERENCES public.users(auth_user_id) ON DELETE CASCADE NOT NULL,
      total_amount numeric NOT NULL DEFAULT 0,
      status text DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Processing', 'Completed', 'Cancelled')) NOT NULL,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Order Items Table
    CREATE TABLE public.order_items (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
      product_id text REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
      quantity integer NOT NULL CHECK (quantity > 0),
      price numeric NOT NULL,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Medical Records Table (references public.users(auth_user_id) for joins)
    CREATE TABLE public.medical_records (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      pet_id uuid REFERENCES public.pets(id) ON DELETE CASCADE NOT NULL,
      owner_id uuid REFERENCES public.users(auth_user_id) ON DELETE CASCADE NOT NULL,
      diagnosa text NOT NULL,
      treatment text,
      date date NOT NULL,
      vet_name text NOT NULL,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Activity Logs Table (references public.users(auth_user_id) for joins)
    CREATE TABLE public.activity_logs (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id uuid REFERENCES public.users(auth_user_id) ON DELETE CASCADE,
      activity text NOT NULL,
      description text,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- ─── 6. ENABLE ROW LEVEL SECURITY (RLS) ──────────────────────────────────
    ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

    -- ─── 7. DEFINE RLS POLICIES ──────────────────────────────────────────────

    -- Users Policies
    CREATE POLICY "Allow profile creation during signup" ON public.users FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow view own profile or by admin/staff" ON public.users FOR SELECT USING (auth.uid() = auth_user_id OR auth.jwt() ->> 'email' = email OR public.get_user_role(auth.uid()) IN ('admin', 'staff'));
    CREATE POLICY "Allow update own profile" ON public.users FOR UPDATE USING (auth.uid() = auth_user_id OR auth.jwt() ->> 'email' = email) WITH CHECK (auth.uid() = auth_user_id OR auth.jwt() ->> 'email' = email);
    CREATE POLICY "Admin has full access on users" ON public.users FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

    -- Pets Policies
    CREATE POLICY "Pets select for owners and staff" ON public.pets FOR SELECT USING (auth.uid() = owner_id OR public.get_user_role(auth.uid()) IN ('admin', 'staff'));
    CREATE POLICY "Pets insert for owners and staff" ON public.pets FOR INSERT WITH CHECK (auth.uid() = owner_id OR public.get_user_role(auth.uid()) IN ('admin', 'staff'));
    CREATE POLICY "Pets update for owners and staff" ON public.pets FOR UPDATE USING (auth.uid() = owner_id OR public.get_user_role(auth.uid()) IN ('admin', 'staff')) WITH CHECK (auth.uid() = owner_id OR public.get_user_role(auth.uid()) IN ('admin', 'staff'));
    CREATE POLICY "Pets delete for owners and admin" ON public.pets FOR DELETE USING (auth.uid() = owner_id OR public.get_user_role(auth.uid()) = 'admin');

    -- Appointments Policies
    CREATE POLICY "Appointments select for owners and staff" ON public.appointments FOR SELECT USING (auth.uid() = owner_id OR public.get_user_role(auth.uid()) IN ('admin', 'staff'));
    CREATE POLICY "Appointments insert for owners and staff" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = owner_id OR public.get_user_role(auth.uid()) IN ('admin', 'staff'));
    CREATE POLICY "Appointments update for owners and staff" ON public.appointments FOR UPDATE USING (auth.uid() = owner_id OR public.get_user_role(auth.uid()) IN ('admin', 'staff')) WITH CHECK (auth.uid() = owner_id OR public.get_user_role(auth.uid()) IN ('admin', 'staff'));
    CREATE POLICY "Appointments delete for owners and admin" ON public.appointments FOR DELETE USING (auth.uid() = owner_id OR public.get_user_role(auth.uid()) = 'admin');

    -- Products Policies (browse is public)
    CREATE POLICY "Allow read products for everyone" ON public.products FOR SELECT USING (true);
    CREATE POLICY "Allow manage products for admin and staff" ON public.products FOR ALL USING (public.get_user_role(auth.uid()) IN ('admin', 'staff')) WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'staff'));

    -- Orders Policies
    CREATE POLICY "Orders select for owners and staff" ON public.orders FOR SELECT USING (auth.uid() = customer_id OR public.get_user_role(auth.uid()) IN ('admin', 'staff'));
    CREATE POLICY "Orders insert for customer" ON public.orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
    CREATE POLICY "Orders update for customer and staff" ON public.orders FOR UPDATE USING (auth.uid() = customer_id OR public.get_user_role(auth.uid()) IN ('admin', 'staff')) WITH CHECK (auth.uid() = customer_id OR public.get_user_role(auth.uid()) IN ('admin', 'staff'));

    -- Order Items Policies
    CREATE POLICY "Order items select for owners and staff" ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND (o.customer_id = auth.uid() OR public.get_user_role(auth.uid()) IN ('admin', 'staff'))));
    CREATE POLICY "Order items insert for customer" ON public.order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = auth.uid()));

    -- Medical Records Policies
    CREATE POLICY "Medical records select for owners and staff" ON public.medical_records FOR SELECT USING (auth.uid() = owner_id OR public.get_user_role(auth.uid()) IN ('admin', 'staff'));
    CREATE POLICY "Medical records manage for admin and staff" ON public.medical_records FOR ALL USING (public.get_user_role(auth.uid()) IN ('admin', 'staff')) WITH CHECK (public.get_user_role(auth.uid()) IN ('admin', 'staff'));

    -- Activity Logs Policies (insert is public for register logging)
    CREATE POLICY "Activity logs insert for everyone" ON public.activity_logs FOR INSERT WITH CHECK (true);
    CREATE POLICY "Activity logs select for owner and admin" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id OR public.get_user_role(auth.uid()) = 'admin');


    -- ─── 8. SEED DATA ────────────────────────────────────────────────────────

    -- Seed Pharmacy Catalog
    INSERT INTO public.products (id, name, category, stock, unit, price, description) VALUES
    ('INV-01', 'Vaksin Rabies (Rabisin)', 'Obat', 15, 'Vial', 185000, 'Vaksin inactivated virus rabies untuk kucing dan anjing. Simpan pada suhu 2-8°C.'),
    ('INV-02', 'Royal Canin Recovery', 'Makanan', 42, 'Kaleng', 35000, 'Makanan terapi untuk anjing dan kucing dalam masa pemulihan.'),
    ('INV-03', 'Jarum Suntik 3cc (Terumo)', 'Alat Medis', 150, 'Pcs', 2500, 'Jarum suntik disposable 3ml dengan jarum 23G x 1 inch. Steril, sekali pakai.'),
    ('INV-04', 'Obat Cacing Drontal Cat', 'Obat', 12, 'Tablet', 45000, 'Anthelmintic broad-spectrum untuk kucing. Dosis: 1 tablet per 4 kg berat badan.');


    -- ─── 9. SEED USERS DIRECTLY INTO AUTH.USERS & PUBLIC.USERS ───────────────
    -- This ensures the accounts can log in immediately with password: PetCare123!

    -- User 1: sigit (Admin)
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      '2fc42ffd-34c1-4f04-21fd-a56d71fa1bb9',
      'authenticated',
      'authenticated',
      'sigit@gmail.com',
      crypt('PetCare123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin","full_name":"sigit"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.users (auth_user_id, full_name, email, phone_number, role)
    VALUES ('2fc42ffd-34c1-4f04-21fd-a56d71fa1bb9', 'sigit', 'sigit@gmail.com', '0844214215', 'admin')
    ON CONFLICT (email) DO UPDATE SET auth_user_id = excluded.auth_user_id, role = 'admin';


    -- User 2: mido (Admin)
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      'cfa0adff-25a8-428d-b403-d444342217cb',
      'authenticated',
      'authenticated',
      'mido24si@mahasiswa.pcr.ac.id',
      crypt('PetCare123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"admin","full_name":"mido"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.users (auth_user_id, full_name, email, phone_number, role)
    VALUES ('cfa0adff-25a8-428d-b403-d444342217cb', 'mido', 'mido24si@mahasiswa.pcr.ac.id', '081365732011', 'admin')
    ON CONFLICT (email) DO UPDATE SET auth_user_id = excluded.auth_user_id, role = 'admin';


    -- User 3: rafi (Customer)
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      '9e3aa95b-bd90-488f-a21d-55e3c586dbfb',
      'authenticated',
      'authenticated',
      'rafi@gmail.com',
      crypt('PetCare123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"role":"customer","full_name":"rafiganteng"}',
      now(),
      now(),
      '',
      '',
      '',
      ''
    ) ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.users (auth_user_id, full_name, email, phone_number, role)
    VALUES ('9e3aa95b-bd90-488f-a21d-55e3c586dbfb', 'rafiganteng', 'rafi@gmail.com', '0821541375', 'customer')
    ON CONFLICT (email) DO UPDATE SET auth_user_id = excluded.auth_user_id, role = 'customer';
