import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaKey } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusField, setFocusField] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Alamat email wajib diisi.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div>
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-[1.2rem] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/25">
          <FaKey className="text-white text-2xl" />
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8 text-center">
        <h2 className="text-[1.7rem] font-extrabold text-gray-900 tracking-tight leading-tight">
          Lupa Password?
        </h2>
        <p className="text-gray-500 text-sm mt-2 font-medium leading-relaxed max-w-xs mx-auto">
          Jangan khawatir! Masukkan email Anda dan kami akan mengirimkan instruksi reset.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 text-red-600 text-sm px-5 py-3.5 rounded-2xl font-semibold flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sm">⚠️</span>
          </div>
          {error}
        </div>
      )}

      {/* Success State */}
      {success ? (
        <div className="text-center">
          <div className="mb-6 bg-gradient-to-b from-emerald-50 to-teal-50/50 border border-emerald-100 p-8 rounded-3xl">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mx-auto mb-5 shadow-lg shadow-emerald-200/40 border border-emerald-100">
              💌
            </div>
            <h3 className="font-extrabold text-lg text-emerald-800 mb-2">Cek Email Anda!</h3>
            <p className="text-sm font-medium text-emerald-600/80 leading-relaxed">
              Link untuk mereset password telah dikirim ke
            </p>
            <div className="inline-block mt-3 px-4 py-2 rounded-xl bg-white border border-emerald-200 text-sm font-bold text-emerald-700 shadow-sm">
              {email}
            </div>
          </div>

          <p className="text-xs text-gray-500 font-medium mb-5 mt-4">
            Tidak menerima email? Periksa folder <strong>spam</strong> Anda.
          </p>

          <button
            onClick={() => { setSuccess(false); setEmail(""); }}
            className="text-emerald-600 font-bold text-sm hover:text-emerald-700 transition-colors underline underline-offset-2 decoration-emerald-300"
          >
            Kirim ulang ke email lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2.5 block">
              Alamat Email
            </label>
            <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
              focusField === "email"
                ? "border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
                : "border-gray-100 hover:border-gray-200"
            }`}>
              <div className={`absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center transition-colors duration-300 ${
                focusField === "email" ? "bg-emerald-50 text-emerald-500" : "bg-gray-50 text-gray-400"
              }`}>
                <FaEnvelope className="text-sm" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusField("email")}
                onBlur={() => setFocusField("")}
                placeholder="dokter@petcare.com"
                className="w-full pl-14 pr-4 py-3.5 bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-500 to-teal-500 hover:from-emerald-600 hover:via-emerald-600 hover:to-teal-600 active:scale-[0.98] text-white font-bold text-[15px] shadow-[0_10px_30px_-8px_rgba(16,185,129,0.5)] hover:shadow-[0_14px_35px_-8px_rgba(16,185,129,0.6)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-1"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Mengirim Link...</span>
              </>
            ) : (
              <>
                Kirim Link Reset
                <span className="text-lg">📨</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Back to Login */}
      <div className="mt-8 text-center">
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2.5 text-sm text-gray-500 hover:text-emerald-600 font-bold transition-all py-2.5 px-5 rounded-xl hover:bg-emerald-50 group"
        >
          <FaArrowLeft className="text-xs transition-transform group-hover:-translate-x-1" /> Kembali ke Halaman Masuk
        </Link>
      </div>
    </div>
  );
}