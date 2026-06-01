import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  BadgeCheck,
  CreditCard,
  LayoutGrid,
  List,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  UserCircle,
  Users,
  ChevronRight,
  Star,
  Calendar,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { crmCustomers, formatCurrency } from "@/data/CustomerCrmData";

function getLevelBadge(level) {
  switch (level) {
    case "Platinum":
      return "bg-violet-100 text-violet-700 border-violet-200";
    case "Gold":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Silver":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function getMemberStatusDot(isActive) {
  return isActive ? "bg-emerald-500" : "bg-rose-400";
}

export default function CustomerCrm() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" | "card"

  const goToDetail = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  const filteredCustomers = useMemo(() => {
    const keyword = search.toLowerCase();
    return crmCustomers.filter((customer) =>
      [customer.name, customer.id, customer.phone, customer.email, customer.city].some(
        (value) => value.toLowerCase().includes(keyword)
      )
    );
  }, [search]);

  const stats = useMemo(() => {
    const totalTransaction = crmCustomers.reduce(
      (sum, customer) => sum + customer.transactionTotalNumber,
      0
    );
    return {
      totalCustomer: crmCustomers.length,
      activeMembers: crmCustomers.filter((c) => c.membership.isActive).length,
      totalComplaints: crmCustomers.reduce((sum, c) => sum + c.interactions.complaints, 0),
      totalTransaction,
    };
  }, []);

  return (
    <div className="min-h-screen p-1.5">
      {/* ─── HEADER ─── */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 shadow-inner">
            <UserCircle className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-800">
              Customer CRM
            </h1>
            <p className="mt-0.5 text-sm font-medium text-gray-400">
              Data customer klinik hewan untuk kebutuhan dokter dan admin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === "list"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                viewMode === "card"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Card
            </button>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Cari nama, ID, kota..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>
        </div>
      </div>

      {/* ─── STAT CARDS ─── */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Customer" value={stats.totalCustomer} icon={Users} color="emerald" />
        <StatCard label="Member Aktif" value={stats.activeMembers} icon={ShieldCheck} color="blue" />
        <StatCard label="Riwayat Komplain" value={stats.totalComplaints} icon={AlertCircle} color="amber" />
        <StatCard
          label="Total Transaksi"
          value={formatCurrency(stats.totalTransaction)}
          icon={CreditCard}
          color="violet"
          small
        />
      </div>

      {/* ─── TABLE VIEW ─── */}
      {viewMode === "list" && (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-2 border-b border-gray-100 p-5">
            <BadgeCheck className="h-5 w-5 text-emerald-500" />
            <div>
              <h2 className="text-base font-bold text-gray-800">Daftar Customer CRM Klinik</h2>
              <p className="text-xs text-gray-400">
                Klik pada baris untuk membuka halaman detail lengkap
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/70">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Customer
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Kontak
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Membership
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Transaksi
                  </TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Aktivitas
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Detail
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      onClick={() => goToDetail(customer.id)}
                      className="cursor-pointer border-b border-gray-50 transition-colors hover:bg-emerald-50/30"
                    >
                      {/* Identity */}
                      <TableCell className="min-w-[240px] py-4 align-top">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={customer.avatar}
                              alt={customer.name}
                              className="h-11 w-11 rounded-full border-2 border-white object-cover shadow-sm"
                            />
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${getMemberStatusDot(
                                customer.membership.isActive
                              )}`}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{customer.name}</p>
                            <p className="text-[11px] font-medium text-gray-400">{customer.id}</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Contact */}
                      <TableCell className="min-w-[200px] align-top">
                        <div className="space-y-1 text-xs">
                          <p className="flex items-center gap-1.5 font-semibold text-gray-700">
                            <Phone className="h-3 w-3 text-gray-400" />
                            {customer.phone}
                          </p>
                          <p className="text-gray-500">{customer.email}</p>
                          <span className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                            <MapPin className="h-2.5 w-2.5" />
                            {customer.city}
                          </span>
                        </div>
                      </TableCell>

                      {/* Membership */}
                      <TableCell className="min-w-[180px] align-top">
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap gap-1.5">
                            <span
                              className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getLevelBadge(
                                customer.membership.level
                              )}`}
                            >
                              {customer.membership.level}
                            </span>
                          </div>
                          <p className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Calendar className="h-3 w-3" />
                            Sejak {customer.membership.joinDate}
                          </p>
                        </div>
                      </TableCell>

                      {/* Transaction */}
                      <TableCell className="min-w-[180px] align-top">
                        <p className="text-sm font-bold text-gray-800">
                          {customer.transactions.totalSpent}
                        </p>
                        <p className="mt-0.5 text-[11px] text-gray-400">
                          {customer.visitCount} kunjungan
                        </p>
                      </TableCell>

                      {/* Activity */}
                      <TableCell className="min-w-[160px] align-top">
                        <p className="text-xs font-semibold text-gray-700">
                          {customer.lastLoginLabel}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-gray-400">
                          {customer.activity.inApp}
                        </p>
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right align-top">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            goToDetail(customer.id);
                          }}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-600 shadow-sm transition hover:bg-emerald-500 hover:text-white"
                        >
                          Detail
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search className="h-6 w-6 text-gray-300" />
                        <p>Customer tidak ditemukan.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* ─── CARD VIEW ─── */}
      {viewMode === "card" && (
        <div className="animate-in fade-in duration-300">
          <div className="mb-4 flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-emerald-500" />
            <h2 className="text-base font-bold text-gray-800">
              {filteredCustomers.length} Customer Ditemukan
            </h2>
          </div>
          {filteredCustomers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => goToDetail(customer.id)}
                  className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-200"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="h-14 w-14 rounded-2xl border-2 border-white object-cover shadow-md transition-transform group-hover:scale-105"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${getMemberStatusDot(
                            customer.membership.isActive
                          )}`}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                          {customer.name}
                        </h3>
                        <p className="text-[11px] font-medium text-gray-400">{customer.id}</p>
                        <div className="mt-1 flex gap-1.5">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getLevelBadge(
                              customer.membership.level
                            )}`}
                          >
                            {customer.membership.level}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-500" />
                  </div>

                  {/* Divider */}
                  <div className="my-4 border-t border-dashed border-gray-100" />

                  {/* Card Body - Grid Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                        Total Transaksi
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-gray-800">
                        {customer.transactions.totalSpent}
                      </p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                        Kunjungan
                      </p>
                      <p className="mt-1 text-sm font-extrabold text-gray-800">
                        {customer.visitCount}x
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-3 space-y-1.5">
                    <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <Phone className="h-3 w-3 text-gray-400" />
                      {customer.phone}
                    </p>
                    <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      {customer.city}
                    </p>
                    <p className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <Star className="h-3 w-3 text-gray-400" />
                      {customer.feedbackSummary} · Rating {customer.rating}/5
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center">
              <Search className="mx-auto mb-3 h-8 w-8 text-gray-300" />
              <p className="text-gray-400">Customer tidak ditemukan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── STAT CARD COMPONENT ─── */
function StatCard({ label, value, icon: Icon, color, small = false }) {
  const colorMap = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-500" },
    blue: { bg: "bg-blue-50", text: "text-blue-500" },
    amber: { bg: "bg-amber-50", text: "text-amber-500" },
    violet: { bg: "bg-violet-50", text: "text-violet-500" },
  };
  const c = colorMap[color] || colorMap.emerald;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full ${c.bg} opacity-50 transition-transform duration-500 group-hover:scale-125`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
          <h2 className={`mt-2 font-extrabold text-gray-800 ${small ? "text-lg" : "text-3xl"}`}>
            {value}
          </h2>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.text} transition-all duration-300 group-hover:scale-110`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
