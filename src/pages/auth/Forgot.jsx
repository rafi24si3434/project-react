import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white shadow-2xl shadow-amber-500/30 mb-6 animate-pulse-slow">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Lupa Password?</h2>
        <p className="text-slate-500 font-medium text-lg">Jangan khawatir, kami akan bantu Anda mereset password.</p>
      </div>

      {error && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-red-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-red-900">{error}</p>
            <p className="text-xs text-red-600/80">Mohon periksa kembali data Anda</p>
          </div>
        </div>
      )}

      {success ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-500 text-white text-5xl mb-6 shadow-xl shadow-emerald-500/30 animate-bounce">
            💌
          </div>
          <h3 className="text-2xl font-black text-emerald-700 mb-2">Cek Email Anda!</h3>
          <p className="text-slate-600 font-medium mb-4">Link reset password telah dikirim ke:</p>
          <div className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 text-slate-800 font-bold shadow-lg shadow-emerald-500/10">
            {email}
          </div>
          <p className="text-xs text-slate-500 mt-6 font-medium">
            Tidak menerima email? Periksa folder <strong>spam</strong>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Alamat Email</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors duration-300" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contoh@email.com"
                className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-amber-500 focus:ring-6 focus:ring-amber-500/10 bg-slate-50 focus:bg-white transition-all duration-300 font-medium text-slate-800 placeholder-slate-400 group-hover:border-amber-300/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 hover:from-amber-600 hover:via-amber-700 hover:to-orange-600 text-white font-black text-lg shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/40 hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-4"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-lg font-black">Mengirim Link...</span>
              </>
            ) : (
              <>
                <span className="text-lg font-black">Kirim Link Reset</span>
                <ArrowLeft className="w-6 h-6 rotate-180" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="mt-8 pt-8 border-t border-slate-100">
        <Link
          to="/login"
          className="flex items-center justify-center gap-3 text-sm text-slate-500 font-black hover:text-emerald-600 transition-colors py-3 px-4 rounded-xl hover:bg-emerald-50 transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5" /> Kembali ke Halaman Masuk
        </Link>
      </div>
    </div>
  );
}