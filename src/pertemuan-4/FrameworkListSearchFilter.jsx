import React, { useState, useMemo } from "react";
import frameworkData from "./framework.json";

// Mengambil semua tag unik dari frameworkData secara dinamis
const allTags = [
  "Semua Kategori", // Opsi default untuk menampilkan semua
  ...new Set(frameworkData.flatMap((item) => item.tags))
].sort();

export default function FrameworkListSearchFilter() {
  // 1. State untuk pencarian teks dan filter tag
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("Semua Kategori");

  // 2. Logika filter gabungan (Search + Tag Filter)
  const filteredFrameworks = useMemo(() => {
    return frameworkData.filter((item) => { 
      // Cek kecocokan teks pencarian
      const lowerCaseQuery = searchTerm.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(lowerCaseQuery) ||
        item.details.developer.toLowerCase().includes(lowerCaseQuery) ||
        item.description.toLowerCase().includes(lowerCaseQuery) ||
        item.tags.some((tag) => tag.toLowerCase().includes(lowerCaseQuery));

      // Cek kecocokan kategori (Dropdown)
      const matchesTag =
        selectedTag === "Semua Kategori" || item.tags.includes(selectedTag);

      // Keduanya harus bernilai true agar item ditampilkan
      return matchesSearch && matchesTag;
    });
  }, [searchTerm, selectedTag]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans relative overflow-hidden">
      
      {/* Header UNLUCKYY DEV */}
      <header className="w-full py-5 px-6 sm:px-8 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl relative z-20 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-start">
          <h1 className="text-2xl font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-500 hover:scale-105 transition-transform duration-300 cursor-default">
            UNLUCKYY DEV
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow py-16 px-4 sm:px-6 lg:px-8 relative">
        {/* Background Glow Ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* Header Ultra-Modern */}
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 tracking-tight mb-6 pb-2">
              Framework Directory
            </h2>
            <p className="text-lg md:text-xl text-slate-400 leading-relaxed font-light">
              Katalog teknologi dan framework modern yang menggerakkan ekosistem pengembangan web masa kini.
            </p>
          </div>

          {/* Kontrol Pencarian dan Filter */}
          <div className="max-w-4xl mx-auto mb-16 flex flex-col md:flex-row gap-4 relative">
            
            {/* Input Search Term */}
            <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                className="w-full bg-slate-900/80 backdrop-blur-xl border border-slate-700 text-slate-200 rounded-2xl py-4 pl-12 pr-4 shadow-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300 placeholder-slate-500"
                placeholder="Cari framework..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-0 -z-10 bg-indigo-500/0 group-focus-within:bg-indigo-500/10 blur-xl transition-all duration-500 rounded-2xl"></div>
            </div>

            {/* Dropdown Filter (Select Tag) */}
            <div className="relative min-w-[240px] group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
              </div>
              <select
                className="w-full appearance-none bg-slate-900/80 backdrop-blur-xl border border-slate-700 text-slate-200 rounded-2xl py-4 pl-12 pr-10 shadow-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300 cursor-pointer"
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
              >
                {allTags.map((tag, index) => (
                  <option key={index} value={tag} className="bg-slate-900 text-slate-200">
                    {tag}
                  </option>
                ))}
              </select>
              {/* Custom Arrow Icon for Select */}
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              <div className="absolute inset-0 -z-10 bg-purple-500/0 group-focus-within:bg-purple-500/10 blur-xl transition-all duration-500 rounded-2xl"></div>
            </div>
          </div>

          {/* Empty State jika filter tidak cocok */}
          {filteredFrameworks.length === 0 && (
            <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed max-w-2xl mx-auto">
              <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">Tidak ada kecocokan</h3>
              <p className="text-slate-500">
                Tidak ditemukan hasil untuk "{searchTerm}" pada kategori "{selectedTag}".
              </p>
              <button 
                onClick={() => { setSearchTerm(""); setSelectedTag("Semua Kategori"); }}
                className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors text-sm font-medium"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* Grid Layout Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredFrameworks.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 hover:border-indigo-500/50 shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 ease-out hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"></div>

                <div className="mb-8 relative z-10 flex-grow">
                  <h3 className="text-3xl font-bold text-slate-100 mb-4 group-hover:text-indigo-400 transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-slate-400 text-base leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-auto relative z-10">
                  <div className="flex flex-col gap-3 mb-6 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/50">
                    <div className="flex items-center text-sm text-slate-300">
                      <svg className="w-4 h-4 mr-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                      </svg>
                      <span className="font-medium text-slate-200">{item.details.developer}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                      <svg className="w-4 h-4 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span>Dirilis pada {item.details.releaseYear}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 group-hover:border-indigo-500/30 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={item.details.officialWebsite}
                    className="group/btn relative overflow-hidden flex items-center justify-center w-full bg-slate-800 text-white font-medium py-3.5 px-4 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-indigo-500/25 border border-slate-700 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="relative z-10 flex items-center text-sm group-hover/btn:text-white transition-colors">
                      Kunjungi Website
                      <svg className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer DIBUAT OLEH MUHAMMAD RAFI */}
      <footer className="w-full py-6 mt-auto border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-md relative z-20 text-center">
        <p className="text-slate-400 text-sm tracking-widest font-medium">
          DIBUAT OLEH <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 ml-1">MUHAMMAD RAFI</span>
        </p>
      </footer>

    </div>
  );
}