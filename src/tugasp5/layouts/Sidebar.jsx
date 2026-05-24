import { useState } from "react";
import { FaGamepad, FaHistory, FaFire } from "react-icons/fa";

export default function Sidebar() {
  const [active, setActive] = useState("dashboard");

  const menu = [
    { name: "Dashboard", icon: <FaGamepad />, key: "dashboard" },
    { name: "Top Up", icon: <FaFire />, key: "topup" },
    { name: "History", icon: <FaHistory />, key: "history" },
  ];

  return (
    <aside className="w-72 h-screen bg-white border-r border-gray-100 flex flex-col justify-between px-6 py-8 sticky top-0">
      
      {/* Top Section: Logo & Menu */}
      <div>
        {/* Logo */}
        <div className="mb-10 pl-2">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            TopUp
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-fuchsia-500">.</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-medium tracking-wide uppercase">Game Store Dashboard</p>
        </div>

        {/* Menu */}
        <ul className="space-y-2">
          {menu.map((item) => {
            const isActive = active === item.key;
            
            return (
              <li
                key={item.key}
                onClick={() => setActive(item.key)}
                className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-300
                  ${
                    isActive
                      ? "bg-violet-50 text-violet-700 font-bold shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800 hover:translate-x-1"
                  }`}
              >
                {/* Ikon Menu */}
                <div 
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? "bg-white text-violet-600 shadow-sm" 
                      : "text-gray-400 group-hover:text-violet-500 group-hover:bg-white group-hover:shadow-sm"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                </div>
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom Section: Footer & Promo Card */}
      <div>
        {/* Promo Card Gradient */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl p-5 text-white shadow-lg shadow-violet-500/30">
          
          {/* Efek Blur/Cahaya di dalam card */}
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-black/10 rounded-full blur-2xl"></div>

          <div className="relative z-10 flex justify-between items-center">
            <div className="w-2/3">
              <p className="text-sm font-bold leading-snug mb-1">
                Top up game favoritmu sekarang!
              </p>
              <p className="text-[10px] text-violet-100 mb-3">
                Dapatkan promo spesial hari ini.
              </p>
              <button className="bg-white text-violet-600 hover:bg-gray-50 text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:scale-105 transition-all">
                + Top Up
              </button>
            </div>

            <img
              src="/img/cs2.png"
              alt="Promo"
              className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-md transform rotate-3 hover:rotate-0 transition-all"
            />
          </div>
        </div>

        {/* Copyright Texts */}
        <div className="mt-6 text-center">
          <p className="text-[11px] font-medium text-gray-400">
            TopUp Game Dashboard
          </p>
          <p className="text-[11px] text-gray-300 mt-0.5">
            © 2026 All Rights Reserved
          </p>
        </div>
      </div>
    </aside>
  );
}