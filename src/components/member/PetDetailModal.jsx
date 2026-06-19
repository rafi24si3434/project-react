import React from "react";
import { CheckCircle, ClipboardList, Calendar } from "lucide-react";

export default function PetDetailModal({ isPetDetailOpen, setIsPetDetailOpen, selectedPetForDetail, setSelectedPetForDetail, medicalRecords, appointments, getPetEmoji }) {
  if (!isPetDetailOpen || !selectedPetForDetail) return null;

  const defaultGetPetEmoji = (type) => {
    switch (type?.toLowerCase()) {
      case "anjing":
      case "dog":
        return "🐶";
      case "kucing":
      case "cat":
        return "🐱";
      case "kelinci":
      case "rabbit":
        return "🐰";
      case "burung":
      case "bird":
        return "🐦";
      case "hamster":
        return "🐹";
      default:
        return "🐾";
    }
  };

  const emoji = getPetEmoji ? getPetEmoji(selectedPetForDetail.type) : defaultGetPetEmoji(selectedPetForDetail.type);

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in text-left flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{emoji}</span>
            <div>
              <h3 className="font-black text-slate-850 text-base">{selectedPetForDetail.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold">{selectedPetForDetail.type} &bull; Ras {selectedPetForDetail.breed}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsPetDetailOpen(false);
              setSelectedPetForDetail(null);
            }}
            className="w-8 h-8 rounded-lg hover:bg-slate-150 flex items-center justify-center text-slate-450 transition cursor-pointer font-bold text-lg"
          >
            &times;
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Pet Details Card */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Jenis Kelamin</p>
              <p className="font-extrabold text-slate-800 mt-0.5">{selectedPetForDetail.gender}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Berat Badan</p>
              <p className="font-extrabold text-slate-800 mt-0.5">{selectedPetForDetail.weight ? `${selectedPetForDetail.weight} Kg` : "-"}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Perkiraan Umur</p>
              <p className="font-extrabold text-slate-800 mt-0.5">
                {selectedPetForDetail.birth_date 
                  ? `${new Date().getFullYear() - new Date(selectedPetForDetail.birth_date).getFullYear()} Tahun` 
                  : "-"}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase">Status Vaksinasi</p>
              <p className="font-extrabold text-emerald-600 mt-0.5 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Lengkap
              </p>
            </div>
          </div>

          {selectedPetForDetail.health_notes && (
            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl text-xs text-amber-800 font-semibold">
              <p className="font-bold">Catatan Kesehatan / Alergi:</p>
              <p className="mt-1 font-medium italic">"{selectedPetForDetail.health_notes}"</p>
            </div>
          )}

          {/* Individual Medical Records */}
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-emerald-500" /> Riwayat Rekam Medis Klinis
            </h4>
            
            {medicalRecords.filter(r => r.pet_id === selectedPetForDetail.id).length > 0 ? (
              <div className="space-y-3">
                {medicalRecords
                  .filter(r => r.pet_id === selectedPetForDetail.id)
                  .map(rec => (
                    <div key={rec.id} className="p-4 bg-white border border-slate-150 rounded-2xl shadow-sm text-xs leading-relaxed font-semibold">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2 font-bold text-slate-400">
                        <span>Tanggal: {rec.date}</span>
                        <span>Dokter: {rec.vet_name}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-500 block">Diagnosa:</span>
                        <p className="font-extrabold text-slate-800 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 mt-1">{rec.diagnosa}</p>
                      </div>
                      {rec.treatment && (
                        <div className="mt-2">
                          <span className="font-bold text-slate-500 block">Tindakan / Terapi:</span>
                          <p className="font-bold text-slate-650 mt-0.5">{rec.treatment}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl text-center text-slate-450 text-xs font-bold">
                Tidak ada catatan diagnosa rekam medis untuk anabul ini.
              </div>
            )}
          </div>

          {/* Individual Appointments */}
          <div>
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-500" /> Janji Temu & Kunjungan
            </h4>
            
            {appointments.filter(a => a.pet_id === selectedPetForDetail.id).length > 0 ? (
              <div className="space-y-3">
                {appointments
                  .filter(a => a.pet_id === selectedPetForDetail.id)
                  .map(app => (
                    <div key={app.id} className="p-4 bg-white border border-slate-150 rounded-2xl shadow-sm flex justify-between items-center text-xs font-semibold">
                      <div>
                        <p className="font-extrabold text-slate-800">Dokter {app.doctor}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">{app.date} &bull; {app.time} WIB</p>
                      </div>
                      <span className={`inline-flex text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        app.status === "Completed"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : app.status === "Confirmed"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : app.status === "Cancelled"
                          ? "bg-rose-50 text-rose-500 border border-rose-100"
                          : app.status === "Amber" || app.status === "Pending"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl text-center text-slate-450 text-xs font-bold">
                Tidak ada jadwal kunjungan terdaftar untuk anabul ini.
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setIsPetDetailOpen(false);
              setSelectedPetForDetail(null);
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 cursor-pointer transition shadow-md shadow-slate-900/10"
          >
            Tutup Histori
          </button>
        </div>

      </div>
    </div>
  );
}
