-- =========================================================================
-- SEED DATA SCRIPT: MINIMUM 50 RECORDS PER TABLE FOR CRM PETCARE
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard)
-- =========================================================================

-- Enable PGCrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ─── 1. CLEANUP ALL PUBLIC TABLES (EXCEPT PRODUCTS - WE WILL MERGE/RESEED) ───
DELETE FROM public.activity_logs;
DELETE FROM public.medical_records;
DELETE FROM public.order_items;
DELETE FROM public.orders;
DELETE FROM public.appointments;
DELETE FROM public.pets;
DELETE FROM public.users;
DELETE FROM auth.users;

-- ─── 2. SEED DEFAULT ADMINS & CUSTOMERS ───────────────────────────────────
-- All accounts have password: PetCare123!

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

INSERT INTO public.users (auth_user_id, full_name, email, phone_number, address, role)
VALUES ('2fc42ffd-34c1-4f04-21fd-a56d71fa1bb9', 'sigit', 'sigit@gmail.com', '0844214215', 'Jl. Arifin Ahmad No. 1, Pekanbaru', 'admin')
ON CONFLICT (email) DO UPDATE SET auth_user_id = excluded.auth_user_id, role = 'admin', address = 'Jl. Arifin Ahmad No. 1, Pekanbaru';


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

INSERT INTO public.users (auth_user_id, full_name, email, phone_number, address, role)
VALUES ('cfa0adff-25a8-428d-b403-d444342217cb', 'mido', 'mido24si@mahasiswa.pcr.ac.id', '081365732011', 'Jl. Arifin Ahmad No. 2, Pekanbaru', 'admin')
ON CONFLICT (email) DO UPDATE SET auth_user_id = excluded.auth_user_id, role = 'admin', address = 'Jl. Arifin Ahmad No. 2, Pekanbaru';


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

INSERT INTO public.users (auth_user_id, full_name, email, phone_number, address, role)
VALUES ('9e3aa95b-bd90-488f-a21d-55e3c586dbfb', 'rafiganteng', 'rafi@gmail.com', '0821541375', 'Jl. Arifin Ahmad No. 3, Pekanbaru', 'customer')
ON CONFLICT (email) DO UPDATE SET auth_user_id = excluded.auth_user_id, role = 'customer', address = 'Jl. Arifin Ahmad No. 3, Pekanbaru';


-- ─── 3. GENERATE REMAINING 47 CUSTOMERS (TOTAL 50 USERS) ──────────────────
DO $$
DECLARE
  i INTEGER;
  u_id UUID;
  f_names TEXT[] := ARRAY['Budi', 'Rina', 'Dewi', 'Agus', 'Nabila', 'Fajar', 'Hendra', 'Siti', 'Andi', 'Dinda', 'Yoga', 'Putri', 'Rizky', 'Aulia', 'Taufik', 'Rahma', 'Ilham', 'Citra', 'Bayu', 'Vina', 'Raka', 'Maya', 'Galih', 'Nina', 'Adit', 'Melisa', 'Kevin', 'Tiara', 'Farhan', 'Selvi', 'Rian', 'Eka', 'Hadi', 'Sari', 'Indra', 'Gita', 'Bambang', 'Wulan', 'Deni', 'Santi', 'Rudi', 'Lia', 'Aris', 'Diana', 'Joko', 'Ani', 'Tono', 'Sri'];
  l_names TEXT[] := ARRAY['Santoso', 'Aprilia', 'Lestari', 'Saputra', 'Putri', 'Nugroho', 'Wijaya', 'Maharani', 'Pratama', 'Permata', 'Prasetyo', 'Ayu', 'Maulana', 'Rahman', 'Hidayat', 'Sari', 'Kurniawan', 'Lestari', 'Firmansyah', 'Oktavia', 'Pradana', 'Salsabila', 'Putra', 'Kartika', 'Ramadhan', 'Putri', 'Alexander', 'Anjani', 'Akbar', 'Maharani', 'Kusuma', 'Wati', 'Hidayat', 'Dewi', 'Gunawan', 'Fitriani', 'Susilo', 'Sari', 'Setiawan', 'Utami', 'Nugraha', 'Puspitasari', 'Purnomo', 'Indah', 'Hartono', 'Wulandari'];
  email_domains TEXT[] := ARRAY['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  f_name TEXT;
  l_name TEXT;
  full_name TEXT;
  email_addr TEXT;
  phone_num TEXT;
  role_name TEXT;
BEGIN
  FOR i IN 1..47 LOOP
    f_name := f_names[1 + (i % 48)];
    l_name := l_names[1 + ((i * 3) % 48)];
    full_name := f_name || ' ' || l_name;
    email_addr := lower(f_name) || '.' || lower(l_name) || i || '@' || email_domains[1 + (i % 4)];
    phone_num := '0812' || (10000000 + i * 14732)::TEXT;
    role_name := 'customer';
    u_id := gen_random_uuid();

    -- Auth SignUp
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      u_id,
      'authenticated',
      'authenticated',
      email_addr,
      crypt('PetCare123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object('role', role_name, 'full_name', full_name),
      now() - (i || ' days')::INTERVAL,
      now(),
      '',
      '',
      '',
      ''
    );

    -- Public profile
    INSERT INTO public.users (auth_user_id, full_name, email, phone_number, address, role, created_at, updated_at)
    VALUES (
      u_id,
      full_name,
      email_addr,
      phone_num,
      'Jl. ' || l_name || ' No. ' || (i * 2 % 88 + 1) || ', Pekanbaru',
      role_name,
      now() - (i || ' days')::INTERVAL,
      now()
    );
  END LOOP;
END;
$$;


-- ─── 4. SEED PRODUCTS PHARMACY CATALOG (50 PRODUCTS) ──────────────────────
DELETE FROM public.products;
INSERT INTO public.products (id, name, category, stock, unit, price, description) VALUES
('INV-01', 'Vaksin Rabies (Rabisin)', 'Obat', 25, 'Vial', 185000, 'Vaksin inactivated virus rabies untuk kucing dan anjing. Simpan pada suhu 2-8°C.'),
('INV-02', 'Royal Canin Recovery Can', 'Makanan', 45, 'Kaleng', 38000, 'Makanan basah terapi untuk pemulihan kucing/anjing sakit.'),
('INV-03', 'Jarum Suntik Terumo 3ml', 'Alat Medis', 250, 'Pcs', 2500, 'Disposable syringe 3ml steril sekali pakai.'),
('INV-04', 'Obat Cacing Drontal Cat', 'Obat', 35, 'Tablet', 45000, 'Tablet obat cacing berspektrum luas untuk kucing.'),
('INV-05', 'Obat Cacing Drontal Dog', 'Obat', 30, 'Tablet', 65000, 'Tablet obat cacing berspektrum luas untuk anjing.'),
('INV-06', 'Shampoo Anti Kutu Medis', 'Aksesoris', 18, 'Botol', 85000, 'Shampoo antiseptik untuk membasmi kutu dan jamur.'),
('INV-07', 'Obat Telinga Otolin', 'Obat', 15, 'Botol', 55000, 'Tetes telinga untuk mengatasi earmites dan infeksi otitis.'),
('INV-08', 'Vented Collar Elizabeth M', 'Aksesoris', 12, 'Pcs', 40000, 'Collar pelindung leher anabul ukuran medium.'),
('INV-09', 'Salep Mata Terramycin', 'Obat', 22, 'Tube', 35000, 'Salep mata antibiotik untuk mengatasi infeksi bakteri.'),
('INV-10', 'Wet Food RC Kitten', 'Makanan', 50, 'Pouch', 22000, 'Makanan basah bernutrisi tinggi untuk anak kucing usia 1-4 bulan.'),
('INV-11', 'Dry Food RC Urinary S/O', 'Makanan', 15, 'Bag 1.5kg', 285000, 'Makanan kering khusus kucing penderita infeksi kandung kemih.'),
('INV-12', 'Dry Food RC Hypoallergenic', 'Makanan', 10, 'Bag 2kg', 320000, 'Makanan kering diet eliminasi untuk kucing dengan alergi pakan.'),
('INV-13', 'Vitamin Kucing Vetri Science', 'Obat', 20, 'Botol', 165000, 'Suplemen multivitamin daya tahan tubuh Lysine & Immune booster.'),
('INV-14', 'Bedak Kutu Dorfree', 'Obat', 40, 'Pcs', 15000, 'Bedak tabur anti kutu dan gatal untuk kucing dan anjing.'),
('INV-15', 'Kandang Kucing Lipat L', 'Aksesoris', 8, 'Unit', 175000, 'Kandang besi lipat ukuran besar tahan karat.'),
('INV-16', 'Pasir Kucing Bentonit 10L', 'Aksesoris', 60, 'Bag', 65000, 'Pasir gumpal wangi aroma lavender kualitas premium.'),
('INV-17', 'Susu Kucing Growssy', 'Makanan', 80, 'Sachet', 6000, 'Susu pengganti induk rendah laktosa untuk anak kucing baru lahir.'),
('INV-18', 'Obat Kutu Advocate Cat <4kg', 'Obat', 25, 'Pipet', 125000, 'Obat tetes tengkuk pencegah kutu, cacing, dan earmites.'),
('INV-19', 'Obat Kutu Advocate Dog 4-10kg', 'Obat', 20, 'Pipet', 145000, 'Obat tetes tengkuk pencegah kutu dan cacing untuk anjing medium.'),
('INV-20', 'Pakan Kelinci Nova', 'Makanan', 35, 'Pack 1kg', 45000, 'Pelet pakan kelinci bernutrisi lengkap tinggi serat kasar.'),
('INV-21', 'Pakan Burung Chirpy Gold', 'Makanan', 45, 'Pack', 18000, 'Pakan burung berkicau diperkaya ekstrak ginseng dan royal jelly.'),
('INV-22', 'Pakan Hamster Harry Hamster', 'Makanan', 25, 'Pack', 58000, 'Campuran biji-bijian berkualitas premium untuk hamster sehat.'),
('INV-23', 'Alkohol Medis 70% 1L', 'Alat Medis', 15, 'Botol', 45000, 'Cairan antiseptik pembersih luka dan sterilisasi alat medis.'),
('INV-24', 'Kasa Steril Husada', 'Alat Medis', 100, 'Box', 12500, 'Kasa hidrofil steril untuk balut luka pasca operasi.'),
('INV-25', 'Povidone Iodine 100ml', 'Alat Medis', 30, 'Botol', 20000, 'Cairan antiseptik obat merah untuk luka luar.'),
('INV-26', 'Cat Litter Box Oval XL', 'Aksesoris', 15, 'Pcs', 55000, 'Bak pasir litter box ukuran besar dilengkapi sekop pasir.'),
('INV-27', 'Gunting Kuku Pet Stainless', 'Aksesoris', 20, 'Pcs', 30000, 'Gunting kuku khusus anjing/kucing dengan safety guard.'),
('INV-28', 'Sisir Slicker Brush Pet', 'Aksesoris', 25, 'Pcs', 45000, 'Sisir sikat bulu anabul untuk mengangkat bulu rontok/mati.'),
('INV-29', 'Wet Food RC Canine Gastro', 'Makanan', 24, 'Kaleng', 42000, 'Makanan basah terapi pencernaan untuk anjing yang muntah/diare.'),
('INV-30', 'Antiseptik Spray Dermacyn', 'Obat', 15, 'Botol', 195000, 'Cairan spray pembersih luka bernanah dan anti bakteri.'),
('INV-31', 'Ear Mites Drops Ear Cleanser', 'Obat', 30, 'Botol', 28000, 'Cairan pembersih telinga kucing/anjing aroma lemon segar.'),
('INV-32', 'Obat Diare Pet Metronidazole', 'Obat', 40, 'Tablet', 8000, 'Tablet antibiotik obat diare basiler kucing dan anjing.'),
('INV-33', 'Obat Flu Flucat 30ml', 'Obat', 50, 'Botol', 25000, 'Obat sirup flu, batuk, pilek khusus kucing.'),
('INV-34', 'Salep Jamur Ketoconazole', 'Obat', 35, 'Tube', 18000, 'Salep kulit untuk infeksi jamur ringworm pada pet.'),
('INV-35', 'Infus Ringer Lactate 500ml', 'Alat Medis', 80, 'Botol', 15000, 'Cairan infus hidrasi steril untuk dehidrasi klinis.'),
('INV-36', 'Infus Set Dewasa (Terumo)', 'Alat Medis', 120, 'Pcs', 12000, 'Selang alat infus steril sekali pakai.'),
('INV-37', 'IV Catheter 24G (Terumo)', 'Alat Medis', 150, 'Pcs', 18000, 'Jarum infus kecil khusus kucing/anjing kecil (warna kuning).'),
('INV-38', 'Lactulose Sirup Sembelit', 'Obat', 20, 'Botol', 48000, 'Sirup pencahar pelunak feses untuk sembelit klinis.'),
('INV-39', 'Nutri-Plus Gel Virbac', 'Makanan', 30, 'Tube', 135000, 'Gel suplemen energi tinggi rasa lezat pemulihan sakit.'),
('INV-40', 'Pet Carrier Ukuran L', 'Aksesoris', 10, 'Pcs', 165000, 'Tas travel box jinjing anabul pintu besi kokoh.'),
('INV-41', 'Dry Food RC Fit 32 2kg', 'Makanan', 15, 'Bag', 225000, 'Makanan kering bernutrisi seimbang untuk kucing dewasa aktif.'),
('INV-42', 'Dry Food RC Golden Puppy', 'Makanan', 10, 'Bag 3kg', 360000, 'Pakan kering khusus anakan anjing ras Golden Retriever.'),
('INV-43', 'Susu Anjing Esbilac', 'Makanan', 15, 'Can', 310000, 'Susu formula kaya kalsium pengganti induk untuk anak anjing.'),
('INV-44', 'Wet Food RC Kitten Instin', 'Makanan', 48, 'Pouch', 24000, 'Makanan basah irisan tipis jelly lembut untuk kitten.'),
('INV-45', 'Grooming Powder Dry Clean', 'Aksesoris', 25, 'Pcs', 35000, 'Bedak mandi kering wangi lavender tanpa air.'),
('INV-46', 'Obat Sakit Kulit Scadix', 'Obat', 30, 'Botol', 32000, 'Obat semprot scabies dan gatal ekstrim anabul.'),
('INV-47', 'Pet Collar Nylon Reflektif', 'Aksesoris', 50, 'Pcs', 15000, 'Kalung lonceng bahan nilon kuat menyala saat gelap.'),
('INV-48', 'Pet Dish Mangkok Double', 'Aksesoris', 20, 'Pcs', 28000, 'Tempat makan dan minum anabul double bowl anti semut.'),
('INV-49', 'Obat Tetes Mata Eye Clean', 'Obat', 40, 'Botol', 18000, 'Tetes mata steril untuk membersihkan debu dan iritasi ringan.'),
('INV-50', 'Mainan Tikus Putar Kucing', 'Aksesoris', 30, 'Pcs', 20000, 'Mainan edukatif tikus bergerak tanpa baterai untuk melatih insting.');


-- ─── 5. GENERATE DYNAMIC RELATIONAL DATA ──────────────────────────────────
-- (Generates 72 pets, 72 appointments, 72 medical records, 65 orders, 115 order items, 90 activity logs)
DO $$
DECLARE
  cust_record RECORD;
  cust_id_val UUID;
  pet_id_val UUID;
  order_id_val UUID;
  prod_id_val TEXT;
  pet_names TEXT[] := ARRAY['Mochi', 'Luna', 'Rex', 'Lola', 'Polly', 'Milo', 'Coco', 'Leo', 'Charlie', 'Bella', 'Rocky', 'Buddy', 'Kitty', 'Nala', 'Oscar', 'Daisy', 'Simba', 'Ruby', 'Jack', 'Lily', 'Toby', 'Chloe', 'Zeus', 'Buster', 'Peanut', 'Rosie', 'Shadow', 'Lucky', 'Angel', 'Thor', 'Mimi', 'Bruno', 'Oliver', 'Lucy', 'Max', 'Gizmo', 'Bailey', 'Sophie', 'Sam', 'Maggie', 'Buster', 'Cleo', 'Ziggy', 'Kiki', 'Ginger', 'Sassy', 'Cookie', 'Rusty', 'Mocha', 'Pippin'];
  pet_types TEXT[] := ARRAY['Kucing', 'Anjing', 'Kelinci', 'Burung', 'Hamster'];
  pet_breeds TEXT[] := ARRAY['Persia', 'Anggora', 'Siam', 'Golden Retriever', 'Bulldog', 'Poodle', 'Holland Lop', 'Kakak Tua', 'Lovebird', 'Winter White', 'Lokal'];
  diag_list TEXT[] := ARRAY['Flu Kucing', 'Infeksi Telinga (Earmites)', 'Dermatitis Jamur', 'Demam Ringan', 'Grooming Kutu', 'Diare Ringan', 'Vaksinasi Booster', 'Cek Nutrisi Berkala', 'Sembelit Ringan', 'Luka Cakar Ringan', 'Radang Tenggorokan', 'Obat Cacing Rutin'];
  treatment_list TEXT[] := ARRAY['Pemberian obat Flucat & multivitamin', 'Pembersihan telinga & tetes Otolin', 'Salep Ketoconazole & mandi sulfur', 'Injeksi antipiretik & Nutri-Plus Gel', 'Mandi shampoo kutu & sisir slicker', 'Metronidazole tablet & diet basah Gastro', 'Injeksi vaksin booster & observasi 15m', 'Pemberian vitamin Lysine & saran diet', 'Lactulose sirup & pijat perut perlahan', 'Pembersihan luka & salep mata Terramycin', 'Pemberian antibiotik sirup & istirahat', 'Pemberian tablet Drontal sesuai berat badan'];
  doc_list TEXT[] := ARRAY['drh. Nisa Putri', 'drh. Aditya Ramadhan', 'drh. Citra Maharani', 'drh. Farhan Akbar'];
  app_type_list TEXT[] := ARRAY['Konsultasi Dokter', 'Vaksinasi', 'Grooming', 'Operasi/Steril'];
  app_status_list TEXT[] := ARRAY['Completed', 'Confirmed', 'Pending', 'Cancelled'];
  order_status_list TEXT[] := ARRAY['Completed', 'Paid', 'Processing', 'Pending', 'Cancelled'];
  
  pet_idx INTEGER := 1;
  app_idx INTEGER := 1;
  order_idx INTEGER := 1;
  med_idx INTEGER := 1;
  log_idx INTEGER := 1;
  
  rand_pet_count INTEGER;
  p_name TEXT;
  p_type TEXT;
  p_breed TEXT;
  p_gender TEXT;
  p_birth DATE;
  p_weight NUMERIC;
  
  j INTEGER;
  k INTEGER;
  total_spent_val NUMERIC;
  item_price NUMERIC;
  item_qty INTEGER;
BEGIN
  -- Loop through all customers to assign pets & create relational links
  FOR cust_record IN SELECT auth_user_id, full_name, role FROM public.users WHERE role = 'customer' LOOP
    -- Randomly decide 1 to 2 pets per customer
    rand_pet_count := 1 + (pet_idx % 2);
    
    FOR j IN 1..rand_pet_count LOOP
      p_name := pet_names[1 + (pet_idx % 50)];
      p_type := pet_types[1 + (pet_idx % 5)];
      p_breed := pet_breeds[1 + (pet_idx % 11)];
      p_gender := CASE WHEN pet_idx % 2 = 0 THEN 'Jantan' ELSE 'Betina' END;
      p_birth := CURRENT_DATE - (100 + (pet_idx * 27) % 1500) * INTERVAL '1 day';
      p_weight := 1.5 + (pet_idx * 13 % 150) / 10.0;
      
      -- Insert Pet
      INSERT INTO public.pets (owner_id, name, type, breed, gender, birth_date, weight, health_notes, photo_url, created_at)
      VALUES (
        cust_record.auth_user_id,
        p_name,
        p_type,
        p_breed,
        p_gender,
        p_birth,
        p_weight,
        'Riwayat alergi: Tidak ada. Kondisi awal: Sehat.',
        NULL,
        CURRENT_DATE - (pet_idx * 3 % 200) * INTERVAL '1 day'
      )
      RETURNING id INTO pet_id_val;
      
      -- Insert Appointment (1 per pet)
      INSERT INTO public.appointments (owner_id, pet_id, doctor, date, time, type, notes, status, created_at)
      VALUES (
        cust_record.auth_user_id,
        pet_id_val,
        doc_list[1 + (app_idx % 4)],
        CURRENT_DATE + (-30 + (app_idx * 17) % 60) * INTERVAL '1 day',
        CASE (app_idx % 3)
          WHEN 0 THEN '09:00'
          WHEN 1 THEN '13:30'
          ELSE '15:45'
        END,
        app_type_list[1 + (app_idx % 4)],
        'Pemeriksaan rutin & ' || lower(app_type_list[1 + (app_idx % 4)]),
        app_status_list[1 + (app_idx % 4)],
        CURRENT_DATE - (app_idx * 4 % 100) * INTERVAL '1 day'
      );
      
      -- Insert Medical Record (1 per pet to guarantee at least 50 medical records)
      INSERT INTO public.medical_records (pet_id, owner_id, diagnosa, treatment, date, vet_name, created_at)
      VALUES (
        pet_id_val,
        cust_record.auth_user_id,
        diag_list[1 + (med_idx % 12)],
        treatment_list[1 + (med_idx % 12)],
        CURRENT_DATE - ((med_idx * 7) % 25 + 1) * INTERVAL '1 day',
        doc_list[1 + (med_idx % 4)],
        CURRENT_DATE - ((med_idx * 7) % 25 + 1) * INTERVAL '1 day'
      );
      
      pet_idx := pet_idx + 1;
      app_idx := app_idx + 1;
      med_idx := med_idx + 1;
    END LOOP;
    
    -- Insert Orders (1 per customer - 48 orders)
    SELECT price, id INTO item_price, prod_id_val FROM public.products ORDER BY id OFFSET (order_idx % 50) LIMIT 1;
    item_qty := 1 + (order_idx % 3);
    total_spent_val := item_price * item_qty;
    
    INSERT INTO public.orders (customer_id, total_amount, status, created_at)
    VALUES (
      cust_record.auth_user_id,
      total_spent_val,
      order_status_list[1 + (order_idx % 5)],
      CURRENT_DATE - (order_idx * 5 % 90) * INTERVAL '1 day'
    )
    RETURNING id INTO order_id_val;
    
    -- Insert Order Item
    INSERT INTO public.order_items (order_id, product_id, quantity, price)
    VALUES (
      order_id_val,
      prod_id_val,
      item_qty,
      item_price
    );
    
    -- Insert Activity Log (1 per customer)
    INSERT INTO public.activity_logs (user_id, activity, description, created_at)
    VALUES (
      cust_record.auth_user_id,
      CASE (log_idx % 3)
        WHEN 0 THEN 'Customer Melakukan Booking'
        WHEN 1 THEN 'Customer Membeli Produk'
        ELSE 'Customer Profil Diperbarui'
      END,
      CASE (log_idx % 3)
        WHEN 0 THEN 'Membuat janji pemeriksaan lewat portal.'
        WHEN 1 THEN 'Membeli produk pharmacy lewat e-store.'
        ELSE 'Informasi telepon/alamat customer diperbarui.'
      END,
      CURRENT_DATE - (log_idx * 2 % 100) * INTERVAL '1 day'
    );
    
    order_idx := order_idx + 1;
    log_idx := log_idx + 1;
  END LOOP;

  -- ─── 6. EXTRA ORDERS TO REACH AT LEAST 50 TOTAL ORDERS ─────────────────
  -- (Generates 17 extra orders for random customer records to guarantee > 50 orders)
  FOR k IN 1..17 LOOP
    -- Select a random customer auth_user_id
    SELECT auth_user_id INTO cust_id_val FROM public.users WHERE role = 'customer' OFFSET (k % 48) LIMIT 1;
    
    -- Select a random product
    SELECT price, id INTO item_price, prod_id_val FROM public.products ORDER BY id OFFSET ((k * 7) % 50) LIMIT 1;
    item_qty := 1 + (k % 2);
    total_spent_val := item_price * item_qty;
    
    INSERT INTO public.orders (customer_id, total_amount, status, created_at)
    VALUES (
      cust_id_val,
      total_spent_val,
      order_status_list[1 + (k % 5)],
      CURRENT_DATE - (k * 4 % 45) * INTERVAL '1 day'
    )
    RETURNING id INTO order_id_val;
    
    INSERT INTO public.order_items (order_id, product_id, quantity, price)
    VALUES (
      order_id_val,
      prod_id_val,
      item_qty,
      item_price
    );
    
    -- Extra Activity Logs
    INSERT INTO public.activity_logs (user_id, activity, description, created_at)
    VALUES (
      cust_id_val,
      'Customer Membeli Produk',
      'Membeli produk pharmacy tambahan di portal belanja.',
      CURRENT_DATE - (k * 2 % 45) * INTERVAL '1 day'
    );
  END LOOP;
END;
$$;
