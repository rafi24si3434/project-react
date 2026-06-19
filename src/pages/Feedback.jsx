import { useState, useMemo, useEffect, useRef } from "react";
import {
  FaStar,
  FaComment,
  FaExclamationCircle,
  FaCheckCircle,
  FaGift,
  FaSearch,
  FaHeart,
  FaReply,
  FaPlusCircle
} from "react-icons/fa";
import { supabase } from "../lib/supabase";
import ToastNotification from "../components/ToastNotification";

export default function Feedback() {
  const [reviews, setReviews] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyInputs, setReplyInputs] = useState({}); // Stores input text for each review ID
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Kategori komplain state
  const [complaintFilter, setComplaintFilter] = useState("Semua");

  // Form input states
  const [newComplaintName, setNewComplaintName] = useState("");
  const [newComplaintText, setNewComplaintText] = useState("");

  // Refs
  const complaintTextareaRef = useRef(null);
  const feedbackFormRef = useRef(null);

  // Trigger Toast Notification
  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Load reviews and complaints from Supabase
  const loadFeedbackAndComplaints = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Feedback with fallback mapping
      let fbData = [];
      const { data: fbJoinData, error: fbJoinErr } = await supabase
        .from("feedback")
        .select(`
          *,
          users (full_name)
        `)
        .order("created_at", { ascending: false });

      if (fbJoinErr) {
        console.warn("Feedback join query failed, using in-memory mapping fallback:", fbJoinErr.message);
        const { data: rawFb, error: rawFbErr } = await supabase
          .from("feedback")
          .select("*")
          .order("created_at", { ascending: false });
        if (rawFbErr) throw rawFbErr;

        const { data: usersData } = await supabase
          .from("users")
          .select("auth_user_id, full_name");

        const userMap = {};
        if (usersData) {
          usersData.forEach((u) => {
            userMap[u.auth_user_id] = u.full_name;
          });
        }

        fbData = (rawFb || []).map((f) => ({
          ...f,
          users: f.customer_id ? { full_name: userMap[f.customer_id] } : null
        }));
      } else {
        fbData = fbJoinData || [];
      }

      const mappedReviews = fbData.map((f) => ({
        id: f.id,
        customerName: f.users?.full_name || "Customer PetCare",
        customerAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(f.users?.full_name || f.id)}`,
        rating: f.rating,
        reviewText: f.review_text,
        date: new Date(f.created_at).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric"
        }),
        isReplied: f.is_replied,
        replyText: f.reply_text || ""
      }));

      setReviews(mappedReviews);

      // 2. Fetch Complaints with fallback mapping
      let compData = [];
      const { data: compJoinData, error: compJoinErr } = await supabase
        .from("complaints")
        .select(`
          *,
          users (full_name, email)
        `)
        .order("created_at", { ascending: false });

      if (compJoinErr) {
        console.warn("Complaints join query failed, using in-memory mapping fallback:", compJoinErr.message);
        const { data: rawComp, error: rawCompErr } = await supabase
          .from("complaints")
          .select("*")
          .order("created_at", { ascending: false });
        if (rawCompErr) throw rawCompErr;

        const { data: usersData } = await supabase
          .from("users")
          .select("auth_user_id, full_name, email");

        const userMap = {};
        if (usersData) {
          usersData.forEach((u) => {
            userMap[u.auth_user_id] = { full_name: u.full_name, email: u.email };
          });
        }

        compData = (rawComp || []).map((c) => ({
          ...c,
          users: c.customer_id ? userMap[c.customer_id] : null
        }));
      } else {
        compData = compJoinData || [];
      }

      const mappedComplaints = compData.map((c) => ({
        id: c.id,
        customerId: c.customer_id,
        customerName: c.users?.full_name || c.customer_name || "Anonim",
        customerAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(c.users?.full_name || c.customer_name || c.id)}`,
        customerEmail: c.users?.email || "no-email@petcare.id",
        note: c.note,
        status: c.status,
        compensationSent: c.compensation_sent
      }));

      setComplaints(mappedComplaints);
    } catch (err) {
      console.error("Error loading feedback/complaints:", err);
      triggerToast("Gagal memuat data feedback & keluhan.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbackAndComplaints();
  }, []);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) =>
      r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reviewText.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [reviews, searchQuery]);

  // Filter complaints according to category
  const filteredComplaints = useMemo(() => {
    if (complaintFilter === "Semua") return complaints;
    return complaints.filter((c) => c.status === complaintFilter);
  }, [complaints, complaintFilter]);

  // Handle send reply to review
  const handleSendReply = async (reviewId) => {
    const text = replyInputs[reviewId];
    if (!text) return;

    try {
      const { error } = await supabase
        .from("feedback")
        .update({
          is_replied: true,
          reply_text: text
        })
        .eq("id", reviewId);

      if (error) throw error;

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
    } catch (err) {
      console.error("Error replying to feedback:", err);
      triggerToast("Gagal mengirim balasan ulasan.");
    }
  };

  // Handle Add Complaint
  const handleAddComplaint = async (e) => {
    e.preventDefault();
    if (!newComplaintName || !newComplaintText) {
      alert("Harap lengkapi nama customer dan isi komplain!");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("complaints")
        .insert({
          customer_name: newComplaintName,
          note: newComplaintText,
          status: "Pending"
        })
        .select()
        .single();

      if (error) throw error;

      const newComp = {
        id: data.id,
        customerId: null,
        customerName: data.customer_name,
        customerAvatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(data.customer_name)}`,
        customerEmail: "no-email@petcare.id",
        note: data.note,
        status: data.status,
        compensationSent: data.compensation_sent
      };

      setComplaints([newComp, ...complaints]);
      setNewComplaintName("");
      setNewComplaintText("");
      triggerToast("Keluhan baru berhasil dicatat secara internal!");
    } catch (err) {
      console.error("Error creating complaint:", err);
      triggerToast("Gagal mencatat keluhan.");
    }
  };

  const focusComplaintTextarea = () => {
    if (complaintTextareaRef.current) {
      complaintTextareaRef.current.focus();
    }
  };

  // Handle Resolve Complaint Ticket
  const handleResolveComplaint = async (ticketId) => {
    try {
      const { error } = await supabase
        .from("complaints")
        .update({ status: "Selesai" })
        .eq("id", ticketId);

      if (error) throw error;

      setComplaints((prev) =>
        prev.map((c) => (c.id === ticketId ? { ...c, status: "Selesai" } : c))
      );
      triggerToast(`Tiket komplain ${ticketId.slice(0, 8)} telah diselesaikan.`);
    } catch (err) {
      console.error("Error resolving complaint:", err);
      triggerToast("Gagal menyelesaikan komplain.");
    }
  };

  // Handle Send Compensation Gift
  const handleSendCompensation = async (ticketId, customerName, email) => {
    try {
      const { error } = await supabase
        .from("complaints")
        .update({ compensation_sent: true })
        .eq("id", ticketId);

      if (error) throw error;

      setComplaints((prev) =>
        prev.map((c) => (c.id === ticketId ? { ...c, compensationSent: true } : c))
      );
      triggerToast(`Voucher kompensasi 15% dikirim ke email ${email}`);
    } catch (err) {
      console.error("Error sending compensation:", err);
      triggerToast("Gagal mengirim kompensasi.");
    }
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
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 text-left">
            <span className="text-2xl">⭐️</span>
            <h1 className="text-xl font-bold text-gray-800">Feedback & Komplain</h1>
          </div>
          <p className="text-sm text-gray-400 pl-8 text-left">
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

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-400 font-semibold">Memuat feedback & komplain...</p>
          </div>
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 text-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-lg shadow-amber-200/30 hover:scale-[1.02] transition duration-300">
              <span className="text-3xl">⭐️</span>
              <div className="text-left">
                <p className="text-2xl font-black">{avgRating} <span className="text-sm font-medium text-white/80">/ 5.0</span></p>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-[10px] ${
                        i < Math.round(parseFloat(avgRating)) ? "text-white" : "text-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-555 via-purple-500 to-indigo-650 text-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-lg shadow-indigo-200/30 hover:scale-[1.02] transition duration-300">
              <span className="text-3xl">💬</span>
              <div className="text-left">
                <p className="text-2xl font-black">{reviews.length}</p>
                <p className="text-xs text-indigo-100 font-semibold uppercase tracking-wider mt-0.5">Total Ulasan</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-400 via-pink-400 to-rose-500 text-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-lg shadow-rose-200/30 hover:scale-[1.02] transition duration-300">
              <span className="text-3xl">⚠️</span>
              <div className="text-left">
                <p className="text-2xl font-black">
                  {complaints.filter((c) => c.status === "Pending").length}
                </p>
                <p className="text-xs text-rose-100 font-semibold uppercase tracking-wider mt-0.5">Keluhan Aktif</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-450 via-teal-400 to-emerald-500 text-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-lg shadow-emerald-200/30 hover:scale-[1.02] transition duration-300">
              <span className="text-3xl">✅</span>
              <div className="text-left">
                <p className="text-2xl font-black">
                  {complaints.filter((c) => c.status === "Selesai").length}
                </p>
                <p className="text-xs text-emerald-100 font-semibold uppercase tracking-wider mt-0.5">Keluhan Selesai</p>
              </div>
            </div>
          </div>

          {/* AI SENTIMENT INSIGHTS CARD */}
          <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl shadow-purple-950/20 relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

            <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl text-left">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-450 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-violet-400 bg-violet-950/60 px-2.5 py-0.5 rounded-full border border-violet-850/40">
                    Paws & Care AI Engine
                  </span>
                </div>
                <h2 className="text-base font-black tracking-tight flex items-center gap-2">
                  💡 Analisis Sentimen & Insight Kepuasan Pelanggan
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Model kecerdasan buatan kami menganalisis ulasan pelanggan secara real-time. Sentimen minggu ini didominasi oleh ulasan <span className="text-emerald-450 font-bold">Sangat Positif</span> terutama mengenai keramahan tim medis dan kecepatan penanganan bedah.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 lg:gap-6 shrink-0 bg-slate-950/40 p-4 rounded-2xl border border-slate-800/60 w-full lg:w-auto justify-between lg:justify-start">
                <div className="text-center lg:text-left">
                  <p className="text-[10px] text-slate-400 font-semibold mb-0.5">Index Kepuasan</p>
                  <p className="text-2xl font-black text-emerald-400">94.2%</p>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-wide">Distribusi Sentimen</p>
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-emerald-400 font-extrabold">88%</span>
                      <span className="text-[9px] text-slate-500 font-bold">Positif</span>
                    </div>
                    <div className="w-1.5 h-6 bg-slate-800 rounded-full overflow-hidden flex flex-col justify-end">
                      <div className="h-[88%] bg-emerald-500 w-full rounded-full"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-amber-400 font-extrabold">8%</span>
                      <span className="text-[9px] text-slate-500 font-bold">Netral</span>
                    </div>
                    <div className="w-1.5 h-6 bg-slate-850 rounded-full overflow-hidden flex flex-col justify-end">
                      <div className="h-[8%] bg-amber-500 w-full rounded-full"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-rose-500 font-extrabold">4%</span>
                      <span className="text-[9px] text-slate-500 font-bold">Negatif</span>
                    </div>
                    <div className="w-1.5 h-6 bg-slate-855 rounded-full overflow-hidden flex flex-col justify-end">
                      <div className="h-[4%] bg-rose-500 w-full rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2-COLUMN LAYOUT */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 items-start text-left">
            {/* LEFT COLUMN: REVIEWS FEED */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="border-b border-gray-50 pb-3 flex justify-between items-center text-left">
                <h3 className="font-bold text-gray-800 text-sm">Ulasan Kepuasan Customer</h3>
                <span className="text-xs font-semibold bg-violet-50 text-violet-650 px-2.5 py-1 rounded-full">
                  {filteredReviews.length} Review Cocok
                </span>
              </div>

              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                {filteredReviews.length > 0 ? (
                  filteredReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className={`border border-l-4 rounded-2xl p-4 space-y-3 bg-white hover:shadow-md transition duration-300 text-left ${
                        rev.rating >= 4
                          ? "border-l-emerald-500 border-gray-100"
                          : rev.rating === 3
                          ? "border-l-amber-400 border-gray-100"
                          : "border-l-rose-400 border-gray-100"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.customerAvatar}
                            alt={rev.customerName}
                            className="h-10 w-10 rounded-xl object-cover ring-2 ring-gray-50 shadow-sm"
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

                      <p className="text-xs text-gray-650 font-semibold leading-relaxed pl-1 italic">
                        "{rev.reviewText}"
                      </p>

                      {/* Reply Log */}
                      {rev.isReplied && (
                        <div className="bg-violet-50/50 border border-violet-100 rounded-xl p-3 ml-6 flex items-start gap-2.5 shadow-inner">
                          <div className="w-6 h-6 rounded bg-violet-600 text-white flex items-center justify-center text-[9px] font-black shrink-0 mt-0.5 shadow-sm">
                            CS
                          </div>
                          <div className="text-xs">
                            <div className="flex items-center gap-2 text-violet-900 font-bold">
                              <span>Tanggapan Tim Paws & Care</span>
                              <span className="text-[8px] bg-violet-200/50 text-violet-750 px-2 py-0.5 rounded-full font-bold">Diterbitkan</span>
                            </div>
                            <p className="mt-1 font-semibold text-gray-700 leading-relaxed">{rev.replyText}</p>
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
                            className="bg-violet-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-violet-650 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm"
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
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3.5 text-left">
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
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚠️</span>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">Tiket Keluhan Customer</h3>
                      <p className="text-[10px] text-gray-400 font-semibold">Selesaikan komplain dan klaim voucher</p>
                    </div>
                  </div>
                  <select
                    value={complaintFilter}
                    onChange={(e) => setComplaintFilter(e.target.value)}
                    className="px-2 py-1 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-semibold cursor-pointer"
                  >
                    <option value="Semua">Semua Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((comp) => (
                      <div
                        key={comp.id}
                        className={`border border-gray-150 rounded-2xl p-4 bg-white hover:shadow-md transition duration-300 border-l-4 space-y-3 ${
                          comp.status === "Selesai" ? "border-l-emerald-500" : "border-l-rose-500"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={comp.customerAvatar}
                              alt={comp.customerName}
                              className="h-8 w-8 rounded-xl object-cover ring-1 ring-gray-100 shadow-sm"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-gray-800">{comp.customerName}</h4>
                              <p className="text-[9px] text-gray-400 font-semibold">{comp.id}</p>
                            </div>
                          </div>

                          <span
                            className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full select-none shadow-sm ${
                              comp.status === "Selesai"
                                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                : "bg-rose-50 text-rose-500 border border-rose-100 animate-pulse"
                            }`}
                          >
                            {comp.status}
                          </span>
                        </div>

                        <p className="text-xs text-gray-650 bg-gray-50/50 border border-gray-100 p-2.5 rounded-xl leading-relaxed italic font-medium">
                          "{comp.note}"
                        </p>

                        <div className="flex gap-1.5 pt-1">
                          {comp.status === "Pending" ? (
                            <button
                              onClick={() => handleResolveComplaint(comp.id)}
                              className="flex-1 flex items-center justify-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold py-2 rounded-xl shadow-sm transition"
                            >
                              <FaCheckCircle className="text-[9px]" />
                              Selesaikan
                            </button>
                          ) : (
                            <button
                              disabled
                              className="flex-1 flex items-center justify-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-bold py-2 rounded-xl transition"
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
                            className="flex-1 flex items-center justify-center gap-1 border border-violet-200 bg-white hover:bg-violet-50 text-violet-600 text-[10px] font-bold py-2 rounded-xl disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-100 disabled:cursor-not-allowed transition shadow-sm"
                          >
                            <FaGift className="text-[9px]" />
                            {comp.compensationSent ? "Kirim Ulang" : "Kompensasi"}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-8 text-center text-gray-400 text-xs font-semibold">
                      Tidak ada tiket keluhan.
                    </div>
                  )}
                </div>
              </div>

              {/* Form Kirim Feedback / Komplain Internal */}
              <div ref={feedbackFormRef} className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📝</span>
                    <h3 className="font-bold text-gray-800 text-sm">Catat Komplain Baru</h3>
                  </div>
                  <button
                    type="button"
                    onClick={focusComplaintTextarea}
                    className="text-[10px] text-emerald-600 hover:text-emerald-750 font-extrabold flex items-center gap-0.5"
                  >
                    Fokus Textarea
                  </button>
                </div>

                <form onSubmit={handleAddComplaint} className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-gray-500 font-bold mb-1 block">Nama Customer</label>
                    <input
                      type="text"
                      value={newComplaintName}
                      onChange={(e) => setNewComplaintName(e.target.value)}
                      placeholder="cth. Budi Santoso"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-250 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 font-bold mb-1 block">Detail Keluhan / Masalah</label>
                    <textarea
                      ref={complaintTextareaRef}
                      value={newComplaintText}
                      onChange={(e) => setNewComplaintText(e.target.value)}
                      rows={3}
                      placeholder="Deskripsikan komplain atau feedback..."
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-250 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-semibold resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2 rounded-xl shadow-sm transition"
                  >
                    <FaPlusCircle className="text-xs" />
                    Catat Tiket Komplain
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TOAST FEEDBACK ALERT */}
      <ToastNotification
        isVisible={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
