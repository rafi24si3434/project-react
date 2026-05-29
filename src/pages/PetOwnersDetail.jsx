import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  BadgeCheck,
  FileText,
  Mail,
  MapPin,
  PawPrint,
  Pencil,
  Phone,
  ShieldCheck,
  Star,
  Trash2,
  UserCircle,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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

import owners from "../data/PetOwners";
import petsData from "../data/Pets";

const petTypeFallback = ["Dog", "Cat", "Rabbit", "Bird", "Hamster"];
const services = [
  "Pemeriksaan umum",
  "Vaksin rutin",
  "Kontrol pasca tindakan",
  "Konsultasi nutrisi",
  "Perawatan kulit dan bulu",
  "Grooming medis",
];
const doctorNames = [
  "drh. Nisa Putri",
  "drh. Aditya Ramadhan",
  "drh. Citra Maharani",
  "drh. Farhan Akbar",
];

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

function getPetTypeBadge(type) {
  switch (type) {
    case "Dog":
      return "border-blue-100 bg-blue-50 text-blue-700";
    case "Cat":
      return "border-emerald-100 bg-emerald-50 text-emerald-700";
    case "Rabbit":
      return "border-amber-100 bg-amber-50 text-amber-700";
    case "Bird":
      return "border-violet-100 bg-violet-50 text-violet-700";
    case "Hamster":
      return "border-rose-100 bg-rose-50 text-rose-700";
    default:
      return "border-gray-100 bg-gray-50 text-gray-700";
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompact(value) {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function buildOwnerDetail(owner) {
  const city = owner.address.split(" ").slice(-1)[0];
  const petCount = owner.pets.length || 1;
  const baseVisits = Math.floor(owner.totalVisits / petCount);
  const visitRemainder = owner.totalVisits % petCount;
  const spendPerType = {
    Dog: 285000,
    Cat: 230000,
    Rabbit: 190000,
    Bird: 175000,
    Hamster: 145000,
  };

  const registeredPets = owner.pets.map((petName, index) => {
    const matchedPet = petsData.find((pet) => pet.name === petName);
    const type = matchedPet?.type || petTypeFallback[index % petTypeFallback.length];
    const breed = matchedPet?.breed || "Mixed Breed";
    const age = matchedPet?.age || index + 2;
    const gender = matchedPet?.gender || (index % 2 === 0 ? "Male" : "Female");
    const visits = baseVisits + (index < visitRemainder ? 1 : 0);
    const lastVisit = `${26 - index * 3} Mei 2026`;
    const nextVisit = `${8 + index * 2} Juni 2026`;
    const lastService = services[(owner.id + index) % services.length];
    const doctor = doctorNames[(owner.id + index) % doctorNames.length];
    const healthStatus =
      index % 3 === 0 ? "Aktif" : index % 3 === 1 ? "Perlu Kontrol" : "Observasi";
    const totalSpend = visits * (spendPerType[type] || 200000);

    return {
      id: `${owner.id}-${index + 1}`,
      name: petName,
      type,
      breed,
      age,
      gender,
      visits,
      lastVisit,
      nextVisit,
      lastService,
      doctor,
      healthStatus,
      totalSpend,
      emoji: getPetEmoji(type),
    };
  });

  const totalSpend = registeredPets.reduce((sum, pet) => sum + pet.totalSpend, 0);
  const memberTier =
    owner.totalVisits >= 14 ? "Platinum" : owner.totalVisits >= 10 ? "Gold" : owner.totalVisits >= 6 ? "Silver" : "Basic";
  const satisfactionScore = Math.min(98, 78 + owner.pets.length * 4 + (owner.totalVisits % 7));

  const monthlyTrend = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"].map((month, index) => ({
    month,
    visits: Math.max(1, Math.round(owner.totalVisits * (0.11 + ((owner.id + index) % 4) * 0.04))),
  }));

  const petVisitData = registeredPets.map((pet) => ({
    name: pet.name,
    visits: pet.visits,
  }));

  const timeline = registeredPets.map((pet, index) => ({
    id: `VIS-${owner.id}${index + 1}`,
    petName: pet.name,
    type: pet.type,
    date: pet.lastVisit,
    service: pet.lastService,
    doctor: pet.doctor,
    status: pet.healthStatus,
    total: formatCurrency(pet.totalSpend / Math.max(1, pet.visits)),
  }));

  return {
    ...owner,
    city,
    memberTier,
    totalSpend,
    satisfactionScore,
    registeredPets,
    monthlyTrend,
    petVisitData,
    timeline,
    ownerStatus: owner.totalVisits >= 10 ? "Owner Prioritas" : "Owner Aktif",
    nextFollowUp: registeredPets[0]?.nextVisit || "Belum dijadwalkan",
    latestVisit: registeredPets[0]?.lastVisit || owner.since,
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
    <div className="grid gap-2 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 md:grid-cols-[170px_minmax(0,1fr)] md:items-start">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm font-semibold leading-relaxed text-gray-800">{value}</p>
    </div>
  );
}

export default function PetOwnersDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const owner = owners.find((item) => item.id === Number(id));
  const ownerDetail = useMemo(() => (owner ? buildOwnerDetail(owner) : null), [owner]);

  if (!ownerDetail) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Owner Tidak Ditemukan</h1>
        <button
          onClick={() => navigate("/pet-owners")}
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
            onClick={() => navigate("/pet-owners")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pet Owner Detail</h1>
            <p className="text-sm text-gray-400">
              Tampilan lengkap owner, daftar pet, dan aktivitas kunjungan klinik
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600">
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600">
            <Trash2 className="h-4 w-4" />
            Hapus
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-xl">
        <div className="grid xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="border-b border-white/10 p-8 xl:border-b-0 xl:border-r">
            <div className="flex flex-col items-center text-center xl:items-start xl:text-left">
              <div
                className={`flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-white/20 bg-white text-4xl font-extrabold shadow-lg ${ownerDetail.avatarBg}`}
              >
                {ownerDetail.avatar}
              </div>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white">
                {ownerDetail.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-emerald-100">{ownerDetail.ownerStatus}</p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
                Owner terdaftar sejak {ownerDetail.since} dengan total {ownerDetail.totalVisits} kunjungan
                dan follow up berikutnya pada {ownerDetail.nextFollowUp}.
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white/90">
                <Phone className="h-4 w-4 text-emerald-200" />
                <span className="text-sm font-semibold">{ownerDetail.phone}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white/90">
                <Mail className="h-4 w-4 text-sky-200" />
                <span className="text-sm font-semibold">{ownerDetail.email}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white/90">
                <MapPin className="h-4 w-4 text-violet-200" />
                <span className="text-sm font-semibold">{ownerDetail.city}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <HeroStat label="Total pets" value={`${ownerDetail.registeredPets.length} ekor`} />
              <HeroStat label="Total kunjungan" value={`${ownerDetail.totalVisits}x`} />
              <HeroStat label="Membership" value={ownerDetail.memberTier} />
              <HeroStat label="Total transaksi" value={formatCurrency(ownerDetail.totalSpend)} />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <div>
                  <h3 className="text-sm font-bold text-white">Tren Kunjungan 6 Bulan</h3>
                  <p className="text-xs text-white/70">Pergerakan aktivitas owner di klinik hewan</p>
                </div>
                <div className="mt-4 h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ownerDetail.monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.75)" fontSize={12} />
                      <YAxis stroke="rgba(255,255,255,0.75)" fontSize={12} />
                      <Tooltip
                        formatter={(value) => `${value} kunjungan`}
                        contentStyle={{
                          borderRadius: 16,
                          border: "1px solid rgba(255,255,255,0.15)",
                          backgroundColor: "rgba(15, 23, 42, 0.92)",
                          color: "#fff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="visits"
                        stroke="#d1fae5"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#d1fae5" }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <div>
                  <h3 className="text-sm font-bold text-white">Distribusi Kunjungan per Pet</h3>
                  <p className="text-xs text-white/70">Pet yang paling aktif datang ke klinik</p>
                </div>
                <div className="mt-4 h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ownerDetail.petVisitData} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.16)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.75)" fontSize={12} />
                      <YAxis stroke="rgba(255,255,255,0.75)" fontSize={12} />
                      <Tooltip
                        formatter={(value) => `${value} kunjungan`}
                        contentStyle={{
                          borderRadius: 16,
                          border: "1px solid rgba(255,255,255,0.15)",
                          backgroundColor: "rgba(15, 23, 42, 0.92)",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="visits" fill="#bfdbfe" radius={[10, 10, 0, 0]} />
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
          icon={UserCircle}
          title="Informasi Owner"
          subtitle="Identitas dan kontak utama pemilik hewan"
          iconClassName="text-emerald-600"
        >
          <div className="grid gap-3">
            <DataRow label="Nama lengkap" value={ownerDetail.name} />
            <DataRow label="Nomor telepon" value={ownerDetail.phone} />
            <DataRow label="Email" value={ownerDetail.email} />
            <DataRow label="Alamat" value={ownerDetail.address} />
            <DataRow label="Kota" value={ownerDetail.city} />
            <DataRow label="Member sejak" value={ownerDetail.since} />
          </div>
        </SectionCard>

        <SectionCard
          icon={ShieldCheck}
          title="Ringkasan CRM Owner"
          subtitle="Status membership, kepuasan layanan, dan reminder kontrol"
          iconClassName="text-violet-600"
        >
          <div className="grid gap-3">
            <DataRow label="Tier membership" value={ownerDetail.memberTier} />
            <DataRow label="Status owner" value={ownerDetail.ownerStatus} />
            <DataRow label="Skor kepuasan" value={`${ownerDetail.satisfactionScore}/100`} />
            <DataRow label="Kunjungan terakhir" value={ownerDetail.latestVisit} />
            <DataRow label="Follow up berikutnya" value={ownerDetail.nextFollowUp} />
          </div>

          <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-violet-600" />
              <h3 className="text-sm font-bold text-violet-900">Catatan Layanan</h3>
            </div>
            <p className="text-sm font-semibold leading-relaxed text-violet-900">
              Owner ini memiliki {ownerDetail.registeredPets.length} pet terdaftar dengan total{" "}
              {ownerDetail.totalVisits} kunjungan. Prioritaskan reminder kontrol pada tanggal{" "}
              {ownerDetail.nextFollowUp} untuk menjaga retensi dan kualitas layanan.
            </p>
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard
          icon={PawPrint}
          title="Registered Pets"
          subtitle="Daftar hewan milik owner beserta status dan aktivitas terbarunya"
          iconClassName="text-blue-600"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ownerDetail.registeredPets.map((pet) => (
              <div
                key={pet.id}
                className="rounded-3xl border border-gray-100 bg-gray-50/70 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
                    {pet.emoji}
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${getPetTypeBadge(
                      pet.type
                    )}`}
                  >
                    {pet.type}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800">{pet.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{pet.breed}</p>
                </div>

                <div className="mt-4 grid gap-2">
                  <DataRow label="Umur" value={`${pet.age} Tahun`} />
                  <DataRow label="Gender" value={pet.gender} />
                  <DataRow label="Total visit" value={`${pet.visits} kunjungan`} />
                  <DataRow label="Layanan terakhir" value={pet.lastService} />
                  <DataRow label="Status" value={pet.healthStatus} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="mt-6">
        <SectionCard
          icon={FileText}
          title="Riwayat Aktivitas Owner"
          subtitle="Tabel layanan terakhir dari seluruh pet yang dimiliki owner"
          iconClassName="text-emerald-600"
        >
          <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <DataRow label="Total transaksi" value={formatCurrency(ownerDetail.totalSpend)} />
            <DataRow label="Rata-rata per pet" value={formatCurrency(ownerDetail.totalSpend / ownerDetail.registeredPets.length)} />
            <DataRow label="Total pets" value={`${ownerDetail.registeredPets.length} ekor`} />
            <DataRow label="Kunjungan aktif" value={`${ownerDetail.totalVisits} kunjungan`} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    ID Visit
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Pet
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
                {ownerDetail.timeline.map((visit) => (
                  <TableRow key={visit.id} className="hover:bg-emerald-50/30">
                    <TableCell className="font-semibold text-gray-700">{visit.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-800">{visit.petName}</p>
                        <p className="text-xs text-gray-400">{visit.type}</p>
                      </div>
                    </TableCell>
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

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <SectionCard
          icon={Activity}
          title="Insight Aktivitas"
          subtitle="Ringkasan perilaku kunjungan owner di klinik"
          iconClassName="text-amber-600"
        >
          <div className="grid gap-3">
            <DataRow label="Rata-rata kunjungan" value={`${(ownerDetail.totalVisits / ownerDetail.registeredPets.length).toFixed(1)} per pet`} />
            <DataRow label="Pet paling aktif" value={ownerDetail.petVisitData.sort((a, b) => b.visits - a.visits)[0]?.name || "-"} />
            <DataRow label="Nominal ringkas" value={formatCompact(ownerDetail.totalSpend)} />
          </div>
        </SectionCard>

        <SectionCard
          icon={Star}
          title="Rekomendasi Follow Up"
          subtitle="Aksi yang bisa dilakukan admin atau dokter berikutnya"
          iconClassName="text-rose-600"
        >
          <div className="grid gap-3">
            <DataRow label="Prioritas" value="Hubungi owner untuk reminder kontrol terdekat." />
            <DataRow label="Saran layanan" value="Tawarkan paket checkup berkala untuk seluruh pet terdaftar." />
            <DataRow label="Catatan" value={`Owner berada di tier ${ownerDetail.memberTier} dengan status ${ownerDetail.ownerStatus}.`} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
