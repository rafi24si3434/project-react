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
    <div className="h-screen bg-white border-r shadow-sm p-4 flex flex-col">
      <h1 className="text-2xl font-bold text-emerald-500 mb-8 px-2">
        PetCare CRM
      </h1>

      <nav className="space-y-3 flex-1 overflow-y-auto">
        <NavLink to="/" end className={({ isActive }) => `block w-full text-left rounded-xl py-3 px-4 font-medium transition ${isActive ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
          Dashboard
        </NavLink>
        <NavLink to="/pets" className={({ isActive }) => `block w-full text-left rounded-xl py-3 px-4 font-medium transition ${isActive ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
          Pets
        </NavLink>
        <NavLink to="/appointments" className={({ isActive }) => `block w-full text-left rounded-xl py-3 px-4 font-medium transition ${isActive ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
          Appointments
        </NavLink>
        <NavLink to="/pet-owners" className={({ isActive }) => `block w-full text-left rounded-xl py-3 px-4 font-medium transition ${isActive ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
          Pet Owners
        </NavLink>
        <div className="pt-4 pb-2">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-4">Klinik</p>
        </div>
        <NavLink to="/medical-records" className={({ isActive }) => `block w-full text-left rounded-xl py-3 px-4 font-medium transition ${isActive ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
          Rekam Medis
        </NavLink>
        <NavLink to="/vaccinations" className={({ isActive }) => `block w-full text-left rounded-xl py-3 px-4 font-medium transition ${isActive ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
          Vaksinasi
        </NavLink>
        <NavLink to="/inventory" className={({ isActive }) => `block w-full text-left rounded-xl py-3 px-4 font-medium transition ${isActive ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>
          Inventori
        </NavLink>
      </nav>

      <div className="pt-4 border-t border-gray-100 space-y-2">
        <NavLink to="/settings" className="block w-full text-left rounded-xl py-3 px-4 font-medium transition text-gray-600 hover:bg-gray-100">
          Pengaturan
        </NavLink>
        <button onClick={() => navigate("/login")} className="block w-full text-left rounded-xl py-3 px-4 font-medium transition text-red-500 hover:bg-red-50">
          Keluar
        </button>
      </div>
    </div>
  );
}