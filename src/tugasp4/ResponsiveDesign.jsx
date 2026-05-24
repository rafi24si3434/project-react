import GuestView from "./GuestView";
import AdminView from "./AdminView";
import { useState } from "react";

export default function ResponsiveDesign() {
  const [page, setPage] = useState("home");

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 p-4 sm:p-8 font-sans selection:bg-indigo-100">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden">
        
        {/* HEADER - MODERN JOB PORTAL STYLE */}
        <header className="relative bg-indigo-900 p-8 sm:p-12 overflow-hidden text-white">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
          
          <div className="relative z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-400/30">
              Career Opportunity
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              LOWONGAN <span className="text-indigo-400">PEKERJAAN</span>
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 mt-4 max-w-2xl font-light leading-relaxed">
              Temukan karir impian Anda dan kembangkan potensi bersama perusahaan-perusahaan terbaik di industri.
            </p>
          </div>
        </header>

        {/* NAVIGATION - GLASSMORPHISM STYLE */}
        <nav className="flex flex-wrap items-center gap-2 p-4 bg-slate-50/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20">
          {[
            { id: "home", label: "Dashboard", icon: "🏠" },
            { id: "guest", label: "Cari Kerja (USER)", icon: "🔍" },
            { id: "admin", label: "Panel HRD (ADMIN)", icon: "💼" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all duration-300 ${
                page === item.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105"
                  : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* CONTENT */}
        <main className="p-6 sm:p-12 space-y-20">
          {page === "home" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <JobStats />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
                <div className="lg:col-span-2 space-y-16">
                  <ResponsiveText />
                  <ResponsiveGrid />
                </div>
                <div className="space-y-8">
                  <ResponsiveWidth />
                  <ResponsiveLayout />
                </div>
              </div>
            </div>
          )}

          {page === "guest" && <GuestView />}
          {page === "admin" && <AdminView />}
        </main>

        <footer className="p-8 border-t border-slate-100 text-center text-slate-400 text-sm font-medium">
          © 2024 Job Portal Showcase • Dibuat dengan Oleh Rafi • Tailwind CSS & React
        </footer>
      </div>
    </div>
  );
}

// 🔹 STATS MINI COMPONENT
function JobStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Posisi Aktif", val: "1.2k+", color: "text-indigo-600" },
        { label: "Perusahaan", val: "450", color: "text-blue-600" },
        { label: "Pelamar", val: "12k", color: "text-emerald-600" },
        { label: "Gaji Rata-rata", val: "15jt", color: "text-amber-600" },
      ].map((stat, i) => (
        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
        </div>
      ))}
    </div>
  );
}

// 🔹 RESPONSIVE TEXT
function ResponsiveText() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
          Tipografi Adaptif
        </h2>
      </div>
      <p className="text-base sm:text-lg lg:text-xl text-slate-500 leading-relaxed">
        Sistem kami secara otomatis menyesuaikan ukuran font agar pelamar tetap nyaman membaca deskripsi pekerjaan baik di smartphone maupun layar monitor besar.
      </p>
    </section>
  );
}

// 🔹 RESPONSIVE WIDTH
function ResponsiveWidth() {
  return (
    <section className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
      <h2 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
        📍 Lokasi Terpopuler
      </h2>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-200/50">
        <p className="text-sm font-bold text-slate-700">Jakarta Selatan</p>
        <div className="w-full bg-slate-100 h-2 mt-2 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full w-[80%] rounded-full"></div>
        </div>
        <p className="text-[10px] mt-2 text-slate-400 uppercase font-bold tracking-tighter">80% Permintaan User</p>
      </div>
    </section>
  );
}

// 🔹 RESPONSIVE GRID
function ResponsiveGrid() {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-800 mb-6">Kategori Pekerjaan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {['Technology', 'Marketing', 'Design', 'Finance', 'Sales', 'Human Resources'].map((item, index) => (
          <div key={index} className="group cursor-pointer p-6 bg-white border border-slate-200 rounded-2xl transition-all duration-300 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100 hover:-translate-y-1">
            <div className="w-10 h-10 bg-slate-100 rounded-lg mb-4 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
              <span className="text-slate-600 group-hover:scale-110 transition-transform">📁</span>
            </div>
            <h3 className="font-bold text-slate-800">{item}</h3>
            <p className="text-sm text-slate-500 mt-1">240+ Lowongan</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// 🔹 RESPONSIVE LAYOUT
function ResponsiveLayout() {
  return (
    <section className="bg-slate-900 p-6 rounded-3xl text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl">✨</div>
      <h2 className="text-lg font-bold mb-4">Update Terbaru</h2>
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-2 h-2 mt-2 bg-indigo-400 rounded-full shrink-0"></div>
          <p className="text-sm text-slate-300">Fitur <strong>Quick Apply</strong> sekarang tersedia untuk Admin.</p>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-2 h-2 mt-2 bg-indigo-400 rounded-full shrink-0"></div>
          <p className="text-sm text-slate-300">Optimasi layout untuk Tablet (iPad Pro).</p>
        </div>
      </div>
    </section>
  );
}