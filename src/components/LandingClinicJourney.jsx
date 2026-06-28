import React from "react";
import {
  CalendarCheck,
  ClipboardList,
  HeartPulse,
  Pill,
  Stethoscope,
} from "lucide-react";

const journeySteps = [
  {
    icon: HeartPulse,
    title: "Triage gejala",
    desc: "Keluhan awal pemilik masuk sebagai briefing sebelum pasien datang.",
    tone: "bg-rose-50 text-rose-600 border-rose-100",
  },
  {
    icon: CalendarCheck,
    title: "Booking dokter",
    desc: "Sistem mengarahkan pasien ke dokter dan jadwal yang paling sesuai.",
    tone: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: Stethoscope,
    title: "Pemeriksaan klinis",
    desc: "Dokter membaca riwayat, memeriksa pasien, lalu mencatat diagnosa.",
    tone: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: Pill,
    title: "Resep & follow-up",
    desc: "Obat, instruksi perawatan, dan reminder kontrol tersimpan di portal.",
    tone: "bg-amber-50 text-amber-600 border-amber-100",
  },
];

export default function LandingClinicJourney() {
  return (
    <section className="py-24 bg-white text-left border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-4 py-2 rounded-full">
              <ClipboardList className="w-4 h-4" />
              Alur Klinik Terpadu
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Dari keluhan pertama sampai catatan medis, semuanya tersambung.
            </h2>
            <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
              PetCare CRM membuat landing page tidak berhenti di promosi. Pengunjung bisa memahami
              bagaimana klinik menerima pasien, mengatur dokter, dan menjaga follow-up setelah tindakan.
            </p>

            <div className="relative overflow-hidden rounded-[2rem] min-h-[320px] shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1576765607924-62a6f079b8f8?auto=format&fit=crop&w=1000&q=85"
                alt="Ruang pemeriksaan klinik hewan modern"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
              <div className="absolute left-6 right-6 bottom-6 text-white">
                <p className="text-[10px] uppercase tracking-wider font-black text-white/60">Ruang pemeriksaan</p>
                <h3 className="text-2xl font-black mt-1">Dokter punya konteks sebelum pasien masuk.</h3>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {journeySteps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-6 hover:bg-white hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${step.tone}`}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 bg-white border border-slate-200 rounded-full px-3 py-1">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-950 mt-6">{step.title}</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed mt-2">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[1.5rem] bg-slate-950 text-white p-6 md:p-7 grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: "Briefing masuk", value: "Otomatis" },
                { label: "Jadwal dokter", value: "Tersinkron" },
                { label: "Follow-up", value: "Terpantau" },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] uppercase tracking-wider text-white/50 font-black">{item.label}</p>
                  <p className="text-xl font-black mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
