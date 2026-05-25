import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import ToastNotification from "../components/ToastNotification";

const initialRecords = [
  { id: "RM-001", date: "2026-05-20", pet: "Mochi", owner: "Budi S.", diagnosis: "Infeksi Telinga Ringan", doctor: "dr. Sari Pratiwi", status: "Selesai" },
  { id: "RM-002", date: "2026-05-22", pet: "Rex", owner: "Rina A.", diagnosis: "Demam & Dehidrasi", doctor: "dr. Andi", status: "Proses" },
  { id: "RM-003", date: "2026-05-23", pet: "Polly", owner: "Hendra K.", diagnosis: "Dermatitis", doctor: "dr. Sari Pratiwi", status: "Selesai" },
];

export default function MedicalRecords() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const filteredRecords = useMemo(() => {
    return initialRecords.filter(r => 
      r.pet.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSave = () => {
    setIsModalOpen(false);
    setShowToast(true);
  };

  return (
    <div className="animate-fade-in p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Rekam Medis</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola riwayat pemeriksaan dan diagnosis pasien.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl shadow-md hover:bg-emerald-600 transition-all hover:-translate-y-0.5"
        >
          + Tambah Rekam Medis
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari ID, Pasien, atau Diagnosis..." />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">ID Rekam</th>
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Tanggal</th>
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Pasien (Pemilik)</th>
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Diagnosis Utama</th>
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Dokter</th>
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r, i) => (
                <tr key={i} onClick={() => navigate(`/medical-records/${r.id}`)} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <td className="py-4 font-semibold text-emerald-600">{r.id}</td>
                  <td className="py-4 text-gray-600">{r.date}</td>
                  <td className="py-4">
                    <p className="font-semibold text-gray-800">{r.pet}</p>
                    <p className="text-xs text-gray-400">{r.owner}</p>
                  </td>
                  <td className="py-4 text-gray-700 font-medium">{r.diagnosis}</td>
                  <td className="py-4 text-gray-600">{r.doctor}</td>
                  <td className="py-4"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr><td colSpan="6" className="py-8 text-center text-gray-400">Data tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleSave} title="Tambah Rekam Medis Baru">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Pilih Pasien</label>
            <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              <option>Mochi (Budi S.)</option>
              <option>Rex (Rina A.)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Diagnosis</label>
            <input type="text" placeholder="Contoh: Flu kucing" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Catatan Dokter</label>
            <textarea rows="3" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"></textarea>
          </div>
        </div>
      </Modal>

      <ToastNotification isVisible={showToast} onClose={() => setShowToast(false)} message="Rekam Medis berhasil disimpan!" />
    </div>
  );
}
