import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import { 
  TrendingUp, Users, Calendar, Activity, 
  Sparkles, Clock, AlertCircle, Heart, ArrowRight,
  PlusCircle, Stethoscope, BriefcaseMedical, ChevronRight,
  Flame, BellDot, HeartPulse
} from "lucide-react";

import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import ToastNotification from "../components/ToastNotification";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── Data ───────────────────────────────────────────────────────────────────

const chartData = [
  { name: "Jan", Kucing: 42, Anjing: 35, Burung: 12, Lainnya: 8 },
  { name: "Feb", Kucing: 38, Anjing: 30, Burung: 10, Lainnya: 9 },
  { name: "Mar", Kucing: 55, Anjing: 40, Burung: 15, Lainnya: 12 },
  { name: "Apr", Kucing: 48, Anjing: 45, Burung: 12, Lainnya: 10 },
  { name: "Mei", Kucing: 60, Anjing: 38, Burung: 18, Lainnya: 15 },
  { name: "Jun", Kucing: 52, Anjing: 50, Burung: 14, Lainnya: 11 },
];

const petTypes = [
  { emoji: "🐱", name: "Kucing", count: 124, max: 124, color: "#10b981" },
  { emoji: "🐶", name: "Anjing", count: 98, max: 124, color: "#3b82f6" },
  { emoji: "🐰", name: "Kelinci", count: 34, max: 124, color: "#8b5cf6" },
  { emoji: "🦜", name: "Burung", count: 28, max: 124, color: "#f59e0b" },
  { emoji: "🐹", name: "Hamster", count: 18, max: 124, color: "#ec4899" },
  { emoji: "🐢", name: "Reptil", count: 10, max: 124, color: "#059669" },
];

const initialVisits = [
  { id: 1, emoji: "🐱", name: "Mochi", breed: "Kucing Persia", owner: "Budi S.", complaint: "Vaksin rutin", status: "Selesai" },
  { id: 2, emoji: "🐶", name: "Rex", breed: "Golden Retriever", owner: "Rina A.", complaint: "Demam tinggi & dehidrasi", status: "Proses" },
  { id: 3, emoji: "🦜", name: "Polly", breed: "Kakak Tua", owner: "Hendra K.", complaint: "Bulu rontok", status: "Antri" },
  { id: 4, emoji: "🐰", name: "Lola", breed: "Holland Lop", owner: "Siti M.", complaint: "Nafsu makan turun drastis", status: "Antri" },
  { id: 5, emoji: "🐱", name: "Luna", breed: "Scottish Fold", owner: "Dinda P.", complaint: "Sterilisasi", status: "Selesai" },
];

const scheduleItems = [
  { time: "08:00", name: "Mochi", detail: "Vaksinasi & pemeriksaan rutin · Budi S.", color: "#10b981" },
  { time: "09:30", name: "Rex — Golden Retriever", detail: "Pengobatan demam & infus · Rina A.", color: "#3b82f6" },
  { time: "10:45", name: "Polly — Kakak Tua", detail: "Dermatologi bulu · Hendra K.", color: "#f59e0b" },
  { time: "13:00", name: "Lola — Kelinci Holland", detail: "Konsultasi nutrisi · Siti M.", color: "#ec4899" },
  { time: "14:30", name: "Bruno — Bulldog Prancis", detail: "Post-op checkup · Agus T.", color: "#8b5cf6" },
  { time: "16:00", name: "Kiki — Hamster Syrien", detail: "Grooming & cek gigi · Dewi L.", color: "#10b981" },
];

const clinicalInsights = [
  {
    id: 1,
    title: "Antisipasi Cuaca Pancaroba",
    content: "Kasus flu kucing diprediksi naik 25% minggu ini. Sarankan vaksinasi booster Tricat/Tetracat pada pasien kucing yang belum berimunisasi tahun ini.",
    badge: "Kesehatan",
    color: "emerald"
  },
  {
    id: 2,
    title: "Feline-Friendly Environment",
    content: "Hari ini terdaftar 124 kucing. Direkomendasikan menyemprotkan Feliway pheromone diffuser di Ruang Vet A agar pasien kucing merasa lebih rileks.",
    badge: "Kenyamanan",
    color: "teal"
  },
  {
    id: 3,
    title: "Optimasi Jam Sibuk Klinik",
    content: "Puncak antrean hari ini diproyeksikan pukul 13:00 - 14:30. Pastikan kelengkapan alat infus steril di Ruang Vet B siap sebelum istirahat siang.",
    badge: "Operasional",
    color: "amber"
  }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("hari-ini");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // UI States for components
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Active AI Insight Index
  const [activeInsightIndex, setActiveInsightIndex] = useState(0);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredVisits = useMemo(() => {
    return initialVisits.filter(v => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.owner.toLowerCase().includes(searchQuery.toLowerCase())
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
        tip: "Mari awali hari dengan senyuman hangat & semangat perawatan terbaik!",
        gradient: "from-emerald-500 via-teal-500 to-cyan-500",
        icon: "☀️"
      };
    } else if (hour >= 11 && hour < 15) {
      return {
        greeting: "Selamat Siang",
        tip: "Jangan lupa istirahat makan siang & tetap terhidrasi ya, dr. Sari!",
        gradient: "from-amber-500 via-emerald-500 to-teal-600",
        icon: "☀️"
      };
    } else if (hour >= 15 && hour < 18) {
      return {
        greeting: "Selamat Sore",
        tip: "Shift sore berjalan dengan lancar. Tetap berikan energi positif!",
        gradient: "from-orange-500 via-rose-500 to-indigo-600",
        icon: "🌇"
      };
    } else {
      return {
        greeting: "Selamat Malam",
        tip: "Shift malam tenang. Terima kasih atas dedikasi luar biasa Anda hari ini!",
        gradient: "from-indigo-950 via-purple-900 to-slate-950 border border-indigo-900/50",
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
    <div className="min-h-screen p-1.5 opacity-100 transition-opacity duration-500">
      
      {/* ─── Top Welcome & Digital Clock Banner ─── */}
      <div className={`relative rounded-3xl overflow-hidden shadow-xl p-8 mb-8 text-white bg-gradient-to-r ${greetingConfig.gradient}`}>
        {/* Background decorative glowing circles */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-white/5 rounded-full blur-2xl -ml-20 -mb-20"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/20 animate-bounce">
              {greetingConfig.icon}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {greetingConfig.greeting}, dr. Sari!
              </h1>
              <p className="text-xs md:text-sm text-white/80 font-medium mt-1 leading-relaxed max-w-lg">
                {greetingConfig.tip}
              </p>
            </div>
          </div>
          
          {/* Glassmorphic Live Clock & Date Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col items-center md:items-end min-w-[220px] shadow-lg">
            <div className="flex items-center gap-2 text-white/90 mb-1">
              <Clock className="w-4 h-4 text-emerald-300 animate-spin-slow" />
              <span className="text-xs font-bold uppercase tracking-wider">LIVE CLINIC CLOCK</span>
            </div>
            <h2 className="text-3xl font-black tracking-widest font-mono text-emerald-200">
              {formatClock(currentTime)}
            </h2>
            <p className="text-[11px] text-white/70 font-semibold mt-1">
              {formatDate(currentTime)}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Action Cards Panel ─── */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-500" /> Ringkasan Analitik
        </h2>
        <div className="flex gap-3">
          <button className="text-xs px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all font-semibold cursor-pointer">
            Semua Pasien
          </button>
          <button 
            onClick={handleNewPatientClick}
            className="text-xs px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg transition-all font-bold transform hover:-translate-y-0.5 flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" /> Pasien Baru
          </button>
        </div>
      </div>

      {/* ─── Stat Cards Modern ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        
        {/* Kunjungan Hari Ini */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-150 p-6 transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Kunjungan Hari Ini</p>
              <h1 className="text-3xl font-extrabold mt-2 text-gray-800 tracking-tight">24</h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">+3</span>
            <span className="text-gray-400 text-xs font-medium">dibanding kemarin</span>
          </div>
        </div>

        {/* Antrian Sekarang */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-150 p-6 transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Antrian Sekarang</p>
              <h1 className="text-3xl font-extrabold mt-2 text-gray-800 tracking-tight">8</h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">4</span>
            <span className="text-gray-400 text-xs font-medium">sedang diproses</span>
          </div>
        </div>

        {/* Pasien Aktif */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-150 p-6 transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pasien Aktif</p>
              <h1 className="text-3xl font-extrabold mt-2 text-gray-800 tracking-tight">312</h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shadow-inner group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">+12</span>
            <span className="text-gray-400 text-xs font-medium">terdaftar bulan ini</span>
          </div>
        </div>

        {/* Pendapatan Hari Ini */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-150 p-6 transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Pendapatan Hari Ini</p>
              <h1 className="text-3xl font-extrabold mt-2 text-gray-800 tracking-tight">Rp 4.2 Jt</h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-inner group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 relative z-10">
            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">85%</span>
            <span className="text-gray-400 text-xs font-medium">dari target harian</span>
          </div>
        </div>
      </div>

      {/* ─── Middle Section (Chart & Pet Grid) ─── */}
      <div className="grid grid-cols-5 gap-6 mb-8">
        
        {/* Chart */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-150 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> Kunjungan Pasien Bulanan (2026)
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }} axisLine={false} tickLine={false} dx={-10} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: "none", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)", fontSize: 13, fontWeight: 500 }}
              />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 12, paddingTop: '20px', fontWeight: 500 }} />
              <Bar dataKey="Kucing" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Anjing" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Burung" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Lainnya" stackId="a" fill="#ec4899" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pet Grid */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-150 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-base font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-emerald-500" /> Pasien Sering Berkunjung
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {petTypes.map((pet) => (
              <div
                key={pet.name}
                className="bg-gray-50 rounded-xl p-4 text-center cursor-pointer hover:bg-white hover:shadow-md transition-all duration-300 border border-gray-100 group"
              >
                <div className="text-3xl mb-2 transition-transform duration-300 group-hover:-translate-y-1">{pet.emoji}</div>
                <p className="text-sm font-semibold text-gray-700">{pet.name}</p>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">{pet.count} pasien</p>
                <div className="h-1.5 rounded-full mt-3 bg-gray-200 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${(pet.count / pet.max) * 100}%`,
                      background: pet.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bottom Section (Visits Table, Schedule, & AI Insights) ─── */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Recent Visits Table */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-150 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <BriefcaseMedical className="w-4 h-4 text-emerald-500" /> Kunjungan Terbaru
            </h2>
            <div className="flex gap-4 items-center self-end sm:self-auto">
              <SearchBar 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Cari pasien / pemilik..."
              />
              <Tabs defaultValue="hari-ini" className="w-[180px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="hari-ini">Hari Ini</TabsTrigger>
                  <TabsTrigger value="minggu-ini">Minggu Ini</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100">Pasien</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100">Pemilik</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100">Keluhan</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100">Triage</th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((v) => {
                    const isUrgent = v.complaint.toLowerCase().includes("demam") || v.complaint.toLowerCase().includes("turun drastis");
                    return (
                      <tr key={v.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors group">
                        <td className="py-3 flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform">{v.emoji}</span>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{v.name}</p>
                            <p className="text-xs text-gray-400 font-medium">{v.breed}</p>
                          </div>
                        </td>
                        <td className="py-3 text-sm font-medium text-gray-600">{v.owner}</td>
                        <td className="py-3 text-sm text-gray-500">{v.complaint}</td>
                        <td className="py-3">
                          {isUrgent ? (
                            <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-100 animate-pulse">
                              <HeartPulse className="w-3 h-3 text-red-500" /> PRIORITAS
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-150">
                              Normal
                            </span>
                          )}
                        </td>
                        <td className="py-3"><StatusBadge status={v.status} /></td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-400 text-sm font-medium">
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side Column (Schedule & AI Insights) */}
        <div className="flex flex-col gap-6">
          
          {/* AI Clinical Insights Widget */}
          <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[190px]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-8 -mt-8 blur-2xl" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black tracking-widest text-emerald-400">ASISTEN AI KLINIK</h3>
                    <p className="text-[10px] text-gray-400 font-semibold">Tip Medis Hari Ini</p>
                  </div>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {activeInsight.badge}
                </span>
              </div>
              
              <div className="mt-2 min-h-[90px] flex flex-col justify-center">
                <h4 className="text-sm font-bold text-emerald-100 flex items-center gap-1.5">
                  💡 {activeInsight.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium mt-1">
                  {activeInsight.content}
                </p>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-emerald-900/60 flex justify-between items-center text-[10px] text-gray-400">
              <button 
                onClick={nextInsight}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition-colors cursor-pointer group"
              >
                Tip Berikutnya <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <span>Auto-Sync Aktif</span>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm hover:shadow-md transition-shadow flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-500" /> Jadwal Hari Ini
              </h2>
              <button className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 transition-colors">Lihat Semua</button>
            </div>
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
              {scheduleItems.map((item, i) => (
                <div key={i} className="flex gap-4 items-start bg-gray-50 hover:bg-emerald-50/30 transition-colors rounded-xl p-3 border border-gray-50 hover:border-emerald-100 cursor-pointer group">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-2.5 h-2.5 rounded-full mb-1 shadow-sm transition-transform group-hover:scale-125"
                      style={{ background: item.color }}
                    />
                    <div className="w-[1px] h-full bg-gray-200 mt-1"></div>
                  </div>
                  <div className="-mt-1">
                    <p className="text-[10px] font-bold text-gray-400 mb-0.5">{item.time}</p>
                    <p className="text-xs font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">{item.name}</p>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ─── Modals & Toasts ─── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmAddPatient}
        title="Pendaftaran Pasien Baru"
        confirmText="Lanjutkan ke Form"
      >
        <p className="text-sm text-gray-500 leading-relaxed">
          Anda akan dialihkan ke halaman pendaftaran pasien baru. Pastikan Anda sudah menyiapkan data rekam medis pasien jika ada.
        </p>
      </Modal>

      <ToastNotification 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
        message={toastMessage} 
        type="success"
      />
    </div>
  );
}