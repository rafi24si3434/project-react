import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Star,
  UserCircle,
  Users,
  Clock,
  Smartphone,
  Activity,
  Tag,
  Gift,
  Megaphone,
  Share2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, getCustomerCrmById } from "@/data/CustomerCrmData";

/* ────────────────────────────────────────────────────────────── */
/*  UTILITY                                                      */
/* ────────────────────────────────────────────────────────────── */
function parseAmount(value) {
  const amount = Number(String(value).replace(/[^\d]/g, ""));
  return Number.isNaN(amount) ? 0 : amount;
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/* ────────────────────────────────────────────────────────────── */
/*  REUSABLE UI BLOCKS                                           */
/* ────────────────────────────────────────────────────────────── */
function MetricCard({ icon: Icon, label, value, accent = "emerald" }) {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    indigo: "bg-indigo-50 text-indigo-600",
    pink: "bg-pink-50 text-pink-600",
    sky: "bg-sky-50 text-sky-600",
  };
  const c = colorMap[accent] || colorMap.emerald;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <p className="mt-0.5 truncate text-sm font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function DataField({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3">
      <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </p>
      <p className="text-sm font-semibold leading-relaxed text-gray-800">{value || "—"}</p>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, accent = "text-emerald-600" }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h2 className="text-base font-bold text-gray-800">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  MAIN COMPONENT                                               */
/* ────────────────────────────────────────────────────────────── */
export default function CustomerCrmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = getCustomerCrmById(id);

  /* ── Chart data ── */
  const crmMetricData = useMemo(() => {
    if (!customer) return [];
    return [
      { name: "Kunjungan", total: customer.visitCount, fill: "#10b981" },
      { name: "Review", total: customer.interactions.feedback, fill: "#3b82f6" },
      { name: "Komplain", total: customer.complaintHistory.length, fill: "#f59e0b" },
      { name: "Rating", total: customer.rating, fill: "#8b5cf6" },
    ];
  }, [customer]);

  const visitValueData = useMemo(() => {
    if (!customer) return [];
    if (customer.visitHistory.length === 0) return [{ name: "Belum ada", total: 0 }];
    return customer.visitHistory.map((visit, i) => ({
      name: `Visit ${i + 1}`,
      total: parseAmount(visit.total),
    }));
  }, [customer]);

  const paymentMethodData = useMemo(() => {
    if (!customer) return [];
    const grouped = customer.visitHistory.reduce((acc, v) => {
      const key = v.paymentMethod || "Belum ada";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const entries = Object.entries(grouped).map(([name, total]) => ({ name, total }));
    return entries.length > 0 ? entries : [{ name: "Belum ada", total: 0 }];
  }, [customer]);

  /* ── 404 ── */
  if (!customer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <UserCircle className="h-16 w-16 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-700">Customer Tidak Ditemukan</h1>
        <p className="text-sm text-gray-400">ID "{id}" tidak cocok dengan data manapun.</p>
        <button
          onClick={() => navigate("/customers")}
          className="mt-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600"
        >
          Kembali ke CRM
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* ═══════════ BREADCRUMB BAR ═══════════ */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/customers")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-800">
              Detail Customer
            </h1>
            <p className="text-xs text-gray-400">
              Halaman lengkap data CRM untuk dokter hewan dan admin klinik
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <span
              className={`h-2 w-2 rounded-full ${
                customer.membership.isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-400"
              }`}
            />
            {customer.memberStatus}
          </span>
          <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
            {customer.membership.level} Member
          </span>
        </div>
      </div>

      {/* ═══════════ HERO BANNER ═══════════ */}
      <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-xl">
        <div className="grid gap-0 xl:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left – Profile */}
          <div className="border-b border-white/10 p-8 xl:border-b-0 xl:border-r">
            <div className="flex flex-col items-center text-center xl:items-start xl:text-left">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="h-24 w-24 rounded-3xl border-4 border-white/20 object-cover shadow-lg"
              />
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
                {customer.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-emerald-100">{customer.id}</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/80">
                Terdaftar sejak {customer.membership.joinDate} · Aktivitas terakhir "
                {customer.activity.inApp}"
              </p>
            </div>

            <div className="mt-5 grid gap-2.5">
              <ContactPill icon={Phone} value={customer.phone} color="text-emerald-200" />
              <ContactPill icon={Mail} value={customer.email} color="text-sky-200" />
              <ContactPill icon={MapPin} value={customer.address} color="text-violet-200" />
            </div>
          </div>

          {/* Right – Quick Stats + Charts */}
          <div className="p-8">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <HeroStat label="Total Transaksi" value={customer.transactions.totalSpent} />
              <HeroStat label="Kunjungan Klinik" value={`${customer.visitCount}x`} />
              <HeroStat label="Review / Feedback" value={customer.feedbackSummary} />
              <HeroStat label="Login Terakhir" value={customer.lastLoginLabel} />
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {/* Chart: Visit Values */}
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-white">Nilai Per Kunjungan</h3>
                <p className="mb-3 text-[11px] text-white/60">Ringkasan nominal tiap kunjungan</p>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visitValueData} barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" fontSize={11} />
                      <YAxis stroke="rgba(255,255,255,0.7)" fontSize={11} tickFormatter={formatCompactNumber} />
                      <Tooltip
                        formatter={(v) => formatCurrency(v)}
                        contentStyle={{
                          borderRadius: 14,
                          border: "1px solid rgba(255,255,255,0.15)",
                          backgroundColor: "rgba(15,23,42,0.92)",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="total" fill="#d1fae5" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart: CRM Metrics */}
              <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-white">Ringkasan CRM</h3>
                <p className="mb-3 text-[11px] text-white/60">Kunjungan, komplain, review & rating</p>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={crmMetricData} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" fontSize={11} />
                      <YAxis stroke="rgba(255,255,255,0.7)" fontSize={11} allowDecimals={false} />
                      <Tooltip
                        formatter={(v) => `${v}`}
                        contentStyle={{
                          borderRadius: 14,
                          border: "1px solid rgba(255,255,255,0.15)",
                          backgroundColor: "rgba(15,23,42,0.92)",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                        {crmMetricData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ TABBED DETAIL SECTIONS ═══════════ */}
      <Tabs defaultValue="identitas" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 gap-1 rounded-2xl border border-gray-100 bg-gray-50 p-1.5 md:grid-cols-5">
          <TabsTrigger
            value="identitas"
            className="rounded-xl text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm"
          >
            👤 Identitas
          </TabsTrigger>
          <TabsTrigger
            value="membership"
            className="rounded-xl text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm"
          >
            🛡️ Membership
          </TabsTrigger>
          <TabsTrigger
            value="transaksi"
            className="rounded-xl text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm"
          >
            💳 Transaksi
          </TabsTrigger>
          <TabsTrigger
            value="aktivitas"
            className="rounded-xl text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm"
          >
            📊 Aktivitas
          </TabsTrigger>
          <TabsTrigger
            value="marketing"
            className="rounded-xl text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm"
          >
            📣 Marketing
          </TabsTrigger>
        </TabsList>

        {/* ═══ TAB: IDENTITAS ═══ */}
        <TabsContent value="identitas" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid gap-6 xl:grid-cols-2">
            {/* Identity Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <SectionHeader icon={UserCircle} title="Data Identitas" subtitle="Informasi pribadi customer" accent="text-emerald-600" />
              <div className="grid gap-3">
                <DataField label="Nama Lengkap" value={customer.name} icon={UserCircle} />
                <DataField label="ID Customer" value={customer.id} icon={Tag} />
                <DataField label="Jenis Kelamin" value={customer.gender} icon={Users} />
                <DataField label="Tanggal Lahir" value={customer.dob} icon={Calendar} />
                <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
                  <img src={customer.avatar} alt={customer.name} className="h-16 w-16 rounded-2xl object-cover shadow-sm" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Foto Profil</p>
                    <p className="mt-1 text-sm font-semibold text-gray-800">Foto profil aktif pada modul CRM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <SectionHeader icon={MapPin} title="Kontak" subtitle="Kontak utama untuk reminder & follow up" accent="text-blue-600" />
              <div className="grid gap-3">
                <DataField label="Nomor HP" value={customer.phone} icon={Phone} />
                <DataField label="Email" value={customer.email} icon={Mail} />
                <DataField label="Alamat" value={customer.address} icon={MapPin} />
                <DataField label="Kota" value={customer.city} icon={MapPin} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══ TAB: MEMBERSHIP ═══ */}
        <TabsContent value="membership" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid gap-6 xl:grid-cols-2">
            {/* Membership Info */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <SectionHeader icon={ShieldCheck} title="Data Akun / Membership" subtitle="Status member, komplain & feedback" accent="text-violet-600" />
              <div className="grid gap-3">
                <DataField label="Tanggal Daftar" value={customer.membership.joinDate} icon={Calendar} />
                <DataField label="Status Member" value={customer.memberStatus} icon={ShieldCheck} />
                <DataField label="Level Membership" value={customer.membership.level} icon={Star} />
                <DataField label="Riwayat Komplain" value={customer.complaintLabel} icon={AlertCircle} />
                <DataField
                  label="Feedback / Review"
                  value={`${customer.feedbackSummary} · Rating ${customer.rating}/5`}
                  icon={MessageSquareText}
                />
                <DataField label="Catatan Admin" value={customer.interactions.adminNotes} icon={FileText} />
              </div>
            </div>

            {/* Complaint & Feedback Panels */}
            <div className="space-y-6">
              <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <h3 className="text-sm font-bold text-amber-900">Riwayat Komplain</h3>
                </div>
                {customer.complaintHistory.length > 0 ? (
                  <div className="space-y-2">
                    {customer.complaintHistory.map((c) => (
                      <div key={c.id} className="rounded-xl border border-amber-100 bg-white/80 p-3 text-sm font-medium text-amber-900">
                        {c.note}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-amber-100 bg-white/80 p-3 text-sm font-medium text-amber-800">
                    Tidak ada komplain yang tercatat.
                  </div>
                )}
              </div>

              <div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-rose-600" />
                  <h3 className="text-sm font-bold text-rose-900">Feedback Terbaru</h3>
                </div>
                <p className="text-sm font-semibold leading-relaxed text-rose-900">
                  {customer.latestReview}
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ═══ TAB: TRANSAKSI ═══ */}
        <TabsContent value="transaksi" className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          {/* Transaction Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={CreditCard} label="Total Transaksi" value={customer.transactions.totalSpent} accent="emerald" />
            <MetricCard icon={Calendar} label="Kunjungan Klinik" value={`${customer.visitCount} kunjungan`} accent="blue" />
            <MetricCard
              icon={Tag}
              label="Metode Pembayaran"
              value={customer.paymentMethods.length > 0 ? customer.paymentMethods.join(", ") : "Belum ada"}
              accent="violet"
            />
            <MetricCard icon={Clock} label="Transaksi Terakhir" value={customer.transactions.lastTransaction} accent="amber" />
          </div>

          {/* Payment Method Distribution Chart */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <SectionHeader icon={Users} title="Distribusi Metode Pembayaran" subtitle="Ringkasan metode bayar tiap kunjungan" accent="text-indigo-600" />
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethodData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" fontSize={11} stroke="#6b7280" />
                  <YAxis allowDecimals={false} fontSize={11} stroke="#6b7280" />
                  <Tooltip
                    formatter={(v) => `${v} transaksi`}
                    contentStyle={{ borderRadius: 14, border: "1px solid #e5e7eb" }}
                  />
                  <Bar dataKey="total" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Visit History Table */}
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-6 py-4">
              <FileText className="h-4 w-4 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-gray-800">Tabel Riwayat Kunjungan Klinik</h3>
                <p className="text-[11px] text-gray-400">Detail setiap kunjungan beserta dokter penanggung jawab</p>
              </div>
            </div>
            <Table>
              <TableHeader className="bg-white">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">ID</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tanggal</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Layanan</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Dokter</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Pembayaran</TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.visitHistory.length > 0 ? (
                  customer.visitHistory.map((v) => (
                    <TableRow key={v.id} className="hover:bg-emerald-50/30">
                      <TableCell className="font-semibold text-gray-700">{v.id}</TableCell>
                      <TableCell className="text-gray-600">{v.date}</TableCell>
                      <TableCell className="font-semibold text-gray-800">{v.service}</TableCell>
                      <TableCell className="text-gray-600">{v.doctor}</TableCell>
                      <TableCell className="text-gray-600">{v.paymentMethod}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">{v.total}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-28 text-center text-gray-400">
                      Belum ada riwayat kunjungan klinik.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* ═══ TAB: AKTIVITAS USER ═══ */}
        <TabsContent value="aktivitas" className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={Clock} label="Login Terakhir" value={customer.lastLoginLabel} accent="blue" />
            <MetricCard icon={Smartphone} label="Device" value={customer.activity?.device || "—"} accent="violet" />
            <MetricCard icon={MapPin} label="Lokasi Login" value={customer.activity?.location || "—"} accent="indigo" />
            <MetricCard icon={Activity} label="Durasi Sesi" value={customer.activity?.duration || "—"} accent="amber" />
          </div>

          <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-600" />
              <div>
                <h3 className="text-sm font-bold text-indigo-900">Aktivitas Terakhir di Aplikasi</h3>
                <p className="text-[11px] text-indigo-600/60">Apa yang dilakukan customer saat terakhir login</p>
              </div>
            </div>
            <p className="rounded-xl border border-indigo-100 bg-white/80 p-4 text-sm font-semibold leading-relaxed text-indigo-900">
              {customer.activity?.inApp || "Tidak ada data aktivitas."}
            </p>
          </div>

          {/* Interaction Stats */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <SectionHeader icon={MessageSquareText} title="Statistik Interaksi" subtitle="Jumlah chat CS, komplain, tiket & review customer" accent="text-sky-600" />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <InteractionStat icon={MessageSquareText} label="Chats CS" value={customer.interactions.chats} color="sky" />
              <InteractionStat icon={AlertCircle} label="Komplain" value={customer.interactions.complaints} color="amber" />
              <InteractionStat icon={FileText} label="Tiket" value={customer.interactions.tickets} color="violet" />
              <InteractionStat icon={Star} label="Review" value={customer.interactions.feedback} color="rose" />
            </div>
          </div>
        </TabsContent>

        {/* ═══ TAB: MARKETING ═══ */}
        <TabsContent value="marketing" className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard icon={Share2} label="Sumber Akuisisi" value={customer.marketing?.source || "—"} accent="pink" />
            <MetricCard icon={Gift} label="Partisipasi Giveaway" value={customer.marketing?.giveaway || "—"} accent="amber" />
            <MetricCard icon={Mail} label="Status Subscription" value={customer.marketing?.subscription || "—"} accent="blue" />
            <MetricCard icon={Tag} label="Status Promo" value={customer.marketing?.promoStatus || "—"} accent="emerald" />
          </div>

          {/* Campaign List */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <SectionHeader icon={Megaphone} title="Campaign Terdaftar" subtitle="Daftar campaign marketing yang diikuti customer" accent="text-pink-600" />
            {customer.marketing?.campaigns?.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {customer.marketing.campaigns.map((camp, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/80 px-5 py-4 transition-colors hover:bg-emerald-50/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-pink-600">
                        <Megaphone className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold text-gray-800">{camp}</span>
                    </div>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                      <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 py-8 text-center">
                <Megaphone className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                <p className="text-sm text-gray-400">Belum ada campaign yang diikuti.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  SMALL HELPER COMPONENTS                                      */
/* ────────────────────────────────────────────────────────────── */
function ContactPill({ icon: Icon, value, color }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 text-white/90 backdrop-blur-sm">
      <Icon className={`h-4 w-4 shrink-0 ${color}`} />
      <span className="truncate text-sm font-semibold">{value}</span>
    </div>
  );
}

function HeroStat({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-white/65">{label}</p>
      <p className="mt-1.5 text-lg font-extrabold text-white">{value}</p>
    </div>
  );
}

function InteractionStat({ icon: Icon, label, value, color }) {
  const colorMap = {
    sky: "bg-sky-50 text-sky-600",
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
    rose: "bg-rose-50 text-rose-600",
  };
  const c = colorMap[color] || colorMap.sky;

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 text-center">
      <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${c}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-2xl font-extrabold text-gray-800">{value}</p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
    </div>
  );
}
