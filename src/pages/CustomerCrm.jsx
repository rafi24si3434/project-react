import { useState, useMemo } from "react";
import {
  Users,
  Search,
  Star,
  Activity,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Calendar,
  Gift,
  AlertCircle,
  FileText,
  BadgeCheck,
  UserCircle,
  Smartphone,
  MapPin,
  Clock,
  Gamepad2,
  Share2,
  Megaphone,
  Mail,
  Tag
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { initialCustomers } from "@/data/CustomersData";

export default function CustomerCrm() {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = useMemo(() => {
    return initialCustomers.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const getLevelBadge = (level) => {
    switch(level) {
      case "Platinum": return "bg-purple-100 text-purple-700 border-purple-200";
      case "Gold": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Silver": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen p-1.5 opacity-100 transition-opacity duration-500">
      
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-100">
            <UserCircle className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
              Customer CRM
            </h1>
            <p className="text-sm text-gray-400 font-medium mt-0.5">
              Kelola loyalitas pelanggan & riwayat interaksi
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Cari nama atau ID Customer..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all bg-white hover:bg-gray-50 shadow-sm"
          />
        </div>
      </div>

      {/* ─── STAT CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-150 p-6 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Customer</p>
              <h1 className="text-3xl font-extrabold mt-2 text-gray-800 tracking-tight">{initialCustomers.length}</h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-150 p-6 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Member VIP / Gold</p>
              <h1 className="text-3xl font-extrabold mt-2 text-gray-800 tracking-tight">2</h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shadow-inner group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
              <Star className="w-6 h-6 animate-pulse-slow" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-150 p-6 transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Nilai Transaksi</p>
              <h1 className="text-2xl font-extrabold mt-2 text-gray-800 tracking-tight">Rp 7.8 Jt</h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── DATA TABLE ─── */}
      <div className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center gap-2">
          <BadgeCheck className="w-5 h-5 text-emerald-500" />
          <h2 className="text-base font-bold text-gray-800">Daftar Customer Loyalty</h2>
        </div>
        
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider py-4">Profil</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Keanggotaan</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Transaksi (Rp)</TableHead>
              <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider text-right">Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
              <TableRow key={customer.id} className="hover:bg-emerald-50/30 transition-colors group border-b-gray-50">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={customer.avatar} 
                      alt={customer.name} 
                      className="w-10 h-10 rounded-full border-2 border-white shadow-sm group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{customer.name}</p>
                      <p className="text-[11px] text-gray-400 font-medium">{customer.id} · {customer.username}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5 items-start">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getLevelBadge(customer.membership.level)}`}>
                      {customer.membership.level}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Sejak {customer.membership.joinDate}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-bold text-gray-700 text-sm">{customer.transactions.totalSpent}</p>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Trx Terakhir: {customer.transactions.lastTransaction}</p>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button 
                        onClick={() => setSelectedCustomer(customer)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                      >
                        Lihat Data CRM
                      </button>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl p-0 overflow-hidden shadow-2xl">
                      {/* DIALOG HEADER */}
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-white relative">
                        <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                        <DialogHeader>
                          <DialogTitle className="sr-only">Detail Customer CRM</DialogTitle>
                        </DialogHeader>
                        <div className="flex gap-5 items-center relative z-10">
                          <img 
                            src={customer.avatar} 
                            alt={customer.name} 
                            className="w-20 h-20 rounded-full border-4 border-white/20 shadow-lg"
                          />
                          <div>
                            <h2 className="text-2xl font-extrabold tracking-tight">{customer.name}</h2>
                            <p className="text-emerald-100 text-sm font-medium flex items-center gap-2 mt-1">
                              {customer.id} <span className="opacity-50">|</span> {customer.username}
                            </p>
                            <span className={`inline-block mt-2 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 border border-white/30`}>
                              {customer.membership.level} MEMBER
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* DIALOG TABS CONTENT */}
                      <div className="p-6 bg-white">
                        <Tabs defaultValue="membership" className="w-full">
                          <TabsList className="grid w-full grid-cols-5 mb-6 bg-gray-50/50 p-1 rounded-xl border border-gray-100">
                            <TabsTrigger value="membership" className="rounded-lg text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">
                              Membership
                            </TabsTrigger>
                            <TabsTrigger value="interaksi" className="rounded-lg text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">
                              Interaksi
                            </TabsTrigger>
                            <TabsTrigger value="transaksi" className="rounded-lg text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">
                              Transaksi
                            </TabsTrigger>
                            <TabsTrigger value="aktivitas" className="rounded-lg text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">
                              Aktivitas User
                            </TabsTrigger>
                            <TabsTrigger value="marketing" className="rounded-lg text-[11px] font-bold data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm">
                              Marketing
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="membership" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Calendar className="w-3 h-3"/> Tanggal Gabung</p>
                                <p className="font-semibold text-gray-800 text-sm">{customer.membership.joinDate}</p>
                              </div>
                              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3"/> Status Aktif</p>
                                <p className="font-semibold text-gray-800 text-sm">
                                  {customer.membership.isActive ? (
                                    <span className="text-emerald-500 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Aktif</span>
                                  ) : (
                                    <span className="text-red-500 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> Tidak Aktif</span>
                                  )}
                                </p>
                              </div>
                              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Gift className="w-3 h-3"/> Referral Code</p>
                                <p className="font-mono font-bold text-indigo-600 text-sm">{customer.membership.referralCode}</p>
                              </div>
                              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><UserCircle className="w-3 h-3"/> Kelahiran / Gender</p>
                                <p className="font-semibold text-gray-800 text-sm">{customer.dob} · {customer.gender}</p>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="interaksi" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4 flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Catatan Admin (CRM Insight)</h4>
                                <p className="text-sm font-medium text-amber-700 leading-relaxed">
                                  {customer.interactions.adminNotes}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-3">
                              <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                                <MessageSquare className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                <h4 className="text-xl font-bold text-gray-700">{customer.interactions.chats}</h4>
                                <p className="text-[9px] text-gray-400 font-bold uppercase">Chats CS</p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                                <AlertCircle className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                <h4 className="text-xl font-bold text-gray-700">{customer.interactions.complaints}</h4>
                                <p className="text-[9px] text-gray-400 font-bold uppercase">Komplain</p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                                <FileText className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                <h4 className="text-xl font-bold text-gray-700">{customer.interactions.tickets}</h4>
                                <p className="text-[9px] text-gray-400 font-bold uppercase">Tiket</p>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                                <Star className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                                <h4 className="text-xl font-bold text-gray-700">{customer.interactions.feedback}</h4>
                                <p className="text-[9px] text-gray-400 font-bold uppercase">Review</p>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="transaksi" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex justify-between items-end mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Transaksi</p>
                                <h3 className="text-2xl font-black text-gray-800">{customer.transactions.totalSpent}</h3>
                              </div>
                              <CreditCard className="w-8 h-8 text-emerald-200" />
                            </div>

                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1">Riwayat Pembelian</h4>
                              {customer.transactions.history.map((trx, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-gray-100 hover:bg-emerald-50/30 transition-colors">
                                  <div>
                                    <p className="font-bold text-sm text-gray-800">{trx.product}</p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">{trx.id} · {trx.date} · {trx.method}</p>
                                  </div>
                                  <p className="font-extrabold text-sm text-emerald-600">{trx.total}</p>
                                </div>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="aktivitas" className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Clock className="w-3 h-3"/> Login Terakhir</p>
                                <p className="font-semibold text-gray-800 text-sm">{customer.activity.lastLogin}</p>
                              </div>
                              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Smartphone className="w-3 h-3"/> Device Terdaftar</p>
                                <p className="font-semibold text-gray-800 text-sm">{customer.activity.device}</p>
                              </div>
                              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><MapPin className="w-3 h-3"/> Lokasi Login</p>
                                <p className="font-semibold text-gray-800 text-sm">{customer.activity.location}</p>
                              </div>
                              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Gamepad2 className="w-3 h-3"/> Durasi Sesi / Penggunaan</p>
                                <p className="font-semibold text-gray-800 text-sm">{customer.activity.duration}</p>
                              </div>
                            </div>
                            <div className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 flex items-start gap-3">
                              <Activity className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1">Aktivitas Terakhir di Aplikasi</h4>
                                <p className="text-sm font-medium text-indigo-700 leading-relaxed">
                                  {customer.activity.inApp}
                                </p>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="marketing" className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
                                <Share2 className="w-8 h-8 text-pink-500" />
                                <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Sumber Akuisisi</p>
                                  <p className="font-semibold text-gray-800 text-sm">{customer.marketing.source}</p>
                                </div>
                              </div>
                              <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex items-center gap-3">
                                <Gift className="w-8 h-8 text-amber-500" />
                                <div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Partisipasi Giveaway</p>
                                  <p className="font-semibold text-gray-800 text-sm">{customer.marketing.giveaway}</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider px-1 flex items-center gap-1.5"><Megaphone className="w-3.5 h-3.5" /> Campaign Terdaftar</h4>
                              {customer.marketing.campaigns.map((camp, i) => (
                                <div key={i} className="px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm text-sm font-medium text-gray-700 flex items-center justify-between">
                                  <span>{camp}</span>
                                  <BadgeCheck className="w-4 h-4 text-emerald-500" />
                                </div>
                              ))}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mt-2">
                               <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Mail className="w-3 h-3"/> Status Subscription</p>
                                <p className="font-semibold text-gray-800 text-sm">{customer.marketing.subscription}</p>
                              </div>
                               <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5"><Tag className="w-3 h-3"/> Status Promo</p>
                                <p className="font-semibold text-gray-800 text-sm">{customer.marketing.promoStatus}</p>
                              </div>
                            </div>
                          </TabsContent>

                        </Tabs>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-6 h-6 text-gray-300" />
                    <p>Customer CRM tidak ditemukan.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
