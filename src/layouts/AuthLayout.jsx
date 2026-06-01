import { Outlet } from "react-router-dom";
import { Sparkles, ShieldCheck, HeartPulse } from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "Keamanan Terjamin", desc: "Data rekam medis dienkripsi dengan standar medis." },
  { icon: HeartPulse, title: "Manajemen Terpadu", desc: "Kelola pasien, dokter, dan inventori dalam satu atap." },
  { icon: Sparkles, title: "Modern & Cepat", desc: "Desain UI/UX premium yang memanjakan mata." },
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">

      {/* ── LEFT PANEL — Visual Branding ── */}
      <div className="hidden lg:flex w-[45%] bg-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        
        {/* Premium Mesh Gradient Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[100px]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-500/20 blur-[120px]"></div>
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[80px]"></div>
        </div>

        {/* Pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <span className="text-2xl">🐾</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">PetCare <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">CRM</span></h1>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10 mt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Platform Klinik Hewan #1
          </div>
          <h2 className="text-5xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            Tingkatkan <br />
            Kualitas <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Layanan</span> <br />
            Klinik Anda.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed max-w-md">
            Sistem manajemen terpadu yang didesain khusus untuk dokter hewan profesional.
          </p>
        </div>

        {/* Feature List */}
        <div className="relative z-10 space-y-5 mt-auto pt-12">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md hover:bg-white/10 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <f.icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{f.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — Form Area ── */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Subtle glow on form side */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] pointer-events-none rounded-full"></div>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center justify-center gap-2 p-8 pb-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md">
            <span className="text-xl">🐾</span>
          </div>
          <span className="font-bold text-xl text-gray-800">PetCare</span>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white relative z-10">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 font-medium pb-8">
          © 2026 PetCare CRM. All rights reserved.
        </p>
      </div>

    </div>
  );
}