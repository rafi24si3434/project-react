import { useState, useMemo } from "react";
import {
  FaStar,
  FaComment,
  FaExclamationCircle,
  FaCheckCircle,
  FaGift,
  FaSearch,
  FaHeart,
  FaReply
} from "react-icons/fa";
import { crmCustomers } from "@/data/CustomerCrmData";
import ToastNotification from "../components/ToastNotification";

export default function Feedback() {
  // Extract reviews from customer data
  const initialReviews = useMemo(() => {
    return crmCustomers
      .filter((c) => c.rating > 0)
      .map((c) => ({
        id: `REV-${c.id}`,
        customerName: c.name,
        customerAvatar: c.avatar,
        rating: c.rating,
        reviewText: c.latestReview,
        date: c.activity.lastLogin === "Baru saja" ? "Hari ini" : c.activity.lastLogin,
        isReplied: false,
        replyText: "",
      }));
  }, []);

  // Extract complaints from customer data
  const initialComplaints = useMemo(() => {
    const list = [];
    crmCustomers.forEach((c) => {
      if (c.complaintHistory && c.complaintHistory.length > 0) {
        c.complaintHistory.forEach((comp) => {
          list.push({
            id: comp.id,
            customerId: c.id,
            customerName: c.name,
            customerAvatar: c.avatar,
            customerEmail: c.email,
            note: comp.note,
            status: "Pending", // "Pending" | "Selesai"
            compensationSent: false,
          });
        });
      }
    });
    return list;
  }, []);

  const [reviews, setReviews] = useState(initialReviews);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyInputs, setReplyInputs] = useState({}); // Stores input text for each review ID
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Trigger Toast Notification
  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) =>
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reviewText.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reviews, searchQuery]);

  // Handle send reply to review
  const handleSendReply = (reviewId) => {
    const text = replyInputs[reviewId];
    if (!text) return;

    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, isReplied: true, replyText: text }
          : r
      )
    );
    // clear input
    setReplyInputs((prev) => ({ ...prev, [reviewId]: "" }));
    triggerToast("Balasan ulasan berhasil dipublikasikan!");
  };

  // Handle Resolve Complaint Ticket
  const handleResolveComplaint = (ticketId) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === ticketId ? { ...c, status: "Selesai" } : c))
    );
    triggerToast(`Tiket komplain ${ticketId} telah diselesaikan.`);
  };

  // Handle Send Compensation Gift
  const handleSendCompensation = (ticketId, customerName, email) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === ticketId ? { ...c, compensationSent: true } : c))
    );
    triggerToast(`Voucher kompensasi 15% dikirim ke email ${email}`);
  };

  // Rating distribution calculations
  const ratingDistribution = useMemo(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      dist[r.rating] = (dist[r.rating] || 0) + 1;
    });
    return dist;
  }, [reviews]);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">⭐️</span>
            <h1 className="text-xl font-bold text-gray-800">Feedback & Komplain</h1>
          </div>
          <p className="text-sm text-gray-400 pl-8">
            Kelola ulasan customer, survei kepuasan, dan selesaikan tiket keluhan
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Cari reviewer atau isi ulasan..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">⭐️</span>
          <div>
            <p className="text-xl font-bold text-gray-800">{avgRating} / 5.0</p>
            <div className="flex gap-0.5 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-[9px] ${
                    i < Math.round(parseFloat(avgRating)) ? "text-amber-400" : "text-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">💬</span>
          <div>
            <p className="text-xl font-bold text-blue-700">{reviews.length}</p>
            <p className="text-xs text-gray-400">Total Ulasan</p>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-xl font-bold text-rose-700">
              {complaints.filter((c) => c.status === "Pending").length}
            </p>
            <p className="text-xs text-gray-400">Keluhan Aktif</p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">✅</span>
          <div>
            <p className="text-xl font-bold text-emerald-700">
              {complaints.filter((c) => c.status === "Selesai").length}
            </p>
            <p className="text-xs text-gray-400">Keluhan Selesai</p>
          </div>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 items-start">
        {/* LEFT COLUMN: REVIEWS FEED */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-gray-50 pb-3 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-sm">Ulasan Kepuasan Customer</h3>
            <span className="text-xs font-semibold bg-violet-50 text-violet-600 px-2.5 py-1 rounded-full">
              {filteredReviews.length} Review Cocok
            </span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {filteredReviews.length > 0 ? (
              filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="border border-gray-100 rounded-2xl p-4 space-y-3 hover:bg-gray-50/55 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <img
                        src={rev.customerAvatar}
                        alt={rev.customerName}
                        className="h-9 w-9 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{rev.customerName}</h4>
                        <p className="text-[9px] text-gray-400 font-semibold">{rev.date}</p>
                      </div>
                    </div>

                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <FaStar
                          key={idx}
                          className={`text-xs ${
                            idx < rev.rating ? "text-amber-400" : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                    "{rev.reviewText}"
                  </p>

                  {/* Reply Log */}
                  {rev.isReplied && (
                    <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-3 ml-6 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded bg-violet-500 text-white flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                        A
                      </div>
                      <div className="text-xs">
                        <div className="flex items-center gap-2 text-violet-900 font-bold">
                          <span>Tanggapan Admin</span>
                          <span className="text-[8px] bg-violet-200/50 text-violet-700 px-1.5 py-0.5 rounded-full font-bold">Telah Terbit</span>
                        </div>
                        <p className="mt-1 font-semibold text-violet-850">{rev.replyText}</p>
                      </div>
                    </div>
                  )}

                  {/* Action box to reply */}
                  {!rev.isReplied && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        value={replyInputs[rev.id] || ""}
                        onChange={(e) =>
                          setReplyInputs((prev) => ({ ...prev, [rev.id]: e.target.value }))
                        }
                        type="text"
                        placeholder="Balas ulasan ini..."
                        className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-violet-400 transition"
                      />
                      <button
                        onClick={() => handleSendReply(rev.id)}
                        disabled={!replyInputs[rev.id]}
                        className="bg-violet-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-violet-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
                      >
                        <FaReply className="text-[10px]" />
                        Balas
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-gray-400 text-xs font-semibold">
                Ulasan tidak ditemukan.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: RATING RANGES & COMPLAINT RESOLVER */}
        <div className="space-y-6">
          {/* Distribution Bars */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3.5">
            <h3 className="font-bold text-gray-800 text-xs flex items-center gap-2">
              <FaHeart className="text-rose-500 text-xs" />
              Distribusi Bintang Kepuasan
            </h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingDistribution[stars] || 0;
                const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-4 font-bold text-gray-500">{stars}★</span>
                    <div className="h-2 flex-1 rounded-full bg-gray-150 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-5 text-right font-bold text-gray-400">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Complaints Manager */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <span className="text-lg">⚠️</span>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Tiket Keluhan Customer</h3>
                <p className="text-[10px] text-gray-400">Selesaikan komplain dan klaim voucher kompensasi</p>
              </div>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {complaints.map((comp) => (
                <div key={comp.id} className="border border-gray-100 rounded-2xl p-3 bg-gray-50/40 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <img
                        src={comp.customerAvatar}
                        alt={comp.customerName}
                        className="h-7 w-7 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{comp.customerName}</h4>
                        <p className="text-[9px] text-gray-400">{comp.id}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        comp.status === "Selesai"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-rose-50 text-rose-500"
                      }`}
                    >
                      {comp.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 bg-white border border-gray-50 p-2 rounded-xl leading-relaxed">
                    "{comp.note}"
                  </p>

                  <div className="flex gap-1.5">
                    {comp.status === "Pending" ? (
                      <button
                        onClick={() => handleResolveComplaint(comp.id)}
                        className="flex-1 flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold py-1.5 rounded-xl shadow-sm transition"
                      >
                        <FaCheckCircle className="text-[9px]" />
                        Selesaikan
                      </button>
                    ) : (
                      <button
                        disabled
                        className="flex-1 flex items-center justify-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold py-1.5 rounded-xl transition"
                      >
                        <FaCheckCircle className="text-[9px]" />
                        Resolved
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleSendCompensation(comp.id, comp.customerName, comp.customerEmail)
                      }
                      disabled={comp.compensationSent}
                      className="flex-1 flex items-center justify-center gap-1 border border-violet-200 bg-white hover:bg-violet-50 text-violet-600 text-[10px] font-bold py-1.5 rounded-xl disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-100 disabled:cursor-not-allowed transition"
                    >
                      <FaGift className="text-[9px]" />
                      {comp.compensationSent ? "Kirim Ulang" : "Kompensasi"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TOAST FEEDBACK ALERT */}
      <ToastNotification
        isVisible={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
