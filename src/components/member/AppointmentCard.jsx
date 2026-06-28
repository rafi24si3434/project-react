import React from "react";
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";

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

  const statusConfig = {
    Completed: {
      color: "from-emerald-500 to-teal-500",
      bg: "from-emerald-50 to-teal-50",
      border: "border-emerald-200",
      text: "text-emerald-600",
      icon: CheckCircle,
      label: "Selesai"
    },
    Confirmed: {
      color: "from-blue-500 to-cyan-500",
      bg: "from-blue-50 to-cyan-50",
      border: "border-blue-200",
      text: "text-blue-600",
      icon: CheckCircle,
      label: "Terkonfirmasi"
    },
    Cancelled: {
      color: "from-rose-500 to-pink-500",
      bg: "from-rose-50 to-pink-50",
      border: "border-rose-200",
      text: "text-rose-600",
      icon: XCircle,
      label: "Dibatalkan"
    },
    Pending: {
      color: "from-amber-500 to-orange-500",
      bg: "from-amber-50 to-orange-50",
      border: "border-amber-200",
      text: "text-amber-600",
      icon: AlertCircle,
      label: "Menunggu"
    }
  };

  const config = statusConfig[app.status] || statusConfig.Pending;
  const StatusIcon = config.icon;

  return (
    <div className="group bg-white/80 backdrop-blur-xl p-6 rounded-[1.5rem] border border-slate-200/50 shadow-lg hover:shadow-2xl transition-all duration-500 text-left relative overflow-hidden">
      {/* Background Accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.bg} opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none`} />
      
      <div className="relative z-10 flex items-start gap-5">
        {/* Pet Avatar */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-200 flex items-center justify-center text-2xl shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300">
          {emoji}
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <h4 className="text-base font-black text-slate-800">{app.pets?.name || "Anabul"}</h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{app.type || "Pemeriksaan"}</p>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1.5 rounded-full bg-gradient-to-r ${config.color} text-white shadow-md`}>
              <StatusIcon className="w-3.5 h-3.5" />
              {config.label}
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
              <User className="w-4 h-4 text-violet-500" />
              <span className="font-medium">{app.doctor}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{app.date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100 sm:col-span-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="font-medium">{app.time} WIB</span>
            </div>
          </div>

          {/* Notes */}
          {app.notes && (
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
              <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed font-medium italic">"{app.notes}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
