import React from "react";
import { Calendar, Clock, User, PawPrint, Stethoscope, FileText, X } from "lucide-react";

export default function BookingModal({ isBookingModalOpen, setIsBookingModalOpen, bookingForm, setBookingForm, pets, handleBookingSubmit, submittingBooking }) {
  if (!isBookingModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] border border-slate-200/50 shadow-2xl w-full max-w-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 text-left">
        {/* Modal Header */}
        <div className="relative overflow-hidden px-7 py-6 border-b border-slate-200/50 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-black text-white text-lg">Buat Janji Berobat</h3>
                <p className="text-violet-100 text-xs font-medium">Jadwalkan kunjungan ke dokter hewan</p>
              </div>
            </div>
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleBookingSubmit} className="p-7 space-y-5">
          {/* Pet Selector */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <PawPrint className="w-4 h-4 text-violet-500" />
              Pilih Anabul <span className="text-rose-500">*</span>
            </label>
            <select
              required
              value={bookingForm.petId}
              onChange={(e) => setBookingForm({ ...bookingForm, petId: e.target.value })}
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 bg-white cursor-pointer font-medium text-slate-700 shadow-sm hover:shadow-md transition-all"
            >
              <option value="" disabled>-- Pilih Hewan Peliharaan --</option>
              {pets.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
              ))}
            </select>
          </div>

          {/* Service Type & Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <Stethoscope className="w-4 h-4 text-emerald-500" />
                Jenis Layanan <span className="text-rose-500">*</span>
              </label>
              <select
                value={bookingForm.type}
                onChange={(e) => setBookingForm({ ...bookingForm, type: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 bg-white cursor-pointer font-medium text-slate-700 shadow-sm hover:shadow-md transition-all"
              >
                {["Pemeriksaan Umum", "Vaksinasi & Booster", "Konsultasi Nutrisi", "Perawatan Kulit & Bulu", "Pemeriksaan Gigi", "Tindakan Bedah"].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <User className="w-4 h-4 text-blue-500" />
                Dokter Hewan <span className="text-rose-500">*</span>
              </label>
              <select
                value={bookingForm.doctor}
                onChange={(e) => setBookingForm({ ...bookingForm, doctor: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 bg-white cursor-pointer font-medium text-slate-700 shadow-sm hover:shadow-md transition-all"
              >
                {["drh. Nisa Putri", "drh. Aditya Ramadhan", "drh. Citra Maharani", "drh. Farhan Akbar"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Time picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-amber-500" />
                Tanggal <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 font-medium text-slate-700 cursor-pointer shadow-sm hover:shadow-md transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-rose-500" />
                Jam Kunjungan <span className="text-rose-500">*</span>
              </label>
              <select
                value={bookingForm.time}
                onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 bg-white cursor-pointer font-medium text-slate-700 shadow-sm hover:shadow-md transition-all"
              >
                {["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(t => (
                  <option key={t} value={t}>{t} WIB</option>
                ))}
              </select>
            </div>
          </div>

          {/* Keluhan / Notes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-slate-500" />
              Keluhan / Catatan
            </label>
            <textarea
              rows="3"
              value={bookingForm.notes}
              onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
              placeholder="Deskripsikan kondisi anabul atau keluhan medis..."
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 font-medium resize-none shadow-sm hover:shadow-md transition-all"
            ></textarea>
          </div>

          {/* Form Buttons */}
          <div className="flex gap-4 justify-end pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsBookingModalOpen(false)}
              className="px-6 py-3.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-all duration-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submittingBooking}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 text-white text-xs font-bold shadow-lg shadow-violet-500/20 cursor-pointer transition-all duration-300 flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submittingBooking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Simpan Janji Temu
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
