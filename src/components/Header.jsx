import { useState } from "react";
import { FaBell, FaSearch, FaPaw, FaCalendarCheck } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";

const notifications = [
  { emoji: "🐱", text: "Mochi sudah check-in", time: "2 menit lalu", unread: true },
  { emoji: "💉", text: "Jadwal vaksin Rex jam 10:45", time: "15 menit lalu", unread: true },
  { emoji: "📋", text: "Rekam medis Lola diperbarui", time: "1 jam lalu", unread: false },
  { emoji: "🐶", text: "Bruno selesai post-op checkup", time: "2 jam lalu", unread: false },
];

export default function Header() {
  const [showNotif, setShowNotif] = useState(false);
  const [query, setQuery] = useState("");
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative flex justify-between items-center bg-white border-b border-gray-100 px-6 py-3.5 z-50">

      {/* ── Left: greeting + date ── */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-lg">👋</span>
          <p className="text-sm font-semibold text-gray-800">
            Selamat Pagi, <span className="text-emerald-500">dr. Sari!</span>
          </p>
        </div>
        <p className="text-[11px] text-gray-400 mt-0.5 pl-7">
          Senin, 5 Mei 2026 · 24 kunjungan terjadwal hari ini
        </p>
      </div>

      {/* ── Center: Search ── */}
      <div className="relative w-[340px]">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari pasien, pemilik, diagnosa..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:bg-white text-sm text-gray-700 placeholder-gray-300 transition"
        />
        {query && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/80 overflow-hidden z-50">
            <div className="px-4 py-2 border-b border-gray-50">
              <p className="text-[10px] text-gray-300 uppercase tracking-widest font-semibold">Hasil Pencarian</p>
            </div>
            {[
              { emoji: "🐱", name: "Mochi", sub: "Kucing Persia · Budi S." },
              { emoji: "🐶", name: "Rex", sub: "Golden Retriever · Rina A." },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition">
                <span className="text-lg">{r.emoji}</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">{r.name}</p>
                  <p className="text-[11px] text-gray-400">{r.sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Right: actions + profile ── */}
      <div className="flex items-center gap-2">

        {/* Quick stats pill */}
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2 mr-1">
          <FaPaw className="text-emerald-400 text-xs" />
          <span className="text-xs font-semibold text-emerald-600">312</span>
          <span className="text-[10px] text-emerald-400">pasien aktif</span>
        </div>

        {/* Appointments quick */}
        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mr-1">
          <FaCalendarCheck className="text-blue-400 text-xs" />
          <span className="text-xs font-semibold text-blue-600">8</span>
          <span className="text-[10px] text-blue-400">antrian</span>
        </div>

        {/* Notification */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition cursor-pointer"
          >
            <FaBell className="text-gray-400 text-sm" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown notif */}
          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-gray-100 shadow-2xl shadow-gray-200/60 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-700">Notifikasi</p>
                <span className="text-[10px] text-emerald-500 font-medium cursor-pointer hover:underline">
                  Tandai semua dibaca
                </span>
              </div>
              {notifications.map((n, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-none hover:bg-gray-50 cursor-pointer transition ${n.unread ? "bg-emerald-50/40" : ""}`}
                >
                  <span className="text-lg mt-0.5 flex-shrink-0">{n.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 leading-snug">{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                  {n.unread && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition cursor-pointer">
          <SlSettings className="text-gray-400 text-sm" />
        </button>

        {/* Divider */}
        <div className="w-px h-7 bg-gray-100 mx-1"></div>

        {/* Profile */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-200 flex-shrink-0">
            SP
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-gray-800 leading-none">dr. Sari Pratiwi</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Dokter Hewan</p>
          </div>
          <div className="w-4 flex flex-col gap-0.5 ml-0.5">
            <span className="block h-px w-3.5 bg-gray-300 group-hover:bg-gray-500 transition"></span>
            <span className="block h-px w-2.5 bg-gray-300 group-hover:bg-gray-500 transition"></span>
          </div>
        </div>

      </div>

      {/* Click outside to close notif */}
      {showNotif && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
      )}
    </div>
  );
}