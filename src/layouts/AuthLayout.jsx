import { Outlet } from "react-router-dom";
import { ShieldCheck, HeartPulse, Sparkles, Activity } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Keamanan Terjamin", desc: "Data rekam medis dienkripsi dengan standar medis." },
  { icon: HeartPulse, title: "Manajemen Terpadu", desc: "Kelola pasien, dokter, dan inventori dalam satu atap." },
  { icon: Activity, title: "Laporan Cerdas", desc: "Analisis bisnis dan kinerja klinik dalam satu dashboard." },
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/10 font-sans relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] rounded-full bg-emerald-400/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-400/10 blur-[120px] animate-pulse-slow" />
        <div className="absolute top-[40%] left-[40%] w-[50%] h-[50%] rounded-full bg-cyan-400/5 blur-[100px] animate-pulse-slow" />
      </div>

      {/* ── LEFT PANEL — Visual Branding ── */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        
        {/* Premium Mesh Gradient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-500/20 blur-[120px] animate-pulse" />
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[80px] animate-pulse" />
        </div>

        {/* Pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30 animate-pulse-slow">
            <span className="text-4xl">🐾</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">PetCare <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">CRM</span></h1>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 mt-16">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-black mb-8 shadow-lg shadow-emerald-500/20 backdrop-blur-md">
            <Sparkles className="w-4 h-4" /> Platform Klinik Hewan #1
          </div>
          <h2 className="text-6xl font-black text-white leading-[1.05] mb-8 tracking-tight">
            Tingkatkan <br />
            Kualitas <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400">Layanan</span> <br />
            Klinik Anda.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            Sistem manajemen terpadu yang didesain khusus untuk dokter hewan profesional.
          </p>
        </div>

        {/* Feature List */}
        <div className="relative z-10 space-y-4 mt-auto pt-16">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-5 bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-md hover:bg-white/10 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <f.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white group-hover:text-emerald-300 transition-colors">{f.title}</h4>
                <p className="text-xs text-slate-400">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 pt-12">
          <p className="text-center text-xs text-slate-500 font-medium">
            © 2026 PetCare CRM. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form Area ── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Subtle glow on form side */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[150px] pointer-events-none rounded-full animate-pulse-slow" />

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-center gap-3 p-8 pb-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <span className="text-3xl">🐾</span>
          </div>
          <span className="font-black text-2xl text-gray-800">PetCare</span>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-[480px] bg-white/95 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-500/10 border border-white/60 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 font-medium pb-8">
          © 2026 PetCare CRM. All rights reserved.
        </p>
      </div>

    </div>
  );
}