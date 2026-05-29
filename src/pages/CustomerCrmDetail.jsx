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
import { formatCurrency, getCustomerCrmById } from "@/data/CustomerCrmData";

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

function InfoStat({ label, value, accentClass }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">{label}</p>
      <p className={`mt-2 text-2xl font-extrabold ${accentClass}`}>{value}</p>
    </div>
  );
}

function SectionBlock({ icon: Icon, title, subtitle, iconClassName = "", children }) {
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

export default function CustomerCrmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const customer = getCustomerCrmById(id);

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

    if (customer.visitHistory.length === 0) {
      return [{ name: "Belum ada", total: 0 }];
    }

    return customer.visitHistory.map((visit, index) => ({
      name: `Visit ${index + 1}`,
      total: parseAmount(visit.total),
    }));
  }, [customer]);

  const paymentMethodData = useMemo(() => {
    if (!customer) return [];

    const groupedMethods = customer.visitHistory.reduce((accumulator, visit) => {
      const key = visit.paymentMethod || "Belum ada";
      accumulator[key] = (accumulator[key] || 0) + 1;
      return accumulator;
    }, {});

    const entries = Object.entries(groupedMethods).map(([name, total]) => ({ name, total }));
    return entries.length > 0 ? entries : [{ name: "Belum ada", total: 0 }];
  }, [customer]);

  if (!customer) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Customer Tidak Ditemukan</h1>
        <button
          onClick={() => navigate("/customers")}
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
            onClick={() => navigate("/customers")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">Customer CRM Detail</h1>
            <p className="text-sm text-gray-400">
              Tampilan lengkap customer untuk kebutuhan dokter hewan dan admin klinik
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            {customer.memberStatus}
          </span>
          <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
            {customer.membership.level} Member
          </span>
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-xl">
        <div className="grid gap-0 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="border-b border-white/10 p-8 xl:border-b-0 xl:border-r">
            <div className="flex flex-col items-center text-center xl:items-start xl:text-left">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="h-28 w-28 rounded-3xl border-4 border-white/20 object-cover shadow-lg"
              />
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white">
                {customer.name}
              </h2>
              <p className="mt-1 text-sm font-medium text-emerald-100">{customer.id}</p>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/80">
                Customer terdaftar sejak {customer.membership.joinDate} dengan aktivitas terakhir
                "{customer.activity.inApp}".
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white/90">
                <Phone className="h-4 w-4 text-emerald-200" />
                <span className="text-sm font-semibold">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white/90">
                <Mail className="h-4 w-4 text-sky-200" />
                <span className="text-sm font-semibold">{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white/90">
                <MapPin className="h-4 w-4 text-violet-200" />
                <span className="text-sm font-semibold">{customer.city}</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <InfoStat
                label="Total transaksi"
                value={customer.transactions.totalSpent}
                accentClass="text-white"
              />
              <InfoStat
                label="Kunjungan klinik"
                value={`${customer.visitCount}x`}
                accentClass="text-emerald-100"
              />
              <InfoStat
                label="Feedback / review"
                value={customer.feedbackSummary}
                accentClass="text-sky-100"
              />
              <InfoStat
                label="Login terakhir"
                value={customer.lastLoginLabel}
                accentClass="text-violet-100"
              />
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Grafik Nilai Per Kunjungan</h3>
                    <p className="text-xs text-white/70">Ringkasan nominal tiap kunjungan klinik</p>
                  </div>
                </div>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visitValueData} barSize={22}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.75)" fontSize={12} />
                      <YAxis
                        stroke="rgba(255,255,255,0.75)"
                        fontSize={12}
                        tickFormatter={formatCompactNumber}
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
                  <h3 className="text-sm font-bold text-white">Ringkasan CRM</h3>
                  <p className="text-xs text-white/70">Kunjungan, komplain, review, dan rating customer</p>
                </div>
                <div className="mt-4 h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={crmMetricData} barSize={26}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.15)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.75)" fontSize={12} />
                      <YAxis stroke="rgba(255,255,255,0.75)" fontSize={12} allowDecimals={false} />
                      <Tooltip
                        formatter={(value) => `${value}`}
                        contentStyle={{
                          borderRadius: 16,
                          border: "1px solid rgba(255,255,255,0.15)",
                          backgroundColor: "rgba(15, 23, 42, 0.92)",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="total" radius={[10, 10, 0, 0]}>
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

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <SectionBlock
          icon={UserCircle}
          title="Data Identitas Customer"
          subtitle="Identitas lengkap pemilik hewan yang tersimpan pada CRM"
          iconClassName="text-emerald-600"
        >
          <div className="grid gap-3">
            <DataRow label="Nama lengkap pemilik" value={customer.name} />
            <DataRow label="ID customer" value={customer.id} />
            <DataRow label="Jenis kelamin" value={customer.gender} />
            <DataRow label="Tanggal lahir" value={customer.dob} />
            <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
              <img
                src={customer.avatar}
                alt={customer.name}
                className="h-16 w-16 rounded-2xl object-cover shadow-sm"
              />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Foto profil
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800">
                  Foto profil customer aktif dan dipakai pada modul CRM.
                </p>
              </div>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock
          icon={MapPin}
          title="Kontak"
          subtitle="Kontak utama untuk reminder, follow up, dan komunikasi layanan"
          iconClassName="text-blue-600"
        >
          <div className="grid gap-3">
            <DataRow label="Nomor HP" value={customer.phone} />
            <DataRow label="Email" value={customer.email} />
            <DataRow label="Alamat" value={customer.address} />
            <DataRow label="Kota" value={customer.city} />
          </div>
        </SectionBlock>

        <SectionBlock
          icon={ShieldCheck}
          title="Data Akun / Membership"
          subtitle="Status member, catatan admin, riwayat komplain, dan feedback customer"
          iconClassName="text-violet-600"
        >
          <div className="grid gap-3">
            <DataRow label="Tanggal daftar" value={customer.membership.joinDate} />
            <DataRow label="Status member" value={customer.memberStatus} />
            <DataRow label="Level membership" value={customer.membership.level} />
            <DataRow label="Riwayat komplain" value={customer.complaintLabel} />
            <DataRow
              label="Feedback / review"
              value={`${customer.feedbackSummary} | rating ${customer.rating}/5`}
            />
            <DataRow label="Catatan admin" value={customer.interactions.adminNotes} />
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-bold text-amber-900">Detail Riwayat Komplain</h3>
              </div>
              {customer.complaintHistory.length > 0 ? (
                <div className="space-y-2">
                  {customer.complaintHistory.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="rounded-xl border border-amber-100 bg-white/80 p-3 text-sm font-medium text-amber-900"
                    >
                      {complaint.note}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-amber-100 bg-white/80 p-3 text-sm font-medium text-amber-800">
                  Tidak ada komplain yang tercatat.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-rose-600" />
                <h3 className="text-sm font-bold text-rose-900">Feedback Terbaru</h3>
              </div>
              <p className="text-sm font-semibold leading-relaxed text-rose-900">
                {customer.latestReview}
              </p>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock
          icon={MessageSquareText}
          title="Aktivitas User"
          subtitle="Aktivitas aplikasi dan intensitas interaksi customer"
          iconClassName="text-indigo-600"
        >
          <div className="grid gap-3">
            <DataRow label="Login terakhir" value={customer.lastLoginLabel} />
            <DataRow label="Aktivitas terakhir" value={customer.activity.inApp} />
          </div>

          <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-indigo-900">Distribusi Metode Pembayaran</h3>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentMethodData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" fontSize={11} stroke="#6b7280" />
                  <YAxis allowDecimals={false} fontSize={11} stroke="#6b7280" />
                  <Tooltip
                    formatter={(value) => `${value} transaksi`}
                    contentStyle={{
                      borderRadius: 16,
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Bar dataKey="total" fill="#6366f1" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </SectionBlock>
      </div>

      <div className="mt-6">
        <SectionBlock
          icon={CreditCard}
          title="Data Transaksi Kunjungan Klinik"
          subtitle="Riwayat kunjungan, total transaksi, metode pembayaran, dan tanggal transaksi terakhir"
          iconClassName="text-emerald-600"
        >
          <div className="mb-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <DataRow label="Riwayat kunjungan" value={`${customer.visitCount} kunjungan`} />
            <DataRow label="Total transaksi" value={customer.transactions.totalSpent} />
            <DataRow
              label="Metode pembayaran"
              value={
                customer.paymentMethods.length > 0
                  ? customer.paymentMethods.join(", ")
                  : "Belum ada"
              }
            />
            <DataRow label="Tanggal transaksi terakhir" value={customer.transactions.lastTransaction} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-5 py-4">
              <FileText className="h-4 w-4 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-gray-800">Tabel Riwayat Kunjungan Klinik</h3>
                <p className="text-xs text-gray-400">Tampilan detail setiap kunjungan customer</p>
              </div>
            </div>

            <Table>
              <TableHeader className="bg-white">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    ID Kunjungan
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
                    Pembayaran
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.visitHistory.length > 0 ? (
                  customer.visitHistory.map((visit) => (
                    <TableRow key={visit.id} className="hover:bg-emerald-50/30">
                      <TableCell className="font-semibold text-gray-700">{visit.id}</TableCell>
                      <TableCell className="text-gray-600">{visit.date}</TableCell>
                      <TableCell className="font-semibold text-gray-800">{visit.service}</TableCell>
                      <TableCell className="text-gray-600">{visit.doctor}</TableCell>
                      <TableCell className="text-gray-600">{visit.paymentMethod}</TableCell>
                      <TableCell className="text-right font-bold text-emerald-600">{visit.total}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-28 text-center text-gray-400">
                      Belum ada riwayat kunjungan klinik untuk customer ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </SectionBlock>
      </div>
    </div>
  );
}
