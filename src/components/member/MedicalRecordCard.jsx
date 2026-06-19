import React from "react";

export default function MedicalRecordCard({ rec }) {
  return (
    <div className="bg-white p-5.5 rounded-3xl border border-slate-150 shadow-sm flex items-start gap-4 hover:border-emerald-100/50 transition duration-300 text-left">
      <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 text-lg shadow-sm shrink-0">
        🩺
      </div>
      <div className="space-y-2 w-full">
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-sm font-black text-slate-800">{rec.pets?.name || "Anabul"}</h4>
          <span className="text-[10px] text-slate-400 font-bold">{rec.date}</span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Diagnosa Penyakit</p>
          <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed font-semibold mt-1">{rec.diagnosa}</p>
        </div>
        {rec.treatment && (
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Tindakan / Terapi</p>
            <p className="text-xs text-slate-650 leading-relaxed font-semibold mt-1">{rec.treatment}</p>
          </div>
        )}
        <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 mt-3 font-semibold">Dokter Hewan: <b>{rec.vet_name}</b></p>
      </div>
    </div>
  );
}
