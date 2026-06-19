import React from "react";
import { Award, Sparkles } from "lucide-react";

export default function LoyaltyCard({ profile, tierColor, loyaltyTier, points, progressPercentage, nextTier, targetSpent, totalSpent }) {
  return (
    <div className="space-y-6 text-left">
      {/* Premium Credit Card Style Loyalty Card */}
      <div className={`p-6 rounded-[2.2rem] bg-gradient-to-br ${tierColor} shadow-xl relative overflow-hidden border flex flex-col justify-between h-56 group hover:shadow-emerald-500/10 transition-all duration-500`}>
        {/* Futuristic Chip Graphics */}
        <div className="absolute right-0 bottom-0 w-36 h-36 bg-white/5 rounded-full translate-x-12 translate-y-12 group-hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-24 h-24 bg-white/5 rounded-full -translate-x-12"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Loyalty Card</p>
            <h3 className="text-lg font-black tracking-tight mt-0.5">PetCare Club</h3>
          </div>
          <div className="w-10 h-8 rounded-md bg-white/10 border border-white/20 backdrop-blur-md flex flex-col justify-center items-center shadow-inner">
            <Award className="w-5 h-5 text-yellow-300" />
          </div>
        </div>

        <div className="relative z-10 pt-2">
          <div className="w-9 h-7 rounded-md bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-80 mb-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/10 grid grid-cols-3 divide-x divide-slate-800/20">
              <div></div><div></div><div></div>
            </div>
          </div>
          <p className="text-xs opacity-75 font-mono">MEMBER - {profile?.id ? profile.id.slice(0, 4).toUpperCase() : "8293"} - {profile?.id ? profile.id.slice(24, 28).toUpperCase() : "9201"}</p>
          <h4 className="text-base font-black truncate mt-1">{profile?.full_name}</h4>
        </div>

        <div className="flex justify-between items-end relative z-10 pt-2.5 border-t border-white/10">
          <div>
            <p className="text-[8px] uppercase opacity-60 font-bold tracking-wider">Level Tier</p>
            <p className="text-xs font-black uppercase tracking-wider">{loyaltyTier} Member</p>
          </div>
          <div className="text-right">
            <p className="text-[8px] uppercase opacity-60 font-bold tracking-wider">Poin</p>
            <p className="text-xs font-black tracking-wider">{points} Pts</p>
          </div>
        </div>
      </div>

      {/* Loyalty Progress Tracker */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" /> Progress Tingkat Member
        </h3>
        
        <div className="space-y-4">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Tier: <b>{loyaltyTier}</b></span>
            {nextTier !== "Max Tier" ? (
              <span>Target: <b>{nextTier}</b></span>
            ) : (
              <span className="text-emerald-600 font-bold">Tier Tertinggi! 👑</span>
            )}
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          {nextTier !== "Max Tier" && (
            <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
              Belanja <b>Rp {(targetSpent - totalSpent).toLocaleString("id-ID")}</b> lagi untuk naik ke level <b>{nextTier} Member</b>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
