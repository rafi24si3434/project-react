import { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";

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
  { id: 2, emoji: "🐶", name: "Rex", breed: "Golden Retriever", owner: "Rina A.", complaint: "Demam tinggi", status: "Proses" },
  { id: 3, emoji: "🦜", name: "Polly", breed: "Kakak Tua", owner: "Hendra K.", complaint: "Bulu rontok", status: "Antri" },
  { id: 4, emoji: "🐰", name: "Lola", breed: "Holland Lop", owner: "Siti M.", complaint: "Nafsu makan turun", status: "Antri" },
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("hari-ini");
  const [searchQuery, setSearchQuery] = useState("");
  const [greeting, setGreeting] = useState("Selamat Datang");
  
  // UI States for our new components
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 11) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");
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

  return (
    <div className="min-h-screen p-6 opacity-100 transition-opacity duration-500">
      {/* Top Bar */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl shadow-inner">🐾</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{greeting}, dr. Sari!</h1>
              <p className="text-sm text-gray-500 font-medium">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="text-sm px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all font-medium">
            Semua Pasien
          </button>
          <button 
            onClick={handleNewPatientClick}
            className="text-sm px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg transition-all font-semibold transform hover:-translate-y-0.5"
          >
            + Pasien Baru
          </button>
        </div>
      </div>

      {/* Stat Cards Modern */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Kunjungan Hari Ini</p>
          <h1 className="text-4xl font-bold mt-2 text-gray-800">24</h1>
          <span className="text-emerald-500 text-sm font-medium mt-2 inline-block">+3 dari kemarin</span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Antrian Sekarang</p>
          <h1 className="text-4xl font-bold mt-2 text-gray-800">8</h1>
          <span className="text-blue-500 text-sm font-medium mt-2 inline-block">4 sedang diproses</span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Pasien Aktif</p>
          <h1 className="text-4xl font-bold mt-2 text-gray-800">312</h1>
          <span className="text-pink-500 text-sm font-medium mt-2 inline-block">+12 bulan ini</span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <p className="text-gray-500 text-sm font-medium">Pendapatan Hari Ini</p>
          <h1 className="text-4xl font-bold mt-2 text-gray-800">Rp 4.2 Jt</h1>
          <span className="text-amber-500 text-sm font-medium mt-2 inline-block">Target 85%</span>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-5 gap-6 mb-8">
        {/* Chart */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-base font-bold text-gray-800 mb-6">Kunjungan Bulanan 2026</h2>
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
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-base font-bold text-gray-800 mb-6">Pasien Sering Berkunjung</h2>
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

      {/* Bottom Section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Visits Table */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-800">Kunjungan Terbaru</h2>
            <div className="flex gap-4 items-center">
              <SearchBar 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Cari pasien / pemilik..."
              />
              <Tabs defaultValue="hari-ini" className="w-[200px]">
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
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((v) => (
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
                      <td className="py-3"><StatusBadge status={v.status} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-400 text-sm font-medium">
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-gray-800">Jadwal Hari Ini</h2>
            <button className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 transition-colors">Lihat Semua</button>
          </div>
          <div className="flex flex-col gap-3">
            {scheduleItems.map((item, i) => (
              <div key={i} className="flex gap-4 items-start bg-gray-50 hover:bg-emerald-50/30 transition-colors rounded-xl p-3.5 border border-gray-50 hover:border-emerald-100 cursor-pointer group">
                <div className="flex flex-col items-center">
                  <div
                    className="w-2.5 h-2.5 rounded-full mb-1 shadow-sm transition-transform group-hover:scale-125"
                    style={{ background: item.color }}
                  />
                  <div className="w-[1px] h-full bg-gray-200 mt-1"></div>
                </div>
                <div className="-mt-1">
                  <p className="text-xs font-bold text-gray-400 mb-0.5">{item.time}</p>
                  <p className="text-sm font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">{item.name}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals & Toasts */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmAddPatient}
        title="Pendaftaran Pasien Baru"
        confirmText="Lanjutkan ke Form"
      >
        <p>Anda akan dialihkan ke halaman pendaftaran pasien baru. Pastikan Anda sudah menyiapkan data rekam medis pasien jika ada.</p>
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