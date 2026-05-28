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
    <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between z-50 sticky top-0">
      <input
        type="text"
        placeholder="Cari pasien..."
        className="border border-gray-200 rounded-xl px-4 py-2.5 w-80 focus:outline-none focus:ring-2 focus:ring-emerald-300"
      />

      <div className="flex items-center gap-4">
        {/* Settings and Notification */}
        <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition cursor-pointer"
          >
            <FaBell className="text-gray-400 text-sm" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
        </button>
        {showNotif && (
            <div className="absolute right-6 top-full mt-2 w-72 bg-white rounded-2xl border border-gray-100 shadow-2xl overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <p className="text-sm font-semibold text-gray-700">Notifikasi</p>
              </div>
              {notifications.map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 border-b border-gray-50">
                  <span className="text-lg mt-0.5">{n.emoji}</span>
                  <div>
                    <p className="text-xs font-medium text-gray-700">{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

        <div className="flex items-center gap-3 border-l border-gray-100 pl-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
            SP
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 text-sm">dr. Sari</h3>
            <p className="text-xs text-gray-500">Dokter Hewan</p>
          </div>
        </div>
      </div>
    </div>
  );
}