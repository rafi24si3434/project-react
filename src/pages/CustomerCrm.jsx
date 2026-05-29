import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  BadgeCheck,
  CreditCard,
  Search,
  ShieldCheck,
  UserCircle,
  Users,
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
      return "bg-slate-100 text-slate-700 border-slate-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function getMemberStatusBadge(isActive) {
  return isActive
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : "bg-rose-100 text-rose-700 border-rose-200";
}

export default function CustomerCrm() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const goToDetail = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  const filteredCustomers = useMemo(() => {
    const keyword = search.toLowerCase();

    return crmCustomers.filter((customer) =>
      [
        customer.name,
        customer.id,
        customer.phone,
        customer.email,
        customer.city,
      ].some((value) => value.toLowerCase().includes(keyword))
    );
  }, [search]);

  const stats = useMemo(() => {
    const totalTransaction = crmCustomers.reduce(
      (sum, customer) => sum + customer.transactionTotalNumber,
      0
    );

    return {
      totalCustomer: crmCustomers.length,
      activeMembers: crmCustomers.filter((customer) => customer.membership.isActive).length,
      totalComplaints: crmCustomers.reduce(
        (sum, customer) => sum + customer.interactions.complaints,
        0
      ),
      totalTransaction,
    };
  }, []);

  return (
    <div className="min-h-screen p-1.5">
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

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            type="text"
            placeholder="Cari nama, ID customer, kota, email, atau nomor HP..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Customer
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-gray-800">
                {stats.totalCustomer}
              </h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Member Aktif
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-gray-800">
                {stats.activeMembers}
              </h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Riwayat Komplain
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-gray-800">
                {stats.totalComplaints}
              </h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Transaksi
              </p>
              <h2 className="mt-2 text-xl font-extrabold text-gray-800">
                {formatCurrency(stats.totalTransaction)}
              </h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-500">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 p-5">
          <BadgeCheck className="h-5 w-5 text-emerald-500" />
          <div>
            <h2 className="text-base font-bold text-gray-800">Daftar Customer CRM Klinik</h2>
            <p className="text-xs text-gray-400">
              Klik detail untuk membuka halaman lengkap data customer
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/70">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Identitas Customer
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Kontak
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Akun / Membership
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Transaksi Klinik
                </TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Aktivitas User
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
                    <TableCell className="min-w-[260px] py-4 align-top">
                      <div className="flex items-start gap-3">
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-gray-800 hover:text-emerald-600">
                            {customer.name}
                          </p>
                          <p className="text-xs font-medium text-gray-400">{customer.id}</p>
                          <p className="text-xs text-gray-500">
                            {customer.gender} | {customer.dob}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[250px] align-top">
                      <div className="space-y-1.5 text-xs text-gray-600">
                        <p className="font-semibold text-gray-700">{customer.phone}</p>
                        <p>{customer.email}</p>
                        <p className="line-clamp-2 leading-relaxed text-gray-500">{customer.address}</p>
                        <span className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                          {customer.city}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[240px] align-top">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${getMemberStatusBadge(
                              customer.membership.isActive
                            )}`}
                          >
                            {customer.memberStatus}
                          </span>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${getLevelBadge(
                              customer.membership.level
                            )}`}
                          >
                            {customer.membership.level}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Tanggal daftar: {customer.membership.joinDate}</p>
                        <p className="text-xs text-gray-500">{customer.complaintLabel}</p>
                        <p className="text-xs text-gray-500">{customer.feedbackSummary}</p>
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[260px] align-top">
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-gray-800">{customer.transactions.totalSpent}</p>
                        <p className="text-xs text-gray-500">
                          Riwayat kunjungan: {customer.visitCount} kunjungan
                        </p>
                        <p className="text-xs text-gray-500">
                          Metode pembayaran:{" "}
                          {customer.paymentMethods.length > 0
                            ? customer.paymentMethods.join(", ")
                            : "Belum ada"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Transaksi terakhir: {customer.transactions.lastTransaction}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="min-w-[180px] align-top">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-700">{customer.lastLoginLabel}</p>
                        <p className="text-xs leading-relaxed text-gray-500">{customer.activity.inApp}</p>
                      </div>
                    </TableCell>

                    <TableCell className="text-right align-top">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          goToDetail(customer.id);
                        }}
                        className="rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-600 shadow-sm transition hover:bg-emerald-500 hover:text-white"
                      >
                        Lihat Detail
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="h-6 w-6 text-gray-300" />
                      <p>Customer CRM tidak ditemukan.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
