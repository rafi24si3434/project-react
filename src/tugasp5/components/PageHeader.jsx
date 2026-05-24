import { FaSearch, FaPlus } from "react-icons/fa";

export default function PageHeader({ 
  searchTerm, 
  setSearchTerm, 
  activeCategory, 
  setActiveCategory, 
  categories = ["All", "MOBA", "Battle Royale", "FPS", "RPG"] 
}) {
  return (
    <div className="relative bg-white/80 backdrop-blur-2xl p-7 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col gap-6 mb-8 overflow-hidden transition-all">
      
      {/* 🎇 Decorative Glowing Blobs (Background) */}
      <div className="absolute -right-12 -top-12 w-48 h-48 bg-violet-400/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-fuchsia-400/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* 🔝 Top Section: Title & Action Button */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {/* Gradient Text Premium */}
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-500">
            Katalog Top Up
          </h1>

          {/* Breadcrumb Modern */}
          <div className="flex items-center gap-2 text-sm font-medium mt-2">
            <span className="text-gray-400 hover:text-violet-500 transition-colors cursor-pointer">Dashboard</span>
            <span className="text-gray-300">•</span>
            <span className="text-violet-600 bg-violet-50 px-3 py-1 rounded-lg border border-violet-100">Katalog Game</span>
          </div>
        </div>

        {/* Action Button Klasik & Elegan */}
        <button className="group flex items-center gap-3 bg-gray-900 hover:bg-black text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xl shadow-gray-900/20 transition-all duration-300 hover:-translate-y-1">
          <div className="bg-white/20 p-1.5 rounded-full group-hover:rotate-90 transition-transform duration-300">
            <FaPlus className="text-xs" />
          </div>
          Tambah Game
        </button>
      </div>

      <hr className="border-gray-100 relative z-10" />

      {/* 🎛️ Bottom Section: Interactive Controls */}
      <div className="relative z-10 flex flex-col xl:flex-row gap-5 items-center justify-between">
        
        {/* 🔍 Search Bar Pro */}
        <div className="relative w-full xl:w-1/2 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-violet-500">
            <FaSearch className="text-gray-400 group-focus-within:text-violet-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari game favoritmu (Cth: Valorant, Free Fire)..."
            className="w-full pl-12 pr-16 py-3.5 bg-gray-50/50 hover:bg-gray-50 border border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 focus:bg-white transition-all shadow-sm font-medium"
          />
          {/* Fake Shortcut Badge (Hanya visual agar terlihat pro) */}
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <span className="bg-white border border-gray-200 text-gray-400 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              ⌘K
            </span>
          </div>
        </div>

        {/* 🏷️ Filter Category Pills (Pengganti Dropdown) */}
        <div className="w-full xl:w-auto overflow-x-auto scrollbar-hide pb-2 xl:pb-0">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30 transform -translate-y-0.5"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 hover:shadow-sm"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}