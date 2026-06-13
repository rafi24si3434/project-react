import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Calendar,
  FileText,
  HeartPulse,
  PawPrint,
  ShieldCheck,
  UserCircle,
  Weight,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "../lib/supabase";

const cityOptions = [
  "Jakarta Selatan",
  "Bandung",
  "Surabaya",
  "Jakarta Barat",
  "Depok",
  "Tangerang",
  "Bogor",
  "Bekasi",
];

const addressOptions = [
  "Jl. Mawar No. 12, Kebayoran Baru",
  "Jl. Anggrek Timur No. 8, Dago",
  "Jl. Kencana Indah No. 14, Pakuwon",
  "Jl. Tanjung Asri No. 5, Kebon Jeruk",
  "Jl. Danau Raya No. 17, Margonda",
  "Jl. Teratai No. 10, Gading Serpong",
  "Jl. Wijaya Kusuma No. 21, Baranangsiang",
  "Jl. Merpati Putih No. 6, Bekasi Selatan",
];

const dietPlans = [
  "Dry food premium dengan tambahan wet food malam hari.",
  "Diet maintenance dengan kontrol kalori ringan.",
  "Diet tinggi protein untuk menjaga massa otot.",
  "Pakan khusus kulit sensitif dan omega 3.",
];

const allergyNotes = [
  "Tidak ada alergi yang dilaporkan.",
  "Sensitif terhadap pergantian pakan mendadak.",
  "Perlu observasi pada camilan berbahan ayam.",
  "Riwayat gatal ringan saat musim hujan.",
];

const doctorNames = [
  "drh. Nisa Putri",
  "drh. Aditya Ramadhan",
  "drh. Citra Maharani",
  "drh. Farhan Akbar",
];

const serviceCatalog = {
  Dog: ["Pemeriksaan umum", "Vaksin tahunan", "Kontrol sendi"],
  Cat: ["Checkup rutin", "Booster vaksin", "Perawatan kulit"],
  Rabbit: ["Konsultasi nutrisi", "Pemeriksaan gigi", "General checkup"],
  Bird: ["Pemeriksaan bulu", "Vitamin dan suplemen", "Kontrol pernapasan"],
  Hamster: ["Checkup mingguan", "Konsultasi kandang", "Pemeriksaan berat badan"],
};

const amountCatalog = {
  Dog: [250000, 325000, 275000],
  Cat: [200000, 275000, 225000],
  Rabbit: [180000, 220000, 200000],
  Bird: [170000, 210000, 190000],
  Hamster: [120000, 150000, 135000],
  default: [160000, 200000, 180000],
};

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/(^\.|\.$)/g, "");
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getPetEmoji(type) {
  switch (type) {
    case "Dog":
      return "🐶";
    case "Cat":
      return "🐱";
    case "Rabbit":
      return "🐰";
    case "Bird":
      return "🦜";
    case "Hamster":
      return "🐹";
    default:
      return "🐾";
  }
}

function buildPetProfile(pet) {
  const age = pet.birth_date ? new Date().getFullYear() - new Date(pet.birth_date).getFullYear() : 0;
  const petCode = `PET-${String(pet.id).slice(0, 6).toUpperCase()}`;
  const ownerPhone = pet.owner?.phone_number || "—";
  const ownerEmail = pet.owner?.email || "—";
  const healthStatus = "Healthy";
  const vaccinationStatus = "Lengkap";
  const sterilizationStatus = "Sudah steril";
  const nextCheckup = "12 Juni 2026";
  const weight = pet.weight ? `${pet.weight} kg` : "—";
  const services = serviceCatalog[pet.type] || ["General checkup", "Kontrol rutin", "Perawatan lanjutan"];
  const amounts = amountCatalog[pet.type] || amountCatalog.default;
  const visits = [0, 1, 2].map((visitIndex) => ({
    id: `${petCode}-VIS-${visitIndex + 1}`,
    date: `${28 - visitIndex * 8} Mei 2026`,
    service: services[visitIndex % services.length],
    doctor: doctorNames[visitIndex % doctorNames.length],
    status: visitIndex === 0 ? "Selesai" : visitIndex === 1 ? "Kontrol" : "Jadwal ulang",
    total: formatCurrency(amounts[visitIndex % amounts.length]),
    amount: amounts[visitIndex % amounts.length],
  }));
  const totalSpend = visits.reduce((sum, visit) => sum + visit.amount, 0);
  const careScoreData = [
    { name: "Vaksin", total: 96 },
    { name: "Nutrisi", total: 85 },
    { name: "Aktivitas", total: 80 },
    { name: "Grooming", total: 88 },
  ];

  return {
    ...pet,
    age,
    petCode,
    petEmoji: getPetEmoji(pet.type),
    city: pet.owner?.city || "—",
    address: pet.owner?.address || "—",
    birthDate: pet.birth_date || "—",
    owner: pet.owner?.full_name || "—",
    ownerPhone,
    ownerEmail,
    healthStatus,
    vaccinationStatus,
    sterilizationStatus,
    nextCheckup,
    weight,
    microchipId: pet.microchip || "—",
    dietPlan: "Dry food premium dengan tambahan wet food malam hari.",
    allergyNote: pet.health_notes || "Tidak ada alergi yang dilaporkan.",
    adminNote: "Pasien cukup kooperatif saat pemeriksaan.",
    visitHistory: visits,
    totalSpend,
    careScoreData,
  };
}

function HeroStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">{label}</p>
      <p className="mt-2 text-xl font-extrabold text-white">{value}</p>
    </div>
  );
}

function SectionCard({ icon: Icon, title, subtitle, iconClassName = "", children }) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-50 ${iconClassName}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-800">{title}</h2>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="grid gap-2 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 md:grid-cols-[180px_minmax(0,1fr)] md:items-start">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm font-semibold leading-relaxed text-gray-800">{value}</p>
    </div>
  );
}

export default function PetsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("pets")
          .select("*, owner:users(*)")
          .eq("id", id)
          .single();

        if (error) throw error;
        setPet(data);
      } catch (err) {
        console.error("Error loading pet details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const petProfile = useMemo(() => (pet ? buildPetProfile(pet) : null), [pet]);

  const visitSpendData = useMemo(() => {
    if (!petProfile) return [];
    return petProfile.visitHistory.map((visit, index) => ({
      name: `Visit ${index + 1}`,
      total: visit.amount,
    }));
  }, [petProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!petProfile) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Pet Tidak Ditemukan</h1>
        <button
          onClick={() => navigate("/pets")}
          className="mt-5 rounded-xl bg-emerald-500 px-5 py-2 text-white"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/pets")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pet Detail</h1>
            <p className="text-sm text-gray-400">
              Informasi lengkap pasien hewan dan owner untuk kebutuhan klinik
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            {petProfile.healthStatus}
          </span>
          <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            {petProfile.vaccinationStatus}
          </span>
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-xl">
        <div className="grid xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="border-b border-white/10 p-8 xl:border-b-0 xl:border-r">
            <div className="flex flex-col items-center text-center xl:items-start xl:text-left">
              <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-white/20 bg-white/15 text-6xl shadow-lg backdrop-blur-sm">
                {petProfile.petEmoji}
              </div>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white">
                {petProfile.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-emerald-100">
                {petProfile.breed} | {petProfile.petCode}
              </p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
                Pasien milik {petProfile.owner} dengan kontrol berikutnya pada {petProfile.nextCheckup}.
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white/90">
                <PawPrint className="h-4 w-4 text-emerald-200" />
                <span className="text-sm font-semibold">{petProfile.type}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white/90">
                <Weight className="h-4 w-4 text-sky-200" />
                <span className="text-sm font-semibold">{petProfile.weight}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white/90">
                <Calendar className="h-4 w-4 text-violet-200" />
                <span className="text-sm font-semibold">{petProfile.birthDate}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <HeroStat label="Umur" value={`${petProfile.age} Tahun`} />
              <HeroStat label="Total kunjungan" value={`${petProfile.visitHistory.length}x`} />
              <HeroStat label="Total transaksi" value={formatCurrency(petProfile.totalSpend)} />
              <HeroStat label="Checkup berikutnya" value={petProfile.nextCheckup} />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <div>
                  <h3 className="text-sm font-bold text-white">Grafik Nilai Kunjungan</h3>
                  <p className="text-xs text-white/70">Nominal pembayaran dari riwayat kunjungan pet</p>
                </div>
                <div className="mt-4 h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visitSpendData} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.75)" fontSize={12} />
                      <YAxis
                        stroke="rgba(255,255,255,0.75)"
                        fontSize={12}
                        tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                      />
                      <Tooltip
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{
                          borderRadius: 16,
                          border: "1px solid rgba(255,255,255,0.15)",
                          backgroundColor: "rgba(15, 23, 42, 0.92)",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="total" fill="#d1fae5" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <div>
                  <h3 className="text-sm font-bold text-white">Skor Perawatan</h3>
                  <p className="text-xs text-white/70">Ringkasan kondisi vaksin, nutrisi, aktivitas, dan grooming</p>
                </div>
                <div className="mt-4 h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={petProfile.careScoreData} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.75)" fontSize={12} />
                      <YAxis stroke="rgba(255,255,255,0.75)" fontSize={12} domain={[0, 100]} />
                      <Tooltip
                        formatter={(value) => `${value}%`}
                        contentStyle={{
                          borderRadius: 16,
                          border: "1px solid rgba(255,255,255,0.15)",
                          backgroundColor: "rgba(15, 23, 42, 0.92)",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="total" fill="#bfdbfe" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <SectionCard
          icon={PawPrint}
          title="Data Identitas Pet"
          subtitle="Profil dasar pasien hewan yang terdaftar di sistem"
          iconClassName="text-emerald-600"
        >
          <div className="grid gap-3">
            <DataRow label="ID pet" value={petProfile.petCode} />
            <DataRow label="Nama pet" value={petProfile.name} />
            <DataRow label="Jenis hewan" value={petProfile.type} />
            <DataRow label="Ras / breed" value={petProfile.breed} />
            <DataRow label="Umur" value={`${petProfile.age} Tahun`} />
            <DataRow label="Gender" value={petProfile.gender} />
            <DataRow label="Tanggal lahir" value={petProfile.birthDate} />
            <DataRow label="Berat badan" value={petProfile.weight} />
            <DataRow label="Microchip ID" value={petProfile.microchipId} />
          </div>
        </SectionCard>

        <SectionCard
          icon={UserCircle}
          title="Owner Information"
          subtitle="Kontak pemilik dan alamat yang terkait dengan pasien"
          iconClassName="text-blue-600"
        >
          <div className="grid gap-3">
            <DataRow label="Nama pemilik" value={petProfile.owner} />
            <DataRow label="Nomor HP" value={petProfile.ownerPhone} />
            <DataRow label="Email" value={petProfile.ownerEmail} />
            <DataRow label="Alamat" value={petProfile.address} />
            <DataRow label="Kota" value={petProfile.city} />
          </div>
        </SectionCard>

        <SectionCard
          icon={HeartPulse}
          title="Medical Summary"
          subtitle="Ringkasan kondisi medis, vaksin, dan catatan klinis"
          iconClassName="text-rose-600"
        >
          <div className="grid gap-3">
            <DataRow label="Status kesehatan" value={petProfile.healthStatus} />
            <DataRow label="Status vaksinasi" value={petProfile.vaccinationStatus} />
            <DataRow label="Status steril" value={petProfile.sterilizationStatus} />
            <DataRow label="Alergi / catatan sensitif" value={petProfile.allergyNote} />
            <DataRow label="Pola diet" value={petProfile.dietPlan} />
            <DataRow label="Catatan admin" value={petProfile.adminNote} />
          </div>
        </SectionCard>

        <SectionCard
          icon={Activity}
          title="Monitoring Care"
          subtitle="Ringkasan aktivitas kontrol dan reminder lanjutan"
          iconClassName="text-violet-600"
        >
          <div className="grid gap-3">
            <DataRow label="Kontrol berikutnya" value={petProfile.nextCheckup} />
            <DataRow label="Aktivitas terakhir" value={petProfile.visitHistory[0]?.service || "Belum ada"} />
            <DataRow label="Jumlah kunjungan" value={`${petProfile.visitHistory.length} kunjungan`} />
            <DataRow label="Total transaksi" value={formatCurrency(petProfile.totalSpend)} />
          </div>

          <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-violet-600" />
              <h3 className="text-sm font-bold text-violet-900">Reminder Klinik</h3>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-violet-900">
              Jadwalkan follow up pada {petProfile.nextCheckup} dan pastikan owner menerima reminder
              otomatis untuk {petProfile.vaccinationStatus.toLowerCase()}.
            </p>
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard
          icon={FileText}
          title="Riwayat Kunjungan Pet"
          subtitle="Tabel perawatan, dokter yang menangani, status, dan biaya kunjungan"
          iconClassName="text-emerald-600"
        >
          <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <DataRow label="Total transaksi" value={formatCurrency(petProfile.totalSpend)} />
            <DataRow label="Kunjungan terakhir" value={petProfile.visitHistory[0]?.date || "-"} />
            <DataRow label="Layanan terakhir" value={petProfile.visitHistory[0]?.service || "-"} />
            <DataRow label="Dokter terakhir" value={petProfile.visitHistory[0]?.doctor || "-"} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    ID Visit
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Tanggal
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Layanan
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Dokter
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Biaya
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {petProfile.visitHistory.map((visit) => (
                  <TableRow key={visit.id} className="hover:bg-emerald-50/30">
                    <TableCell className="font-semibold text-gray-700">{visit.id}</TableCell>
                    <TableCell className="text-gray-600">{visit.date}</TableCell>
                    <TableCell className="font-semibold text-gray-800">{visit.service}</TableCell>
                    <TableCell className="text-gray-600">{visit.doctor}</TableCell>
                    <TableCell>
                      <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                        {visit.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-600">{visit.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
