import { useMemo, useState, useEffect } from "react";
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
  PawPrint
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
import { supabase } from "../lib/supabase";
import MetricCard from "../components/MetricCard";
import ActivityTimeline from "../components/ActivityTimeline";

function parseAmount(value) {
  const amount = Number(String(value).replace(/[^\d]/g, ""));
  return Number.isNaN(amount) ? 0 : amount;
}

function DataField({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 text-left">
      <p className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </p>
      <p className="text-sm font-semibold leading-relaxed text-gray-800">{value || "—"}</p>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, accent }) {
  return (
    <div className="mb-5 flex items-center gap-3 text-left">
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

export default function CustomerCrmDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      setLoading(true);
      try {
        const { data: userProfile, error: uErr } = await supabase
          .from("users")
          .select("*")
          .eq("id", id)
          .single();

        if (uErr) throw uErr;

        const { data: petsData } = await supabase
          .from("pets")
          .select("*")
          .eq("owner_id", userProfile.auth_user_id);

        const { data: appsData } = await supabase
          .from("appointments")
          .select("*, pets(name, type, breed)")
          .eq("owner_id", userProfile.auth_user_id)
          .order("date", { ascending: false });

        const { data: ordersData } = await supabase
          .from("orders")
          .select(`
            *,
            order_items (
              quantity,
              price,
              products (name)
            )
          `)
          .eq("customer_id", userProfile.auth_user_id)
          .order("created_at", { ascending: false });

        const { data: logsData } = await supabase
          .from("activity_logs")
          .select("*")
          .eq("user_id", userProfile.auth_user_id)
          .order("created_at", { ascending: false });

        const totalSpent = (ordersData || [])
          .filter(o => o.status !== "Cancelled")
          .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

        const mapped = {
          id: `CUST-${userProfile.id.slice(0, 5).toUpperCase()}`,
          name: userProfile.full_name,
          phone: userProfile.phone_number || "—",
          email: userProfile.email,
          address: "Pekanbaru, Riau, Indonesia",
          city: "Pekanbaru",
          gender: "Jantan / Betina (Owner)",
          dob: "—",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
          memberStatus: "Active",
          membership: {
            level: totalSpent > 500000 ? "Platinum" : totalSpent > 200000 ? "Gold" : "Silver",
            isActive: true,
            joinDate: new Date(userProfile.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "short" })
          },
          transactions: {
            totalSpent: `Rp ${totalSpent.toLocaleString("id-ID")}`,
            lastTransaction: ordersData && ordersData.length > 0 
              ? new Date(ordersData[0].created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
              : "Belum ada"
          },
          visitCount: appsData ? appsData.length : 0,
          feedbackSummary: "Good",
          rating: 4.8,
          complaintLabel: "0 komplain aktif",
          lastLoginLabel: logsData && logsData.length > 0 
            ? new Date(logsData[0].created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
            : "Baru saja",
          activity: {
            inApp: logsData && logsData.length > 0 ? logsData[0].activity : "Registrasi akun",
            device: "Chrome (Windows)",
            location: "Pekanbaru, ID",
            duration: "10 menit"
          },
          latestReview: "Sangat puas dengan pelayanan vaksinasi rutin klinik ini.",
          paymentMethods: ["Transfer", "E-Wallet"],
          interactions: {
            chats: 2,
            complaints: 0,
            tickets: 0,
            feedback: 1,
            adminNotes: "Customer loyal. Komunikasi baik dan penyayang hewan."
          },
          marketing: {
            source: "Rekomendasi Teman",
            giveaway: "Pernah",
            subscription: "Subscribed",
            promoStatus: "Aktif",
            campaigns: ["Grooming Merdeka"]
          },
          pets: (petsData || []).map(p => ({
            id: p.id,
            name: p.name,
            type: p.type,
            breed: p.breed || "-",
            age: p.birth_date ? new Date().getFullYear() - new Date(p.birth_date).getFullYear() : 0,
            gender: p.gender === "Male" || p.gender === "Jantan" ? "Jantan" : "Betina"
          })),
          appointments: (appsData || []).map(a => ({
            id: a.id,
            date: a.date,
            petName: a.pets?.name || "Hewan",
            doctor: a.doctor,
            type: a.type,
            status: a.status
          })),
          orders: (ordersData || []).map(o => ({
            id: o.id,
            date: new Date(o.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
            total: o.total_amount,
            status: o.status,
            items: o.order_items?.map(oi => `${oi.products?.name} (x${oi.quantity})`).join(", ")
          })),
          logs: (logsData || []).map(l => ({
            id: l.id,
            date: new Date(l.created_at).toLocaleString("id-ID"),
            activity: l.activity,
            description: l.description
          })),
          visitHistory: (appsData || []).map((app, idx) => ({
            id: `VIS-${app.id.slice(0, 5).toUpperCase()}`,
            date: app.date,
            service: app.type,
            doctor: app.doctor,
            paymentMethod: "E-Wallet",
            total: `Rp ${(120000 + (idx % 3) * 30000).toLocaleString("id-ID")}`
          }))
        };

        setCustomer(mapped);
      } catch (err) {
        console.error("Error loading customer details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetail();
  }, [id]);

  const crmMetricData = useMemo(() => {
    if (!customer) return [];
    return [
      { name: "Kunjungan", total: customer.visitCount, fill: "#10b981" },
      { name: "Review", total: customer.interactions.feedback, fill: "#3b82f6" },
      { name: "Komplain", total: customer.interactions.complaints, fill: "#f59e0b" },
      { name: "Rating", total: 5, fill: "#8b5cf6" },
    ];
  }, [customer]);

  const paymentMethodData = useMemo(() => {
    return [
      { name: "Transfer Bank", total: 3 },
      { name: "E-Wallet", total: 2 }
    ];
  }, [customer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-left">
        <UserCircle className="h-16 w-16 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-700">Customer Tidak Ditemukan</h1>
        <button
          onClick={() => navigate("/customers")}
          className="mt-2 rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600 cursor-pointer"
        >
          Kembali ke CRM
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 text-left">
      
      {/* BREADCRUMB BAR */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/customers")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-100 cursor-pointer"
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
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            {customer.memberStatus}
          </span>
          <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
            {customer.membership.level} Member
          </span>
        </div>
      </div>

      {/* HERO BANNER */}
      <section className="mb-6 overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 shadow-xl">
        <div className="grid gap-0 xl:grid-cols-[320px_minmax(0,1fr)]">
          {/* Profile card info */}
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
              <p className="mt-1 text-sm font-medium text-emerald-100">ID: #{customer.id.slice(5)}</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/80">
                Terdaftar sejak {customer.membership.joinDate} · Aktivitas terakhir "{customer.activity.inApp}"
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

      {/* TABBED DETAIL SECTIONS */}
      <Tabs defaultValue="identitas" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 gap-1 rounded-2xl border border-gray-100 bg-gray-50 p-1.5 md:grid-cols-6">
          <TabsTrigger value="identitas" className="rounded-xl text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">👤 Identitas</TabsTrigger>
          <TabsTrigger value="pets" className="rounded-xl text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">🐾 Pets</TabsTrigger>
          <TabsTrigger value="membership" className="rounded-xl text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">🛡️ Membership</TabsTrigger>
          <TabsTrigger value="transaksi" className="rounded-xl text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">💳 Transaksi</TabsTrigger>
          <TabsTrigger value="aktivitas" className="rounded-xl text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">📊 Aktivitas</TabsTrigger>
          <TabsTrigger value="marketing" className="rounded-xl text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">📣 Marketing</TabsTrigger>
        </TabsList>

        {/* TAB: IDENTITAS */}
        <TabsContent value="identitas" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <SectionHeader icon={UserCircle} title="Data Identitas" subtitle="Informasi pribadi customer" accent="text-emerald-600" />
              <div className="grid gap-3">
                <DataField label="Nama Lengkap" value={customer.name} icon={UserCircle} />
                <DataField label="ID Customer" value={customer.id} icon={Tag} />
                <DataField label="Role Pengguna" value="Customer Portal User" icon={Users} />
              </div>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <SectionHeader icon={MapPin} title="Kontak" subtitle="Kontak utama untuk reminder & follow up" accent="text-blue-600" />
              <div className="grid gap-3">
                <DataField label="Nomor HP" value={customer.phone} icon={Phone} />
                <DataField label="Email" value={customer.email} icon={Mail} />
                <DataField label="Kota" value={customer.city} icon={MapPin} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB: PETS */}
        <TabsContent value="pets" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <SectionHeader icon={PawPrint} title="Hewan Terdaftar" subtitle="Daftar anabul milik customer ini" accent="text-emerald-600" />
            {customer.pets?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {customer.pets.map((pet) => (
                  <div key={pet.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl shadow-sm">
                      {pet.type?.toLowerCase() === "cat" || pet.type?.toLowerCase() === "kucing" ? "🐱" : 
                       pet.type?.toLowerCase() === "dog" || pet.type?.toLowerCase() === "anjing" ? "🐶" : 
                       pet.type?.toLowerCase() === "rabbit" || pet.type?.toLowerCase() === "kelinci" ? "🐰" : "🐾"}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{pet.name}</h4>
                      <p className="text-xs text-gray-400">{pet.breed} · {pet.gender}</p>
                      <p className="text-[10px] text-emerald-650 font-bold bg-emerald-50/50 px-1.5 py-0.5 rounded inline-block mt-1">{pet.age} Tahun</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-gray-50 py-8 text-center">
                <p className="text-sm text-gray-400">Customer belum mendaftarkan hewan peliharaan.</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB: MEMBERSHIP */}
        <TabsContent value="membership" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <SectionHeader icon={ShieldCheck} title="Data Akun / Membership" subtitle="Status member, komplain & feedback" accent="text-violet-600" />
              <div className="grid gap-3">
                <DataField label="Tanggal Daftar" value={customer.membership.joinDate} icon={Calendar} />
                <DataField label="Status Member" value={customer.memberStatus} icon={ShieldCheck} />
                <DataField label="Level Membership" value={customer.membership.level} icon={Star} />
                <DataField label="Catatan Admin" value={customer.interactions.adminNotes} icon={FileText} />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB: TRANSAKSI */}
        <TabsContent value="transaksi" className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={CreditCard} label="Total Transaksi" value={customer.transactions.totalSpent} accent="emerald" />
            <MetricCard icon={Calendar} label="Kunjungan Klinik" value={`${customer.visitCount} kunjungan`} accent="blue" />
            <MetricCard icon={Clock} label="Transaksi Terakhir" value={customer.transactions.lastTransaction} accent="amber" />
          </div>

          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-6 py-4">
              <FileText className="h-4 w-4 text-emerald-600" />
              <div>
                <h3 className="text-sm font-bold text-gray-800">Tabel Riwayat Pembelian & Order</h3>
                <p className="text-[11px] text-gray-400">Daftar transaksi produk dari supabase</p>
              </div>
            </div>
            <Table>
              <TableHeader className="bg-white">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">ID Order</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tanggal</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Produk</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Status</TableHead>
                  <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.orders?.length > 0 ? (
                  customer.orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-semibold text-emerald-600">#{order.id.slice(0, 8).toUpperCase()}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="font-medium text-gray-700">{order.items}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{order.status}</span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-gray-800">Rp {order.total.toLocaleString("id-ID")}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-gray-400">Belum ada transaksi.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* TAB: AKTIVITAS USER */}
        <TabsContent value="aktivitas" className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard icon={Clock} label="Login Terakhir" value={customer.lastLoginLabel} accent="blue" />
            <MetricCard icon={Smartphone} label="Device" value={customer.activity?.device} accent="violet" />
            <MetricCard icon={MapPin} label="Lokasi Login" value={customer.activity?.location} accent="indigo" />
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <SectionHeader icon={Clock} title="Timeline Aktivitas" subtitle="Jejak aktivitas customer di platform" accent="text-indigo-600" />
            <ActivityTimeline logs={customer.logs} />
          </div>
        </TabsContent>

        {/* TAB: MARKETING */}
        <TabsContent value="marketing" className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard icon={Share2} label="Sumber Akuisisi" value={customer.marketing?.source} accent="pink" />
            <MetricCard icon={Mail} label="Status Subscription" value={customer.marketing?.subscription} accent="blue" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

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
