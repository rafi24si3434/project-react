import React from "react";
import { Calendar, Clock } from "lucide-react";

export default function AppointmentCard({ app, getPetEmoji }) {
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

  const emoji = getPetEmoji ? getPetEmoji(app.pets?.type) : defaultGetPetEmoji(app.pets?.type);

  return (
    <div className="bg-white p-5.5 rounded-3xl border border-slate-150 shadow-sm flex items-start gap-4 hover:border-slate-300 transition duration-300 text-left">
      <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-lg shadow-sm shrink-0">
        {emoji}
      </div>
      <div className="space-y-1.5 w-full">
        <div className="flex justify-between items-start gap-2">
          <h4 className="text-sm font-black text-slate-800">{app.pets?.name || "Anabul"}</h4>
          <span className={`inline-flex text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
            app.status === "Completed"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : app.status === "Confirmed"
              ? "bg-blue-50 text-blue-600 border border-blue-100"
              : app.status === "Cancelled"
              ? "bg-rose-50 text-rose-500 border border-rose-100"
              : "bg-amber-50 text-amber-600 border border-amber-100"
          }`}>
            {app.status}
          </span>
        </div>
        <p className="text-xs text-slate-650 font-semibold">Dokter Penanggung Jawab: <b>{app.doctor}</b></p>
        <p className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {app.date} &bull; <Clock className="w-3.5 h-3.5 text-slate-400" /> {app.time} WIB
        </p>
        {app.notes && (
          <div className="mt-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 italic font-semibold">
            Keluhan Pasien: "{app.notes}"
          </div>
        )}
      </div>
    </div>
  );
}
