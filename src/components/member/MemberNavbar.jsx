import React from "react";
import { PawPrint, ShoppingBag, Receipt, User, LogOut } from "lucide-react";

export default function MemberNavbar({ profile, tierColor, loyaltyTier, handleLogout, setActiveTab, setSubTab, navigate }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.015)] px-6 py-4.5 text-left">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-500/10">
            <PawPrint className="w-5.5 h-5.5" />
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            PetCare <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Portal</span>
          </h1>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
          <button onClick={() => navigate("/")} className="hover:text-emerald-500 transition-colors cursor-pointer">Beranda</button>
          <button onClick={() => { setActiveTab("transactions"); setSubTab("catalog"); }} className="hover:text-emerald-500 transition-colors cursor-pointer flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Toko Obat</button>
          <button onClick={() => { setActiveTab("transactions"); setSubTab("history"); }} className="hover:text-emerald-500 transition-colors cursor-pointer flex items-center gap-2"><Receipt className="w-4 h-4" /> Pesanan Saya</button>
          <button onClick={() => { setActiveTab("overview"); }} className="hover:text-emerald-500 transition-colors cursor-pointer flex items-center gap-2"><User className="w-4 h-4" /> Profil</button>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-4.5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-800 leading-none">{profile?.full_name}</p>
            <span className={`inline-block text-[9px] font-black uppercase px-2.5 py-0.5 mt-1.5 rounded-full bg-gradient-to-r ${tierColor} border border-white/5`}>
              {loyaltyTier} Member
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition cursor-pointer border border-red-100/30"
            title="Keluar dari Akun"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
