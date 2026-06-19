import React from "react";

export default function BookingModal({ isBookingModalOpen, setIsBookingModalOpen, bookingForm, setBookingForm, pets, handleBookingSubmit, submittingBooking }) {
  if (!isBookingModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in text-left">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-850 text-base flex items-center gap-2">
            <span>📅 Buat Janji Berobat & Kunjungan</span>
          </h3>
          <button
            onClick={() => setIsBookingModalOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-slate-150 flex items-center justify-center text-slate-450 transition cursor-pointer font-bold text-lg"
          >
            &times;
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
          {/* Pet Selector */}
          <div>
            <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Pilih Anabul <span className="text-red-400">*</span></label>
            <select
              required
              value={bookingForm.petId}
              onChange={(e) => setBookingForm({ ...bookingForm, petId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white cursor-pointer font-semibold text-slate-750"
            >
              <option value="" disabled>-- Pilih Anabul --</option>
              {pets.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
              ))}
            </select>
          </div>

          {/* Service Type & Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Jenis Layanan <span className="text-red-400">*</span></label>
              <select
                value={bookingForm.type}
                onChange={(e) => setBookingForm({ ...bookingForm, type: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white cursor-pointer font-semibold text-slate-750"
              >
                {["Pemeriksaan Umum", "Vaksinasi & Booster", "Konsultasi Nutrisi & Diet", "Perawatan Kulit & Bulu", "Pemeriksaan Gigi", "Tindakan Bedah / Operasi"].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Dokter Hewan <span className="text-red-400">*</span></label>
              <select
                value={bookingForm.doctor}
                onChange={(e) => setBookingForm({ ...bookingForm, doctor: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white cursor-pointer font-semibold text-slate-750"
              >
                {["drh. Nisa Putri", "drh. Aditya Ramadhan", "drh. Citra Maharani", "drh. Farhan Akbar"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Tanggal Kunjungan <span className="text-red-400">*</span></label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-semibold text-slate-755 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Jam Kunjungan <span className="text-red-400">*</span></label>
              <select
                value={bookingForm.time}
                onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white cursor-pointer font-semibold text-slate-750"
              >
                {["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(t => (
                  <option key={t} value={t}>{t} WIB</option>
                ))}
              </select>
            </div>
          </div>

          {/* Keluhan / Notes */}
          <div>
            <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Keluhan / Catatan Medis</label>
            <textarea
              rows="3"
              value={bookingForm.notes}
              onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
              placeholder="Deskripsikan kondisi anabul atau keluhan medis..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
            ></textarea>
          </div>

          {/* Form Buttons */}
          <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(false)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submittingBooking}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/10 cursor-pointer transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingBooking ? "Mengirim..." : "Simpan Janji Temu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
