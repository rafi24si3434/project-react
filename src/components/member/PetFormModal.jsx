import React from "react";
import { PawPrint, X, Heart, Scale, Calendar, FileText } from "lucide-react";

export default function PetFormModal({ isPetModalOpen, setIsPetModalOpen, petForm, setPetForm, handlePetFormSubmit, submittingPet }) {
  if (!isPetModalOpen) return null;

  const petTypeEmojis = {
    "Kucing": "🐱",
    "Anjing": "🐶",
    "Kelinci": "🐰",
    "Burung": "🐦",
    "Hamster": "🐹",
    "Lainnya": "🐾"
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] border border-slate-200/50 shadow-2xl w-full max-w-lg overflow-hidden animate-in slide-in-from-bottom-4 duration-300 text-left">
        {/* Modal Header */}
        <div className="relative overflow-hidden px-7 py-6 border-b border-slate-200/50 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-2xl">
                {petTypeEmojis[petForm.type] || "🐾"}
              </div>
              <div>
                <h3 className="font-black text-white text-lg">Daftarkan Anabul</h3>
                <p className="text-blue-100 text-xs font-medium">Tambah hewan peliharaan baru</p>
              </div>
            </div>
            <button
              onClick={() => setIsPetModalOpen(false)}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handlePetFormSubmit} className="p-7 space-y-5">
          {/* Pet Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <PawPrint className="w-4 h-4 text-blue-500" />
              Nama Hewan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={petForm.name}
              onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
              placeholder="Contoh: Milo, Whiskers, Bruno"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 font-medium shadow-sm hover:shadow-md transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Pet Type */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Jenis Hewan <span className="text-rose-500">*</span></label>
              <select
                value={petForm.type}
                onChange={(e) => setPetForm({ ...petForm, type: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white cursor-pointer font-medium text-slate-700 shadow-sm hover:shadow-md transition-all"
              >
                {["Kucing", "Anjing", "Kelinci", "Burung", "Hamster", "Lainnya"].map(t => (
                  <option key={t} value={t}>{petTypeEmojis[t]} {t}</option>
                ))}
              </select>
            </div>

            {/* Pet Gender */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Jenis Kelamin</label>
              <select
                value={petForm.gender}
                onChange={(e) => setPetForm({ ...petForm, gender: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white cursor-pointer font-medium text-slate-700 shadow-sm hover:shadow-md transition-all"
              >
                <option value="Jantan">♂️ Jantan</option>
                <option value="Betina">♀️ Betina</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {/* Breed */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <Heart className="w-4 h-4 text-pink-500" />
                Ras / Keturunan
              </label>
              <input
                type="text"
                value={petForm.breed}
                onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                placeholder="Contoh: Persia, Pomeranian"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 font-medium shadow-sm hover:shadow-md transition-all"
              />
            </div>

            {/* Weight */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <Scale className="w-4 h-4 text-amber-500" />
                Berat (Kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={petForm.weight}
                onChange={(e) => setPetForm({ ...petForm, weight: e.target.value })}
                placeholder="Contoh: 4.5"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 font-medium shadow-sm hover:shadow-md transition-all"
              />
            </div>
          </div>

          {/* Birth date */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-emerald-500" />
              Tanggal Lahir
            </label>
            <input
              type="date"
              value={petForm.birthDate}
              onChange={(e) => setPetForm({ ...petForm, birthDate: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 font-medium text-slate-700 cursor-pointer shadow-sm hover:shadow-md transition-all"
            />
          </div>

          {/* Health Notes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-violet-500" />
              Catatan Medis / Alergi
            </label>
            <textarea
              rows="2"
              value={petForm.healthNotes}
              onChange={(e) => setPetForm({ ...petForm, healthNotes: e.target.value })}
              placeholder="Contoh: Alergi obat tertentu, manja, lemas..."
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 font-medium resize-none shadow-sm hover:shadow-md transition-all"
            ></textarea>
          </div>

          {/* Form Buttons */}
          <div className="flex gap-4 justify-end pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsPetModalOpen(false)}
              className="px-6 py-3.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-all duration-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submittingPet}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 hover:from-blue-600 hover:via-cyan-600 hover:to-teal-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20 cursor-pointer transition-all duration-300 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submittingPet ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <PawPrint className="w-4 h-4" />
                  Daftarkan Hewan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
