import React from "react";

export default function PetFormModal({ isPetModalOpen, setIsPetModalOpen, petForm, setPetForm, handlePetFormSubmit, submittingPet }) {
  if (!isPetModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-850 text-base flex items-center gap-2">
            <span>🐱 Daftarkan Hewan Peliharaan Baru</span>
          </h3>
          <button
            onClick={() => setIsPetModalOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-slate-150 flex items-center justify-center text-slate-450 transition cursor-pointer font-bold text-lg"
          >
            &times;
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handlePetFormSubmit} className="p-6 space-y-4">
          {/* Pet Name */}
          <div>
            <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Nama Peliharaan <span className="text-red-400">*</span></label>
            <input
              type="text"
              required
              value={petForm.name}
              onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
              placeholder="Milo / Whiskers"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Pet Type */}
            <div>
              <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Jenis Hewan <span className="text-red-400">*</span></label>
              <select
                value={petForm.type}
                onChange={(e) => setPetForm({ ...petForm, type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white cursor-pointer font-semibold text-slate-750"
              >
                {["Kucing", "Anjing", "Kelinci", "Burung", "Hamster", "Lainnya"].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Pet Gender */}
            <div>
              <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Jenis Kelamin</label>
              <select
                value={petForm.gender}
                onChange={(e) => setPetForm({ ...petForm, gender: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white cursor-pointer font-semibold text-slate-755"
              >
                <option value="Jantan">Jantan</option>
                <option value="Betina">Betina</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Breed */}
            <div>
              <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Ras / Keturunan</label>
              <input
                type="text"
                value={petForm.breed}
                onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                placeholder="Persia / Anggora"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Berat Badan (Kg)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={petForm.weight}
                onChange={(e) => setPetForm({ ...petForm, weight: e.target.value })}
                placeholder="4.5"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
              />
            </div>
          </div>

          {/* Birth date */}
          <div>
            <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Tanggal Lahir</label>
            <input
              type="date"
              value={petForm.birthDate}
              onChange={(e) => setPetForm({ ...petForm, birthDate: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-semibold text-slate-755 cursor-pointer"
            />
          </div>

          {/* Health Notes */}
          <div>
            <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Catatan Medis / Alergi</label>
            <textarea
              rows="2"
              value={petForm.healthNotes}
              onChange={(e) => setPetForm({ ...petForm, healthNotes: e.target.value })}
              placeholder="Alergi obat, manja, lemas..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
            ></textarea>
          </div>

          {/* Form Buttons */}
          <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPetModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submittingPet}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/10 cursor-pointer transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingPet ? "Menyimpan..." : "Daftarkan Hewan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
