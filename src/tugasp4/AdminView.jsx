import data from "./services.json";
import { useState } from "react";

export default function AdminView() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "" || item.category === category)
  );

  // Helper untuk warna kategori otomatis
  const getCategoryColor = (cat) => {
    const colors = {
      IT: "bg-blue-100 text-blue-700 border-blue-200",
      Design: "bg-pink-100 text-pink-700 border-pink-200",
      Marketing: "bg-purple-100 text-purple-700 border-purple-200",
      Business: "bg-amber-100 text-amber-700 border-amber-200",
    };
    return colors[cat] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Panel <span className="text-indigo-600">Manajemen</span>
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Pantau dan kelola seluruh daftar lowongan yang tersedia.
          </p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 bg-indigo-50 rounded-lg text-indigo-700 text-sm font-bold border border-indigo-100">
             Total: {filtered.length} Data
           </div>
        </div>
      </div>

      {/* SEARCH & FILTER BOX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-lg shadow-indigo-200">
        <div className="md:col-span-2 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-indigo-300">
            🔍
          </span>
          <input 
            type="text"
            placeholder="Cari nama lowongan atau posisi..." 
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-sm text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all"
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        <div className="relative">
          <select 
            onChange={(e) => setCategory(e.target.value)} 
            className="w-full px-4 py-3 bg-white border-none rounded-xl text-sm text-indigo-900 font-bold cursor-pointer shadow-sm focus:ring-4 focus:ring-indigo-400/30 transition-all appearance-none"
          >
            <option value="">Semua Kategori</option>
            <option value="IT">IT & Tech</option>
            <option value="Design">Creative Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Business">Business Savy</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-indigo-600">
            ▼
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-widest text-[10px] font-black">
              <tr>
                <th className="px-8 py-5">Nama Lowongan</th>
                <th className="px-6 py-5">Kategori</th>
                <th className="px-6 py-5">Gaji Estimasi</th>
                <th className="px-6 py-5">Lokasi Kantor</th>
                <th className="px-8 py-5 text-center">Rating</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 text-slate-700">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-indigo-50/30 transition-all duration-300 group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">ID: #{item.id.toString().slice(0,5)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 border rounded-full text-[10px] font-black uppercase tracking-tight ${getCategoryColor(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-700">
                        <span className="text-emerald-500">Rp</span>
                        {item.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-500">
                        <span>📍</span>
                        <span className="truncate max-w-[150px]">{item.provider?.location || "Remote"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full text-xs font-black text-amber-600">
                        ⭐ {item.rating}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center opacity-40">
                      <div className="text-6xl mb-4">🏜️</div>
                      <span className="text-lg font-bold text-slate-900">Data Tidak Ditemukan</span>
                      <p className="text-sm text-slate-500">Coba kata kunci atau kategori lain.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}