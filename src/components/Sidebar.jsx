import { NavLink, useNavigate } from "react-router-dom";
import {
  FaThLarge,
  FaPaw,
  FaCalendarCheck,
  FaUserFriends,
  FaFileMedical,
  FaSyringe,
  FaBoxOpen,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const menuItems = [
  {
    group: "Utama",
    items: [
      { to: "/", label: "Dashboard", icon: FaThLarge, end: true },
    ],
  },
  {
    group: "Manajemen",
    items: [
      { to: "/pets", label: "Pets", icon: FaPaw },
      { to: "/appointments", label: "Appointments", icon: FaCalendarCheck },
      { to: "/pet-owners", label: "Pet Owners", icon: FaUserFriends },
    ],
  },
  {
    group: "Klinik",
    items: [
      { to: "/medical-records", label: "Rekam Medis", icon: FaFileMedical },
      { to: "/vaccinations", label: "Vaksinasi", icon: FaSyringe },
      { to: "/inventory", label: "Inventori", icon: FaBoxOpen },
    ],
  },
];

const todayAppointments = [
  { emoji: "🐱", name: "Mochi", time: "09:30", status: "Sekarang" },
  { emoji: "🐶", name: "Rex", time: "10:45", status: "Berikutnya" },
  { emoji: "🐰", name: "Lola", time: "13:00", status: "Menunggu" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 cursor-pointer
     ${
       isActive
         ? "bg-emerald-500 text-white font-medium shadow-md shadow-emerald-200"
         : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
     }`;

  const iconClass = (isActive) =>
    `text-base flex-shrink-0 ${isActive ? "text-white" : "text-gray-400"}`;

  return (
    <div className="w-64 h-screen bg-white flex flex-col border-r border-gray-100 overflow-hidden">

      {/* ── Logo ── */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-lg shadow-md shadow-emerald-200">
            🐾
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800 leading-none">PetCare</h1>
            <p className="text-[10px] text-emerald-500 font-medium tracking-wide uppercase">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* ── Dokter on duty ── */}
      <div className="mx-4 mt-4 mb-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl px-4 py-3 border border-emerald-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-200 flex items-center justify-center text-lg flex-shrink-0">
            👩‍⚕️
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">dr. Sari Pratiwi, drh.</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              <p className="text-[10px] text-emerald-600">Sedang Bertugas</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-4 scrollbar-none">
        {menuItems.map((group) => (
          <div key={group.group}>
            <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest px-3 mb-1.5">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end} className={menuClass}>
                    {({ isActive }) => (
                      <>
                        <Icon className={iconClass(isActive)} />
                        <span className="truncate">{label}</span>
                        {label === "Appointments" && (
                          <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white text-emerald-600" : "bg-emerald-100 text-emerald-600"}`}>
                            8
                          </span>
                        )}
                        {label === "Pets" && (
                          <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white text-emerald-600" : "bg-gray-100 text-gray-500"}`}>
                            312
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* ── Jadwal Hari Ini ── */}
        <div>
          <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-widest px-3 mb-1.5">
            Jadwal Hari Ini
          </p>
          <div className="bg-gray-50 rounded-2xl p-3 space-y-2 border border-gray-100">
            {todayAppointments.map((apt, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white border border-gray-100 flex items-center justify-center text-sm flex-shrink-0 shadow-sm">
                  {apt.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700 truncate">{apt.name}</p>
                  <p className="text-[10px] text-gray-400">{apt.time}</p>
                </div>
                <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                  apt.status === "Sekarang"
                    ? "bg-emerald-100 text-emerald-700"
                    : apt.status === "Berikutnya"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {apt.status}
                </span>
              </div>
            ))}
            <NavLink
              to="/appointments"
              className="block text-center text-[10px] text-emerald-500 font-medium pt-1 hover:text-emerald-600 transition"
            >
              Lihat semua →
            </NavLink>
          </div>
        </div>
      </nav>

      {/* ── Footer ── */}
      <div className="px-4 pb-5 pt-3 border-t border-gray-100 space-y-2">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition cursor-pointer"
        >
          <FaCog className="text-base text-gray-400" />
          Pengaturan
        </NavLink>
        <button 
          onClick={() => navigate("/login")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-50 hover:text-red-500 transition cursor-pointer"
        >
          <FaSignOutAlt className="text-base" />
          Keluar
        </button>
        <p className="text-[10px] text-gray-300 text-center pt-1">
          PetCare © 2026 · All rights reserved
        </p>
      </div>
    </div>
  );
}