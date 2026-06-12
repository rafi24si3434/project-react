import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  PawPrint, ArrowRight, ShieldCheck, CalendarCheck, 
  Megaphone, Star, ClipboardList, Users, 
  TrendingUp, Sparkles, Clock, CheckCircle2, Heart, 
  Activity, Info 
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- Treatment Simulator & CRM Discount States ---
  const [selectedPet, setSelectedPet] = useState("cat"); // "cat" | "dog" | "rabbit"
  const [selectedTreatment, setSelectedTreatment] = useState("grooming"); // "grooming" | "vaccine" | "surgery" | "consultation"
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const handleCTA = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  // --- Helper Functions for Calculator ---
  const getBasePrice = (treatment) => {
    switch (treatment) {
      case "grooming": return 150000;
      case "vaccine": return 250000;
      case "surgery": return 800000;
      case "consultation": return 120000;
      default: return 0;
    }
  };

  const getTreatmentLabel = (t) => {
    switch (t) {
      case "grooming": return "Grooming Sehat & Kutu";
      case "vaccine": return "Vaksinasi Lengkap (F3/F4)";
      case "surgery": return "Operasi Sterilisasi Bedah";
      case "consultation": return "Konsultasi Dokter Hewan";
      default: return "";
    }
  };

  const applyPromoCode = (e) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponError("Kode kupon tidak boleh kosong");
      return;
    }

    if (code === "PAWSOME20") {
      setAppliedCoupon(code);
      setCouponSuccess("Kupon hemat 20% berhasil diterapkan!");
    } else if (code === "VAKSIN10" && selectedTreatment === "vaccine") {
      setAppliedCoupon(code);
      setCouponSuccess("Kupon hemat 10% untuk Vaksin berhasil diterapkan!");
    } else if (code === "VAKSIN10") {
      setCouponError("Kupon VAKSIN10 hanya berlaku untuk jenis perawatan Vaksinasi");
    } else if (code === "GROOMINGFREE" && selectedTreatment === "grooming") {
      setAppliedCoupon(code);
      setCouponSuccess("Potongan flat Rp 50.000 untuk Grooming berhasil diterapkan!");
    } else if (code === "GROOMINGFREE") {
      setCouponError("Kupon GROOMINGFREE hanya berlaku untuk perawatan Grooming");
    } else if (code === "FIRSTNEW") {
      setAppliedCoupon(code);
      setCouponSuccess("Diskon pengguna baru 15% berhasil diterapkan!");
    } else {
      setCouponError("Kode kupon tidak valid. Coba PAWSOME20 atau FIRSTNEW!");
    }
  };

  const calculatedValues = useMemo(() => {
    const base = getBasePrice(selectedTreatment);
    let discount = 0;
    
    if (appliedCoupon === "PAWSOME20") {
      discount = base * 0.20;
    } else if (appliedCoupon === "VAKSIN10" && selectedTreatment === "vaccine") {
      discount = base * 0.10;
    } else if (appliedCoupon === "GROOMINGFREE" && selectedTreatment === "grooming") {
      discount = 50000;
    } else if (appliedCoupon === "FIRSTNEW") {
      discount = base * 0.15;
    }

    return {
      basePrice: base,
      discount: discount,
      finalPrice: base - discount
    };
  }, [selectedTreatment, appliedCoupon]);

  // --- Step-by-Step Treatment Care descriptions ---
  const getTreatmentSteps = (treatment) => {
    switch (treatment) {
      case "grooming":
        return [
          { step: "Langkah 1", title: "Deteksi Kutu & Penimbangan", desc: "Pengecekan kulit menyeluruh oleh staf untuk mendeteksi jamur/kutu sebelum mandi." },
          { step: "Langkah 2", title: "Mandi Terapi Khusus", desc: "Pembersihan menggunakan air hangat dan sampo antikutu atau obat jamur sesuai kondisi kulit." },
          { step: "Langkah 3", title: "Blowing & Perapian Kuku", desc: "Bulu dikeringkan steril menggunakan blower berisik rendah agar anabul tidak stres, dilanjutkan potong kuku." },
          { step: "Langkah 4", title: "Disinfeksi & Parfum", desc: "Pembersihan rongga telinga dengan ear cleaner dan semprotan parfum organik wangi segar." }
        ];
      case "vaccine":
        return [
          { step: "Langkah 1", title: "Skrining Suhu Tubuh", desc: "Pengecekan suhu rektal anabul wajib di bawah 39.2°C untuk menjamin kondisi fit." },
          { step: "Langkah 2", title: "Auskultasi Jantung & Paru", desc: "Dokter memeriksa detak jantung dan pernapasan untuk memastikan tidak ada infeksi aktif." },
          { step: "Langkah 3", title: "Penyuntikan Vaksin Steril", desc: "Injeksi subkutan vaksin (Rabies/F3/F4) menggunakan spuit sekali pakai yang dijamin steril." },
          { step: "Langkah 4", title: "Catatan Buku Vaksin Digital", desc: "Pencatatan batch vaksin ke rekam medis Supabase dan penempelan stiker di buku vaksin cetak." }
        ];
      case "surgery":
        return [
          { step: "Langkah 1", title: "Pemeriksaan Darah Lengkap", desc: "Tes kimia darah sebelum operasi untuk mengecek kesiapan organ ginjal & hati menerima anestesi." },
          { step: "Langkah 2", title: "Pembiusan & Premedikasi", desc: "Pemberian penenang (sedasi) dilanjutkan anestesi gas inhalasi yang aman dan minim risiko." },
          { step: "Langkah 3", title: "Tindakan Sterilisasi/Operasi", desc: "Operasi bedah dilakukan di ruang steril dengan monitoring ketat detak jantung dan saturasi oksigen." },
          { step: "Langkah 4", title: "Pemulihan Inkubator Hangat", desc: "Anabul diistirahatkan di kandang inkubator berpenghangat pasca-operasi untuk memulihkan suhu tubuh." }
        ];
      case "consultation":
        return [
          { step: "Langkah 1", title: "Wawancara Anamnesis", desc: "Tanya jawab dokter dengan pemilik mengenai keluhan nafsu makan, keaktifan, dan pencernaan." },
          { step: "Langkah 2", title: "Pemeriksaan Fisik Palpasi", desc: "Dokter meraba area abdomen, mengecek kelembapan gusi, warna konjungtiva mata, dan hidung." },
          { step: "Langkah 3", title: "Rekomendasi Diagnosis Penunjang", desc: "Saran tes laboratorium, rontgen, atau USG jika ditemukan indikasi klinis penyakit dalam." },
          { step: "Langkah 4", title: "Resep & Konseling Obat", desc: "Pemberian obat terapi beserta petunjuk dosis makan yang dimasukkan dalam rekam medis CRM." }
        ];
      default:
        return [];
    }
  };

  const treatmentSteps = getTreatmentSteps(selectedTreatment);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 text-left overflow-x-hidden">
      
      {/* ─── HEADER / NAVBAR ─── */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <PawPrint className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">
              PetCare <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">CRM</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-650">
            <a href="#fitur" className="hover:text-emerald-600 transition-colors">Fitur Utama</a>
            <a href="#simulator" className="hover:text-emerald-600 transition-colors">Simulator Klinik & Diskon</a>
            <a href="#crm" className="hover:text-emerald-600 transition-colors">Fungsi CRM</a>
            <a href="#statistik" className="hover:text-emerald-600 transition-colors">Performa</a>
            <a href="#testimoni" className="hover:text-emerald-600 transition-colors">Testimoni</a>
          </nav>

          {/* Header Action Button */}
          <div>
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold px-5.5 py-2.5 rounded-xl shadow-md shadow-emerald-500/15 active:scale-[0.98] transition-all"
              >
                <span>Masuk Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-xs font-bold text-gray-650 hover:text-emerald-600 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold px-5.5 py-2.5 rounded-xl shadow-md shadow-emerald-500/15 active:scale-[0.98] transition-all"
                >
                  Daftar Gratis
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-white">
        {/* Glow patterns */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 lg:pr-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Solusi CRM & Klinik Hewan Profesional
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight">
              Tingkatkan Loyalitas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500">
                Pet Owners
              </span> <br />
              Dengan CRM Cerdas.
            </h1>
            
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-xl">
              Kelola rekam medis, otomatisasi janji temu, dan dorong promosi strategis untuk anabul kesayangan pelanggan Anda dalam satu sistem CRM Klinik Hewan yang modern dan intuitif.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleCTA}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-emerald-500 to-teal-500 hover:from-emerald-600 hover:via-emerald-600 hover:to-teal-600 text-white font-bold text-sm px-7 py-4 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                {user ? "Masuk ke Dashboard Saya" : "Mulai Percobaan Gratis"}
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#fitur"
                className="flex items-center justify-center border-2 border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-bold text-sm px-6 py-3.5 rounded-2xl transition"
              >
                Pelajari Fitur
              </a>
            </div>

            {/* Micro proof check */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-100 max-w-md">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> Tanpa Kartu Kredit
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> Akun Demo Siap Pakai
              </div>
            </div>
          </div>

          {/* Right UI Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl border border-slate-800/80 max-w-md mx-auto overflow-hidden">
              <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-emerald-500/20 rounded-full blur-[60px]" />
              
              <div className="flex gap-1.5 mb-6 relative z-10">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>

              <div className="space-y-4 relative z-10 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>🐾</span> PetCare Dashboard
                  </div>
                  <div className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black">LIVE</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 flex justify-between items-center text-white">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Transaksi CRM</p>
                    <p className="text-xl font-black mt-1 text-emerald-400">Rp 48,250,000</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 text-white space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="font-extrabold text-[11px] text-slate-350">AI Sentiment Customer Feedback</span>
                    <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">94.2% Positif</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-2 rounded bg-emerald-500" title="94% Senang" />
                    <div className="w-3 h-2 rounded bg-amber-500" title="4% Netral" />
                    <div className="w-2.5 h-2 rounded bg-red-500" title="2% Komplain" />
                  </div>
                  
                  <div className="white/5 p-2.5 rounded-xl text-[10px] text-slate-450 border border-slate-800/60 italic">
                    "drh. Nisa melayani Mochi dengan sangat sabar. Sukses selalu untuk klinik PetCare!"
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 text-white space-y-2.5">
                  <span className="font-extrabold text-[11px] text-slate-355 block text-left">Antrean Poli Aktif</span>
                  
                  <div className="flex items-center justify-between text-[10px] bg-slate-900/40 p-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🐱</span>
                      <div>
                        <p className="font-bold">Mochi</p>
                        <p className="text-[9px] text-slate-500">Booster Vaksin</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded animate-pulse">AKTIF</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] bg-slate-900/40 p-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🐶</span>
                      <div>
                        <p className="font-bold">Rex</p>
                        <p className="text-[9px] text-slate-500">Dermatologi</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">ANTRI</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white border border-gray-150 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce duration-1000 max-w-[170px] text-xs">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-current animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-gray-850 text-[10px]">10,000+</p>
                <p className="text-[9px] text-gray-400 font-bold leading-tight">Anabul Terlayani</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="fitur" className="py-20 bg-slate-50 border-t border-gray-150 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Fitur Platform
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Satu Sistem Untuk Semua Kebutuhan Klinik
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-semibold">
              Klinik tidak lagi kesulitan mengintegrasikan data rekam medis dengan komunikasi pelanggan. Semuanya tersambung otomatis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur 1 */}
            <div className="bg-white border border-gray-150 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">E-Medical Records</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Catatan rekam medis terstruktur, riwayat alergi, diagnosis penyakit, dan daftar obat. Aman dan tersinkronisasi.
              </p>
            </div>

            {/* Fitur 2 */}
            <div className="bg-white border border-gray-150 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Janji Temu Online</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Sistem penjadwalan online tanpa repot. Customer dapat memilih tanggal, hewan peliharaan, dan dokter yang diinginkan.
              </p>
            </div>

            {/* Fitur 3 */}
            <div className="bg-white border border-gray-150 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Keamanan Supabase</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Otentikasi terenkripsi Supabase Auth dan Row Level Security (RLS). Menjamin hak privasi data rekam medis pasien aman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTERACTIVE CLINIC SIMULATOR & CRM DISCOUNT SECTION ─── */}
      <section id="simulator" className="py-20 bg-white border-t border-gray-150 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Simulator Perawatan & Diskon CRM
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Alur Perawatan & Simulasi Kupon CRM
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-semibold">
              Ketahui bagaimana staf medis merawat anabul Anda dan coba hitung penawaran diskon CRM secara langsung di bawah ini.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Selector & Steps (Col-span 7) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Pet Type & Treatment Selector Card */}
              <div className="bg-slate-50 border border-gray-150 p-6 rounded-[2rem] space-y-6">
                
                {/* 1. Pet Selection */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block text-left">1. Pilih Jenis Anabul</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "cat", label: "Kucing", emoji: "🐱" },
                      { id: "dog", label: "Anjing", emoji: "🐶" },
                      { id: "rabbit", label: "Kelinci", emoji: "🐰" }
                    ].map((pet) => (
                      <button
                        key={pet.id}
                        onClick={() => setSelectedPet(pet.id)}
                        className={`py-3.5 rounded-2xl border-2 font-bold text-sm flex flex-col items-center justify-center gap-1.5 transition cursor-pointer select-none ${
                          selectedPet === pet.id
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20"
                            : "bg-white border-gray-150 text-gray-750 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-2xl">{pet.emoji}</span>
                        <span>{pet.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Treatment Selection */}
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block text-left">2. Pilih Jenis Perawatan / Layanan Medis</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "grooming", label: "Grooming", emoji: "🧴" },
                      { id: "vaccine", label: "Vaksinasi", emoji: "💉" },
                      { id: "surgery", label: "Sterilisasi", emoji: "✂️" },
                      { id: "consultation", label: "Konsultasi", emoji: "🩺" }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          setSelectedTreatment(t.id);
                          // Auto clear context-specific validation error
                          if (appliedCoupon === "VAKSIN10" && t.id !== "vaccine") setAppliedCoupon("");
                          if (appliedCoupon === "GROOMINGFREE" && t.id !== "grooming") setAppliedCoupon("");
                        }}
                        className={`py-3 px-2 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                          selectedTreatment === t.id
                            ? "bg-slate-900 border-slate-900 text-white"
                            : "bg-white border-gray-150 text-gray-600 hover:border-gray-250"
                        }`}
                      >
                        <span>{t.emoji}</span>
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Treatment steps overview */}
              <div className="bg-white border border-gray-150 p-6 rounded-[2rem] space-y-5">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  <h4 className="font-extrabold text-sm text-gray-800">
                    Prosedur Klinik Perawatan: <span className="text-emerald-600 font-black">{getTreatmentLabel(selectedTreatment)}</span>
                  </h4>
                </div>

                {/* Vertical timeline steps */}
                <div className="space-y-6 relative pl-4 text-left">
                  {/* Timeline vertical bar */}
                  <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-emerald-100" />
                  
                  {treatmentSteps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Timeline dot */}
                      <div className="absolute -left-[18px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white shadow shadow-emerald-500/50" />
                      
                      <div className="space-y-1">
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {step.step}
                        </span>
                        <h5 className="font-extrabold text-xs text-gray-800 mt-1">{step.title}</h5>
                        <p className="text-[10px] text-gray-450 font-semibold leading-relaxed max-w-lg">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Billing & Coupon Panel (Col-span 5) */}
            <div className="lg:col-span-5 relative lg:sticky lg:top-24">
              <div className="bg-white border border-gray-150 rounded-[2rem] p-6 shadow-lg space-y-6">
                <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-gray-850">
                    🧾 Estimasi Lembar Pembayaran
                  </h3>
                  <span className="text-[8px] font-black uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded">CRM Billing</span>
                </div>

                {/* Bill detail */}
                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="font-medium">Jenis Hewan</span>
                    <span className="font-bold uppercase text-slate-800">{selectedPet}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-500">
                    <span className="font-medium">Tindakan Medis</span>
                    <span className="font-bold text-slate-800">{getTreatmentLabel(selectedTreatment)}</span>
                  </div>

                  <div className="flex justify-between items-center text-slate-500 border-b border-gray-100 pb-3.5">
                    <span className="font-medium">Biaya Standard Tindakan</span>
                    <span className="font-bold text-slate-800">
                      Rp {calculatedValues.basePrice.toLocaleString("id-ID")}
                    </span>
                  </div>

                  {calculatedValues.discount > 0 && (
                    <div className="flex justify-between items-center text-emerald-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50">
                      <span className="font-extrabold flex items-center gap-1">
                        🎁 Kupon Diskon ({appliedCoupon})
                      </span>
                      <span className="font-black">
                        - Rp {calculatedValues.discount.toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-gray-150 pt-4 pb-2">
                    <span className="font-black text-sm text-gray-850">Total Biaya Akhir</span>
                    <span className="font-black text-xl text-emerald-600">
                      Rp {calculatedValues.finalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Promo Code input form */}
                <form onSubmit={applyPromoCode} className="space-y-3 pt-3 border-t border-gray-100 text-left">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Masukkan Kupon CRM</label>
                    <span className="text-[9px] font-extrabold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <Info className="w-3 h-3" /> Tips: PAWSOME20
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Contoh: PAWSOME20, FIRSTNEW"
                      className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300 font-bold uppercase tracking-wider"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 rounded-xl transition cursor-pointer select-none"
                    >
                      Terapkan
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-[10px] text-red-500 font-semibold ml-1">{couponError}</p>
                  )}
                  {couponSuccess && (
                    <p className="text-[10px] text-emerald-600 font-semibold ml-1">{couponSuccess}</p>
                  )}

                  {/* List of active coupon codes info */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-gray-150 text-[9px] text-gray-450 leading-relaxed font-semibold space-y-1">
                    <p className="font-bold text-gray-600 uppercase tracking-wider">Kupon Aktif CRM Bulan Ini:</p>
                    <p>• <span className="text-emerald-600 font-black">PAWSOME20</span>: Diskon 20% untuk semua jenis perawatan.</p>
                    <p>• <span className="text-emerald-600 font-black">FIRSTNEW</span>: Diskon 15% khusus pendaftaran pengguna baru.</p>
                    <p>• <span className="text-emerald-600 font-black">VAKSIN10</span>: Hemat 10% khusus untuk Vaksinasi.</p>
                    <p>• <span className="text-emerald-600 font-black">GROOMINGFREE</span>: Potongan langsung Rp 50.000 untuk Grooming.</p>
                  </div>
                </form>

                {/* Call to action */}
                <button
                  onClick={handleCTA}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer animate-pulse-slow"
                >
                  <span>Klaim Diskon & Janji Temu</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CRM FUNCTIONS SECTION ─── */}
      <section id="crm" className="py-20 bg-slate-50 border-t border-gray-150 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Graphics representation */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 shadow-inner">
                <div className="flex justify-between items-center border-b border-emerald-200/50 pb-4 mb-4">
                  <h4 className="font-extrabold text-xs text-emerald-800 flex items-center gap-1.5">
                    📢 Peta Kampanye CRM
                  </h4>
                  <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">3 Kampanye Aktif</span>
                </div>

                <div className="space-y-4">
                  {/* Campaign item 1 */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between text-xs shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">💉</span>
                      <div>
                        <p className="font-bold text-gray-800">Booster Vaksin Kucing</p>
                        <p className="text-[9px] text-gray-400 font-semibold">Terkirim ke 124 Pemilik</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Sukses</span>
                  </div>

                  {/* Campaign item 2 */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between text-xs shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🧴</span>
                      <div>
                        <p className="font-bold text-gray-800">Grooming Hemat Weekend</p>
                        <p className="text-[9px] text-gray-400 font-semibold">Diskon 15% · Pemasaran</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Sukses</span>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-emerald-600 text-white shadow-lg text-xs space-y-1">
                  <p className="font-extrabold flex items-center gap-1.5">💡 Insight Kampanye</p>
                  <p className="text-[10px] text-emerald-100 font-medium leading-relaxed">
                    Kampanye Booster Vaksin meningkatkan tingkat kedatangan janji temu hingga 42% pada minggu ini.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Otomatisasi Hubungan Pelanggan
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Hubungkan Klinik dan Pemilik Hewan Tanpa Jeda
              </h2>
              <p className="text-slate-500 text-sm md:text-base font-semibold">
                Sistem CRM (Customer Relationship Management) terintegrasi kami membantu klinik hewan memperluas jangkauan komunikasi mereka:
              </p>

              <div className="space-y-4 text-xs font-semibold">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Kampanye Promosi Otomatis</h4>
                    <p className="text-slate-500 font-medium leading-relaxed mt-1">Buat, kelola, dan sebarkan pesan promosi layanan grooming, paket check-up, atau produk baru langsung ke semua pemilik hewan terdaftar.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Feedback & Analisis Keluhan</h4>
                    <p className="text-slate-500 font-medium leading-relaxed mt-1">Evaluasi kualitas pelayanan klinik berdasarkan ulasan bintang dan catat keluhan internal untuk ditindaklanjuti secara cepat demi kepuasan pelanggan.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Manajemen Customer CRM</h4>
                    <p className="text-slate-500 font-medium leading-relaxed mt-1">Kelompokkan riwayat interaksi, feedback, keluhan, dan biodata setiap pemilik anabul di satu tab detail customer terpusat.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CLINIC METRICS SECTION ─── */}
      <section id="statistik" className="py-20 bg-slate-950 text-white relative overflow-hidden">
        {/* Glow patterns */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-400 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-16">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest border border-emerald-400/30 px-3 py-1 rounded-full bg-emerald-450/10">
              Metrik Keberhasilan
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Klinik Lebih Produktif Bersama Kami</h2>
            <p className="text-slate-400 text-xs sm:text-sm font-semibold">Membantu mempercepat administrasi klinis dan mengotomatisasi retensi kedatangan pemilik hewan secara efektif.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <h3 className="text-4xl md:text-5xl font-black text-emerald-400">10k+</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pasien Anabul</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl md:text-5xl font-black text-emerald-400">94.2%</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Kepuasan CRM</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl md:text-5xl font-black text-emerald-400">99.9%</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Uptime Sistem</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl md:text-5xl font-black text-emerald-400">42%</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Kenaikan Retensi</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ─── */}
      <section id="testimoni" className="py-20 bg-slate-50 border-t border-gray-150">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Testimoni Pengguna
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Apa Kata Mereka?</h2>
            <p className="text-slate-500 text-sm font-semibold">Telah dipercaya oleh dokter hewan klinik profesional dan ribuan pemilik anabul.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimoni 1 */}
            <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm text-left space-y-4">
              <div className="flex text-amber-400 text-xs">
                {[1,2,3,4,5].map((s) => <Star key={s} className="fill-current w-3.5 h-3.5" />)}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                "Sebelum pakai PetCare CRM, kami sering lupa mengabari pemilik kucing untuk jadwal vaksinasi booster. Sekarang semuanya terjadwal otomatis, loyalitas pelanggan kami meningkat drastis!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs">
                  DN
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-800">drh. Nisa Putri</h4>
                  <p className="text-[9px] text-gray-400 font-bold">Klinik Paws & Care</p>
                </div>
              </div>
            </div>

            {/* Testimoni 2 */}
            <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm text-left space-y-4">
              <div className="flex text-amber-400 text-xs">
                {[1,2,3,4,5].map((s) => <Star key={s} className="fill-current w-3.5 h-3.5" />)}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                "Sebagai customer, saya suka sekali dengan dashboard-nya. Saya bisa melihat rekam medis Mochi langsung di HP dan tinggal klak-klik untuk buat janji temu konsultasi dokter gigi."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                  BS
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-800">Budi Santoso</h4>
                  <p className="text-[9px] text-gray-400 font-bold">Pemilik Anabul (Customer)</p>
                </div>
              </div>
            </div>

            {/* Testimoni 3 */}
            <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm text-left space-y-4">
              <div className="flex text-amber-400 text-xs">
                {[1,2,3,4,5].map((s) => <Star key={s} className="fill-current w-3.5 h-3.5" />)}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                "Keamanan datanya luar biasa. Modul RLS Supabase memastikan data medis rekam penyakit hanya bisa diakses oleh dokter yang bertugas dan pemilik hewan bersangkutan secara aman."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                  AH
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-800">drh. Aditya Ramadhan</h4>
                  <p className="text-[9px] text-gray-400 font-bold">Klinik Happy Pets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION SECTION ─── */}
      <section className="py-20 bg-white border-t border-gray-150 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Siap Mengoptimalkan Manajemen <br />
            Klinik Hewan Anda?
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto font-semibold">
            Dapatkan akses penuh ke fitur E-Medical Records, Janji Temu Online, dan CRM Pemasaran Cerdas dengan pendaftaran gratis 5 menit.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={handleCTA}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-emerald-500/15 transition active:scale-[0.98] cursor-pointer"
            >
              {user ? "Masuk ke Dashboard" : "Daftar Akun Sekarang"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-950 text-slate-450 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs font-semibold">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white shadow-md">
                <PawPrint className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">PetCare CRM</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">Sistem CRM & manajemen klinis terpadu terbaik untuk kesehatan anabul pelanggan Anda.</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Navigasi</h4>
            <ul className="space-y-2.5">
              <li><a href="#fitur" className="hover:text-emerald-500 transition">Fitur Utama</a></li>
              <li><a href="#simulator" className="hover:text-emerald-500 transition">Simulator Klinik</a></li>
              <li><a href="#crm" className="hover:text-emerald-500 transition">Otomatisasi CRM</a></li>
              <li><a href="#statistik" className="hover:text-emerald-500 transition">Statistik</a></li>
              <li><a href="#testimoni" className="hover:text-emerald-500 transition">Testimoni Pengguna</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Kontak</h4>
            <ul className="space-y-2 text-slate-450">
              <li>Klinik Pusat PetCare CRM</li>
              <li>Jl. Anabul Bahagia No. 12</li>
              <li>Jakarta, Indonesia</li>
              <li className="pt-2 text-white">support@petcarecrm.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-emerald-500 transition">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition">Keamanan Data</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500">
          <p>© 2026 PetCare CRM. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 font-bold">
            <a href="#" className="hover:text-white transition">Instagram</a>
            <a href="#" className="hover:text-white transition">Facebook</a>
            <a href="#" className="hover:text-white transition">Twitter</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
