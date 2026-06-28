import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  HeartPulse,
  Stethoscope,
  Syringe,
  Thermometer,
} from "lucide-react";

const symptoms = [
  { id: "no-appetite", label: "Tidak mau makan", score: 2, service: "Konsultasi dokter", room: "Poli Umum" },
  { id: "vomit", label: "Muntah berulang", score: 3, service: "Pemeriksaan pencernaan", room: "Ruang Observasi" },
  { id: "skin", label: "Kulit merah atau gatal", score: 1, service: "Dermatologi", room: "Poli Kulit" },
  { id: "limp", label: "Pincang atau lemas", score: 2, service: "Pemeriksaan fisik", room: "Poli Umum" },
  { id: "breath", label: "Napas berat", score: 4, service: "Prioritas dokter", room: "Ruang Tindakan" },
  { id: "vaccine", label: "Jadwal vaksin dekat", score: 1, service: "Vaksinasi", room: "Poli Vaksin" },
];

function getPriority(score) {
  if (score >= 6) {
    return {
      title: "Kunjungan Prioritas",
      badge: "Butuh dokter segera",
      text: "Gejala yang dipilih mengarah ke kondisi yang sebaiknya diperiksa lebih cepat. Booking akan diarahkan ke antrean prioritas.",
      color: "rose",
      icon: AlertTriangle,
    };
  }

  if (score >= 3) {
    return {
      title: "Perlu Pemeriksaan",
      badge: "Rekomendasi konsultasi",
      text: "Kondisi perlu dicatat dan diperiksa dokter agar penyebabnya jelas sebelum diberi terapi lanjutan.",
      color: "amber",
      icon: Stethoscope,
    };
  }

  return {
    title: "Pantau Terjadwal",
    badge: "Aman untuk booking biasa",
    text: "Keluhan masih bisa dipantau, namun tetap bagus untuk dibuatkan catatan awal di portal customer.",
    color: "emerald",
    icon: ClipboardCheck,
  };
}

const colorClass = {
  rose: {
    icon: "bg-rose-50 text-rose-600 border-rose-100",
    pill: "bg-rose-50 text-rose-700 border-rose-100",
    bar: "bg-rose-500",
  },
  amber: {
    icon: "bg-amber-50 text-amber-600 border-amber-100",
    pill: "bg-amber-50 text-amber-700 border-amber-100",
    bar: "bg-amber-500",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600 border-emerald-100",
    pill: "bg-emerald-50 text-emerald-700 border-emerald-100",
    bar: "bg-emerald-500",
  },
};

export default function LandingSymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState(["no-appetite", "vaccine"]);

  const selectedData = useMemo(
    () => symptoms.filter((symptom) => selectedSymptoms.includes(symptom.id)),
    [selectedSymptoms]
  );

  const score = selectedData.reduce((total, symptom) => total + symptom.score, 0);
  const priority = getPriority(score);
  const PriorityIcon = priority.icon;
  const styles = colorClass[priority.color];
  const recommendedServices = [...new Set(selectedData.map((symptom) => symptom.service))].slice(0, 3);
  const roomTarget = [...new Set(selectedData.map((symptom) => symptom.room))][0] || "Poli Umum";
  const progressWidth = `${Math.min(100, Math.max(18, score * 13))}%`;

  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms((current) => {
      if (current.includes(symptomId)) {
        return current.filter((id) => id !== symptomId);
      }
      return [...current, symptomId];
    });
  };

  return (
    <section className="py-24 bg-[#f6fbfa] text-left border-y border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-5 mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-700 bg-white border border-emerald-100 px-4 py-2 rounded-full shadow-sm">
            <HeartPulse className="w-4 h-4" />
            Vet Triage Assistant
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Cek gejala ringan sebelum memilih jadwal dokter.
          </h2>
          <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed">
            Section ini dibuat seperti briefing klinik: pemilik memilih keluhan, sistem menyiapkan prioritas,
            ruang layanan, dan rekomendasi yang langsung mengarah ke booking.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-4 rounded-[2rem] bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="relative h-72">
              <img
                src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=900&q=85"
                alt="Dokter hewan memeriksa hewan peliharaan"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/82 via-slate-950/10 to-transparent" />
              <div className="absolute left-5 right-5 bottom-5 text-white">
                <p className="text-[10px] uppercase tracking-wider font-black text-white/60">Pasien hari ini</p>
                <h3 className="text-2xl font-black mt-1">Mochi</h3>
                <p className="text-xs text-white/75 font-semibold mt-1">Kucing persia, 2 tahun</p>
              </div>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3">
              {[
                { icon: Thermometer, label: "Suhu", value: "38.4 C" },
                { icon: Syringe, label: "Vaksin", value: "7 hari lagi" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                  <item.icon className="w-5 h-5 text-emerald-600" />
                  <p className="text-[10px] uppercase tracking-wider font-black text-slate-400 mt-3">{item.label}</p>
                  <p className="text-sm font-black text-slate-900 mt-1">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-4 rounded-[2rem] bg-white border border-slate-200 shadow-sm p-5 md:p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-lg font-black text-slate-950">Keluhan utama</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Pilih satu atau beberapa gejala</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
              {symptoms.map((symptom) => {
                const isSelected = selectedSymptoms.includes(symptom.id);
                return (
                  <button
                    key={symptom.id}
                    type="button"
                    onClick={() => toggleSymptom(symptom.id)}
                    className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                      isSelected
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/50"
                    }`}
                  >
                    <span className="text-xs font-black">{symptom.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="xl:col-span-4 rounded-[2rem] bg-slate-950 text-white shadow-2xl p-5 md:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${styles.icon}`}>
                  <PriorityIcon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border ${styles.pill}`}>
                  {priority.badge}
                </span>
              </div>

              <p className="text-[10px] uppercase tracking-wider text-white/50 font-black mt-6">Briefing dokter</p>
              <h3 className="text-2xl font-black mt-2">{priority.title}</h3>
              <p className="text-sm text-white/70 font-medium leading-relaxed mt-4">{priority.text}</p>

              <div className="mt-6">
                <div className="flex justify-between text-[10px] uppercase tracking-wider font-black text-white/50 mb-2">
                  <span>Skor prioritas</span>
                  <span>{score}/10</span>
                </div>
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div className={`h-full rounded-full ${styles.bar}`} style={{ width: progressWidth }} />
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-[10px] uppercase tracking-wider text-white/50 font-black mb-3">Disiapkan untuk</p>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-black">{roomTarget}</p>
                    <p className="text-xs text-white/60 font-medium mt-1">Estimasi briefing masuk CRM</p>
                  </div>
                  <CalendarClock className="w-5 h-5 text-emerald-300 shrink-0" />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {(recommendedServices.length ? recommendedServices : ["Konsultasi dokter"]).map((service) => (
                <div key={service} className="flex items-center gap-2 text-xs font-bold text-white/80">
                  <span className="w-2 h-2 rounded-full bg-emerald-300" />
                  {service}
                </div>
              ))}
              <a
                href="#simulator"
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 px-5 py-4 text-sm font-black text-white transition-all"
              >
                Lanjut booking dokter
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
