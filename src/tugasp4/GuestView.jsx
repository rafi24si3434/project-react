import data from "./services.json";
import { useState } from "react";

export default function GuestView() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "" || item.category === category) &&
    (location === "" || item.provider.location === location)
  );

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* TITLE SECTION */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Eksplorasi <span className="text-indigo-600">Karirmu</span>
        </h2>
        <p className="text-slate-500 font-medium italic">
          Temukan ribuan peluang kerja yang sesuai dengan passion dan keahlianmu.
        </p>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2 relative">
          <input 
            placeholder="Cari posisi pekerjaan (cth: Frontend Developer)..." 
            className="w-full pl-4 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            onChange={(e) => setSearch(e.target.value)} 
          />
        </div>

        <select 
          onChange={(e) => setCategory(e.target.value)} 
          className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-semibold text-slate-700 cursor-pointer focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Semua Bidang</option>
          <option>IT</option>
          <option>Design</option>
          <option>Marketing</option>
          <option>Business</option>
        </select>

        <select 
          onChange={(e) => setLocation(e.target.value)} 
          className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm font-semibold text-slate-700 cursor-pointer focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Semua Lokasi</option>
          <option>Jakarta</option>
          <option>Bandung</option>
          <option>Surabaya</option>
          <option>Bali</option>
        </select>
      </div>

      {/* JOBS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div 
            key={item.id} 
            className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
          >
            {/* Image Section dengan Overlay */}
            <div className="relative h-48 overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                  {item.category}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-slate-400">
                  <span className="text-xs font-semibold">📍 {item.provider.location}</span>
                  <span className="text-xs opacity-50">•</span>
                  <span className="text-xs font-semibold">Full-time</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Estimasi Gaji</span>
                  <p className="text-lg font-black text-indigo-600">
                    ${item.price}<span className="text-xs text-slate-400 font-medium">/bln</span>
                  </p>
                </div>
                <button className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200">
                  Detail
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <div className="text-5xl mb-4">🔎</div>
          <h3 className="text-xl font-bold text-slate-800">Ups! Lowongan tidak ditemukan</h3>
          <p className="text-slate-500">Coba ubah kriteria pencarian atau lokasi Anda.</p>
        </div>
      )}
    </div>
  );
}