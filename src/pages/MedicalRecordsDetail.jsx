import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaPrint,
  FaFileMedical,
  FaStethoscope,
  FaNotesMedical,
  FaPills,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";

const recordsData = [
  {
    id: "RM-001",
    date: "2026-05-20",
    pet: "Mochi",
    petType: "Kucing Persia",
    petEmoji: "🐱",
    owner: "Budi Santoso",
    ownerPhone: "081234567890",
    doctor: "dr. Sari Pratiwi, drh.",
    diagnosis: "Infeksi Telinga Ringan (Otitis Externa)",
    symptoms: ["Menggaruk telinga berlebihan", "Keluar cairan kecoklatan", "Bau tidak sedap pada telinga"],
    treatment: "Pembersihan telinga dengan larutan antiseptik, pemberian tetes telinga antibiotik (Otibiotic) 2x sehari selama 7 hari.",
    prescription: [
      { name: "Otibiotic Ear Drop", dosage: "3 tetes / 2x sehari", duration: "7 hari" },
      { name: "Amoxicillin 250mg", dosage: "1/2 tablet / 2x sehari", duration: "5 hari" },
    ],
    notes: "Pasien merespons baik terhadap pengobatan awal. Kontrol ulang 1 minggu ke depan untuk evaluasi perkembangan. Hindari air masuk ke telinga saat mandi.",
    weight: "4.2 kg",
    temperature: "38.5°C",
    heartRate: "140 bpm",
    status: "Selesai",
  },
  {
    id: "RM-002",
    date: "2026-05-22",
    pet: "Rex",
    petType: "Golden Retriever",
    petEmoji: "🐶",
    owner: "Rina Anggraini",
    ownerPhone: "081298765432",
    doctor: "dr. Andi Wijaya, drh.",
    diagnosis: "Demam & Dehidrasi Sedang",
    symptoms: ["Lesu dan tidak mau makan", "Suhu tubuh tinggi (40.2°C)", "Membran mukosa kering"],
    treatment: "Infus NaCl 0.9% untuk rehidrasi, injeksi antipiretik, observasi 24 jam di klinik.",
    prescription: [
      { name: "Infus NaCl 0.9%", dosage: "500ml IV drip", duration: "6 jam" },
      { name: "Meloxicam 1.5mg", dosage: "1 tablet / 1x sehari", duration: "3 hari" },
      { name: "Probiotik Hewan", dosage: "1 sachet / 1x sehari", duration: "5 hari" },
    ],
    notes: "Pasien perlu diawasi ketat. Jika suhu tubuh tidak turun dalam 24 jam, pertimbangkan pemeriksaan darah lengkap untuk menyingkirkan penyakit infeksi serius.",
    weight: "28.5 kg",
    temperature: "40.2°C",
    heartRate: "110 bpm",
    status: "Proses",
  },
  {
    id: "RM-003",
    date: "2026-05-23",
    pet: "Polly",
    petType: "Kakak Tua",
    petEmoji: "🦜",
    owner: "Hendra Kurniawan",
    ownerPhone: "081356789012",
    doctor: "dr. Sari Pratiwi, drh.",
    diagnosis: "Dermatitis (Feather Plucking)",
    symptoms: ["Bulu rontok tidak normal", "Area kulit kemerahan di dada", "Perilaku mencabut bulu sendiri"],
    treatment: "Pemberian suplemen bulu, perubahan pola makan dengan tambahan buah segar, evaluasi stres lingkungan.",
    prescription: [
      { name: "Suplemen Bulu Burung", dosage: "5 tetes di air minum", duration: "14 hari" },
      { name: "Salep Chlorhexidine", dosage: "Oles tipis 1x sehari", duration: "7 hari" },
    ],
    notes: "Disarankan memperkaya lingkungan dengan mainan interaktif untuk mengurangi stres. Evaluasi ulang dalam 2 minggu.",
    weight: "0.4 kg",
    temperature: "40.0°C",
    heartRate: "300 bpm",
    status: "Selesai",
  },
];

export default function MedicalRecordsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const record = recordsData.find((r) => r.id === id);

  if (!record) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-700">Rekam Medis Tidak Ditemukan</h1>
        <button onClick={() => navigate("/medical-records")} className="mt-5 px-5 py-2 rounded-xl bg-emerald-500 text-white">Kembali</button>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/medical-records")} className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition">
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Detail Rekam Medis</h1>
            <p className="text-sm text-gray-400">ID: {record.id} · {record.date}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition">
            <FaPrint /> Cetak
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm transition">
            <FaEdit /> Edit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="col-span-1 space-y-6">

          {/* Patient Card */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <img src="/images/medical-record.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-5xl shadow-lg">
                  {record.petEmoji}
                </div>
                <h2 className="text-xl font-bold text-white mt-4">{record.pet}</h2>
                <p className="text-emerald-100 text-sm mt-1">{record.petType}</p>
                <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${record.status === "Selesai" ? "bg-white/20 text-white" : "bg-amber-400/30 text-amber-100"}`}>
                  {record.status}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><FaUser /></div>
                <div>
                  <p className="text-xs text-gray-400">Pemilik</p>
                  <p className="font-semibold text-gray-800 text-sm">{record.owner}</p>
                  <p className="text-xs text-gray-400">{record.ownerPhone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><FaStethoscope /></div>
                <div>
                  <p className="text-xs text-gray-400">Dokter</p>
                  <p className="font-semibold text-gray-800 text-sm">{record.doctor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center"><FaCalendarAlt /></div>
                <div>
                  <p className="text-xs text-gray-400">Tanggal Periksa</p>
                  <p className="font-semibold text-gray-800 text-sm">{record.date}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">🩺 Tanda Vital</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 rounded-2xl p-3 text-center">
                <p className="text-lg font-bold text-emerald-700">{record.weight}</p>
                <p className="text-[10px] text-gray-500 font-medium mt-1">Berat</p>
              </div>
              <div className="bg-red-50 rounded-2xl p-3 text-center">
                <p className="text-lg font-bold text-red-600">{record.temperature}</p>
                <p className="text-[10px] text-gray-500 font-medium mt-1">Suhu</p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-3 text-center">
                <p className="text-lg font-bold text-blue-600">{record.heartRate}</p>
                <p className="text-[10px] text-gray-500 font-medium mt-1">Detak Jantung</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="col-span-2 space-y-6">

          {/* Diagnosis */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center"><FaFileMedical /></div>
              <div>
                <h3 className="font-bold text-gray-800">Diagnosis</h3>
                <p className="text-xs text-gray-400">Hasil pemeriksaan klinis</p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4">
              <p className="font-bold text-red-700">{record.diagnosis}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Gejala yang Ditemukan</p>
              <div className="space-y-2">
                {record.symptoms.map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0"></span>
                    <p className="text-sm text-gray-700">{s}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Treatment */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><FaNotesMedical /></div>
              <div>
                <h3 className="font-bold text-gray-800">Tindakan & Penanganan</h3>
                <p className="text-xs text-gray-400">Prosedur yang dilakukan</p>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed">{record.treatment}</p>
            </div>
          </div>

          {/* Prescription */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><FaPills /></div>
              <div>
                <h3 className="font-bold text-gray-800">Resep Obat</h3>
                <p className="text-xs text-gray-400">Obat yang diresepkan dokter</p>
              </div>
            </div>
            <div className="space-y-3">
              {record.prescription.map((p, i) => (
                <div key={i} className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <div>
                    <p className="font-semibold text-blue-800 text-sm">{p.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.dosage}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{p.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Notes */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">📝 Catatan Dokter</h3>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed italic">"{record.notes}"</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
