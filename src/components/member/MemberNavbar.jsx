import React from "react";
import { PawPrint, ShoppingBag, Receipt, User, LogOut, Bell, Search, ChevronDown } from "lucide-react";

export default function MemberNavbar({ profile, tierColor, loyaltyTier, handleLogout, setActiveTab, setSubTab, navigate }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 shadow-lg shadow-slate-200/20 px-6 py-4 text-left">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-105">
            <PawPrint className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              PetCare <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Portal</span>
            </h1>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider hidden sm:block">Customer Area</p>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari produk, jadwal, atau layanan..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-100/80 border border-slate-200/50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          <button 
            onClick={() => navigate("/")} 
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 cursor-pointer"
          >
            Beranda
          </button>
          <button 
            onClick={() => { setActiveTab("transactions"); setSubTab("catalog"); }} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" /> Toko
          </button>
          <button 
            onClick={() => { setActiveTab("transactions"); setSubTab("history"); }} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-300 cursor-pointer"
          >
            <Receipt className="w-4 h-4" /> Pesanan
          </button>
        </div>

        {/* User Info & Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button className="relative w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-all cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full text-[9px] text-white font-black flex items-center justify-center border-2 border-white">
              2
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div className="flex items-center gap-3 pl-3 pr-1 py-1 rounded-xl bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200/50 hover:shadow-md transition-all duration-300 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-800 leading-none">{profile?.full_name?.split(" ")[0]}</p>
              <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 mt-1 rounded-full bg-gradient-to-r ${tierColor}`}>
                {loyaltyTier}
              </span>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-sm shadow-md">
              {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 text-rose-500 hover:from-rose-100 hover:to-pink-100 transition-all duration-300 cursor-pointer border border-rose-100/50 group"
            title="Keluar dari Akun"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
}
