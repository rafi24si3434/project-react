import React from "react";
import { Eye, ClipboardList, Info, Calendar, Heart } from "lucide-react";

export default function PetCard({ pet, getPetEmoji, getPetGradient, age, lastRecord, activeApp, setSelectedPetForDetail, setIsPetDetailOpen, navigate }) {
  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/50 p-6 shadow-lg hover:shadow-2xl hover:border-blue-300/50 transition-all duration-500 flex flex-col justify-between text-left relative overflow-hidden">
      {/* Background Accent */}
      <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${getPetGradient(pet.type)} rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none`} />
      
      <div className="relative z-10">
        {/* Card Top Block */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Large Avatar */}
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getPetGradient(pet.type)} flex items-center justify-center text-3xl shadow-lg border-2 border-white/50 group-hover:scale-110 transition-transform duration-300`}>
              {getPetEmoji(pet.type)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-black text-slate-800 tracking-tight">{pet.name}</h4>
                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  pet.gender === "Jantan"
                    ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 border border-blue-200"
                    : "bg-gradient-to-r from-pink-100 to-rose-100 text-pink-600 border border-pink-200"
                }`}>
                  {pet.gender}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-semibold">{pet.type} • {pet.breed}</p>
            </div>
          </div>

          {/* Status Badge */}
          <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full border ${
            activeApp 
              ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-600 border-blue-200" 
              : "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-600 border-emerald-200"
          }`}>
            {activeApp ? "📋 Ada Jadwal" : "✓ Sehat"}
          </span>
        </div>

        {/* Pet Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-3 rounded-xl border border-slate-100 group-hover:shadow-md transition-all">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Umur</p>
            <p className="text-sm font-black text-slate-800 mt-1">{age}</p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 p-3 rounded-xl border border-slate-100 group-hover:shadow-md transition-all">
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Berat</p>
            <p className="text-sm font-black text-slate-800 mt-1">{pet.weight ? `${pet.weight} Kg` : "-"}</p>
          </div>
        </div>

        {/* Last Diagnostic Info box */}
        <div className="mt-4 p-4 bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border border-slate-100 text-xs">
          {lastRecord ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-slate-600">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <ClipboardList className="w-3 h-3 text-white" />
                </div>
                <span>Rekam Terakhir ({lastRecord.date})</span>
              </div>
              <p className="font-bold text-slate-800 leading-snug pl-8">{lastRecord.diagnosa}</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <Info className="w-4 h-4 text-slate-400" />
              <span>Belum ada rekam medis</span>
            </div>
          )}
        </div>

        {pet.health_notes && (
          <p className="text-[10px] text-slate-600 mt-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 px-3 py-2 rounded-xl font-medium flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-amber-500" />
            {pet.health_notes}
          </p>
        )}
      </div>

      {/* Detail Button */}
      <div className="mt-5 pt-4 border-t border-slate-100 relative z-10">
        <button
          onClick={() => {
            setSelectedPetForDetail(pet);
            setIsPetDetailOpen(true);
          }}
          className="w-full py-3.5 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-blue-600 border border-blue-200/50 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer text-center flex items-center justify-center gap-2 group-hover:shadow-md"
        >
          <Eye className="w-4 h-4" /> Lihat Histori Lengkap
        </button>
      </div>
    </div>
  );
}
