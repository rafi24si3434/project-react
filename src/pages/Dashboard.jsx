import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import petsData from "../data/Pets";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import { 
  TrendingUp, Users, Calendar, Activity, 
  Sparkles, Clock, AlertCircle, Heart, ArrowRight,
  PlusCircle, Stethoscope, BriefcaseMedical, ChevronRight,
  Flame, BellDot, HeartPulse, ShieldAlert, DollarSign, Send,
  ArrowUpRight, AlertTriangle, CheckCircle, HelpCircle, PawPrint
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
  const navigate = useNavigate();
  const { profile, isCustomer } = useAuth();

  const [custStats, setCustStats] = useState({
    petsCount: 0,
    appCount: 0,
    recordCount: 0,
    totalSpent: 0,
    petsList: [],
    appointmentsList: [],
    ordersList: []
  });

  const [admStats, setAdmStats] = useState({
    totalCustomer: 0,
    customerBaru: 0,
    totalHewan: 0,
    appointmentAktif: 0,
    totalPenjualan: 0
  });

  const [loadingDb, setLoadingDb] = useState(true);

  const fetchCustomerStats = async (userId) => {
    try {
      const { count: petsCount } = await supabase
        .from("pets")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", userId);

      const { count: appCount } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", userId)
        .in("status", ["Pending", "Confirmed"]);

      const { count: recordCount } = await supabase
        .from("medical_records")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", userId);

      const { data: orderData } = await supabase
        .from("orders")
        .select("total_amount")
        .eq("customer_id", userId)
        .in("status", ["Paid", "Completed", "Processing"]);

      const totalSpent = orderData ? orderData.reduce((sum, o) => sum + Number(o.total_amount || 0), 0) : 0;

      const { data: petsList } = await supabase
        .from("pets")
        .select("*")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });

      const { data: appointmentsList } = await supabase
        .from("appointments")
        .select("*, pets(name, type, breed)")
        .eq("owner_id", userId)
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      const { data: ordersList } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      return {
        petsCount: petsCount || 0,
        appCount: appCount || 0,
        recordCount: recordCount || 0,
        totalSpent,
        petsList: petsList || [],
        appointmentsList: appointmentsList || [],
        ordersList: ordersList || []
      };
    } catch (err) {
      console.error("Error fetching customer stats:", err);
      return {
        petsCount: 0,
        appCount: 0,
        recordCount: 0,
        totalSpent: 0,
        petsList: [],
        appointmentsList: [],
        ordersList: []
      };
    }
  };

  const fetchAdminStats = async () => {
    try {
      const { count: totalCustomer } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "customer");
        
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { count: customerBaru } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "customer")
        .gte("created_at", sevenDaysAgo.toISOString());

      const { count: totalHewan } = await supabase
        .from("pets")
        .select("*", { count: "exact", head: true });

      const { count: appointmentAktif } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .in("status", ["Pending", "Confirmed"]);

      const { data: salesData } = await supabase
        .from("orders")
        .select("total_amount")
        .in("status", ["Paid", "Completed", "Processing"]);

      const totalPenjualan = salesData ? salesData.reduce((sum, o) => sum + Number(o.total_amount || 0), 0) : 0;

      return {
        totalCustomer: totalCustomer || 0,
        customerBaru: customerBaru || 0,
        totalHewan: totalHewan || 0,
        appointmentAktif: appointmentAktif || 0,
        totalPenjualan
      };
    } catch (err) {
      console.error("Error fetching admin stats:", err);
      return {
        totalCustomer: 0,
        customerBaru: 0,
        totalHewan: 0,
        appointmentAktif: 0,
        totalPenjualan: 0
      };
    }
  };

  useEffect(() => {
    if (!profile) return;
    const loadData = async () => {
      setLoadingDb(true);
      if (profile.role === "customer") {
        const data = await fetchCustomerStats(profile.auth_user_id);
        setCustStats(data);
      } else {
        const data = await fetchAdminStats();
        setAdmStats(data);
      }
      setLoadingDb(false);
    };
    loadData();
  }, [profile]);

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

  const statsList = useMemo(() => {
    return [
      { label: "Total Customer", val: admStats.totalCustomer, sub: `+${admStats.customerBaru}`, desc: "Customer baru (7 hari)", color: "emerald", icon: Users },
      { label: "Total Hewan", val: admStats.totalHewan, sub: "Aktif", desc: "Anabul terdaftar", color: "blue", icon: PawPrint },
      { label: "Appointment Aktif", val: admStats.appointmentAktif, sub: "Pending/Confirmed", desc: "Janji temu aktif", color: "violet", icon: Calendar },
      { label: "Total Penjualan Produk", val: `Rp ${admStats.totalPenjualan.toLocaleString("id-ID")}`, sub: "Lunas/Proses", desc: "Pendapatan produk", color: "amber", icon: TrendingUp },
    ];
  }, [admStats]);

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

  if (isCustomer) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen space-y-6 text-left animate-fade-in">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 p-8 text-white shadow-xl shadow-emerald-500/10">
          {/* Decorative shapes */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute right-1/4 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-emerald-50">
                🐾 Portal Customer PetCare
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Halo, {profile?.full_name || "Pemilik Hewan"}!
              </h1>
              <p className="text-emerald-100 text-sm md:text-base font-medium max-w-xl">
                Pantau rekam medis, jadwal vaksin, dan kelola janji temu untuk anabul kesayangan Anda dengan mudah dalam satu tempat.
              </p>
            </div>
            
            <div className="shrink-0 flex items-center gap-3 bg-white/15 backdrop-blur-md px-5 py-4 rounded-3xl border border-white/10">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl">
                📅
              </div>
              <div className="text-xs">
                <p className="font-extrabold text-white">Hari Ini</p>
                <p className="font-semibold text-emerald-100 mt-0.5">
                  {currentTime.toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-150 rounded-3xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
              🐾
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Anabul Saya</p>
              <h3 className="text-2xl font-black text-gray-850 mt-0.5">{custStats.petsCount} Ekor</h3>
            </div>
          </div>

          <div className="bg-white border border-gray-150 rounded-3xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
              📅
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Janji Temu</p>
              <h3 className="text-2xl font-black text-gray-855 mt-0.5">{custStats.appCount} Jadwal</h3>
            </div>
          </div>

          <div className="bg-white border border-gray-150 rounded-3xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
              💰
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Belanja</p>
              <h3 className="text-2xl font-black text-gray-850 mt-0.5">Rp {custStats.totalSpent.toLocaleString("id-ID")}</h3>
            </div>
          </div>

          <div className="bg-white border border-gray-150 rounded-3xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-bold">
              📋
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rekam Medis</p>
              <h3 className="text-2xl font-black text-gray-850 mt-0.5">{custStats.recordCount} Catatan</h3>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            🚀 Akses Cepat Layanan
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate("/appointments")} 
              className="bg-white hover:bg-emerald-50/20 border border-gray-150 hover:border-emerald-250 p-4 rounded-2xl shadow-sm text-left flex items-start gap-4 transition group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-850">Buat Janji Temu</h4>
                <p className="text-[10px] text-gray-450 mt-1 font-semibold">Konsultasi dokter & vaksinasi</p>
              </div>
            </button>

            <button 
              onClick={() => navigate("/pets/add")} 
              className="bg-white hover:bg-blue-50/20 border border-gray-150 hover:border-blue-250 p-4 rounded-2xl shadow-sm text-left flex items-start gap-4 transition group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-850">Daftarkan Anabul</h4>
                <p className="text-[10px] text-gray-450 mt-1 font-semibold">Tambah riwayat hewan baru</p>
              </div>
            </button>

            <button 
              onClick={() => navigate("/medical-records")} 
              className="bg-white hover:bg-purple-50/20 border border-gray-150 hover:border-purple-250 p-4 rounded-2xl shadow-sm text-left flex items-start gap-4 transition group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BriefcaseMedical className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-850">Rekam Medis</h4>
                <p className="text-[10px] text-gray-450 mt-1 font-semibold">Lihat riwayat penyakit & obat</p>
              </div>
            </button>

            <button 
              onClick={() => navigate("/feedback")} 
              className="bg-white hover:bg-amber-50/20 border border-gray-150 hover:border-amber-250 p-4 rounded-2xl shadow-sm text-left flex items-start gap-4 transition group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-850">Beri Feedback</h4>
                <p className="text-[10px] text-gray-450 mt-1 font-semibold">Beri ulasan / komplain klinik</p>
              </div>
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Pets & Appointments (Col-span 2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* My Pets Section */}
            <div className="bg-white border border-gray-150 rounded-[2rem] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2">
                  🐾 Hewan Peliharaan Saya
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {custStats.petsCount} Terdaftar
                </span>
              </div>

              {custStats.petsList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {custStats.petsList.map((pet) => {
                    const getEmoji = (t) => {
                      const lower = t?.toLowerCase();
                      if (lower === "cat" || lower === "kucing") return "🐱";
                      if (lower === "dog" || lower === "anjing") return "🐶";
                      if (lower === "rabbit" || lower === "kelinci") return "🐰";
                      if (lower === "bird" || lower === "burung") return "🦜";
                      if (lower === "hamster") return "🐹";
                      return "🐾";
                    };
                    return (
                      <div 
                        key={pet.id}
                        onClick={() => navigate(`/pets/${pet.id}`)}
                        className="p-4 rounded-2xl border border-gray-150 hover:border-emerald-300 bg-gray-50/30 hover:bg-white transition duration-300 flex items-center justify-between group cursor-pointer hover:shadow-md hover:shadow-emerald-500/5"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-white border border-gray-150 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-sm">
                            {getEmoji(pet.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-gray-800 text-sm">{pet.name}</h4>
                              <span className={`text-[10px] font-bold ${pet.gender === 'Male' || pet.gender === 'Jantan' ? 'text-blue-500' : 'text-pink-500'}`}>
                                {pet.gender === 'Male' || pet.gender === 'Jantan' ? '♂️' : '♀️'}
                              </span>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold mt-0.5">{pet.breed}</p>
                            <p className="text-[9px] text-emerald-600 font-extrabold bg-emerald-50/50 px-1.5 py-0.5 rounded inline-block mt-1">{pet.birth_date ? `${new Date().getFullYear() - new Date(pet.birth_date).getFullYear()} Tahun` : "Umur -"}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl space-y-3">
                  <span className="text-3xl block">🐕🐈</span>
                  <h4 className="font-bold text-gray-700 text-sm">Belum Ada Hewan Peliharaan</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                    Yuk, daftarkan anabul kesayangan Anda sekarang untuk menikmati akses rekam medis penuh dan jadwal konsultasi!
                  </p>
                  <button 
                    onClick={() => navigate("/pets/add")} 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                  >
                    Daftarkan Sekarang <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Upcoming Appointments Section */}
            <div className="bg-white border border-gray-150 rounded-[2rem] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2">
                  📅 Jadwal Janji Temu Mendatang
                </h3>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {custStats.appCount} Jadwal
                </span>
              </div>

              {custStats.appointmentsList.length > 0 ? (
                <div className="space-y-3">
                  {custStats.appointmentsList.map((app) => {
                    const getEmoji = (t) => {
                      const lower = t?.toLowerCase();
                      if (lower === "cat" || lower === "kucing") return "🐱";
                      if (lower === "dog" || lower === "anjing") return "🐶";
                      if (lower === "rabbit" || lower === "kelinci") return "🐰";
                      if (lower === "bird" || lower === "burung") return "🦜";
                      if (lower === "hamster") return "🐹";
                      return "🐾";
                    };
                    return (
                      <div 
                        key={app.id}
                        className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xl shadow-sm shrink-0">
                            {getEmoji(app.pets?.type)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 text-sm">{app.pets?.name || "Hewan"}</h4>
                            <p className="text-[10px] text-gray-400 font-bold">{app.pets?.breed || "Ras"}</p>
                            <p className="text-[10px] text-gray-600 font-medium mt-1">Keluhan: <span className="font-semibold text-gray-800">{app.notes || "-"}</span></p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100 text-xs gap-1">
                          <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 bg-emerald-50/80 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            {app.date} · {app.time}
                          </div>
                          <div className="text-[9px] font-bold text-gray-400 mt-0.5">Dokter: <span className="text-gray-750 font-bold">{app.doctor}</span></div>
                          <span className={`inline-block text-[8px] font-black uppercase px-2 py-0.5 rounded mt-1.5 ${
                            app.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                            app.status === 'Confirmed' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700 animate-pulse'
                          }`}>
                            {app.status === 'Completed' ? 'Selesai' : app.status === 'Confirmed' ? 'Terkonfirmasi' : 'Menunggu'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl space-y-3">
                  <span className="text-3xl block">📅</span>
                  <h4 className="font-bold text-gray-700 text-sm">Tidak Ada Janji Temu Aktif</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                    Belum ada jadwal janji temu untuk hewan peliharaan Anda.
                  </p>
                  <button 
                    onClick={() => navigate("/appointments")} 
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Buat Janji Temu Baru <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Right: Insights & Promotion (Col-span 1) */}
          <div className="space-y-6">
            
            {/* Health Insights */}
            <div className="bg-white border border-gray-150 rounded-[2rem] p-6 shadow-sm space-y-4 text-left">
              <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
                💡 Tips Kesehatan Hewan
              </h3>
              <div className="space-y-4">
                <div className="p-3.5 bg-emerald-50/30 border border-emerald-100 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1.5 text-emerald-700 text-xs font-bold">
                    <span>🐱</span> Kucing Persia & Bulu Kusut
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                    Pastikan anabul Anda disisir setidaknya sekali sehari untuk mencegah bulu kusut (hairball). Cukupi kebutuhan air minumnya agar ginjal tetap sehat.
                  </p>
                </div>

                <div className="p-3.5 bg-blue-50/30 border border-blue-100 rounded-2xl">
                  <div className="flex items-center gap-2 mb-1.5 text-blue-750 text-xs font-bold">
                    <span>🐶</span> Nutrisi Golden Retriever
                  </div>
                  <p className="text-[10px] text-gray-500 font-semibold leading-relaxed">
                    Perhatikan asupan kalsium pada masa pertumbuhan mereka. Hindari memberikan cokelat, anggur, atau bawang merah karena beracun bagi anjing.
                  </p>
                </div>
              </div>
            </div>

            {/* Campaign promo */}
            <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-slate-850 rounded-[2rem] p-6 text-white shadow-lg space-y-4 relative overflow-hidden text-left">
              {/* background light */}
              <div className="absolute right-[-10%] top-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-2xl" />
              
              <div className="relative z-10 space-y-3">
                <span className="inline-flex px-2.5 py-0.5 rounded bg-purple-500/20 border border-purple-500/30 text-[9px] font-black uppercase text-purple-300">
                  Promo Spesial Bulan Ini
                </span>
                <h4 className="text-base font-extrabold leading-tight text-white">
                  Paket Sterilisasi Lengkap & Cek Kesehatan
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold">
                  Diskon 20% untuk paket sterilisasi kucing/anjing termasuk rawat inap 1 malam & obat pasca operasi. Berlaku s.d. 30 Juni 2026.
                </p>
                <div className="pt-2">
                  <button 
                    onClick={() => navigate("/appointments")} 
                    className="w-full text-center py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-xl text-xs font-extrabold transition shadow-md shadow-purple-500/10 cursor-pointer"
                  >
                    Klaim Promo Sekarang
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

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