import React, { useState } from "react";
import { FaStar, FaExclamationTriangle, FaTimes } from "react-icons/fa";

export default function FeedbackComplaintModal({ isOpen, onClose, onSubmitReview, onSubmitComplaint }) {
  const [activeSubTab, setActiveSubTab] = useState("review"); // "review" | "complaint"

  // Review states
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Complaint states
  const [complaintText, setComplaintText] = useState("");
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  if (!isOpen) return null;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText) return;
    setSubmittingReview(true);
    await onSubmitReview(rating, reviewText);
    setSubmittingReview(false);
    setReviewText("");
    setRating(5);
    onClose();
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!complaintText) return;
    setSubmittingComplaint(true);
    await onSubmitComplaint(complaintText);
    setSubmittingComplaint(false);
    setComplaintText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-fade-in text-left">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-850 text-base">
            Ulasan & Bantuan Layanan
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-150 flex items-center justify-center text-slate-450 transition cursor-pointer font-bold text-lg"
          >
            <FaTimes className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-100 bg-slate-50/30 p-1">
          <button
            onClick={() => setActiveSubTab("review")}
            className={`flex-1 py-3 text-center text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeSubTab === "review"
                ? "border-emerald-500 text-emerald-650"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            ⭐️ Beri Ulasan
          </button>
          <button
            onClick={() => setActiveSubTab("complaint")}
            className={`flex-1 py-3 text-center text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeSubTab === "complaint"
                ? "border-rose-500 text-rose-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            ⚠️ Laporkan Kendala
          </button>
        </div>

        <div className="p-6">
          {activeSubTab === "review" ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase">Bagaimana Pelayanan Kami?</p>
                <div className="flex justify-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="text-2xl transition duration-155 hover:scale-110 cursor-pointer"
                    >
                      <FaStar
                        className={
                          star <= (hoverRating || rating)
                            ? "text-amber-400"
                            : "text-slate-200"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">
                  Ulasan Anda
                </label>
                <textarea
                  rows="3"
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tulis ulasan Anda tentang dokter, fasilitas, atau obat..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/10 transition active:scale-[0.98] cursor-pointer"
              >
                {submittingReview ? "Mengirim..." : "Kirim Ulasan"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleComplaintSubmit} className="space-y-4">
              <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4 text-xs text-rose-800 flex gap-2.5">
                <FaExclamationTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500 animate-bounce" />
                <div>
                  <p className="font-bold">Butuh Bantuan Segera?</p>
                  <p className="mt-0.5 font-medium leading-relaxed">
                    Tuliskan keluhan atau kendala transaksi/janji temu Anda. Admin kami akan segera menyelesaikan kendala Anda.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">
                  Detail Keluhan / Masalah
                </label>
                <textarea
                  rows="4"
                  required
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="Jelaskan detail kendala Anda..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 font-medium resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submittingComplaint}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-500/10 transition active:scale-[0.98] cursor-pointer"
              >
                {submittingComplaint ? "Mengirim..." : "Kirim Tiket Keluhan"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
