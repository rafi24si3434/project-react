import { useState, useEffect, useMemo } from "react";
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

import { supabase } from "../lib/supabase";
import HeroStat from "../components/HeroStat";
import SectionCard from "../components/SectionCard";
import DataRow from "../components/DataRow";

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



export default function PetOwnersDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ownerDetail, setOwnerDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const fetchOwnerDetails = async () => {
      setIsLoading(true);
      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .or(`id.eq.${id},auth_user_id.eq.${id}`)
          .maybeSingle();

        if (userError) throw userError;
        if (!userData) {
          setOwnerDetail(null);
          return;
        }

        const { data: petsData } = await supabase
          .from("pets")
          .select("*")
          .eq("owner_id", userData.auth_user_id);

        const { data: appointmentsData } = await supabase
          .from("appointments")
          .select("*")
          .eq("owner_id", userData.auth_user_id)
          .order("date", { ascending: false });

        const { data: ordersData } = await supabase
          .from("orders")
          .select("*")
          .eq("customer_id", userData.auth_user_id)
          .order("created_at", { ascending: false });

        const { data: medicalRecordsData } = await supabase
          .from("medical_records")
          .select("*")
          .eq("owner_id", userData.auth_user_id)
          .order("date", { ascending: false });

        const colors = [
          "bg-emerald-100 text-emerald-700",
          "bg-blue-100 text-blue-700",
          "bg-pink-100 text-pink-700",
          "bg-yellow-100 text-yellow-700",
          "bg-purple-100 text-purple-700",
          "bg-indigo-100 text-indigo-700",
          "bg-red-100 text-red-700",
          "bg-teal-100 text-teal-700",
          "bg-orange-100 text-orange-700",
          "bg-cyan-100 text-cyan-700",
        ];

        const getInitials = (name) => {
          if (!name) return "US";
          return name
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
        };

        const totalSpend = ordersData
          ? ordersData
              .filter(o => ["Paid", "Completed", "Processing"].includes(o.status))
              .reduce((sum, o) => sum + Number(o.total_amount || 0), 0)
          : 0;

        const registeredPets = (petsData || []).map((pet) => {
          const petVisits = appointmentsData ? appointmentsData.filter((a) => a.pet_id === pet.id) : [];
          
          let lastVisit = "Belum pernah";
          let nextVisit = "Belum dijadwalkan";
          let lastService = "-";
          let doctor = "-";

          const pastVisits = petVisits.filter(a => new Date(a.date) <= new Date());
          if (pastVisits.length > 0) {
            lastVisit = new Date(pastVisits[0].date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric"
            });
            lastService = pastVisits[0].type;
            doctor = pastVisits[0].doctor || "-";
          }

          const futureVisits = petVisits.filter(a => new Date(a.date) > new Date() && ["Pending", "Confirmed"].includes(a.status));
          if (futureVisits.length > 0) {
            nextVisit = new Date(futureVisits[0].date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric"
            });
          }

          let age = "-";
          if (pet.birth_date) {
            const birthYear = new Date(pet.birth_date).getFullYear();
            const currentYear = new Date().getFullYear();
            age = currentYear - birthYear;
          }

          return {
            id: pet.id,
            name: pet.name,
            type: pet.type,
            breed: pet.breed || "Mixed Breed",
            age: age,
            gender: pet.gender || "-",
            visits: petVisits.length,
            lastVisit,
            nextVisit,
            lastService,
            doctor,
            healthStatus: pet.health_notes || "Sehat",
            totalSpend: petVisits.length * 150000,
            emoji: getPetEmoji(pet.type),
          };
        });

        const sinceDate = userData.created_at
          ? new Date(userData.created_at).toLocaleDateString("id-ID", { month: "short", year: "numeric" })
          : "Baru";

        const timeline = (appointmentsData || []).map((app) => {
          const matchedPet = (petsData || []).find((p) => p.id === app.pet_id);
          return {
            id: `APT-${app.id.substring(0, 5).toUpperCase()}`,
            petName: matchedPet?.name || "Hewan",
            type: matchedPet?.type || "🐾",
            date: new Date(app.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric"
            }),
            service: app.type,
            doctor: app.doctor || "-",
            status: app.status === "Completed" ? "Selesai" : app.status === "Confirmed" ? "Terkonfirmasi" : app.status === "Cancelled" ? "Dibatalkan" : "Menunggu",
            total: formatCurrency(150000),
          };
        });

        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"];
        const monthlyTrend = months.map((m, idx) => {
          const count = (appointmentsData || []).filter(a => {
            const date = new Date(a.date);
            return date.getMonth() === (new Date().getMonth() - 5 + idx + 12) % 12;
          }).length;
          return {
            month: m,
            visits: Math.max(0, count)
          };
        });

        const petVisitData = registeredPets.map((pet) => ({
          name: pet.name,
          visits: pet.visits,
        }));

        const satisfactionScore = 85 + (registeredPets.length * 3) + Math.min(5, appointmentsData?.length || 0);

        setOwnerDetail({
          id: userData.id,
          auth_user_id: userData.auth_user_id,
          name: userData.full_name,
          phone: userData.phone_number || "-",
          email: userData.email,
          address: userData.address || "Pekanbaru",
          city: "Pekanbaru",
          since: sinceDate,
          avatar: getInitials(userData.full_name),
          avatarBg: colors[Math.abs(userData.full_name.charCodeAt(0) || 0) % colors.length],
          memberTier: (appointmentsData?.length || 0) >= 10 ? "Platinum" : (appointmentsData?.length || 0) >= 5 ? "Gold" : "Silver",
          totalSpend,
          satisfactionScore,
          registeredPets,
          monthlyTrend,
          petVisitData,
          timeline,
          ownerStatus: (appointmentsData?.length || 0) >= 5 ? "Owner Prioritas" : "Owner Aktif",
          nextFollowUp: registeredPets[0]?.nextVisit || "Belum dijadwalkan",
          latestVisit: registeredPets[0]?.lastVisit || sinceDate,
          totalVisits: appointmentsData?.length || 0,
        });

      } catch (err) {
        console.error("Error fetching pet owner details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnerDetails();
  }, [id, refreshCounter]);

  const handleDeleteOwner = async () => {
    if (!ownerDetail) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus owner ${ownerDetail.name}?`)) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from("users")
          .delete()
          .eq("id", ownerDetail.id);

        if (error) throw error;
        navigate("/pet-owners");
      } catch (err) {
        console.error("Error deleting owner:", err);
        alert(err.message || "Gagal menghapus data owner");
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-400">Memuat detail pemilik...</p>
        </div>
      </div>
    );
  }

  if (!ownerDetail) {
    return (
      <div className="p-10 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-700">Owner Tidak Ditemukan</h1>
        <button
          onClick={() => navigate("/pet-owners")}
          className="mt-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 transition shadow"
        >
          Kembali ke Daftar Pemilik
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
          <button 
            onClick={handleDeleteOwner}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
          >
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
