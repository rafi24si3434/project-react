import React from "react";

export default function MetricCard({ icon: Icon, label, value, accent = "emerald", className = "" }) {
  const colors = {
    emerald: "border-emerald-100 bg-emerald-50/40 text-emerald-600",
    blue: "border-blue-100 bg-blue-50/40 text-blue-600",
    amber: "border-amber-100 bg-amber-50/40 text-amber-600",
    violet: "border-violet-100 bg-violet-50/40 text-violet-600",
    indigo: "border-indigo-100 bg-indigo-50/40 text-indigo-600",
    pink: "border-pink-100 bg-pink-50/40 text-pink-600",
  };
  const colorStyle = colors[accent] || colors.emerald;

  return (
    <div className={`flex items-center gap-4 rounded-2xl border border-gray-100 p-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${colorStyle}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <p className="mt-1 text-sm font-extrabold text-gray-800 leading-tight">{value}</p>
      </div>
    </div>
  );
}
