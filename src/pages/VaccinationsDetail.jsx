import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaPrint,
  FaSyringe,
  FaCalendarAlt,
  FaUser,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const vaccinationsData = [
  {
    id: 1,
    pet: "Luna",
    petType: "Scottish Fold",
    petEmoji: "🐱",
    owner: "Dinda Permata",
    ownerPhone: "081234567891",
    doctor: "dr. Sari Pratiwi, drh.",
    vaccines: [
      { name: "Rabies", brand: "Rabisin (Merial)", date: "2025-05-10", nextDue: "2026-05-10", batchNo: "RBN-2025-4421", status: "Overdue" },
      { name: "Tricat (FVRCP)", brand: "Nobivac Tricat", date: "2025-11-15", nextDue: "2026-11-15", batchNo: "TRI-2025-8812", status: "Aman" },
      { name: "FeLV", brand: "Purevax FeLV", date: "2026-01-20", nextDue: "2027-01-20", batchNo: "FLV-2026-1103", status: "Aman" },
    ],
    allergies: "Tidak ada alergi yang diketahui",
    weight: "3.8 kg",
    notes: "Kucing indoor, risiko rendah. Vaksin rabies wajib diperpanjang segera. Kondisi umum sehat, tidak ada kontraindikasi untuk vaksinasi.",
  },
  {
    id: 2,
    pet: "Rex",
    petType: "Golden Retriever",
    petEmoji: "🐶",
    owner: "Rina Anggraini",
    ownerPhone: "081298765432",
    doctor: "dr. Andi Wijaya, drh.",
    vaccines: [
      { name: "Rabies", brand: "Defensor 3", date: "2026-02-01", nextDue: "2027-02-01", batchNo: "RBN-2026-0912", status: "Aman" },
      { name: "Parvovirus (DHPP)", brand: "Vanguard Plus 5", date: "2026-02-15", nextDue: "2027-02-15", batchNo: "DHPP-2026-1245", status: "Aman" },
      { name: "Bordetella", brand: "Bronchi-Shield", date: "2026-04-10", nextDue: "2026-10-10", batchNo: "BRD-2026-3378", status: "Aman" },
      { name: "Leptospirosis", brand: "Nobivac Lepto", date: "2026-03-05", nextDue: "2027-03-05", batchNo: "LPT-2026-2201", status: "Aman" },
    ],
    allergies: "Reaksi ringan (bengkak lokal) pada vaksin Leptospirosis sebelumnya",
    weight: "28.5 kg",
    notes: "Anjing aktif outdoor, risiko tinggi. Semua vaksin up-to-date. Monitor reaksi pasca-vaksinasi Leptospirosis selama 24 jam.",
  },
  {
    id: 3,
    pet: "Lola",
    petType: "Holland Lop",
    petEmoji: "🐰",
    owner: "Siti Mawarni",
    ownerPhone: "081356789013",
    doctor: "dr. Sari Pratiwi, drh.",
    vaccines: [
      { name: "Myxomatosis", brand: "Nobivac Myxo-RHD", date: "2026-05-01", nextDue: "2026-11-01", batchNo: "MYX-2026-5501", status: "Aman" },
      { name: "RHD (Rabbit Haemorrhagic Disease)", brand: "Filavac VHD", date: "2026-05-01", nextDue: "2027-05-01", batchNo: "RHD-2026-5502", status: "Aman" },
    ],
    allergies: "Tidak ada alergi yang diketahui",
    weight: "1.8 kg",
    notes: "Kelinci peliharaan indoor. Vaksinasi berjalan sesuai jadwal. Kelinci dalam kondisi sehat dan aktif. Jadwal booster Myxo dalam 6 bulan.",
  },
];

export default function VaccinationsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const record = vaccinationsData.find((r) => r.id === Number(id));

  if (!record) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Data Vaksinasi Tidak Ditemukan</h1>
        <button onClick={() => navigate("/vaccinations")} className="mt-5 px-5 py-2 rounded-xl bg-blue-500 text-white">Kembali</button>
      </div>
    );
  }

  const overdueCount = record.vaccines.filter(v => v.status === "Overdue").length;
  const amanCount = record.vaccines.filter(v => v.status === "Aman").length;

  return (
    <div className="p-6 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/vaccinations")} className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Kartu Vaksinasi</h1>
            <p className="text-sm text-gray-400">Riwayat lengkap vaksin {record.pet}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition">
            <FaPrint /> Cetak Kartu
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm transition">
            <FaSyringe /> + Tambah Vaksin
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="col-span-1 space-y-6">

          {/* Pet Card */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <img src="/images/vaccination.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-5xl shadow-lg">
                  {record.petEmoji}
                </div>
                <h2 className="text-xl font-bold text-white mt-4">{record.pet}</h2>
                <p className="text-blue-100 text-sm mt-1">{record.petType}</p>
                <p className="text-blue-200 text-xs mt-1">BB: {record.weight}</p>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><FaUser /></div>
                <div>
                  <p className="text-xs text-gray-400">Pemilik</p>
                  <p className="font-semibold text-gray-800 text-sm">{record.owner}</p>
                  <p className="text-xs text-gray-400">{record.ownerPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><FaShieldAlt /></div>
                <div>
                  <p className="text-xs text-gray-400">Dokter</p>
                  <p className="font-semibold text-gray-800 text-sm">{record.doctor}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vaccination Summary */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">💉 Ringkasan Vaksinasi</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-emerald-600">{amanCount}</p>
                <p className="text-[10px] text-gray-500 font-semibold mt-1">Aman / Aktif</p>
              </div>
              <div className="bg-red-50 border border-red-100 rounded-2xl p-3 text-center">
                <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
                <p className="text-[10px] text-gray-500 font-semibold mt-1">Overdue</p>
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">⚠️ Catatan Alergi</h3>
            <div className={`rounded-2xl p-4 text-sm ${record.allergies.includes("Tidak ada") ? "bg-emerald-50 border border-emerald-100 text-emerald-700" : "bg-amber-50 border border-amber-100 text-amber-700"}`}>
              <p className="font-medium">{record.allergies}</p>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-2 space-y-6">

          {/* Vaccine Timeline */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><FaSyringe /></div>
              <div>
                <h3 className="font-bold text-gray-800">Riwayat Vaksinasi Lengkap</h3>
                <p className="text-xs text-gray-400">{record.vaccines.length} vaksin tercatat</p>
              </div>
            </div>

            <div className="space-y-4">
              {record.vaccines.map((v, i) => (
                <div key={i} className={`rounded-2xl p-5 border ${v.status === "Overdue" ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className={`font-bold text-base ${v.status === "Overdue" ? "text-red-700" : "text-emerald-700"}`}>{v.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{v.brand}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${v.status === "Overdue" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {v.status === "Overdue" ? <FaExclamationTriangle /> : <FaCheckCircle />}
                      {v.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/60 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-gray-400 mb-1"><FaCalendarAlt className="text-xs" /><p className="text-[10px] font-semibold">Tanggal Vaksin</p></div>
                      <p className="text-sm font-semibold text-gray-800">{v.date}</p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-gray-400 mb-1"><FaClock className="text-xs" /><p className="text-[10px] font-semibold">Jadwal Berikutnya</p></div>
                      <p className={`text-sm font-semibold ${v.status === "Overdue" ? "text-red-600" : "text-gray-800"}`}>{v.nextDue}</p>
                    </div>
                    <div className="bg-white/60 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-gray-400 mb-1"><FaShieldAlt className="text-xs" /><p className="text-[10px] font-semibold">Batch No.</p></div>
                      <p className="text-sm font-semibold text-gray-800">{v.batchNo}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Notes */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">📝 Catatan Dokter</h3>
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed italic">"{record.notes}"</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
