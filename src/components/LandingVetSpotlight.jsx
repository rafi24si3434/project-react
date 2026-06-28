import React from "react";
import {
  Award,
  CalendarDays,
  HeartHandshake,
  Microscope,
  ShieldPlus,
  Star,
  Syringe,
} from "lucide-react";

const doctors = [
  {
    name: "drh. Nisa Putri",
    role: "Konsultasi umum & vaksinasi",
    schedule: "Senin - Jumat, 09.00 - 15.00",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=700&q=85",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    name: "drh. Aditya Ramadhan",
    role: "Bedah minor & sterilisasi",
    schedule: "Selasa - Sabtu, 10.00 - 16.00",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=700&q=85",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    name: "drh. Sari Putri",
    role: "Dermatologi & grooming medis",
    schedule: "Rabu - Minggu, 11.00 - 17.00",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=700&q=85",
    accent: "from-amber-500 to-orange-500",
  },
];

const services = [
  {
    icon: Syringe,
    title: "Vaksin & Booster",
    desc: "Reminder otomatis membantu pemilik tidak lupa jadwal vaksin berikutnya.",
  },
  {
    icon: Microscope,
    title: "Diagnosa Terarah",
    desc: "Keluhan, tindakan, dan resep masuk ke rekam medis digital pasien.",
  },
  {
    icon: ShieldPlus,
    title: "Perawatan Darurat",
    desc: "Kasus prioritas ditandai lebih jelas untuk staf klinik dan dokter.",
  },
];

export default function LandingVetSpotlight() {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 text-left border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-12">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-4 py-2 rounded-full">
              <HeartHandshake className="w-4 h-4" />
              Tim Dokter Hewan
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Kenalkan dokter, layanan, dan jadwal sebelum customer booking.
            </h2>
          </div>
          <p className="lg:col-span-5 text-sm md:text-base text-slate-500 font-medium leading-relaxed">
            Landing page sekarang tidak hanya menjual sistem CRM, tapi juga memberi rasa percaya:
            pemilik hewan tahu siapa dokter yang menangani dan layanan apa yang tersedia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {doctors.map((doctor) => (
            <article
              key={doctor.name}
              className="group overflow-hidden rounded-[2rem] bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent" />
                <div className="absolute left-5 right-5 bottom-5 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black tracking-tight">{doctor.name}</h3>
                      <p className="text-xs text-white/70 font-semibold mt-1">{doctor.role}</p>
                    </div>
                    <div className={`shrink-0 rounded-2xl bg-gradient-to-br ${doctor.accent} px-3 py-2 text-xs font-black flex items-center gap-1.5`}>
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {doctor.rating}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <CalendarDays className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-xs font-black text-slate-700">{doctor.schedule}</p>
                </div>
                <a
                  href="#simulator"
                  className="w-full flex items-center justify-center rounded-2xl bg-slate-950 hover:bg-emerald-600 text-white py-4 text-sm font-black transition-colors"
                >
                  Pilih jadwal dokter
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.title} className="rounded-2xl border border-slate-200 bg-white p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <service.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  {service.title}
                  <Award className="w-4 h-4 text-amber-500" />
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{service.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
