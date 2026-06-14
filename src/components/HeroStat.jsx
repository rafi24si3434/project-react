import React from "react";

export default function HeroStat({ label, value, className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 shadow-sm ${className}`}>
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/70">{label}</p>
      <p className="mt-2 text-xl font-black text-white tracking-tight">{value}</p>
    </div>
  );
}
