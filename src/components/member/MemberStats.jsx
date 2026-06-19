import React from "react";

export default function MemberStats({ petsCount, appointmentsCount, points }) {
  return (
    <div className="flex flex-wrap gap-4 w-full md:w-auto">
      <div className="bg-white px-5 py-3.5 rounded-[1.5rem] border border-slate-100 flex items-center gap-4 shadow-sm flex-1 min-w-[130px] hover:-translate-y-0.5 transition duration-300">
        <span className="text-2xl">🐱</span>
        <div className="text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Anabul Saya</p>
          <p className="text-xl font-black text-slate-800 mt-1">{petsCount} Ekor</p>
        </div>
      </div>
      <div className="bg-white px-5 py-3.5 rounded-[1.5rem] border border-slate-100 flex items-center gap-4 shadow-sm flex-1 min-w-[130px] hover:-translate-y-0.5 transition duration-300">
        <span className="text-2xl">📅</span>
        <div className="text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Janji Temu</p>
          <p className="text-xl font-black text-slate-800 mt-1">{appointmentsCount} Kali</p>
        </div>
      </div>
      <div className="bg-white px-5 py-3.5 rounded-[1.5rem] border border-slate-100 flex items-center gap-4 shadow-sm flex-1 min-w-[130px] hover:-translate-y-0.5 transition duration-300">
        <span className="text-2xl">💎</span>
        <div className="text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Poin Loyalitas</p>
          <p className="text-xl font-black text-emerald-600 mt-1">{points} Pts</p>
        </div>
      </div>
    </div>
  );
}
