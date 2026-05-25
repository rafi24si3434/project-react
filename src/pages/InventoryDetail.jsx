import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaPrint,
  FaBoxOpen,
  FaCalendarAlt,
  FaWarehouse,
  FaHistory,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

const inventoryData = [
  {
    id: "INV-01",
    name: "Vaksin Rabies (Rabisin)",
    category: "Obat",
    categoryColor: "emerald",
    stock: 5,
    unit: "Vial",
    minStock: 10,
    price: 185000,
    supplier: "PT. Merial Indonesia",
    expiry: "2027-03-15",
    location: "Lemari Pendingin A-1",
    status: "Kritis",
    description: "Vaksin inactivated virus rabies untuk kucing dan anjing. Simpan pada suhu 2-8°C. Jangan dibekukan.",
    history: [
      { date: "2026-05-20", type: "Keluar", qty: 2, note: "Vaksinasi Mochi & Luna", by: "dr. Sari" },
      { date: "2026-05-18", type: "Keluar", qty: 1, note: "Vaksinasi Rex", by: "dr. Andi" },
      { date: "2026-05-10", type: "Masuk", qty: 10, note: "Restok dari supplier", by: "Admin" },
      { date: "2026-05-05", type: "Keluar", qty: 2, note: "Vaksinasi Bruno & Kiki", by: "dr. Sari" },
    ],
  },
  {
    id: "INV-02",
    name: "Royal Canin Recovery",
    category: "Makanan",
    categoryColor: "amber",
    stock: 42,
    unit: "Kaleng",
    minStock: 15,
    price: 35000,
    supplier: "Royal Canin Indonesia",
    expiry: "2027-08-20",
    location: "Rak Penyimpanan B-3",
    status: "Aman",
    description: "Makanan terapi untuk anjing dan kucing dalam masa pemulihan. Formula mudah dicerna dengan kandungan energi tinggi.",
    history: [
      { date: "2026-05-22", type: "Keluar", qty: 3, note: "Nutrisi Rex (rawat inap)", by: "dr. Andi" },
      { date: "2026-05-15", type: "Masuk", qty: 24, note: "Restok bulanan", by: "Admin" },
      { date: "2026-05-10", type: "Keluar", qty: 2, note: "Makanan Lola", by: "dr. Sari" },
    ],
  },
  {
    id: "INV-03",
    name: "Jarum Suntik 3cc (Terumo)",
    category: "Alat Medis",
    categoryColor: "blue",
    stock: 150,
    unit: "Pcs",
    minStock: 50,
    price: 2500,
    supplier: "PT. Terumo Indonesia",
    expiry: "2028-12-31",
    location: "Laci Alat Medis C-2",
    status: "Aman",
    description: "Jarum suntik disposable 3ml dengan jarum 23G x 1 inch. Steril, sekali pakai. Untuk injeksi subkutan dan intramuskular pada hewan kecil.",
    history: [
      { date: "2026-05-22", type: "Keluar", qty: 5, note: "Pemakaian harian", by: "dr. Andi" },
      { date: "2026-05-20", type: "Keluar", qty: 8, note: "Vaksinasi massal", by: "dr. Sari" },
      { date: "2026-05-01", type: "Masuk", qty: 200, note: "Restok dari supplier", by: "Admin" },
    ],
  },
  {
    id: "INV-04",
    name: "Obat Cacing Drontal Cat",
    category: "Obat",
    categoryColor: "emerald",
    stock: 12,
    unit: "Tablet",
    minStock: 10,
    price: 45000,
    supplier: "Bayer Animal Health",
    expiry: "2027-06-30",
    location: "Lemari Obat A-3",
    status: "Peringatan",
    description: "Anthelmintic broad-spectrum untuk kucing. Efektif terhadap cacing gelang, cacing pita, dan cacing tambang. Dosis: 1 tablet per 4 kg berat badan.",
    history: [
      { date: "2026-05-23", type: "Keluar", qty: 1, note: "Deworming Polly", by: "dr. Sari" },
      { date: "2026-05-15", type: "Keluar", qty: 2, note: "Deworming Mochi & Luna", by: "dr. Sari" },
      { date: "2026-04-28", type: "Masuk", qty: 20, note: "Restok bulanan", by: "Admin" },
    ],
  },
];

export default function InventoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = inventoryData.find((i) => i.id === id);

  if (!item) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Barang Tidak Ditemukan</h1>
        <button onClick={() => navigate("/inventory")} className="mt-5 px-5 py-2 rounded-xl bg-amber-500 text-white">Kembali</button>
      </div>
    );
  }

  const stockPercentage = Math.min((item.stock / (item.minStock * 2)) * 100, 100);
  const statusConfig = {
    Aman: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", barColor: "bg-emerald-500" },
    Peringatan: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", barColor: "bg-amber-500" },
    Kritis: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", barColor: "bg-red-500" },
  };
  const sc = statusConfig[item.status];

  return (
    <div className="p-6 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/inventory")} className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Detail Inventori</h1>
            <p className="text-sm text-gray-400">Kode: {item.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition">
            <FaPrint /> Cetak
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm transition">
            <FaEdit /> Edit Stok
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="col-span-1 space-y-6">

          {/* Item Card */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-15">
                <img src="/images/inventory.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-5xl shadow-lg">
                  <FaBoxOpen className="text-white" />
                </div>
                <h2 className="text-lg font-bold text-white mt-4">{item.name}</h2>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold ${item.status === "Aman" ? "bg-white/20 text-white" : item.status === "Peringatan" ? "bg-amber-300/30 text-amber-100" : "bg-red-400/40 text-red-100"}`}>
                  {item.category} · {item.status}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center"><FaWarehouse /></div>
                <div>
                  <p className="text-xs text-gray-400">Lokasi Penyimpanan</p>
                  <p className="font-semibold text-gray-800 text-sm">{item.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><FaBoxOpen /></div>
                <div>
                  <p className="text-xs text-gray-400">Supplier</p>
                  <p className="font-semibold text-gray-800 text-sm">{item.supplier}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center"><FaCalendarAlt /></div>
                <div>
                  <p className="text-xs text-gray-400">Kedaluwarsa</p>
                  <p className="font-semibold text-gray-800 text-sm">{item.expiry}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stock Gauge */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">📊 Status Stok</h3>
            <div className={`${sc.bg} ${sc.border} border rounded-2xl p-4 text-center mb-4`}>
              <p className={`text-3xl font-bold ${sc.text}`}>{item.stock}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">{item.unit} tersisa</p>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Stok Saat Ini</span>
                <span>Min: {item.minStock} {item.unit}</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-3 rounded-full ${sc.barColor} transition-all duration-500`} style={{ width: `${stockPercentage}%` }}></div>
              </div>
            </div>
            {item.status === "Kritis" && (
              <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
                <FaExclamationTriangle className="text-red-500 shrink-0" />
                <p className="text-xs text-red-700 font-medium">Stok di bawah batas minimum! Segera lakukan restok.</p>
              </div>
            )}
            {item.status === "Peringatan" && (
              <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                <FaExclamationTriangle className="text-amber-500 shrink-0" />
                <p className="text-xs text-amber-700 font-medium">Stok mendekati batas minimum. Pertimbangkan restok.</p>
              </div>
            )}
            {item.status === "Aman" && (
              <div className="mt-3 flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                <FaCheckCircle className="text-emerald-500 shrink-0" />
                <p className="text-xs text-emerald-700 font-medium">Stok aman dan mencukupi kebutuhan operasional.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-2 space-y-6">

          {/* Item Info */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><FaBoxOpen /></div>
              <div>
                <h3 className="font-bold text-gray-800">Informasi Barang</h3>
                <p className="text-xs text-gray-400">Detail produk & spesifikasi</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">Kode</p>
                <p className="font-bold text-gray-800">{item.id}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">Harga Satuan</p>
                <p className="font-bold text-gray-800">Rp {item.price.toLocaleString("id-ID")}</p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">Total Nilai Stok</p>
                <p className="font-bold text-emerald-600">Rp {(item.price * item.stock).toLocaleString("id-ID")}</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Deskripsi Produk</p>
              <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><FaHistory /></div>
              <div>
                <h3 className="font-bold text-gray-800">Riwayat Transaksi</h3>
                <p className="text-xs text-gray-400">Catatan keluar-masuk barang</p>
              </div>
            </div>

            <div className="space-y-3">
              {item.history.map((h, i) => (
                <div key={i} className={`flex items-center justify-between rounded-2xl p-4 border ${h.type === "Masuk" ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${h.type === "Masuk" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                      {h.type === "Masuk" ? <FaArrowDown /> : <FaArrowUp />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{h.note}</p>
                      <p className="text-xs text-gray-400">{h.date} · {h.by}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${h.type === "Masuk" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {h.type === "Masuk" ? "+" : "-"}{h.qty} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
