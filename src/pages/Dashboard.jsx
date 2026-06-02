import { useState, useEffect, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import { 
  TrendingUp, Users, Calendar, Activity, 
  Sparkles, Clock, AlertCircle, Heart, ArrowRight,
  PlusCircle, Stethoscope, BriefcaseMedical, ChevronRight,
  Flame, BellDot, HeartPulse, ShieldAlert, DollarSign, Send,
  ArrowUpRight, AlertTriangle, CheckCircle, HelpCircle
} from "lucide-react";

import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import ToastNotification from "../components/ToastNotification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── DATA ───────────────────────────────────────────────────────────────────

const chartData = [
  { name: "Jan", Kucing: 42, Anjing: 35, Burung: 12, Lainnya: 8, Total: 97 },
  { name: "Feb", Kucing: 38, Anjing: 30, Burung: 10, Lainnya: 9, Total: 87 },
  { name: "Mar", Kucing: 55, Anjing: 40, Burung: 15, Lainnya: 12, Total: 122 },
  { name: "Apr", Kucing: 48, Anjing: 45, Burung: 12, Lainnya: 10, Total: 115 },
  { name: "Mei", Kucing: 60, Anjing: 38, Burung: 18, Lainnya: 15, Total: 131 },
  { name: "Jun", Kucing: 52, Anjing: 50, Burung: 14, Lainnya: 11, Total: 127 },
];

const petTypes = [
  { emoji: "🐱", name: "Kucing", count: 124, max: 150, color: "bg-emerald-500", text: "text-emerald-600" },
  { emoji: "🐶", name: "Anjing", count: 98, max: 150, color: "bg-blue-500", text: "text-blue-600" },
  { emoji: "🐰", name: "Kelinci", count: 34, max: 150, color: "bg-violet-500", text: "text-violet-600" },
  { emoji: "🦜", name: "Burung", count: 28, max: 150, color: "bg-amber-500", text: "text-amber-600" },
  { emoji: "🐹", name: "Hamster", count: 18, max: 150, color: "bg-pink-500", text: "text-pink-600" },
  { emoji: "🐢", name: "Reptil", count: 10, max: 150, color: "bg-teal-500", text: "text-teal-600" },
];

const initialVisits = [
  { id: 1, emoji: "🐱", name: "Mochi", breed: "Kucing Persia", owner: "Budi S.", complaint: "Vaksin rutin booster", status: "Selesai", doctor: "drh. Nisa Putri" },
  { id: 2, emoji: "🐶", name: "Rex", breed: "Golden Retriever", owner: "Rina A.", complaint: "Demam tinggi & dehidrasi", status: "Proses", doctor: "drh. Aditya Ramadhan" },
  { id: 3, emoji: "🦜", name: "Polly", breed: "Kakak Tua", owner: "Hendra K.", complaint: "Bulu rontok parah", status: "Antri", doctor: "drh. Citra Maharani" },
  { id: 4, emoji: "🐰", name: "Lola", breed: "Holland Lop", owner: "Siti M.", complaint: "Nafsu makan turun drastis", status: "Antri", doctor: "drh. Farhan Akbar" },
  { id: 5, emoji: "🐱", name: "Luna", breed: "Scottish Fold", owner: "Dinda P.", complaint: "Sterilisasi steril", status: "Selesai", doctor: "drh. Vania Lestari" },
];

const scheduleItems = [
  { time: "08:00 - Poli Umum", name: "Mochi (Kucing)", detail: "Vaksinasi · Budi S. · drh. Nisa", color: "#10b981", active: true },
  { time: "09:30 - Poli Bedah", name: "Rex (Golden Retriever)", detail: "Infus Demam · Rina A. · drh. Aditya", color: "#3b82f6", active: true },
  { time: "10:45 - Poli Eksotis", name: "Polly (Kakak Tua)", detail: "Dermatologi · Hendra K. · drh. Citra", color: "#f59e0b", active: false },
  { time: "13:00 - Poli Gigi", name: "Lola (Kelinci)", detail: "Cek Nutrisi · Siti M. · drh. Farhan", color: "#ec4899", active: false },
  { time: "14:30 - Poli Kulit & Bulu", name: "Bruno (Bulldog)", detail: "Post-Op Check · Agus T. · drh. Vania", color: "#8b5cf6", active: false },
];

const clinicalInsights = [
  {
    id: 1,
    title: "Antisipasi Cuaca Pancaroba",
    content: "Kasus flu kucing diprediksi naik 25% minggu ini. Sarankan vaksinasi booster Tricat/Tetracat pada pasien kucing yang belum berimunisasi tahun ini.",
    badge: "Kesehatan",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
  },
  {
    id: 2,
    title: "Feline-Friendly Environment",
    content: "Hari ini terdaftar 124 kucing. Direkomendasikan menyemprotkan Feliway pheromone diffuser di Ruang Vet A agar pasien kucing merasa lebih rileks.",
    badge: "Kenyamanan",
    color: "text-teal-400 bg-teal-500/10 border-teal-500/20"
  },
  {
    id: 3,
    title: "Optimasi Jam Sibuk Klinik",
    content: "Puncak antrean hari ini diproyeksikan pukul 13:00 - 14:30. Pastikan kelengkapan alat infus steril di Ruang Vet B siap sebelum istirahat siang.",
    badge: "Operasional",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
  }
];

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // UI States for components
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Active AI Insight Index
  const [activeInsightIndex, setActiveInsightIndex] = useState(0);

  // Report Period Filter
  const [periodFilter, setPeriodFilter] = useState("hari-ini");
  
  // Dashboard Statistics State
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Define triggerToast
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulated stats loading based on report period filter (useEffect)
  useEffect(() => {
    setIsLoadingStats(true);
    const timer = setTimeout(() => {
      if (periodFilter === "hari-ini") {
        setStats({
          kunjungan: "24",
          kunjunganSub: "+3 anabul",
          kunjunganDesc: "dibanding kemarin",
          antrian: "8",
          antrianSub: "4 anabul",
          antrianDesc: "sedang diperiksa",
          totalPasien: "312",
          totalPasienSub: "+12 bulan ini",
          totalPasienDesc: "anabul terdaftar",
          pendapatan: "Rp 4.2Jt",
          pendapatanSub: "85%",
          pendapatanDesc: "dari target harian"
        });
      } else {
        setStats({
          kunjungan: "158",
          kunjunganSub: "+22% m-o-m",
          kunjunganDesc: "dibanding minggu lalu",
          antrian: "42",
          antrianSub: "12 rata-rata/hari",
          antrianDesc: "minggu ini",
          totalPasien: "324",
          totalPasienSub: "+24 bulan ini",
          totalPasienDesc: "anabul terdaftar",
          pendapatan: "Rp 28.5Jt",
          pendapatanSub: "98%",
          pendapatanDesc: "dari target mingguan"
        });
      }
      setIsLoadingStats(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [periodFilter]);

  const statsList = useMemo(() => {
    if (!stats) return [
      { label: "Kunjungan Hari Ini", val: "...", sub: "...", desc: "...", color: "emerald", icon: Calendar },
      { label: "Antrian Pasien", val: "...", sub: "...", desc: "...", color: "blue", icon: Activity },
      { label: "Total Pasien Aktif", val: "...", sub: "...", desc: "...", color: "violet", icon: Users },
      { label: "Pendapatan Harian", val: "...", sub: "...", desc: "...", color: "amber", icon: TrendingUp },
    ];
    return [
      { label: periodFilter === "hari-ini" ? "Kunjungan Hari Ini" : "Kunjungan Minggu Ini", val: stats.kunjungan, sub: stats.kunjunganSub, desc: stats.kunjunganDesc, color: "emerald", icon: Calendar },
      { label: "Antrian Pasien", val: stats.antrian, sub: stats.antrianSub, desc: stats.antrianDesc, color: "blue", icon: Activity },
      { label: "Total Pasien Aktif", val: stats.totalPasien, sub: stats.totalPasienSub, desc: stats.totalPasienDesc, color: "violet", icon: Users },
      { label: periodFilter === "hari-ini" ? "Pendapatan Harian" : "Pendapatan Mingguan", val: stats.pendapatan, sub: stats.pendapatanSub, desc: stats.pendapatanDesc, color: "amber", icon: TrendingUp },
    ];
  }, [stats, periodFilter]);

  const filteredVisits = useMemo(() => {
    return initialVisits.filter(v => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.doctor.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleNewPatientClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmAddPatient = () => {
    setIsModalOpen(false);
    setToastMessage("Menyiapkan formulir pasien baru...");
    setShowToast(true);
  };

  const nextInsight = () => {
    setActiveInsightIndex((prev) => (prev + 1) % clinicalInsights.length);
  };

  // Personalized dynamic greeting configuration based on time of day
  const getGreetingConfig = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 11) {
      return {
        greeting: "Selamat Pagi",
        tip: "Awali hari dengan senyuman hangat & berikan pelayanan terbaik untuk anabul pasien!",
        gradient: "from-emerald-600 via-teal-600 to-cyan-600",
        icon: "☀️"
      };
    } else if (hour >= 11 && hour < 15) {
      return {
        greeting: "Selamat Siang",
        tip: "Jam makan siang & hidrasi penting, dr. Sari! Tetap bersemangat!",
        gradient: "from-amber-600 via-emerald-600 to-teal-700",
        icon: "☀️"
      };
    } else if (hour >= 15 && hour < 18) {
      return {
        greeting: "Selamat Sore",
        tip: "Shift sore berjalan aman. Pastikan rekap kunjungan anabul terisi rapi!",
        gradient: "from-orange-600 via-rose-600 to-indigo-700",
        icon: "🌇"
      };
    } else {
      return {
        greeting: "Selamat Malam",
        tip: "Terima kasih atas dedikasi luar biasa Anda dalam merawat anabul malam ini!",
        gradient: "from-slate-900 via-indigo-950 to-slate-900 border border-slate-800",
        icon: "🌙"
      };
    }
  };

  const greetingConfig = getGreetingConfig();
  
  const formatClock = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const activeInsight = clinicalInsights[activeInsightIndex];

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      
      {/* ─── ALERT BANNER / RUNNING CLIPS ─── */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 px-5 flex items-center justify-between text-xs text-amber-800 shadow-sm animate-pulse">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4.5 w-4.5 text-amber-500 shrink-0" />
          <span className="font-extrabold tracking-wide text-[10px] bg-amber-500 text-white rounded px-1.5 py-0.5 uppercase">Alert Klinik</span>
          <span className="font-semibold text-amber-700">Peringatan: Stok Vaksin Rabies & Parvo tersisa 5 dosis. Segera lakukan repeat order ke supplier!</span>
        </div>
        <span className="text-[10px] font-bold text-amber-600 hidden md:block">Hari Ini</span>
      </div>

      {/* ─── TOP WELCOME BANNER & LIVE CLOCK ─── */}
      <div className={`relative rounded-3xl overflow-hidden shadow-lg p-7 text-white bg-gradient-to-r ${greetingConfig.gradient}`}>
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-white/5 rounded-full blur-2xl -ml-20 -mb-20" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4.5">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/25 shrink-0">
              {greetingConfig.icon}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {greetingConfig.greeting}, dr. Sari!
              </h1>
              <p className="text-xs md:text-sm text-white/80 font-semibold mt-1.5 leading-relaxed max-w-lg">
                {greetingConfig.tip}
              </p>
            </div>
          </div>
          
          {/* Glassmorphic Digital Clock */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center md:items-end min-w-[220px] shadow-md shrink-0">
            <div className="flex items-center gap-1.5 text-white/80 mb-0.5">
              <Clock className="w-3.5 h-3.5 text-emerald-300 animate-spin-slow" />
              <span className="text-[9px] font-bold uppercase tracking-widest">LIVE DIGITAL CLOCK</span>
            </div>
            <h2 className="text-3xl font-black tracking-widest font-mono text-emerald-150">
              {formatClock(currentTime)}
            </h2>
            <p className="text-[10px] text-white/70 font-bold mt-1">
              {formatDate(currentTime)}
            </p>
          </div>
        </div>
      </div>

      {/* ─── QUICK ACTIONS GRID HUB ─── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Registrasi Pasien", desc: "Input anabul baru", icon: PlusCircle, action: handleNewPatientClick, color: "bg-emerald-50 text-emerald-600 hover:border-emerald-300" },
          { label: "Jadwal Temu Baru", desc: "Buat janji pemeriksaan", icon: Calendar, action: () => triggerToast("Membuka penjadwalan janji temu..."), color: "bg-blue-50 text-blue-600 hover:border-blue-300" },
          { label: "Cek Rekam Medis", desc: "Cari riwayat klinis", icon: BriefcaseMedical, action: () => triggerToast("Mengarahkan ke Rekam Medis..."), color: "bg-violet-50 text-violet-600 hover:border-violet-300" },
          { label: "Kirim Broadcast", desc: "Blast WhatsApp/Email", icon: Send, action: () => triggerToast("Mengalihkan ke Broadcast Hub..."), color: "bg-pink-50 text-pink-600 hover:border-pink-300" },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={item.action}
              className={`p-4 rounded-2xl border border-gray-100 bg-white shadow-sm flex items-center gap-3.5 cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md ${item.color}`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-150 shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black tracking-tight text-gray-800">{item.label}</p>
                <p className="text-[10px] text-gray-400 font-bold truncate mt-0.5">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── STAT CARDS PANEL ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statsList.map((stat, i) => {
          const Icon = stat.icon;
          const colorMap = {
            emerald: { bg: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-100 text-emerald-700" },
            blue: { bg: "bg-blue-50 text-blue-600", dot: "bg-blue-100 text-blue-700" },
            violet: { bg: "bg-violet-50 text-violet-600", dot: "bg-violet-100 text-violet-700" },
            amber: { bg: "bg-amber-50 text-amber-600", dot: "bg-amber-100 text-amber-700" },
          };
          const c = colorMap[stat.color];
          return (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start justify-between hover:shadow-md transition">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-2xl font-black text-gray-800 mt-2">{stat.val}</h3>
                <div className="mt-3 flex items-center gap-1.5 text-[10px]">
                  <span className={`px-2 py-0.5 rounded-full font-bold ${c.dot}`}>{stat.sub}</span>
                  <span className="text-gray-400 font-semibold">{stat.desc}</span>
                </div>
              </div>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${c.bg}`}>
                <Icon className="h-5.5 w-5.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── MIDDLE SECTION: CHARTS & PET TYPES DISTRIBUTION ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-150 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Statistik Pasien Bulanan</h3>
              <p className="text-[11px] text-gray-400 mt-0.5">Volume kunjungan anabul per jenis spesies</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +15.4% Trafik
            </span>
          </div>

          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorKucing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAnjing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: "10px", fontWeight: 600 }} />
                <Area type="monotone" dataKey="Kucing" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorKucing)" />
                <Area type="monotone" dataKey="Anjing" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAnjing)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pet Species Distribution */}
        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Spesies Pasien Terbanyak</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">Persentase sebaran pasien klinik</p>
          </div>

          <div className="space-y-3.5 my-4">
            {petTypes.map((pet) => {
              const percent = Math.round((pet.count / pet.max) * 100);
              return (
                <div key={pet.name} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center font-semibold text-gray-700">
                    <span className="flex items-center gap-1.5">
                      <span>{pet.emoji}</span>
                      <span>{pet.name}</span>
                    </span>
                    <span className={pet.text}>{pet.count} Pasien ({percent}%)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${pet.color}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── BOTTOM SECTION: VISITS, SHIFTS & AI CLINICAL ADVISOR ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Recent Visits Tracker */}
        <div className="lg:col-span-2 bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Tracker Kunjungan Pasien</h3>
              <p className="text-xs text-gray-400 mt-0.5">Triage prioritas pemeriksaan medis hari ini</p>
            </div>
            
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <SearchBar 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Cari pasien / dokter..."
              />
              <Tabs value={periodFilter} onValueChange={setPeriodFilter} className="w-[170px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="hari-ini">Hari Ini</TabsTrigger>
                  <TabsTrigger value="minggu-ini">Minggu Ini</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-50 bg-gray-50/50">
                  <th className="py-2.5 px-3">Anabul Pasien</th>
                  <th className="py-2.5 px-3">Pemilik</th>
                  <th className="py-2.5 px-3">Keluhan Klinis</th>
                  <th className="py-2.5 px-3">Dokter Penanggung Jawab</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((v) => {
                    const isUrgent = v.complaint.toLowerCase().includes("demam") || v.complaint.toLowerCase().includes("rontok parah") || v.complaint.toLowerCase().includes("turun drastis");
                    return (
                      <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition">
                        <td className="py-3 px-3 flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg shadow-sm shrink-0">
                            {v.emoji}
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800 text-xs truncate">{v.name}</p>
                            <p className="text-[10px] text-gray-400 font-semibold">{v.breed}</p>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-xs font-bold text-gray-600">{v.owner}</td>
                        <td className="py-3 px-3 text-xs text-gray-500">
                          <div className="flex flex-col gap-1">
                            <span>{v.complaint}</span>
                            {isUrgent ? (
                              <span className="w-fit inline-flex items-center gap-1 bg-red-50 text-red-600 text-[9px] font-black px-1.5 py-0.25 rounded border border-red-100 animate-pulse">
                                <HeartPulse className="h-2.5 w-2.5" /> TRIAGE URGENT
                              </span>
                            ) : (
                              <span className="w-fit inline-flex items-center gap-1 bg-gray-50 text-gray-500 text-[9px] font-bold px-1.5 py-0.25 rounded border border-gray-150">
                                Normal
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-xs font-semibold text-emerald-600">{v.doctor}</td>
                        <td className="py-3 px-3 text-right"><StatusBadge status={v.status} /></td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-400 text-xs font-semibold">
                      Pasien tidak ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: AI CLINICAL INSIGHTS & SCHEDULE SHIFTS */}
        <div className="space-y-6">
          
          {/* AI Clinical Advisor */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[180px]">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl" />
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black tracking-widest text-emerald-400">ASISTEN AI VET</h4>
                    <p className="text-[9px] text-gray-500 font-bold">Clinical Advice Log</p>
                  </div>
                </div>
                
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${activeInsight.color}`}>
                  {activeInsight.badge}
                </span>
              </div>

              <div className="min-h-[70px]">
                <h5 className="text-xs font-extrabold text-emerald-100 flex items-center gap-1.5">
                  💡 {activeInsight.title}
                </h5>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold mt-1">
                  {activeInsight.content}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center text-[10px] text-gray-500">
              <button
                onClick={nextInsight}
                className="text-emerald-400 hover:text-emerald-300 font-extrabold flex items-center gap-1 transition-colors group cursor-pointer"
              >
                Tips Berikutnya <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
              </button>
              <span>Auto-Sync Aktif</span>
            </div>
          </div>

          {/* Today Vets & Schedules Shift */}
          <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-150 pb-3">
              <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-emerald-500" /> Jadwal & Poli Aktif
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                5 Shift Hari Ini
              </span>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {scheduleItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-gray-50 hover:bg-emerald-50/30 border border-gray-50 hover:border-emerald-200 rounded-xl transition cursor-pointer group"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className="w-2.5 h-2.5 rounded-full shadow-sm shrink-0 mt-1"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="w-[1px] h-6 bg-gray-250 mt-1" />
                  </div>
                  <div className="min-w-0 -mt-0.5 text-xs">
                    <div className="flex justify-between items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-black text-gray-400 uppercase">{item.time}</span>
                      {item.active && (
                        <span className="bg-emerald-100 text-emerald-700 text-[8px] font-bold px-1.5 rounded animate-pulse">AKTIF</span>
                      )}
                    </div>
                    <p className="font-extrabold text-gray-800 group-hover:text-emerald-700 transition">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5 truncate">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ─── REGISTER PATIENT MODAL ─── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmAddPatient}
        title="Registrasi Pasien Baru"
        confirmText="Buka Form Pendaftaran"
      >
        <p className="text-xs text-gray-500 leading-relaxed font-semibold">
          Anda akan diarahkan ke modul formulir penambahan pasien baru (/pets/add). Pastikan semua data rekam medis awal dan kontak pemilik anabul telah disiapkan terlebih dahulu.
        </p>
      </Modal>

      {/* TOAST FEEDBACK ALERT */}
      <ToastNotification 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
        message={toastMessage} 
        type="success"
      />
    </div>
  );
}