import React from "react";
import { CheckCircle, AlertCircle, RefreshCw, ShoppingCart, UserCheck, Calendar } from "lucide-react";

export default function ActivityTimeline({ logs = [], emptyMessage = "Belum ada catatan aktivitas." }) {
  const getLogStyle = (activity) => {
    const act = activity?.toLowerCase() || "";
    if (act.includes("booking") || act.includes("appointment") || act.includes("jadwal")) {
      return {
        icon: Calendar,
        bg: "bg-blue-500",
        text: "text-blue-500",
        border: "border-blue-100",
      };
    }
    if (act.includes("beli") || act.includes("produk") || act.includes("order") || act.includes("belanja")) {
      return {
        icon: ShoppingCart,
        bg: "bg-emerald-500",
        text: "text-emerald-500",
        border: "border-emerald-100",
      };
    }
    if (act.includes("terdaftar") || act.includes("baru") || act.includes("akun") || act.includes("register")) {
      return {
        icon: UserCheck,
        bg: "bg-violet-500",
        text: "text-violet-500",
        border: "border-violet-100",
      };
    }
    if (act.includes("ubah") || act.includes("perbarui") || act.includes("edit") || act.includes("update") || act.includes("profil")) {
      return {
        icon: RefreshCw,
        bg: "bg-amber-500",
        text: "text-amber-500",
        border: "border-amber-100",
      };
    }
    return {
      icon: CheckCircle,
      bg: "bg-gray-500",
      text: "text-gray-500",
      border: "border-gray-100",
    };
  };

  if (!logs || logs.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-10 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-gray-400 animate-pulse" />
        <p className="mt-2 text-sm font-medium text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative border-l-2 border-gray-100 ml-4 pl-6 text-left">
      {logs.map((log) => {
        const style = getLogStyle(log.activity);
        const Icon = style.icon;
        return (
          <div key={log.id} className="relative group transition-all duration-300">
            {/* Timeline Dot Indicator */}
            <span className={`absolute -left-[35px] top-0.5 w-6 h-6 rounded-full ${style.bg} border-4 border-white flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-115`}>
              <Icon className="h-3 w-3" />
            </span>
            <div className="bg-white group-hover:bg-gray-50/50 p-1.5 rounded-xl transition-all duration-300">
              <span className="text-[10px] font-bold text-gray-400 tracking-wide">{log.date}</span>
              <h5 className="text-xs font-extrabold text-gray-800 mt-1 tracking-tight">{log.activity}</h5>
              <p className="text-xs text-gray-505 mt-1 leading-relaxed">{log.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
