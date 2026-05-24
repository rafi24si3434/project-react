import { useState, useMemo } from "react";
import SearchBar from "../components/SearchBar";
import Modal from "../components/Modal";
import ToastNotification from "../components/ToastNotification";

const initialItems = [
  { id: "INV-01", name: "Vaksin Rabies", category: "Obat", stock: 5, unit: "Vial", status: "Kritis" },
  { id: "INV-02", name: "Royal Canin Recovery", category: "Makanan", stock: 42, unit: "Kaleng", status: "Aman" },
  { id: "INV-03", name: "Jarum Suntik 3cc", category: "Alat Medis", stock: 150, unit: "Pcs", status: "Aman" },
  { id: "INV-04", name: "Obat Cacing Drontal", category: "Obat", stock: 12, unit: "Tablet", status: "Peringatan" },
];

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const filteredItems = useMemo(() => {
    return initialItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.category.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventori Klinik</h1>
          <p className="text-sm text-gray-500 mt-1">Pantau stok obat, makanan, dan peralatan medis.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-amber-500 text-white font-semibold rounded-xl shadow-md hover:bg-amber-600 transition-all hover:-translate-y-0.5">
          + Tambah Barang
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="mb-6"><SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari Nama Barang / Kategori..." /></div>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Kode</th>
              <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Nama Barang</th>
              <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Kategori</th>
              <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Stok Tersisa</th>
              <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((i) => (
              <tr key={i.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-4 text-gray-500 text-xs">{i.id}</td>
                <td className="py-4 font-bold text-gray-800">{i.name}</td>
                <td className="py-4 text-gray-600">{i.category}</td>
                <td className="py-4 font-semibold text-gray-700">{i.stock} {i.unit}</td>
                <td className="py-4">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border 
                    ${i.status === "Aman" ? "bg-green-50 text-green-700 border-green-200" 
                    : i.status === "Peringatan" ? "bg-amber-50 text-amber-700 border-amber-200" 
                    : "bg-red-50 text-red-700 border-red-200"}`}>
                    {i.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={() => { setIsModalOpen(false); setShowToast(true); }} title="Tambah Barang Baru" confirmColor="bg-amber-500">
        <div className="space-y-4">
          <div><label className="block text-xs font-semibold mb-1">Nama Barang</label><input type="text" className="w-full border rounded-lg p-2.5 text-sm" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-semibold mb-1">Kategori</label><input type="text" className="w-full border rounded-lg p-2.5 text-sm" /></div>
            <div><label className="block text-xs font-semibold mb-1">Stok Awal</label><input type="number" className="w-full border rounded-lg p-2.5 text-sm" /></div>
          </div>
        </div>
      </Modal>

      <ToastNotification isVisible={showToast} onClose={() => setShowToast(false)} message="Barang berhasil ditambahkan ke Inventori!" />
    </div>
  );
}
