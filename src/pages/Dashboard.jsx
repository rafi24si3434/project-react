import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
  { emoji: "🐱", name: "Kucing", count: 124, max: 124, color: "#1D9E75" },
  { emoji: "🐶", name: "Anjing", count: 98, max: 124, color: "#378ADD" },
  { emoji: "🐰", name: "Kelinci", count: 34, max: 124, color: "#7F77DD" },
  { emoji: "🦜", name: "Burung", count: 28, max: 124, color: "#BA7517" },
  { emoji: "🐹", name: "Hamster", count: 18, max: 124, color: "#D4537E" },
  { emoji: "🐢", name: "Reptil", count: 10, max: 124, color: "#0F6E56" },
];

const recentVisits = [
  { emoji: "🐱", name: "Mochi", breed: "Kucing Persia", owner: "Budi S.", complaint: "Vaksin rutin", status: "Selesai" },
  { emoji: "🐶", name: "Rex", breed: "Golden Retriever", owner: "Rina A.", complaint: "Demam tinggi", status: "Proses" },
  { emoji: "🦜", name: "Polly", breed: "Kakak Tua", owner: "Hendra K.", complaint: "Bulu rontok", status: "Antri" },
  { emoji: "🐰", name: "Lola", breed: "Holland Lop", owner: "Siti M.", complaint: "Nafsu makan turun", status: "Antri" },
  { emoji: "🐱", name: "Luna", breed: "Scottish Fold", owner: "Dinda P.", complaint: "Sterilisasi", status: "Selesai" },
];

const scheduleItems = [
  { time: "08:00", name: "Mochi", detail: "Vaksinasi & pemeriksaan rutin · Budi S.", color: "#1D9E75" },
  { time: "09:30", name: "Rex — Golden Retriever", detail: "Pengobatan demam & infus · Rina A.", color: "#378ADD" },
  { time: "10:45", name: "Polly — Kakak Tua", detail: "Dermatologi bulu · Hendra K.", color: "#BA7517" },
  { time: "13:00", name: "Lola — Kelinci Holland", detail: "Konsultasi nutrisi · Siti M.", color: "#D4537E" },
  { time: "14:30", name: "Bruno — Bulldog Prancis", detail: "Post-op checkup · Agus T.", color: "#7F77DD" },
  { time: "16:00", name: "Kiki — Hamster Syrien", detail: "Grooming & cek gigi · Dewi L.", color: "#1D9E75" },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ emoji, value, label, badge, badgeBg, badgeText, accentColor }) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden shadow-sm">
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-2xl"
        style={{ background: accentColor }}
      />
      <div className="text-2xl mb-2">{emoji}</div>
      <p className="text-2xl font-semibold text-gray-800 leading-none">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
      {badge && (
        <span
          className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: badgeBg, color: badgeText }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Selesai: "bg-green-100 text-green-800",
    Proses: "bg-blue-100 text-blue-800",
    Antri: "bg-amber-100 text-amber-800",
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("hari-ini");

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Top Bar */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🐾</span>
            <h1 className="text-xl font-semibold text-gray-800">Klinik Hewan PetCare</h1>
          </div>
          <p className="text-sm text-gray-400">Senin, 5 Mei 2026 · dr. Sari Pratiwi, drh.</p>
        </div>
        <div className="flex gap-2">
          <button className="text-sm px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition">
            Semua Pasien
          </button>
          <button className="text-sm px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm transition font-medium">
            + Pasien Baru
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard emoji="🩺" value="24" label="Kunjungan Hari Ini" badge="+3 dari kemarin" badgeBg="#EAF3DE" badgeText="#3B6D11" accentColor="#1D9E75" />
        <StatCard emoji="📋" value="8" label="Antrian Sekarang" badge="4 sedang diproses" badgeBg="#E6F1FB" badgeText="#185FA5" accentColor="#378ADD" />
        <StatCard emoji="🐾" value="312" label="Total Pasien Aktif" badge="+12 bulan ini" badgeBg="#FBEAF0" badgeText="#993556" accentColor="#D4537E" />
        <StatCard emoji="💰" value="Rp 4,2 Jt" label="Pendapatan Hari Ini" badge="Target 85%" badgeBg="#FAEEDA" badgeText="#854F0B" accentColor="#BA7517" />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-5 gap-4 mb-6">

        {/* Chart */}
        <div className="col-span-3 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Kunjungan Bulanan 2026</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", fontSize: 12 }}
              />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Kucing" stackId="a" fill="#5DCAA5" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Anjing" stackId="a" fill="#85B7EB" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Burung" stackId="a" fill="#EF9F27" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Lainnya" stackId="a" fill="#ED93B1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pet Grid */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Pasien Sering Berkunjung</h2>
          <div className="grid grid-cols-3 gap-2">
            {petTypes.map((pet) => (
              <div
                key={pet.name}
                className="bg-gray-50 rounded-xl p-3 text-center cursor-pointer hover:bg-gray-100 transition border border-gray-100"
              >
                <div className="text-2xl mb-1">{pet.emoji}</div>
                <p className="text-xs font-semibold text-gray-700">{pet.name}</p>
                <p className="text-[10px] text-gray-400">{pet.count} pasien</p>
                <div className="h-1 rounded-full mt-2 bg-gray-200">
                  <div
                    className="h-1 rounded-full"
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
      <div className="grid grid-cols-2 gap-4">

        {/* Recent Visits Table */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-700">Kunjungan Terbaru</h2>
            <div className="flex gap-1">
              {["hari-ini", "minggu-ini"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-[11px] px-3 py-1 rounded-lg transition ${
                    activeTab === tab
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {tab === "hari-ini" ? "Hari Ini" : "Minggu Ini"}
                </button>
              ))}
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider pb-2 font-medium border-b border-gray-100">Pasien</th>
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider pb-2 font-medium border-b border-gray-100">Pemilik</th>
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider pb-2 font-medium border-b border-gray-100">Keluhan</th>
                <th className="text-left text-[10px] text-gray-400 uppercase tracking-wider pb-2 font-medium border-b border-gray-100">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentVisits.map((v, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-none">
                  <td className="py-2.5 flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm">{v.emoji}</span>
                    <div>
                      <p className="font-medium text-gray-800 text-xs">{v.name}</p>
                      <p className="text-[10px] text-gray-400">{v.breed}</p>
                    </div>
                  </td>
                  <td className="py-2.5 text-xs text-gray-500">{v.owner}</td>
                  <td className="py-2.5 text-xs text-gray-500">{v.complaint}</td>
                  <td className="py-2.5"><StatusBadge status={v.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Jadwal Hari Ini</h2>
          <div className="flex flex-col gap-2">
            {scheduleItems.map((item, i) => (
              <div key={i} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: item.color }}
                />
                <p className="text-[11px] text-gray-400 min-w-[36px] mt-0.5">{item.time}</p>
                <div>
                  <p className="text-xs font-semibold text-gray-700">{item.name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}