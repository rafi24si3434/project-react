import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import ToastNotification from "../components/ToastNotification";

const initialVax = [
  { id: 1, pet: "Luna", type: "Rabies", date: "2025-05-10", nextDue: "2026-05-10", status: "Overdue" },
  { id: 2, pet: "Rex", type: "Parvovirus", date: "2026-02-15", nextDue: "2027-02-15", status: "Aman" },
  { id: 3, pet: "Lola", type: "Myxomatosis", date: "2026-05-01", nextDue: "2026-11-01", status: "Aman" },
];

export default function Vaccinations() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const filteredVax = useMemo(() => {
    return initialVax.filter(v => v.pet.toLowerCase().includes(searchQuery.toLowerCase()) || v.type.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vaksinasi</h1>
          <p className="text-sm text-gray-500 mt-1">Pantau jadwal dan riwayat vaksin pasien.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-blue-500 text-white font-semibold rounded-xl shadow-md hover:bg-blue-600 transition-all hover:-translate-y-0.5">
          + Jadwalkan Vaksin
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="mb-6"><SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari Pasien atau Vaksin..." /></div>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Pasien</th>
              <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Jenis Vaksin</th>
              <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Tgl Pemberian</th>
              <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Jadwal Berikutnya</th>
              <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredVax.map((v) => (
              <tr key={v.id} onClick={() => navigate(`/vaccinations/${v.id}`)} className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer">
                <td className="py-4 font-semibold text-gray-800">{v.pet}</td>
                <td className="py-4 text-gray-600 font-medium">{v.type}</td>
                <td className="py-4 text-gray-500">{v.date}</td>
                <td className="py-4 font-medium text-gray-700">{v.nextDue}</td>
                <td className="py-4">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${v.status === "Aman" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}>
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={() => { setIsModalOpen(false); setShowToast(true); }} title="Jadwalkan Vaksinasi" confirmColor="bg-blue-500">
        <div className="space-y-4">
          <div><label className="block text-xs font-semibold mb-1">Pilih Pasien</label><input type="text" className="w-full border rounded-lg p-2.5 text-sm" /></div>
          <div><label className="block text-xs font-semibold mb-1">Jenis Vaksin</label><input type="text" className="w-full border rounded-lg p-2.5 text-sm" /></div>
          <div><label className="block text-xs font-semibold mb-1">Tanggal Jadwal</label><input type="date" className="w-full border rounded-lg p-2.5 text-sm" /></div>
        </div>
      </Modal>

      <ToastNotification isVisible={showToast} onClose={() => setShowToast(false)} message="Jadwal Vaksin berhasil ditambahkan!" />
    </div>
  );
}
