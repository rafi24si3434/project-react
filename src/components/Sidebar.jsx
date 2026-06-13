import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
  Contact,
  Megaphone,
  Star,
  Stethoscope,
  User,
  ShoppingBag,
  Receipt
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const { profile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/login");
    }
  };

  const role = profile?.role || "customer";

  // Build filtered menu items dynamically based on user role
  const getMenuItems = () => {
    const items = [];

    // 1. Group Utama
    items.push({
      group: "Utama",
      items: [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
      ],
    });

    // 2. Group CRM & Pemasaran (Admin & Staff only)
    if (role === "admin" || role === "staff") {
      items.push({
        group: "CRM & Pemasaran",
        items: [
          { to: "/customers", label: "Customer CRM", icon: Contact },
          { to: "/campaigns", label: "Campaign Promo", icon: Megaphone },
          { to: "/feedback", label: "Feedback & Komplain", icon: Star },
        ],
      });
    }

    // 3. Group Manajemen
    const managementItems = [
      { to: "/pets", label: "Pets", icon: PawPrint },
      { to: "/appointments", label: "Appointments", icon: CalendarCheck },
    ];
    if (role === "admin" || role === "staff") {
      managementItems.push({ to: "/pet-owners", label: "Pet Owners", icon: Users });
      managementItems.push({ to: "/vets", label: "Dokter & Staf", icon: Stethoscope });
    }
    if (role === "admin") {
      managementItems.push({ to: "/users", label: "Manajemen User", icon: Users });
    }
    items.push({
      group: "Manajemen",
      items: managementItems,
    });

    // 4. Group Klinik
    const klinikItems = [
      { to: "/medical-records", label: "Rekam Medis", icon: ClipboardList },
      { to: "/vaccinations", label: "Vaksinasi", icon: Syringe },
    ];
    if (role === "admin" || role === "staff") {
      klinikItems.push({ to: "/inventory", label: "Inventori", icon: Package });
    }
    items.push({
      group: "Klinik",
      items: klinikItems,
    });

    // 5. Group Toko (Customer Only)
    if (role === "customer") {
      items.push({
        group: "Toko & Belanja",
        items: [
          { to: "/shop", label: "Toko Online", icon: ShoppingBag },
          { to: "/orders", label: "Pesanan Saya", icon: Receipt },
        ],
      });
    }

    return items;
  };

  const menuItems = getMenuItems();

  return (
    <div className="h-screen bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] p-4 flex flex-col justify-between relative overflow-hidden">
      
      <div className="relative z-10">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 px-2 py-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <PawPrint className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            PetCare <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">CRM</span>
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-6 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {menuItems.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5 text-left">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">
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
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group relative
                         ${
                           isActive
                             ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20"
                             : "text-gray-650 hover:bg-emerald-50/80 hover:text-emerald-600"
                         }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${
                              isActive ? "text-white" : "text-gray-400 group-hover:text-emerald-500"
                            }`}
                          />
                          <span className="relative z-10">{item.label}</span>
                          {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                          )}
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
      <div className="pt-4 border-t border-gray-100 space-y-2 relative z-10 text-left">
        {/* Profile Link (All Roles) */}
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group
             ${
               isActive
                 ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20"
                 : "text-gray-650 hover:bg-gray-50 hover:text-gray-900"
             }`
          }
        >
          {({ isActive }) => (
            <>
              <User
                className={`w-5 h-5 transition-transform duration-300 ${
                  isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              <span>Profil Saya</span>
            </>
          )}
        </NavLink>

        {/* Settings Link (Admin & Staff Only) */}
        {(role === "admin" || role === "staff") && (
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group
               ${
                 isActive
                   ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20"
                   : "text-gray-650 hover:bg-gray-50 hover:text-gray-900"
               }`
            }
          >
            {({ isActive }) => (
              <>
                <Settings
                  className={`w-5 h-5 transition-transform duration-500 group-hover:rotate-90 ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
                <span>Pengaturan</span>
              </>
            )}
          </NavLink>
        )}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 text-gray-650 hover:bg-red-50 hover:text-red-650 cursor-pointer group border border-transparent"
        >
          <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1 text-gray-400 group-hover:text-red-500" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}