import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaEdit, FaPrint, FaFileMedical,
  FaStethoscope, FaNotesMedical, FaPills, FaCalendarAlt, FaUser
} from "react-icons/fa";
import { supabase } from "../lib/supabase";

export default function MedicalRecordsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("medical_records")
          .select(`
            *,
            pets (*),
            owner:users (*)
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        
        // Map data to match old format
        const getPetEmoji = (t) => {
          const lower = t?.toLowerCase();
          if (lower === "cat" || lower === "kucing") return "🐱";
          if (lower === "dog" || lower === "anjing") return "🐶";
          if (lower === "rabbit" || lower === "kelinci") return "🐰";
          if (lower === "bird" || lower === "burung") return "🦜";
          return "🐾";
        };

        const mapped = {
          id: `RM-${data.id.slice(0, 5).toUpperCase()}`,
          date: data.date,
          pet: data.pets?.name || "Hewan",
          petType: data.pets?.breed || data.pets?.type || "-",
          petEmoji: getPetEmoji(data.pets?.type),
          owner: data.owner?.full_name || "Owner",
          ownerPhone: data.owner?.phone_number || "—",
          doctor: data.vet_name,
          diagnosis: data.diagnosa,
          symptoms: ["Menggaruk/tidak nyaman", "Diperiksa di klinik"],
          treatment: data.treatment || "Pemberian tindakan perawatan sesuai diagnosis.",
          prescription: [
            { name: "Pemberian resep obat sesuai tindakan", dosage: "Kontrol teratur", duration: "Mandiri" }
          ],
          notes: "Telah selesai diperiksa. Pantau kondisi fisik dan nafsu makan harian.",
          weight: data.pets?.weight ? `${data.pets.weight} kg` : "—",
          temperature: "38.5°C",
          heartRate: "Normal",
          status: "Selesai"
        };

        setRecord(mapped);
      } catch (err) {
        console.error("Error loading medical record details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="p-10 text-center text-left">
        <h1 className="text-2xl font-bold text-gray-700">Rekam Medis Tidak Ditemukan</h1>
        <button onClick={() => navigate("/medical-records")} className="mt-5 px-5 py-2 rounded-xl bg-emerald-500 text-white cursor-pointer">Kembali</button>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen text-left bg-gray-50">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/medical-records")} className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition cursor-pointer">
            <FaArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Detail Rekam Medis</h1>
            <p className="text-sm text-gray-400">ID Rekam: {record.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition cursor-pointer">
            <FaPrint /> Cetak
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Patient & Owner Profile */}
        <div className="col-span-1 space-y-6">
          
          {/* Patient Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl bg-emerald-50 p-3 rounded-2xl">{record.petEmoji}</span>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{record.pet}</h3>
                <p className="text-xs text-gray-400">{record.petType}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-t pt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pemilik</p>
                <p className="text-sm font-semibold text-gray-700 mt-1 flex items-center gap-2"><FaUser className="text-gray-400 text-xs" /> {record.owner}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nomor Telepon</p>
                <p className="text-sm font-semibold text-gray-700 mt-1">{record.ownerPhone}</p>
              </div>
            </div>
          </div>

          {/* Vitals Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaStethoscope className="text-emerald-500" /> Tanda-tanda Vital
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-400">Berat Badan</span>
                <p className="text-sm font-bold text-gray-800 mt-1">{record.weight}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <span className="text-gray-400">Suhu Tubuh</span>
                <p className="text-sm font-bold text-gray-800 mt-1">{record.temperature}</p>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Diagnosis, Treatment, & Prescriptions */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="flex justify-between items-start border-b pb-4">
              <div className="flex items-center gap-3">
                <FaFileMedical className="text-emerald-500 text-2xl" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Diagnosis Medis</h4>
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5"><FaCalendarAlt /> Pemeriksaan: {record.date}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100`}>
                {record.status}
              </span>
            </div>

            {/* Diagnosis */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Diagnosis Utama</p>
              <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-xl p-4">
                <p className="text-sm font-bold text-emerald-800">{record.diagnosis}</p>
              </div>
            </div>

            {/* Treatment */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><FaNotesMedical className="text-emerald-500" /> Tindakan Medis</p>
              <p className="text-sm text-gray-650 leading-relaxed bg-gray-50 p-4 rounded-xl">{record.treatment}</p>
            </div>

            {/* Prescription */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><FaPills className="text-emerald-500" /> Resep Obat</p>
              <div className="space-y-2">
                {record.prescription.map((med, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50/50 border border-gray-100 p-3.5 rounded-xl">
                    <div>
                      <span className="text-xs font-bold text-gray-800">{med.name}</span>
                      <p className="text-[10px] text-gray-450 mt-0.5 font-semibold">Dosis: {med.dosage}</p>
                    </div>
                    <span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500 font-bold">{med.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vet info */}
            <div className="border-t pt-4 flex items-center justify-between text-xs">
              <span className="text-gray-400 font-semibold">Dokter Pemeriksa:</span>
              <span className="font-bold text-gray-700">{record.doctor}</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
