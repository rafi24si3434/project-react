import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBell, FaSearch, FaChevronDown } from "react-icons/fa";

const notifications = [
  { emoji: "🐱", text: "Mochi sudah check-in", time: "2 menit lalu", unread: true },
  { emoji: "💉", text: "Jadwal vaksin Rex jam 10:45", time: "15 menit lalu", unread: true },
  { emoji: "📋", text: "Rekam medis Lola diperbarui", time: "1 jam lalu", unread: false },
  { emoji: "🐶", text: "Bruno selesai post-op checkup", time: "2 jam lalu", unread: false },
];

export default function Header() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [showNotif, setShowNotif] = useState(false);
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

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

  const getRoleLabel = (role) => {
    if (role === "admin") return "Administrator";
    if (role === "staff") return "Staf Klinik";
    if (role === "customer") return "Customer";
    return role || "Pengguna";
  };

  const userName = profile?.full_name || user?.email || "User";
  const userRole = getRoleLabel(profile?.role);
  const userInitials = getInitials(userName);

  return (
    <div className="bg-white/70 backdrop-blur-xl border-b border-gray-100 px-8 py-4 flex items-center justify-between z-40 sticky top-0 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
      {/* Search Bar */}
      <div 
        className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300 w-96 ${
          isFocused 
            ? "bg-white shadow-lg shadow-emerald-500/10 border border-emerald-200" 
            : "bg-gray-50/50 border border-gray-200/60 hover:bg-gray-50"
        }`}
      >
        <FaSearch className={`text-sm transition-colors duration-300 ${isFocused ? "text-emerald-500" : "text-gray-400"}`} />
        <input
          type="text"
          placeholder="Cari pasien, pemilik, atau rekam medis..."
          className="bg-transparent w-full text-sm focus:outline-none text-gray-700 placeholder-gray-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {/* Command shortcut hint */}
        <div className="hidden sm:flex items-center justify-center px-2 py-1 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-400">
          ⌘K
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Notification */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className={`relative w-11 h-11 flex items-center justify-center rounded-2xl transition-all duration-300 cursor-pointer ${
              showNotif ? "bg-emerald-50 text-emerald-600 shadow-inner" : "bg-white border border-gray-100 text-gray-400 hover:bg-gray-50 hover:text-emerald-500 shadow-sm"
            }`}
          >
            <FaBell className="text-[17px]" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-3 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotif && (
            <div className="absolute right-0 top-full mt-3 w-80 bg-white/95 backdrop-blur-xl rounded-3xl border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden z-50 transform origin-top-right transition-all">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 bg-gray-50/30">
                <p className="text-sm font-bold text-gray-800">Notifikasi</p>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {unreadCount} Baru
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n, i) => (
                  <div key={i} className={`flex items-start gap-4 px-5 py-3.5 border-b border-gray-50 transition-colors hover:bg-gray-50/50 cursor-pointer ${n.unread ? "bg-emerald-50/30" : ""}`}>
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-lg flex-shrink-0">
                      {n.emoji}
                    </div>
                    <div className="text-left">
                      <p className={`text-sm ${n.unread ? "font-semibold text-gray-800" : "font-medium text-gray-600"}`}>
                        {n.text}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                    {n.unread && (
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 ml-auto"></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 text-center border-t border-gray-50 hover:bg-gray-50/55 cursor-pointer transition-colors">
                <p className="text-xs font-semibold text-emerald-600">Lihat Semua Notifikasi</p>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div 
          onClick={() => navigate("/profile")}
          className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow duration-300">
              {userInitials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div className="hidden md:block text-left">
            <h3 className="font-bold text-gray-800 text-sm group-hover:text-emerald-600 transition-colors">{userName}</h3>
            <p className="text-xs text-gray-500 font-medium">{userRole}</p>
          </div>
          <FaChevronDown className="text-gray-400 text-xs ml-1 group-hover:text-emerald-500 transition-colors" />
        </div>
      </div>
    </div>
  );
}