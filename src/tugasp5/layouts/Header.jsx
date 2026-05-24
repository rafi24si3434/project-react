import { useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";

export default function Header() {
  const [search, setSearch] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="flex justify-between items-center bg-white/80 backdrop-blur-md px-6 py-4 border-b border-gray-100 sticky top-0 z-40 shadow-sm transition-all">
      
      {/* 🔍 Search - Dibuat responsif dan membulat (pill shape) */}
      <div className="relative w-full max-w-md hidden md:block group">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Cari game atau top up..."
          className="w-full pl-5 pr-12 py-2.5 rounded-full border-2 border-transparent bg-gray-50 focus:bg-white focus:border-violet-100 focus:outline-none focus:ring-4 focus:ring-violet-500/10 text-sm text-gray-700 transition-all placeholder-gray-400"
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-violet-500 p-2 rounded-full text-white cursor-pointer hover:bg-violet-600 hover:scale-105 transition-all shadow-md shadow-violet-500/20">
          <FaSearch className="text-xs" />
        </div>
      </div>

      {/* 🔥 Right Section */}
      <div className="flex items-center gap-3 md:gap-5 w-full md:w-auto justify-end">
        
        {/* 🔔 Notification */}
        <div className="relative">
          <div
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative bg-indigo-50 hover:bg-indigo-100 p-2.5 rounded-2xl cursor-pointer transition-colors"
          >
            <FaBell className="text-indigo-600 text-lg" />
            <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
              3
            </span>
          </div>

          {/* Dropdown Notifikasi */}
          {notifOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-white shadow-[0_10px_40px_rgb(0,0,0,0.08)] rounded-2xl p-4 text-sm z-50 border border-gray-50 animate-fade-in">
              <div className="flex justify-between items-center mb-3">
                <p className="font-bold text-gray-800">Notifikasi</p>
                <span className="text-xs text-violet-500 cursor-pointer hover:underline">Tandai dibaca</span>
              </div>
              <div className="flex flex-col gap-3">
                <p className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <span className="bg-green-100 p-1.5 rounded-lg text-green-600">✔</span> Top up berhasil
                </p>
                <p className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <span className="bg-blue-100 p-1.5 rounded-lg text-blue-600">💰</span> Pembayaran masuk
                </p>
                <p className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <span className="bg-orange-100 p-1.5 rounded-lg text-orange-500">⚠</span> Pending order
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 📊 Chart */}
        <div className="bg-sky-50 hover:bg-sky-100 p-2.5 rounded-2xl cursor-pointer hover:-translate-y-1 transition-all">
          <FcAreaChart className="text-lg" />
        </div>

        {/* ⚙️ Settings */}
        <div className="bg-rose-50 hover:bg-rose-100 p-2.5 rounded-2xl cursor-pointer hover:rotate-90 transition-all duration-300">
          <SlSettings className="text-rose-500 text-lg" />
        </div>

        {/* Garis Pemisah (Divider) */}
        <div className="hidden md:block w-px h-8 bg-gray-200 mx-2"></div>

        {/* 👤 Profile */}
        <div className="relative flex items-center gap-3">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-xs text-gray-400 font-medium">Welcome back,</span>
            <span className="text-sm text-gray-800 font-bold">Muhammad Rafi</span>
          </div>

          <img
            onClick={() => setProfileOpen(!profileOpen)}
            src="/img/rafijelek.jpeg"
            alt="Profile"
            className="w-11 h-11 rounded-full cursor-pointer border-2 border-transparent hover:border-violet-500 p-0.5 transition-all shadow-sm"
          />

          {/* Dropdown Profile */}
          {profileOpen && (
            <div className="absolute right-0 top-14 bg-white shadow-[0_10px_40px_rgb(0,0,0,0.08)] rounded-2xl w-48 p-2 text-sm z-50 border border-gray-50 animate-fade-in">
              <div className="p-2 border-b border-gray-50 mb-1 lg:hidden">
                <p className="font-bold text-gray-800">Muhammad Rafi</p>
              </div>
              <p className="cursor-pointer px-3 py-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors font-medium">
                Profil Saya
              </p>
              <p className="cursor-pointer px-3 py-2 text-gray-600 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-colors font-medium">
                Pengaturan
              </p>
              <p className="cursor-pointer px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium mt-1 border-t border-gray-50 pt-2">
                Keluar
              </p>
            </div>
          )}

          {/* More Button - Diperhalus */}
          <div className="w-9 h-9 bg-gray-800 hover:bg-gray-900 rounded-xl flex items-center justify-center text-white cursor-pointer shadow-md hover:shadow-lg transition-all ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}