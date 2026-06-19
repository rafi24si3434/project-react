import React from "react";

export default function ProfileModal({ isProfileModalOpen, setIsProfileModalOpen, editProfileForm, setEditProfileForm, handleProfileSubmit, submittingProfile }) {
  if (!isProfileModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in text-left">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-850 text-base flex items-center gap-2">
            <span>👤 Edit Profil Saya</span>
          </h3>
          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-slate-150 flex items-center justify-center text-slate-450 transition cursor-pointer font-bold text-lg"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Nama Lengkap <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              value={editProfileForm.fullName}
              onChange={(e) => setEditProfileForm({ ...editProfileForm, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Nomor HP</label>
            <input
              type="text"
              value={editProfileForm.phoneNumber}
              onChange={(e) => setEditProfileForm({ ...editProfileForm, phoneNumber: e.target.value })}
              placeholder="0812xxxxxxxx"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Alamat Pengiriman</label>
            <textarea
              rows="3"
              value={editProfileForm.address}
              onChange={(e) => setEditProfileForm({ ...editProfileForm, address: e.target.value })}
              placeholder="Jl. Anggrek No. 12..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
            ></textarea>
          </div>

          <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submittingProfile}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/10 cursor-pointer transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {submittingProfile ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
