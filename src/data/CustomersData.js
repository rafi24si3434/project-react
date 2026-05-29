export const initialCustomers = [
  {
    id: "CUST-001", name: "Budi Santoso", username: "@budis", gender: "Laki-laki", dob: "15 Agustus 1990",
    avatar: "https://i.pravatar.cc/150?u=budis",
    membership: { joinDate: "12 Jan 2024", status: "VIP", level: "Platinum", referralCode: "BUDI-VIP-99", isActive: true },
    interactions: { chats: 12, complaints: 0, tickets: 1, feedback: 5, adminNotes: "Customer VIP. Sangat peduli dengan anabul. Selalu pilih layanan grooming premium." },
    transactions: { history: [{ id: "TRX-101", date: "24 Mei 2026", product: "Royal Canin Persian 2kg", total: "Rp 350.000", method: "BCA Virtual Account" }], totalSpent: "Rp 4.500.000", lastTransaction: "24 Mei 2026" },
    activity: { lastLogin: "Baru saja", device: "iPhone 15 Pro (iOS 17)", location: "Jakarta Selatan, ID", inApp: "Mengecek jadwal klinik", duration: "45 menit" },
    marketing: { source: "Instagram Ads", campaigns: ["PetCare Summer Festival"], giveaway: "Pernah ikut (Menang)", subscription: "Email & WhatsApp", promoStatus: "Diskon 50% Aktif" }
  },
  {
    id: "CUST-002", name: "Dewi Lestari", username: "@dewil", gender: "Perempuan", dob: "22 Maret 1995",
    avatar: "https://i.pravatar.cc/150?u=dewil",
    membership: { joinDate: "05 Mar 2025", status: "Member", level: "Silver", referralCode: "DEWI-PET-22", isActive: true },
    interactions: { chats: 4, complaints: 1, tickets: 0, feedback: 2, adminNotes: "Pernah komplain keterlambatan dokter. Beri diskon 10% kedatangan berikutnya." },
    transactions: { history: [{ id: "TRX-105", date: "26 Mei 2026", product: "Vaksinasi Rabies", total: "Rp 150.000", method: "Qris" }], totalSpent: "Rp 1.200.000", lastTransaction: "26 Mei 2026" },
    activity: { lastLogin: "2 Hari yang lalu", device: "Samsung Galaxy S23", location: "Bandung, ID", inApp: "Melihat riwayat vaksin", duration: "10 menit" },
    marketing: { source: "Referral Teman", campaigns: ["Vaksinasi Gratis"], giveaway: "Belum pernah", subscription: "WhatsApp Only", promoStatus: "Tidak ada" }
  },
  {
    id: "CUST-003", name: "Andi Saputra", username: "@andisap", gender: "Laki-laki", dob: "10 November 1988",
    avatar: "https://i.pravatar.cc/150?u=andis",
    membership: { joinDate: "20 Nov 2025", status: "Member", level: "Gold", referralCode: "ANDI-GOLD-10", isActive: false },
    interactions: { chats: 8, complaints: 0, tickets: 2, feedback: 4, adminNotes: "Jarang berkunjung. Kirimkan blast promo Checkup." },
    transactions: { history: [{ id: "TRX-050", date: "15 Feb 2026", product: "Operasi Steril Kelinci", total: "Rp 850.000", method: "Kartu Kredit" }], totalSpent: "Rp 2.100.000", lastTransaction: "15 Feb 2026" },
    activity: { lastLogin: "3 Bulan yang lalu", device: "MacBook Air M2", location: "Surabaya, ID", inApp: "Membayar tagihan", duration: "5 menit" },
    marketing: { source: "Google Search", campaigns: ["Diskon Steril 2025"], giveaway: "Pernah (Kalah)", subscription: "Unsubscribed", promoStatus: "Voucher Comeback" }
  },
  {
    id: "CUST-004", name: "Rina Amelia", username: "@rinamel", gender: "Perempuan", dob: "01 Januari 1992",
    avatar: "https://i.pravatar.cc/150?u=rinamel",
    membership: { joinDate: "10 Feb 2026", status: "Member", level: "Platinum", referralCode: "RINA-PLAT", isActive: true },
    interactions: { chats: 15, complaints: 0, tickets: 1, feedback: 10, adminNotes: "Langganan grooming mingguan. Tawarkan paket membership tahunan." },
    transactions: { history: [{ id: "TRX-110", date: "28 Mei 2026", product: "Grooming Kucing Reguler", total: "Rp 150.000", method: "OVO" }], totalSpent: "Rp 5.500.000", lastTransaction: "28 Mei 2026" },
    activity: { lastLogin: "5 Jam yang lalu", device: "iPad Pro", location: "Jakarta Barat, ID", inApp: "Booking jadwal grooming", duration: "12 menit" },
    marketing: { source: "TikTok Ads", campaigns: [], giveaway: "Belum pernah", subscription: "Email", promoStatus: "Loyalty Reward Tersedia" }
  },
  {
    id: "CUST-005", name: "Tono Haryanto", username: "@tonoh", gender: "Laki-laki", dob: "12 Desember 1985",
    avatar: "https://i.pravatar.cc/150?u=tonoh",
    membership: { joinDate: "05 Apr 2026", status: "Member", level: "Silver", referralCode: "TONO-PET", isActive: true },
    interactions: { chats: 2, complaints: 0, tickets: 0, feedback: 1, adminNotes: "Baru adopsi anjing rescue. Butuh panduan nutrisi." },
    transactions: { history: [{ id: "TRX-120", date: "02 Mei 2026", product: "Konsultasi Dokter Umum", total: "Rp 100.000", method: "Tunai" }], totalSpent: "Rp 100.000", lastTransaction: "02 Mei 2026" },
    activity: { lastLogin: "1 Minggu yang lalu", device: "Xiaomi 13", location: "Depok, ID", inApp: "Membaca artikel blog", duration: "30 menit" },
    marketing: { source: "Facebook", campaigns: [], giveaway: "Belum pernah", subscription: "Email & WhatsApp", promoStatus: "Diskon Pengguna Baru" }
  },
  {
    id: "CUST-006", name: "Siti Rahma", username: "@sitir", gender: "Perempuan", dob: "05 Juni 2000",
    avatar: "https://i.pravatar.cc/150?u=sitir",
    membership: { joinDate: "15 Jan 2026", status: "Member", level: "Gold", referralCode: "SITI-GOLD", isActive: true },
    interactions: { chats: 20, complaints: 2, tickets: 3, feedback: 8, adminNotes: "Sering bertanya via chat CS. Sangat teliti soal produk." },
    transactions: { history: [{ id: "TRX-135", date: "20 Mei 2026", product: "Mainan Kucing Interaktif", total: "Rp 85.000", method: "ShopeePay" }], totalSpent: "Rp 1.500.000", lastTransaction: "20 Mei 2026" },
    activity: { lastLogin: "Kemarin", device: "iPhone 13", location: "Tangerang, ID", inApp: "Chat dengan CS", duration: "25 menit" },
    marketing: { source: "Instagram Ads", campaigns: ["Pekan Mainan Anabul"], giveaway: "Pernah (Menang)", subscription: "WhatsApp Only", promoStatus: "Gratis Ongkir" }
  },
  {
    id: "CUST-007", name: "Ahmad Fauzi", username: "@fauzi_a", gender: "Laki-laki", dob: "18 Oktober 1993",
    avatar: "https://i.pravatar.cc/150?u=fauzia",
    membership: { joinDate: "20 Des 2024", status: "VIP", level: "Platinum", referralCode: "FAUZI-VIP", isActive: true },
    interactions: { chats: 5, complaints: 0, tickets: 0, feedback: 3, adminNotes: "Owner Pet Shop. Pembelian dalam jumlah besar." },
    transactions: { history: [{ id: "TRX-142", date: "15 Mei 2026", product: "Grosir Makanan Kucing", total: "Rp 2.500.000", method: "Transfer Bank" }], totalSpent: "Rp 12.000.000", lastTransaction: "15 Mei 2026" },
    activity: { lastLogin: "1 Bulan lalu", device: "Windows PC", location: "Bekasi, ID", inApp: "Order B2B", duration: "1 jam" },
    marketing: { source: "Direct Sales", campaigns: ["B2B Partner"], giveaway: "Tidak Relevan", subscription: "Email", promoStatus: "Diskon Grosir 15%" }
  },
  {
    id: "CUST-008", name: "Lintang Kirana", username: "@lintangk", gender: "Perempuan", dob: "25 Februari 1998",
    avatar: "https://i.pravatar.cc/150?u=lintangk",
    membership: { joinDate: "10 Mar 2026", status: "Member", level: "Silver", referralCode: "LINTANG-22", isActive: true },
    interactions: { chats: 1, complaints: 0, tickets: 0, feedback: 1, adminNotes: "Pelanggan baru dari event komunitas." },
    transactions: { history: [{ id: "TRX-150", date: "12 Mar 2026", product: "Kalung Nama Custom", total: "Rp 75.000", method: "Dana" }], totalSpent: "Rp 75.000", lastTransaction: "12 Mar 2026" },
    activity: { lastLogin: "2 Bulan lalu", device: "Oppo Reno 8", location: "Semarang, ID", inApp: "Registrasi akun", duration: "15 menit" },
    marketing: { source: "Event Offline", campaigns: ["Cat Show Semarang"], giveaway: "Pernah (Kalah)", subscription: "Email & WhatsApp", promoStatus: "Tidak ada" }
  },
  {
    id: "CUST-009", name: "Reza Pahlevi", username: "@rezap", gender: "Laki-laki", dob: "30 Juli 1991",
    avatar: "https://i.pravatar.cc/150?u=rezap",
    membership: { joinDate: "05 Nov 2025", status: "Member", level: "Gold", referralCode: "REZA-GOLD", isActive: true },
    interactions: { chats: 6, complaints: 1, tickets: 1, feedback: 4, adminNotes: "Anjing Husky-nya butuh perawatan khusus kulit." },
    transactions: { history: [{ id: "TRX-165", date: "25 Apr 2026", product: "Shampoo Kulit Sensitif", total: "Rp 120.000", method: "Qris" }], totalSpent: "Rp 2.800.000", lastTransaction: "25 Apr 2026" },
    activity: { lastLogin: "3 Hari lalu", device: "iPhone 14 Pro Max", location: "Jakarta Timur, ID", inApp: "Mencari jadwal grooming", duration: "8 menit" },
    marketing: { source: "Google Search", campaigns: [], giveaway: "Belum pernah", subscription: "WhatsApp Only", promoStatus: "Promo Produk Perawatan" }
  },
  {
    id: "CUST-010", name: "Maya Sari", username: "@mayas", gender: "Perempuan", dob: "14 April 1989",
    avatar: "https://i.pravatar.cc/150?u=mayas",
    membership: { joinDate: "01 Feb 2026", status: "Member", level: "Silver", referralCode: "MAYA-PET", isActive: false },
    interactions: { chats: 0, complaints: 0, tickets: 0, feedback: 0, adminNotes: "Akun dorman. Coba re-engagement." },
    transactions: { history: [], totalSpent: "Rp 0", lastTransaction: "Belum ada" },
    activity: { lastLogin: "01 Feb 2026", device: "Vivo V27", location: "Malang, ID", inApp: "Buat akun saja", duration: "2 menit" },
    marketing: { source: "TikTok Ads", campaigns: [], giveaway: "Belum pernah", subscription: "Unsubscribed", promoStatus: "Voucher Diskon 70%" }
  },
  {
    id: "CUST-011", name: "Hendra Wijaya", username: "@hendraw", gender: "Laki-laki", dob: "08 September 1982",
    avatar: "https://i.pravatar.cc/150?u=hendraw",
    membership: { joinDate: "15 Mei 2023", status: "VIP", level: "Platinum", referralCode: "HENDRA-VIP", isActive: true },
    interactions: { chats: 3, complaints: 0, tickets: 0, feedback: 12, adminNotes: "Pelanggan setia sejak lama. Punya 5 kucing." },
    transactions: { history: [{ id: "TRX-180", date: "27 Mei 2026", product: "Vaksin Booster 5 Kucing", total: "Rp 1.000.000", method: "Kartu Kredit" }], totalSpent: "Rp 8.500.000", lastTransaction: "27 Mei 2026" },
    activity: { lastLogin: "Hari ini", device: "Samsung Galaxy Fold", location: "Jakarta Pusat, ID", inApp: "Melihat riwayat vaksin", duration: "20 menit" },
    marketing: { source: "Word of Mouth", campaigns: ["Anniversary PetCare"], giveaway: "Pernah (Menang)", subscription: "Email", promoStatus: "Gratis Layanan 1 Kucing" }
  },
  {
    id: "CUST-012", name: "Fitri Handayani", username: "@fitrih", gender: "Perempuan", dob: "19 Mei 1996",
    avatar: "https://i.pravatar.cc/150?u=fitrih",
    membership: { joinDate: "22 Ags 2025", status: "Member", level: "Gold", referralCode: "FITRI-GOLD", isActive: true },
    interactions: { chats: 7, complaints: 0, tickets: 1, feedback: 5, adminNotes: "Sering titip anabul (Pet Hotel) saat weekend." },
    transactions: { history: [{ id: "TRX-192", date: "20 Mei 2026", product: "Pet Hotel 2 Malam", total: "Rp 300.000", method: "Transfer Bank" }], totalSpent: "Rp 3.200.000", lastTransaction: "20 Mei 2026" },
    activity: { lastLogin: "1 Minggu lalu", device: "iPhone 11", location: "Bogor, ID", inApp: "Booking Pet Hotel", duration: "10 menit" },
    marketing: { source: "Instagram Ads", campaigns: ["Liburan Tenang Bersama PetCare"], giveaway: "Belum pernah", subscription: "Email & WhatsApp", promoStatus: "Cashback 10% Pet Hotel" }
  },
  {
    id: "CUST-013", name: "Bagas Pratama", username: "@bagasp", gender: "Laki-laki", dob: "03 Desember 1999",
    avatar: "https://i.pravatar.cc/150?u=bagasp",
    membership: { joinDate: "11 Jan 2026", status: "Member", level: "Silver", referralCode: "BAGAS-PET", isActive: true },
    interactions: { chats: 2, complaints: 0, tickets: 0, feedback: 0, adminNotes: "Mahasiswa. Pelihara iguana." },
    transactions: { history: [{ id: "TRX-201", date: "15 Feb 2026", product: "Konsultasi Hewan Eksotis", total: "Rp 150.000", method: "GoPay" }], totalSpent: "Rp 150.000", lastTransaction: "15 Feb 2026" },
    activity: { lastLogin: "3 Bulan lalu", device: "Asus ROG Phone", location: "Yogyakarta, ID", inApp: "Membaca artikel reptil", duration: "40 menit" },
    marketing: { source: "YouTube Review", campaigns: [], giveaway: "Belum pernah", subscription: "WhatsApp Only", promoStatus: "Tidak ada" }
  },
  {
    id: "CUST-014", name: "Dina Mariana", username: "@dinam", gender: "Perempuan", dob: "28 Oktober 1987",
    avatar: "https://i.pravatar.cc/150?u=dinam",
    membership: { joinDate: "05 Sep 2024", status: "VIP", level: "Platinum", referralCode: "DINA-VIP", isActive: true },
    interactions: { chats: 10, complaints: 1, tickets: 2, feedback: 9, adminNotes: "Pecinta anjing ras kecil. Langganan dental care." },
    transactions: { history: [{ id: "TRX-215", date: "22 Mei 2026", product: "Scaling Gigi Anjing", total: "Rp 450.000", method: "BCA Virtual Account" }], totalSpent: "Rp 6.800.000", lastTransaction: "22 Mei 2026" },
    activity: { lastLogin: "2 Hari lalu", device: "iPhone 14 Pro", location: "Bali, ID", inApp: "Mengecek poin membership", duration: "5 menit" },
    marketing: { source: "Instagram Ads", campaigns: ["Bulan Kesehatan Gigi Hewan"], giveaway: "Pernah (Kalah)", subscription: "Email", promoStatus: "Poin 2x Lipat" }
  },
  {
    id: "CUST-015", name: "Surya Dharma", username: "@suryad", gender: "Laki-laki", dob: "11 Juli 1994",
    avatar: "https://i.pravatar.cc/150?u=suryad",
    membership: { joinDate: "18 Okt 2025", status: "Member", level: "Gold", referralCode: "SURYA-GOLD", isActive: true },
    interactions: { chats: 5, complaints: 0, tickets: 1, feedback: 3, adminNotes: "Beli makanan khusus diet untuk kucingnya." },
    transactions: { history: [{ id: "TRX-230", date: "01 Mei 2026", product: "Pro Plan Weight Loss 1.5kg", total: "Rp 280.000", method: "ShopeePay" }], totalSpent: "Rp 1.900.000", lastTransaction: "01 Mei 2026" },
    activity: { lastLogin: "1 Bulan lalu", device: "Samsung Galaxy A54", location: "Makassar, ID", inApp: "Order produk diet", duration: "10 menit" },
    marketing: { source: "Google Search", campaigns: ["Health & Diet Pet"], giveaway: "Belum pernah", subscription: "Email & WhatsApp", promoStatus: "Potongan Harga Produk Diet" }
  },
  {
    id: "CUST-016", name: "Nina Kusuma", username: "@ninak", gender: "Perempuan", dob: "09 Maret 2001",
    avatar: "https://i.pravatar.cc/150?u=ninak",
    membership: { joinDate: "20 Jan 2026", status: "Member", level: "Silver", referralCode: "NINA-22", isActive: true },
    interactions: { chats: 14, complaints: 0, tickets: 0, feedback: 2, adminNotes: "Sering tanya stok baju anjing." },
    transactions: { history: [{ id: "TRX-245", date: "28 Mei 2026", product: "Baju Rajut Anjing", total: "Rp 65.000", method: "Dana" }], totalSpent: "Rp 250.000", lastTransaction: "28 Mei 2026" },
    activity: { lastLogin: "Hari ini", device: "iPhone 12 Mini", location: "Jakarta Selatan, ID", inApp: "Scroll katalog produk", duration: "1.5 jam" },
    marketing: { source: "TikTok", campaigns: ["Pet Fashion Week"], giveaway: "Pernah (Kalah)", subscription: "WhatsApp Only", promoStatus: "Beli 2 Gratis 1 Baju" }
  },
  {
    id: "CUST-017", name: "Gilang Ramadhan", username: "@gilangr", gender: "Laki-laki", dob: "16 April 1997",
    avatar: "https://i.pravatar.cc/150?u=gilangr",
    membership: { joinDate: "14 Feb 2026", status: "Member", level: "Silver", referralCode: "GILANG-PET", isActive: true },
    interactions: { chats: 1, complaints: 0, tickets: 0, feedback: 0, adminNotes: "Adopsi kelinci dari shelter mitra." },
    transactions: { history: [{ id: "TRX-251", date: "14 Feb 2026", product: "Paket Starter Kelinci", total: "Rp 350.000", method: "Qris" }], totalSpent: "Rp 350.000", lastTransaction: "14 Feb 2026" },
    activity: { lastLogin: "3 Bulan lalu", device: "Realme 10", location: "Solo, ID", inApp: "Transaksi awal", duration: "10 menit" },
    marketing: { source: "Shelter Mitra", campaigns: ["Adoption Drive"], giveaway: "Belum pernah", subscription: "Unsubscribed", promoStatus: "Tidak ada" }
  },
  {
    id: "CUST-018", name: "Putri Ayu", username: "@putriayu", gender: "Perempuan", dob: "23 Agustus 1993",
    avatar: "https://i.pravatar.cc/150?u=putriayu",
    membership: { joinDate: "30 Nov 2024", status: "VIP", level: "Platinum", referralCode: "PUTRI-VIP", isActive: true },
    interactions: { chats: 8, complaints: 0, tickets: 1, feedback: 15, adminNotes: "Breeder kucing persia. Selalu vaksin rombongan." },
    transactions: { history: [{ id: "TRX-268", date: "10 Mei 2026", product: "Vaksin Lengkap 4 Kucing", total: "Rp 800.000", method: "Transfer Bank" }], totalSpent: "Rp 9.200.000", lastTransaction: "10 Mei 2026" },
    activity: { lastLogin: "2 Minggu lalu", device: "iPad Air", location: "Bandung, ID", inApp: "Booking dokter hewan", duration: "15 menit" },
    marketing: { source: "Referral Breeder", campaigns: [], giveaway: "Tidak Relevan", subscription: "Email", promoStatus: "Harga Khusus Breeder" }
  },
  {
    id: "CUST-019", name: "Kevin Sanjaya", username: "@kevins", gender: "Laki-laki", dob: "02 Mei 1995",
    avatar: "https://i.pravatar.cc/150?u=kevins",
    membership: { joinDate: "10 Jan 2026", status: "Member", level: "Gold", referralCode: "KEVIN-GOLD", isActive: true },
    interactions: { chats: 3, complaints: 0, tickets: 0, feedback: 4, adminNotes: "Punya burung kakaktua." },
    transactions: { history: [{ id: "TRX-280", date: "05 Apr 2026", product: "Pakan Burung Premium", total: "Rp 150.000", method: "GoPay" }], totalSpent: "Rp 1.100.000", lastTransaction: "05 Apr 2026" },
    activity: { lastLogin: "1 Bulan lalu", device: "iPhone 13 Pro", location: "Surabaya, ID", inApp: "Review produk", duration: "5 menit" },
    marketing: { source: "YouTube Ads", campaigns: [], giveaway: "Belum pernah", subscription: "Email & WhatsApp", promoStatus: "Tidak ada" }
  },
  {
    id: "CUST-020", name: "Siska Saraswati", username: "@siskas", gender: "Perempuan", dob: "17 Juni 1986",
    avatar: "https://i.pravatar.cc/150?u=siskas",
    membership: { joinDate: "05 Mar 2024", status: "VIP", level: "Platinum", referralCode: "SISKA-VIP", isActive: true },
    interactions: { chats: 6, complaints: 1, tickets: 2, feedback: 8, adminNotes: "Langganan antar-jemput pet grooming." },
    transactions: { history: [{ id: "TRX-295", date: "26 Mei 2026", product: "Grooming & Antar Jemput", total: "Rp 300.000", method: "Kartu Kredit" }], totalSpent: "Rp 7.500.000", lastTransaction: "26 Mei 2026" },
    activity: { lastLogin: "3 Hari lalu", device: "Samsung Galaxy S22", location: "Jakarta Pusat, ID", inApp: "Tracking supir penjemput", duration: "25 menit" },
    marketing: { source: "Word of Mouth", campaigns: ["Layanan Antar Jemput"], giveaway: "Belum pernah", subscription: "WhatsApp Only", promoStatus: "Gratis 1x Antar Jemput" }
  },
  {
    id: "CUST-021", name: "Beni Irawan", username: "@benii", gender: "Laki-laki", dob: "29 September 1992",
    avatar: "https://i.pravatar.cc/150?u=benii",
    membership: { joinDate: "12 Apr 2026", status: "Member", level: "Silver", referralCode: "BENI-22", isActive: true },
    interactions: { chats: 0, complaints: 0, tickets: 0, feedback: 1, adminNotes: "Beli kandang anjing besar." },
    transactions: { history: [{ id: "TRX-310", date: "12 Apr 2026", product: "Kandang Besi XL", total: "Rp 1.200.000", method: "Transfer Bank" }], totalSpent: "Rp 1.200.000", lastTransaction: "12 Apr 2026" },
    activity: { lastLogin: "1 Bulan lalu", device: "Poco F4", location: "Depok, ID", inApp: "Checkout produk", duration: "10 menit" },
    marketing: { source: "Google Shopping", campaigns: [], giveaway: "Belum pernah", subscription: "Email", promoStatus: "Diskon Aksesoris" }
  },
  {
    id: "CUST-022", name: "Farah Diba", username: "@farahd", gender: "Perempuan", dob: "11 Januari 1999",
    avatar: "https://i.pravatar.cc/150?u=farahd",
    membership: { joinDate: "08 Mei 2026", status: "Member", level: "Silver", referralCode: "FARAH-PET", isActive: true },
    interactions: { chats: 3, complaints: 0, tickets: 0, feedback: 0, adminNotes: "Konsultasi jamur kulit pada anak kucing." },
    transactions: { history: [{ id: "TRX-322", date: "08 Mei 2026", product: "Salep Anti Jamur", total: "Rp 45.000", method: "ShopeePay" }], totalSpent: "Rp 45.000", lastTransaction: "08 Mei 2026" },
    activity: { lastLogin: "2 Minggu lalu", device: "iPhone SE", location: "Tangerang, ID", inApp: "Konsultasi online", duration: "30 menit" },
    marketing: { source: "TikTok", campaigns: ["Tele-vet Launch"], giveaway: "Belum pernah", subscription: "WhatsApp Only", promoStatus: "Free Konsul Lanjutan" }
  },
  {
    id: "CUST-023", name: "Joko Anwar", username: "@jokoa", gender: "Laki-laki", dob: "04 Maret 1980",
    avatar: "https://i.pravatar.cc/150?u=jokoa",
    membership: { joinDate: "20 Sep 2025", status: "Member", level: "Gold", referralCode: "JOKO-GOLD", isActive: true },
    interactions: { chats: 2, complaints: 0, tickets: 1, feedback: 5, adminNotes: "Rutin beli obat cacing tiap bulan." },
    transactions: { history: [{ id: "TRX-340", date: "01 Mei 2026", product: "Drontal Cat", total: "Rp 60.000", method: "OVO" }], totalSpent: "Rp 1.500.000", lastTransaction: "01 Mei 2026" },
    activity: { lastLogin: "3 Minggu lalu", device: "Samsung Galaxy Tab", location: "Jakarta Selatan, ID", inApp: "Repeat order otomatis", duration: "3 menit" },
    marketing: { source: "Organic", campaigns: [], giveaway: "Belum pernah", subscription: "Email", promoStatus: "Tidak ada" }
  },
  {
    id: "CUST-024", name: "Cynthia Bella", username: "@cynthiab", gender: "Perempuan", dob: "21 Juli 1994",
    avatar: "https://i.pravatar.cc/150?u=cynthiab",
    membership: { joinDate: "15 Jul 2024", status: "VIP", level: "Platinum", referralCode: "CYNTHIA-VIP", isActive: true },
    interactions: { chats: 9, complaints: 2, tickets: 1, feedback: 11, adminNotes: "Sering protes packing rusak, beri extra bubble wrap!" },
    transactions: { history: [{ id: "TRX-355", date: "25 Mei 2026", product: "Cat Pasir Bentonite 10L", total: "Rp 110.000", method: "BCA Virtual Account" }], totalSpent: "Rp 5.400.000", lastTransaction: "25 Mei 2026" },
    activity: { lastLogin: "3 Hari lalu", device: "iPhone 15", location: "Bekasi, ID", inApp: "Lacak pengiriman", duration: "10 menit" },
    marketing: { source: "Instagram Ads", campaigns: ["Pekan Pasir Kucing"], giveaway: "Pernah (Menang)", subscription: "Email & WhatsApp", promoStatus: "Klaim Garansi Packing" }
  },
  {
    id: "CUST-025", name: "Eko Prasetyo", username: "@ekop", gender: "Laki-laki", dob: "13 Oktober 1983",
    avatar: "https://i.pravatar.cc/150?u=ekop",
    membership: { joinDate: "05 Jan 2026", status: "Member", level: "Gold", referralCode: "EKO-GOLD", isActive: true },
    interactions: { chats: 4, complaints: 0, tickets: 0, feedback: 2, adminNotes: "Langganan makanan basah grosir." },
    transactions: { history: [{ id: "TRX-370", date: "20 Apr 2026", product: "Whiskas Pouch Tuna x24", total: "Rp 150.000", method: "Qris" }], totalSpent: "Rp 2.100.000", lastTransaction: "20 Apr 2026" },
    activity: { lastLogin: "1 Bulan lalu", device: "Xiaomi Pad 6", location: "Bogor, ID", inApp: "Browsing promo", duration: "20 menit" },
    marketing: { source: "Google Ads", campaigns: [], giveaway: "Belum pernah", subscription: "WhatsApp Only", promoStatus: "Voucher Free Ongkir 50rb" }
  }
];
