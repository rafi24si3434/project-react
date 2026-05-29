import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  PawPrint, 
  CalendarCheck, 
  Users, 
  ClipboardList, 
  Syringe, 
  Package, 
  Settings, 
  LogOut,
  Contact
} from "lucide-react";

const menuItems = [
  {
    group: "Utama",
    items: [
      { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
    ],
  },
  {
    group: "Manajemen",
    items: [
      { to: "/customers", label: "Customer CRM", icon: Contact },
      { to: "/pets", label: "Pets", icon: PawPrint },
      { to: "/appointments", label: "Appointments", icon: CalendarCheck },
      { to: "/pet-owners", label: "Pet Owners", icon: Users },
    ],
  },
  {
    group: "Klinik",
    items: [
      { to: "/medical-records", label: "Rekam Medis", icon: ClipboardList },
      { to: "/vaccinations", label: "Vaksinasi", icon: Syringe },
      { to: "/inventory", label: "Inventori", icon: Package },
    ],
  },
];

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-white border-r shadow-sm p-4 flex flex-col justify-between">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 px-2 py-1">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-emerald-200">
            <PawPrint className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            PetCare <span className="text-emerald-500">CRM</span>
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-6 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
          {menuItems.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">
                {group.group}
              </p>
              <div className="space-y-1">
                {group.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={itemIdx}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                         ${
                           isActive
                             ? "bg-emerald-500 text-white shadow-md shadow-emerald-150"
                             : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                         }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${
                              isActive ? "text-white" : "text-gray-400 group-hover:text-emerald-500"
                            }`}
                          />
                          <span>{item.label}</span>
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="pt-4 border-t border-gray-150 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
             ${
               isActive
                 ? "bg-emerald-500 text-white shadow-md"
                 : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
             }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings
                className={`w-5 h-5 transition-transform duration-200 group-hover:rotate-45 ${
                  isActive ? "text-white" : "text-gray-400 group-hover:text-emerald-500"
                }`}
              />
              <span>Pengaturan</span>
            </>
          )}
        </NavLink>
        <button
          onClick={() => navigate("/login")}
          className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer group"
        >
          <LogOut className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 text-red-400 group-hover:text-red-600" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}