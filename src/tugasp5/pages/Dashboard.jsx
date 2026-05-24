import { useState } from "react";
import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import PageHeader from "../components/PageHeader";
import { FaGamepad, FaUsers, FaMoneyBillWave, FaHistory, FaSyncAlt, FaSearch, FaChartLine, FaArrowAltCircleUp } from "react-icons/fa";

// 🏆 Komponen Card Premium
function Card({ icon, value, label, gradient, shadow }) {
  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
      <div className={`w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} ${shadow} text-white text-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
        <p className="text-2xl font-extrabold text-gray-800 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

// 📦 Komponen Item Legenda Donat (DIGUNAKAN DI GRAFIK)
function LegendItem({ color, label, percentage, value }) {
  return (
    <div className="flex justify-between items-center bg-gray-50/70 p-4 rounded-xl hover:bg-violet-50 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded ${color}`}></div>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-xs text-violet-600 bg-violet-100 px-2.5 py-1 rounded-full font-bold group-hover:scale-110 transition-transform">{percentage}</p>
      </div>
      <p className="text-sm font-extrabold text-gray-800 tracking-tight">{value}</p>
    </div>
  );
}

// 📈 Komponen Grafik Profesional (Mockup Visual Premium Tanpa Perpustakaan)
function ProfessionalCharts({ data }) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-violet-100 text-violet-600 text-xl">
              <FaChartLine />
            </div>
            Analisis Kinerja & Pertumbuhan
          </h2>
          <p className="text-sm text-gray-400 mt-1 pl-12">Visualisasi data bulanan Mei 2024</p>
        </div>
        
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-xl border border-emerald-100">
          <FaArrowAltCircleUp className="text-xl" />
          <div>
            <p className="text-xs font-semibold text-emerald-600">Pertumbuhan Bulan Ini</p>
            <p className="text-xl font-extrabold text-emerald-800">+18.5% <span className="text-sm font-medium text-emerald-600">vs April</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* 📊 Grafik Garis: Tren Pertumbuhan */}
        <div className="lg:col-span-2 relative">
          <p className="text-lg font-semibold text-gray-700 mb-7">Volume Transaksi & Pendapatan</p>
          
          <div className="relative h-64 w-full">
            {/* Sumbu X & Y */}
            <div className="absolute inset-0 border-b border-l border-gray-100"></div>
            
            {/* Svg Grafik Garis (Mockup Visual) */}
            <svg viewBox="0 0 500 200" className="w-full h-full">
              {/* Grid Lines (Horisontal) */}
              <line x1="0" y1="50" x2="500" y2="50" stroke="#f0f0f0" strokeDasharray="3 3"/>
              <line x1="0" y1="100" x2="500" y2="100" stroke="#f0f0f0" strokeDasharray="3 3"/>
              <line x1="0" y1="150" x2="500" y2="150" stroke="#f0f0f0" strokeDasharray="3 3"/>

              {/* Garis Pendapatan (Biru) */}
              <path d="M0,160 C50,140 100,100 150,120 C200,140 250,90 300,100 C350,110 400,60 450,70 C500,80" fill="none" stroke="#60A5FA" strokeWidth="4" />
              <path d="M0,160 C50,140 100,100 150,120 C200,140 250,90 300,100 C350,110 400,60 450,70 C500,80 L500,200 L0,200 Z" fill="url(#gradBlue)" opacity="0.1" />

              {/* Garis Transaksi (Violet) */}
              <path d="M0,180 C50,160 100,130 150,145 C200,160 250,110 300,120 C350,130 400,90 450,100 C500,110" fill="none" stroke="#A78BFA" strokeWidth="4" />
              <path d="M0,180 C50,160 100,130 150,145 C200,160 250,110 300,120 C350,130 400,90 450,100 C500,110 L500,200 L0,200 Z" fill="url(#gradViolet)" opacity="0.1" />

              {/* Defs untuk Gradien */}
              <defs>
                <linearGradient id="gradBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
                <linearGradient id="gradViolet" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>

              {/* Data Points (Titk Data) */}
              <circle cx="150" cy="120" r="5" fill="#60A5FA" stroke="white" strokeWidth="3" className="cursor-pointer hover:r-7 transition-all duration-300"/>
              <circle cx="150" cy="145" r="5" fill="#A78BFA" stroke="white" strokeWidth="3" className="cursor-pointer hover:r-7 transition-all duration-300"/>
              <circle cx="450" cy="70" r="5" fill="#60A5FA" stroke="white" strokeWidth="3" className="cursor-pointer hover:r-7 transition-all duration-300"/>
              <circle cx="450" cy="100" r="5" fill="#A78BFA" stroke="white" strokeWidth="3" className="cursor-pointer hover:r-7 transition-all duration-300"/>
            </svg>

            {/* Label Sumbu (Y - Pendapatan Kiri, Transaksi Kanan) */}
            <div className="absolute left-0 top-0 text-[10px] text-gray-400 -translate-x-10 h-full flex flex-col justify-between -translate-y-2 py-1 pr-1 font-medium text-right w-8">
              <span>Rp 20Jt</span>
              <span>Rp 10Jt</span>
              <span>0</span>
            </div>
             <div className="absolute right-0 top-0 text-[10px] text-gray-400 translate-x-10 h-full flex flex-col justify-between -translate-y-2 py-1 pl-1 font-medium w-8">
              <span>2.5K</span>
              <span>1.2K</span>
              <span>0</span>
            </div>

            {/* Label Sumbu (X - Waktu) */}
            <div className="absolute bottom-0 left-0 w-full flex justify-around text-xs text-gray-400 translate-y-7 font-medium">
              <span>Minggu 1</span>
              <span>Minggu 2</span>
              <span>Minggu 3</span>
              <span>Minggu 4</span>
              <span>Bulan Depan</span>
            </div>
          </div>
          
          {/* Legenda Bawah */}
          <div className="flex items-center gap-6 mt-14 pl-6">
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-violet-400 ring-2 ring-violet-200"></span>
              <p className="text-sm font-medium text-gray-600">Total Transaksi (Rata-rata: {Math.floor(data.topup / 4)}/Mgg)</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="w-3.5 h-3.5 rounded-full bg-blue-400 ring-2 ring-blue-200"></span>
              <p className="text-sm font-medium text-gray-600">Total Pendapatan (Rata-rata: Rp {Math.floor(parseInt(data.revenue.replace(/\./g, '')) / 4).toLocaleString('id-ID')}/Mgg)</p>
            </div>
          </div>
        </div>

        {/* 📊 Grafik Donat: Perincian Kategori */}
        <div className="lg:col-span-1 border-l border-gray-100 pl-10">
          <p className="text-lg font-semibold text-gray-700 mb-8">Perincian Berdasarkan Kategori Game</p>
          <div className="relative flex justify-center items-center h-56 mb-10 group">
            <svg viewBox="0 0 36 36" className="w-56 h-56 transform -rotate-90 group-hover:scale-105 transition-transform duration-500">
              {/* Latar Belakang Donat */}
              <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
              {/* Segmen: MOBA (45%) */}
              <path className="text-emerald-500 stroke-[4.5] hover:stroke-[5.5] transition-all" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="45, 100" strokeLinecap="round" />
              {/* Segmen: Battle Royale (30%) */}
              <path className="text-blue-500 stroke-[4.5] hover:stroke-[5.5] transition-all" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="30, 100" strokeDashoffset="-45" strokeLinecap="round" />
              {/* Segmen: FPS (15%) */}
              <path className="text-violet-500 stroke-[4.5] hover:stroke-[5.5] transition-all" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="15, 100" strokeDashoffset="-75" strokeLinecap="round" />
               {/* Segmen: RPG (10%) */}
              <path className="text-rose-500 stroke-[4.5] hover:stroke-[5.5] transition-all" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="10, 100" strokeDashoffset="-90" strokeLinecap="round" />
            </svg>
            {/* Info di Tengah Donat */}
            <div className="absolute flex flex-col items-center">
              <p className="text-4xl font-extrabold text-gray-800 tracking-tighter">100%</p>
              <p className="text-xs text-gray-400 font-medium">Total Pendapatan</p>
            </div>
          </div>
          
          {/* Item Legenda Donat */}
          <div className="space-y-3.5">
            <LegendItem color="bg-emerald-500" label="MOBA" percentage="45%" value={`Rp ${(Math.floor(parseInt(data.revenue.replace(/\./g, '')) * 0.45)).toLocaleString('id-ID')}`} />
            <LegendItem color="bg-blue-500" label="Battle Royale" percentage="30%" value={`Rp ${(Math.floor(parseInt(data.revenue.replace(/\./g, '')) * 0.30)).toLocaleString('id-ID')}`} />
            <LegendItem color="bg-violet-500" label="FPS" percentage="15%" value={`Rp ${(Math.floor(parseInt(data.revenue.replace(/\./g, '')) * 0.15)).toLocaleString('id-ID')}`} />
            <LegendItem color="bg-rose-500" label="RPG" percentage="10%" value={`Rp ${(Math.floor(parseInt(data.revenue.replace(/\./g, '')) * 0.10)).toLocaleString('id-ID')}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  // 📊 State Data Statistik (Mendukung Dynamic Charts)
  const [data, setData] = useState({
    topup: 1240,
    users: 850,
    revenue: "15.500.000",
    history: 432,
  });

  // 🔍 State Pencarian & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🎮 Data Game Lengkap
  const games = [
    { name: "Mobile Legends", img: "/img/ml.png", category: "MOBA", tag: "Populer" },
    { name: "Free Fire", img: "/img/ff.png", category: "Battle Royale", tag: "Promo" },
    { name: "Valorant", img: "/img/valo.png", category: "FPS", tag: "Hot" },
    { name: "PUBG Mobile", img: "/img/pubg.png", category: "Battle Royale", tag: "Populer" },
    { name: "Genshin Impact", img: "/img/genshin.png", category: "RPG", tag: "New" },
  ];

  // ⚙️ Logika Filtering
  const filteredGames = games.filter((game) => {
    const matchSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = activeCategory === "All" || game.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const categories = ["All", "MOBA", "Battle Royale", "FPS", "RPG"];

  // 🔄 Fungsi Refresh Animasi & Data (Mengacak data untuk grafik juga)
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setData({
        topup: Math.floor(Math.random() * 5000) + 1000,
        users: Math.floor(Math.random() * 2000) + 500,
        revenue: `${(Math.floor(Math.random() * 50) + 10)}.000.000`, // Pastikan minimal 10jt agar perincian donut bagus
        history: Math.floor(Math.random() * 1000) + 100,
      });
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="flex bg-[#F8F9FB] min-h-screen font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto px-6 py-6 pb-20 scrollbar-hide">
          <PageHeader />

          {/* 📊 Baris Statistik */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Overview Bulanan</h2>
              <p className="text-sm text-gray-400">Pantau performa toko game Anda</p>
            </div>
            
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:text-violet-600 hover:border-violet-200 px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all font-medium text-sm group"
            >
              <FaSyncAlt className={`${isRefreshing ? "animate-spin text-violet-500" : "group-hover:rotate-180 transition-transform duration-500"}`} />
              Refresh Data
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card icon={<FaGamepad />} value={data.topup} label="Total Transaksi" gradient="from-violet-500 to-fuchsia-500" shadow="shadow-lg shadow-violet-500/30" />
            <Card icon={<FaUsers />} value={data.users} label="Pengguna Aktif" gradient="from-blue-400 to-indigo-500" shadow="shadow-lg shadow-blue-500/30" />
            <Card icon={<FaMoneyBillWave />} value={`Rp ${data.revenue}`} label="Pendapatan" gradient="from-emerald-400 to-teal-500" shadow="shadow-lg shadow-emerald-500/30" />
            <Card icon={<FaHistory />} value={data.history} label="Riwayat Gagal" gradient="from-rose-400 to-red-500" shadow="shadow-lg shadow-rose-500/30" />
          </div>

          {/* 👇 TAMBAHKAN GRAFIK DISINI 👇 */}
          <ProfessionalCharts data={data} />
          {/* ☝️ GRAFIK TELAH DITAMBAHKAN ☝️ */}

          {/* 🎮 Bagian Daftar Game */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Katalog Game</h2>
                <p className="text-sm text-gray-400">Kelola game yang tersedia untuk Top Up</p>
              </div>

              {/* Action Bar (Search & Filter) */}
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-64">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari game..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all"
                  />
                </div>
                
                <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                        activeCategory === cat 
                        ? "bg-violet-50 text-violet-700 border border-violet-200" 
                        : "bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Grid Game */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredGames.map((game, i) => (
                  <div
                    key={i}
                    className="group relative bg-gray-50 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-violet-300"
                  >
                    {/* Gambar dengan Overlay Premium */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={game.img}
                        alt={game.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                      
                      {/* Badge / Tag */}
                      <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-lg text-white shadow-sm
                        ${game.tag === 'Populer' ? 'bg-blue-500' : game.tag === 'Promo' ? 'bg-rose-500' : game.tag === 'Hot' ? 'bg-orange-500' : 'bg-emerald-500'}
                      `}>
                        {game.tag}
                      </span>
                    </div>

                    {/* Info Game di Bawah Overlay */}
                    <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-xs text-gray-300 font-medium mb-1">{game.category}</p>
                      <p className="text-white font-bold text-base truncate">{game.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Jika pencarian tidak ditemukan
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 mb-2">Game tidak ditemukan</p>
                <button 
                  onClick={() => {setSearchTerm(""); setActiveCategory("All");}} 
                  className="text-violet-600 text-sm font-medium hover:underline"
                >
                  Reset Pencarian
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}