import React from "react";

export default function DataRow({ label, value, className = "" }) {
  return (
    <div className={`grid gap-2 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 md:grid-cols-[180px_minmax(0,1fr)] md:items-start hover:bg-gray-100/50 transition-colors duration-250 ${className}`}>
      <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
      <p className="text-sm font-semibold leading-relaxed text-gray-800">{value}</p>
    </div>
  );
}
