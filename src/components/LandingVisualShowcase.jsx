import React from "react";
import { Camera, HeartPulse, MapPin, ShieldCheck, Sparkles } from "lucide-react";

const galleryItems = [
  {
    title: "Pemeriksaan Dokter",
    label: "Vet Care",
    image:
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=85",
    alt: "Dokter hewan memeriksa anjing di klinik",
    className: "md:col-span-2 md:row-span-2 min-h-[360px]",
  },
  {
    title: "Ruang Klinik Bersih",
    label: "Sterile Room",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=700&q=85",
    alt: "Ruang klinik modern yang bersih",
    className: "min-h-[230px]",
  },
  {
    title: "Grooming & Perawatan",
    label: "Pet Spa",
    image:
      "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=700&q=85",
    alt: "Hewan peliharaan mendapatkan perawatan grooming",
    className: "min-h-[230px]",
  },
  {
    title: "Portal Member",
    label: "Customer CRM",
    image:
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=700&q=85",
    alt: "Anjing sehat bersama pemiliknya",
    className: "min-h-[230px]",
  },
  {
    title: "Cat Friendly Care",
    label: "Gentle Handling",
    image:
      "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=700&q=85",
    alt: "Kucing tenang saat dirawat",
    className: "min-h-[230px]",
  },
];

const proofItems = [
  { icon: HeartPulse, title: "Ramah Anabul", desc: "Alur pemeriksaan dibuat tenang dari check-in sampai pulang." },
  { icon: ShieldCheck, title: "Data Aman", desc: "Rekam medis dan transaksi pelanggan tersimpan terpusat." },
  { icon: MapPin, title: "Klinik Terpantau", desc: "Admin, dokter, dan customer melihat jadwal yang sama." },
];

export default function LandingVisualShowcase() {
  return (
    <section className="py-24 bg-white border-y border-slate-100 text-left">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end mb-12">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full">
              <Camera className="w-4 h-4" />
              Klinik & Anabul Nyata
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Tampilan klinik terasa hidup, bukan cuma dashboard.
            </h2>
          </div>
          <p className="lg:col-span-5 text-sm md:text-base text-slate-500 font-medium leading-relaxed">
            Landing page sekarang memberi kesan klinik hewan modern: ada visual pemeriksaan,
            ruang klinik, grooming, dan kedekatan pemilik dengan hewan peliharaannya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr">
          {galleryItems.map((item) => (
            <figure
              key={item.title}
              className={`group relative overflow-hidden rounded-[1.75rem] bg-slate-100 shadow-sm ${item.className}`}
            >
              <img
                src={item.image}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                  <Sparkles className="w-3 h-3" />
                  {item.label}
                </span>
                <h3 className="mt-3 text-lg font-black tracking-tight">{item.title}</h3>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {proofItems.map((item) => (
            <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              <div className="w-11 h-11 rounded-xl bg-white text-emerald-600 flex items-center justify-center shadow-sm shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800">{item.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
