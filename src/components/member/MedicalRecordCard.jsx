import React from "react";
import { Stethoscope, Calendar, User, Activity, Pill } from "lucide-react";

export default function MedicalRecordCard({ rec }) {
  return (
    <div className="group bg-white/80 backdrop-blur-xl p-6 rounded-[1.5rem] border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 text-left relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50/0 to-pink-50/0 group-hover:from-rose-50/30 group-hover:to-pink-50/30 transition-all duration-500 pointer-events-none" />
      
      <div className="relative z-10 flex items-start gap-5">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 border-2 border-rose-200 flex items-center justify-center text-2xl shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Stethoscope className="w-7 h-7 text-rose-500" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <h4 className="text-base font-black text-slate-800">{rec.pets?.name || "Anabul"}</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                {rec.date}
              </p>
            </div>
            <span className="text-[10px] font-bold text-rose-500 bg-gradient-to-r from-rose-50 to-pink-50 px-3 py-1.5 rounded-full border border-rose-200">
              Rekam Medis
            </span>
          </div>

          {/* Diagnosis */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              Diagnosa Penyakit
            </div>
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 p-4 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-800 font-semibold leading-relaxed">{rec.diagnosa}</p>
            </div>
          </div>

          {/* Treatment */}
          {rec.treatment && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <Pill className="w-3.5 h-3.5" />
                Tindakan / Terapi
              </div>
              <p className="text-sm text-slate-700 font-medium leading-relaxed bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-100">
                {rec.treatment}
              </p>
            </div>
          )}

          {/* Vet Info */}
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-violet-500" />
            </div>
            <span className="font-medium">Dokter Hewan:</span>
            <span className="font-bold text-slate-700">{rec.vet_name}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
