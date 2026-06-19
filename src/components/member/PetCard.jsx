import React from "react";
import { Eye, ClipboardList, Info } from "lucide-react";

export default function PetCard({ pet, getPetEmoji, getPetGradient, age, lastRecord, activeApp, setSelectedPetForDetail, setIsPetDetailOpen, navigate }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200/80 p-6.5 shadow-sm hover:shadow-md hover:border-emerald-200/50 transition-all duration-300 flex flex-col justify-between text-left">
      <div>
        {/* Card Top Block */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4.5">
            {/* Large Avatar */}
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${getPetGradient(pet.type)} flex items-center justify-center text-4xl shadow-sm shrink-0 border`}>
              {getPetEmoji(pet.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-black text-slate-800 tracking-tight">{pet.name}</h4>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  pet.gender === "Jantan"
                    ? "bg-blue-50 text-blue-600 border border-blue-100"
                    : "bg-pink-50 text-pink-600 border border-pink-100"
                }`}>
                  {pet.gender}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-bold">{pet.type} &bull; Ras {pet.breed}</p>
            </div>
          </div>

          {/* Status Badge */}
          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
            activeApp 
              ? "bg-blue-50 text-blue-600 border-blue-100" 
              : "bg-emerald-50 text-emerald-600 border-emerald-100"
          }`}>
            {activeApp ? "Ada Jadwal" : "Kondisi Baik"}
          </span>
        </div>

        {/* Pet Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100 text-xs text-slate-650">
          <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Perkiraan Umur</p>
            <p className="text-sm font-black text-slate-850 mt-1">{age}</p>
          </div>
          <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[9px] font-bold text-slate-400 uppercase">Berat Badan</p>
            <p className="text-sm font-black text-slate-850 mt-1">{pet.weight ? `${pet.weight} Kg` : "-"}</p>
          </div>
        </div>

        {/* Last Diagnostic Info box */}
        <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          {lastRecord ? (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-550">
                <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                <span>Rekam Medis Terakhir ({lastRecord.date})</span>
              </div>
              <p className="font-extrabold text-slate-800 leading-snug">{lastRecord.diagnosa}</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-450 font-bold">
              <Info className="w-4 h-4 text-slate-405" />
              <span>Belum ada histori rekam medis klinis</span>
            </div>
          )}
        </div>

        {pet.health_notes && (
          <p className="text-[11px] text-slate-450 italic mt-3 bg-yellow-50/20 border border-yellow-250/20 px-3 py-2 rounded-xl">
            Catatan alergi/kesehatan: "{pet.health_notes}"
          </p>
        )}
      </div>

      {/* Detail Button */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <button
          onClick={() => {
            setSelectedPetForDetail(pet);
            setIsPetDetailOpen(true);
          }}
          className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100/30 rounded-2xl text-xs font-bold transition duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5"
        >
          <Eye className="w-4 h-4" /> Lihat Histori Lengkap & Vaksin
        </button>
      </div>
    </div>
  );
}
