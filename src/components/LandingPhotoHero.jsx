import React from "react";
import { ArrowRight, CalendarCheck, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export default function LandingPhotoHero({ user, onPrimaryAction }) {
  return (
    <section className="relative min-h-[88vh] pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden bg-slate-950 flex items-end">
      <img
        src="https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&w=1800&q=85"
        alt="Dokter hewan di ruang klinik modern bersama hewan peliharaan"
        className="absolute inset-0 h-full w-full object-cover"
        decoding="async"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/58 to-slate-950/12" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950/80 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="max-w-3xl space-y-8 text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
            <Sparkles className="w-4 h-4 text-emerald-300" /> CRM Klinik Hewan, Booking, dan Portal Customer
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.02] tracking-tight">
            PetCare CRM untuk klinik hewan modern.
          </h1>

          <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl font-medium">
            Kelola rekam medis, jadwal dokter, apotek, dan hubungan pelanggan dalam satu sistem yang terasa cepat untuk staf klinik dan mudah untuk pemilik anabul.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onPrimaryAction}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-xl shadow-emerald-950/30 active:scale-[0.98] transition-all duration-300 cursor-pointer"
            >
              {user ? "Masuk ke Dashboard Saya" : "Mulai Percobaan Gratis"}
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#simulator"
                className="flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-sm px-8 py-4 rounded-2xl backdrop-blur-md transition-all duration-300"
            >
              Coba Booking Cepat
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl pt-4">
            {[
              { icon: CheckCircle2, title: "Rekam medis", text: "Rapi dan mudah dicari" },
              { icon: CalendarCheck, title: "Booking online", text: "Antrean lebih terkendali" },
              { icon: ShieldCheck, title: "Data aman", text: "Akses sesuai role" },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                <item.icon className="w-5 h-5 text-emerald-300 mb-3" />
                <p className="text-xs font-black text-white">{item.title}</p>
                <p className="text-[10px] text-white/65 font-medium mt-1 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
