import { Outlet, NavLink } from "react-router-dom";

const facts = [
  { emoji: "🐱", text: "Kucing memiliki lebih dari 20 otot untuk menggerakkan telinganya." },
  { emoji: "🐶", text: "Anjing dapat mencium aroma 10.000× lebih tajam dari manusia." },
  { emoji: "🐰", text: "Kelinci tidak bisa muntah — sistem pencernaan mereka unik." },
  { emoji: "🦜", text: "Beberapa burung kakak tua bisa hidup hingga 80 tahun." },
  { emoji: "🐹", text: "Hamster bisa berlari 8 km per malam di roda putarnya." },
];

const randomFact = facts[Math.floor(Math.random() * facts.length)];

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL — branding ── */}
      <div className="hidden lg:flex w-1/2 bg-emerald-500 flex-col justify-between p-12 relative overflow-hidden">

        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-emerald-400 opacity-40" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-emerald-600 opacity-30" />
        <div className="absolute top-1/2 -right-16 w-48 h-48 rounded-full bg-emerald-300 opacity-20" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
              🐾
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">PetCare</h1>
              <p className="text-emerald-200 text-xs font-medium tracking-widest uppercase">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Main copy */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Kelola Klinik<br />
            Hewan Anda<br />
            <span className="text-emerald-200">dengan Mudah.</span>
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed max-w-xs">
            Satu platform untuk mengelola pasien, jadwal dokter, rekam medis, dan semua kebutuhan klinik hewan Anda.
          </p>
        </div>

        {/* Fun fact card */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4">
          <p className="text-emerald-200 text-[10px] uppercase tracking-widest font-semibold mb-2">Tahukah Kamu?</p>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{randomFact.emoji}</span>
            <p className="text-white text-sm leading-relaxed">{randomFact.text}</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="flex-1 flex flex-col bg-gray-50">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 p-6 pb-0">
          <span className="text-xl">🐾</span>
          <span className="font-bold text-gray-800">PetCare</span>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-6">
          © 2026 PetCare Admin. All rights reserved.
        </p>
      </div>

    </div>
  );
}