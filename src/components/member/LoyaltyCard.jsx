import React from "react";
import { Award, Sparkles, Gift, Crown, Star } from "lucide-react";

export default function LoyaltyCard({ profile, tierColor, loyaltyTier, points, progressPercentage, nextTier, targetSpent, totalSpent }) {
  const tierIcons = {
    Bronze: "🥉",
    Silver: "🥈",
    Gold: "🥇"
  };

  return (
    <div className="space-y-6 text-left">
      {/* Premium Credit Card Style Loyalty Card */}
      <div className={`relative overflow-hidden p-7 rounded-[2rem] bg-gradient-to-br ${tierColor} shadow-2xl border border-white/10 h-60 group transition-all duration-500 hover:scale-[1.02]`}>
        {/* Animated Background Patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg" />
          
          {/* Sparkle Effects */}
          <div className="absolute top-8 right-12 text-white/20 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute bottom-12 left-12 text-white/10 animate-pulse delay-300">
            <Star className="w-4 h-4" />
          </div>
        </div>
        
        {/* Card Content */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          {/* Top Section */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                  <Award className="w-4 h-4 text-yellow-300" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Loyalty Card</p>
                  <h3 className="text-lg font-black text-white tracking-tight">PetCare Club</h3>
                </div>
              </div>
            </div>
            
            {/* Tier Icon */}
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl border border-white/30 shadow-lg">
              {tierIcons[loyaltyTier] || "🐾"}
            </div>
          </div>
          
          {/* Middle Section - Chip & Member ID */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-9 rounded-lg bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 relative overflow-hidden shadow-md">
              <div className="absolute inset-0 bg-slate-900/10 grid grid-cols-3 divide-x divide-slate-800/20">
                <div></div><div></div><div></div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Gift className="w-4 h-4 text-yellow-800/40" />
              </div>
            </div>
            <div>
              <p className="text-[9px] font-mono text-white/60 uppercase tracking-wider">Member ID</p>
              <p className="text-xs font-black text-white tracking-wider">
                {profile?.id ? `${profile.id.slice(0, 4).toUpperCase()}-${profile.id.slice(24, 28).toUpperCase()}` : "XXXX-XXXX"}
              </p>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="flex justify-between items-end pt-4 border-t border-white/10">
            <div>
              <p className="text-[9px] text-white/60 uppercase font-bold tracking-wider">Nama Member</p>
              <p className="text-sm font-black text-white truncate max-w-[140px]">{profile?.full_name || "Member"}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-white/60 uppercase font-bold tracking-wider">Poin</p>
              <div className="flex items-center gap-1 justify-end">
                <Star className="w-3 h-3 text-yellow-300" />
                <p className="text-lg font-black text-white">{points.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty Progress Tracker */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[1.5rem] border border-slate-200/50 shadow-xl">
        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          Progress Tingkat Member
        </h3>
        
        <div className="space-y-4">
          {/* Tier Progress */}
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium">Tier:</span>
              <span className="font-black text-emerald-600 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-1 rounded-full border border-emerald-200">
                {loyaltyTier} {tierIcons[loyaltyTier]}
              </span>
            </div>
            {nextTier !== "Max Tier" ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-medium">Target:</span>
                <span className="font-black text-slate-800">{nextTier}</span>
              </div>
            ) : (
              <span className="text-amber-600 font-bold flex items-center gap-1">
                <Crown className="w-4 h-4" /> Tier Tertinggi!
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 h-full rounded-full transition-all duration-1000 relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </div>
            </div>
            <div className="absolute -top-1 right-0 text-[10px] font-black text-emerald-600">
              {Math.round(progressPercentage)}%
            </div>
          </div>

          {/* Info Text */}
          {nextTier !== "Max Tier" && (
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-3 border border-slate-100">
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Belanja <span className="font-black text-emerald-600">Rp {(targetSpent - totalSpent).toLocaleString("id-ID")}</span> lagi untuk naik ke <span className="font-black">{nextTier}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
