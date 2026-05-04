import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaPhone, FaEnvelope, FaEye, FaEdit, FaTrash } from "react-icons/fa";

const owners = [
  { id: 1, name: "Budi Santoso", phone: "0812-1234-5678", email: "budi@email.com", address: "Jl. Sudirman No.12, Pekanbaru", pets: ["🐱 Mochi", "🐱 Oreo"], totalVisits: 14, since: "Jan 2024", avatar: "BS", avatarBg: "bg-emerald-100 text-emerald-700" },
  { id: 2, name: "Rina Aprilia", phone: "0813-2345-6789", email: "rina@email.com", address: "Jl. Diponegoro No.5, Pekanbaru", pets: ["🐶 Rex"], totalVisits: 8, since: "Mar 2024", avatar: "RA", avatarBg: "bg-blue-100 text-blue-700" },
  { id: 3, name: "Siti Maharani", phone: "0815-4567-8901", email: "siti@email.com", address: "Jl. Ahmad Yani No.22, Pekanbaru", pets: ["🐰 Lola", "🐰 Coco"], totalVisits: 11, since: "Feb 2024", avatar: "SM", avatarBg: "bg-purple-100 text-purple-700" },
  { id: 4, name: "Hendra Kurnia", phone: "0814-3456-7890", email: "hendra@email.com", address: "Jl. Imam Bonjol No.9, Pekanbaru", pets: ["🦜 Polly"], totalVisits: 5, since: "Jun 2024", avatar: "HK", avatarBg: "bg-amber-100 text-amber-700" },
  { id: 5, name: "Dewi Lestari", phone: "0817-6789-0123", email: "dewi@email.com", address: "Jl. Gajahmada No.3, Pekanbaru", pets: ["🐹 Kiki"], totalVisits: 7, since: "Apr 2024", avatar: "DL", avatarBg: "bg-pink-100 text-pink-700" },
  { id: 6, name: "Dinda Permata", phone: "0818-7890-1234", email: "dinda@email.com", address: "Jl. Pahlawan No.17, Pekanbaru", pets: ["🐱 Luna", "🐶 Max"], totalVisits: 19, since: "Nov 2023", avatar: "DP", avatarBg: "bg-teal-100 text-teal-700" },
  { id: 7, name: "Agus Trisno", phone: "0816-5678-9012", email: "agus@email.com", address: "Jl. Veteran No.45, Pekanbaru", pets: ["🐶 Bruno"], totalVisits: 6, since: "May 2024", avatar: "AT", avatarBg: "bg-indigo-100 text-indigo-700" },
  { id: 8, name: "Fajar Nugroho", phone: "0819-8901-2345", email: "fajar@email.com", address: "Jl. Tengku Umar No.8, Pekanbaru", pets: ["🐢 Turbo"], totalVisits: 3, since: "Aug 2024", avatar: "FN", avatarBg: "bg-gray-100 text-gray-700" },
];

export default function PetOwners() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState(null);

  const filtered = owners.filter(o =>
    o.name.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">👨‍👩‍👧</span>
            <h1 className="text-xl font-bold text-gray-800">Pet Owners</h1>
          </div>
          <p className="text-sm text-gray-400 pl-8">{owners.length} pemilik terdaftar · {owners.reduce((a, o) => a + o.pets.length, 0)} hewan total</p>
        </div>
        <button
          onClick={() => navigate("/pet-owners/add")}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-md shadow-emerald-200 transition"
        >
          <FaPlus className="text-xs" /> Tambah Pemilik
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">👥</span>
          <div><p className="text-xl font-bold text-gray-800">{owners.length}</p><p className="text-xs text-gray-400">Total Pemilik</p></div>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🐾</span>
          <div><p className="text-xl font-bold text-emerald-700">{owners.reduce((a, o) => a + o.pets.length, 0)}</p><p className="text-xs text-gray-400">Total Hewan</p></div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">📊</span>
          <div><p className="text-xl font-bold text-blue-700">{Math.round(owners.reduce((a, o) => a + o.totalVisits, 0) / owners.length)}</p><p className="text-xs text-gray-400">Rata-rata Kunjungan</p></div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
          <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Cari nama atau email..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 ml-auto">
          <button onClick={() => setView("grid")} className={`px-3 py-1.5 rounded-lg text-xs transition ${view === "grid" ? "bg-gray-100 text-gray-700" : "text-gray-400"}`}>Grid</button>
          <button onClick={() => setView("list")} className={`px-3 py-1.5 rounded-lg text-xs transition ${view === "list" ? "bg-gray-100 text-gray-700" : "text-gray-400"}`}>List</button>
        </div>
      </div>

      {/* Grid */}
      {view === "grid" ? (
        <div className="grid grid-cols-4 gap-4">
          {filtered.map((owner) => (
            <div
              key={owner.id}
              onClick={() => setSelected(selected?.id === owner.id ? null : owner)}
              className={`bg-white rounded-2xl border p-4 cursor-pointer hover:shadow-md transition ${selected?.id === owner.id ? "border-emerald-300 ring-2 ring-emerald-100" : "border-gray-100 hover:border-gray-200"}`}
            >
              {/* Avatar */}
              <div className="flex justify-between items-start mb-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${owner.avatarBg}`}>
                  {owner.avatar}
                </div>
                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Sejak {owner.since}</span>
              </div>

              <h3 className="font-bold text-gray-800 text-sm mb-0.5">{owner.name}</h3>
              <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                <FaPhone className="text-[9px]" />{owner.phone}
              </p>

              {/* Pets */}
              <div className="flex flex-wrap gap-1 mb-3">
                {owner.pets.map((p, i) => (
                  <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p}</span>
                ))}
              </div>

              <div className="border-t border-gray-50 pt-2.5 flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-gray-400">Total Kunjungan</p>
                  <p className="text-sm font-bold text-gray-700">{owner.totalVisits}×</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={e => { e.stopPropagation(); }} className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition"><FaEnvelope className="text-[9px]"/></button>
                  <button onClick={e => { e.stopPropagation(); }} className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-100 transition"><FaEdit className="text-[9px]"/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List view */
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Pemilik","Kontak","Hewan Peliharaan","Kunjungan","Bergabung","Aksi"].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((owner) => (
                <tr key={owner.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${owner.avatarBg}`}>{owner.avatar}</div>
                      <div>
                        <p className="font-semibold text-gray-800">{owner.name}</p>
                        <p className="text-xs text-gray-400">{owner.address.substring(0, 30)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-600 flex items-center gap-1"><FaPhone className="text-[9px] text-gray-400" />{owner.phone}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1"><FaEnvelope className="text-[9px]" />{owner.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {owner.pets.map((p, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{p}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-700">{owner.totalVisits}×</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{owner.since}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition"><FaEye className="text-xs"/></button>
                      <button className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-100 transition"><FaEdit className="text-xs"/></button>
                      <button className="w-7 h-7 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition"><FaTrash className="text-xs"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail side panel */}
      {selected && (
        <div className="fixed right-6 top-24 w-72 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/60 z-50 overflow-hidden">
          <div className="p-5 border-b border-gray-50">
            <div className="flex justify-between items-start mb-3">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg ${selected.avatarBg}`}>
                {selected.avatar}
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg font-light">×</button>
            </div>
            <h3 className="font-bold text-gray-800">{selected.name}</h3>
            <p className="text-xs text-gray-400">Member sejak {selected.since}</p>
          </div>
          <div className="p-5 space-y-3">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Kontak</p>
              <p className="text-xs text-gray-700 flex items-center gap-1.5"><FaPhone className="text-gray-400 text-[9px]" />{selected.phone}</p>
              <p className="text-xs text-gray-700 flex items-center gap-1.5 mt-1"><FaEnvelope className="text-gray-400 text-[9px]" />{selected.email}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Hewan Peliharaan</p>
              <div className="flex flex-wrap gap-1">
                {selected.pets.map((p, i) => (
                  <span key={i} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">{p}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">Alamat</p>
              <p className="text-xs text-gray-600 leading-relaxed">{selected.address}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex justify-between">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{selected.totalVisits}</p>
                <p className="text-[10px] text-gray-400">Kunjungan</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-800">{selected.pets.length}</p>
                <p className="text-[10px] text-gray-400">Hewan</p>
              </div>
            </div>
          </div>
          <div className="px-5 pb-4 flex gap-2">
            <button className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition">Edit Data</button>
            <button className="flex-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-medium transition">Buat Janji</button>
          </div>
        </div>
      )}
    </div>
  );
}