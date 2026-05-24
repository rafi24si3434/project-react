import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Alamat email wajib diisi.");
      return;
    }

    // Validasi email sederhana
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setLoading(true);
    // Simulasi proses API request
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div>
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Lupa Password? 🔐</h2>
        <p className="text-sm text-gray-400">
          Jangan khawatir! Masukkan email yang terdaftar, dan kami akan mengirimkan instruksi untuk mengatur ulang password Anda.
        </p>
      </div>

      {/* Pesan Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Pesan Sukses */}
      {success ? (
        <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm px-4 py-4 rounded-xl text-center">
          <p className="font-semibold mb-1">Cek Email Anda! 💌</p>
          <p className="text-xs opacity-90">
            Link untuk mereset password telah dikirim ke <strong>{email}</strong>. Silakan periksa kotak masuk atau folder spam Anda.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Email */}
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Alamat Email</label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dokter@petcare.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition placeholder-gray-300"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-semibold text-sm shadow-md shadow-emerald-200 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Mengirim Link...
              </>
            ) : (
              "Kirim Link Reset 📨"
            )}
          </button>
        </form>
      )}

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-emerald-500 font-semibold transition"
        >
          <FaArrowLeft className="text-[10px]" /> Kembali ke Halaman Masuk
        </Link>
      </div>
    </div>
  );
}