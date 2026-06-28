import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, CreditCard, Activity, Clock } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || !form.password) {
      setError("Email dan Password wajib diisi");
      return;
    }

    setLoading(true);

    try {
      await login(form.email, form.password);

      const { data: profileData } = await supabase
        .from("users")
        .select("role")
        .eq("email", form.email)
        .maybeSingle();

      const userRole = profileData?.role || "customer";

      if (userRole === "customer") {
        setSuccess("Login berhasil, redirect...");
        setTimeout(() => navigate("/member"), 800);
      } else {
        setSuccess("Login berhasil, redirect...");
        setTimeout(() => navigate("/dashboard"), 800);
      }
    } catch (err) {
      console.error("Login error details:", err);
      if (err.message && (err.message.includes("Email not confirmed") || err.message.includes("confirm"))) {
        setError("Email belum dikonfirmasi! Silakan konfirmasi email Anda, atau jika menggunakan testing lokal, nonaktifkan opsi 'Confirm email' di Supabase Dashboard (Authentication -> Providers -> Email).");
      } else {
        setError(err.message || "Email atau password salah");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-500 text-white shadow-2xl shadow-emerald-500/30 mb-6 animate-pulse-slow">
          <CreditCard className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Selamat Datang</h2>
        <p className="text-slate-500 font-medium text-lg">Masuk ke platform CRM PetCare Anda</p>
      </div>

      {success && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500/30 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-emerald-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-emerald-900">{success}</p>
            <p className="text-xs text-emerald-600/80">Sedang memuat dashboard...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-red-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-red-900">{error}</p>
            <p className="text-xs text-red-600/80">Mohon periksa kembali kredensial Anda</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Email Pengguna</label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-300" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="contoh@email.com"
              className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-6 focus:ring-emerald-500/10 bg-slate-50 focus:bg-white transition-all duration-300 font-medium text-slate-800 placeholder-slate-400 group-hover:border-emerald-300/50"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center ml-1">
            <label className="text-xs font-black text-slate-700 uppercase tracking-widest">Password</label>
            <Link
              to="/forgot"
              className="text-xs text-emerald-600 font-bold hover:text-emerald-700 transition-colors hover:underline underline-offset-2"
            >
              Lupa Password?
            </Link>
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-300" />
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="••••••••"
              className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-6 focus:ring-emerald-500/10 bg-slate-50 focus:bg-white transition-all duration-300 font-medium text-slate-800 placeholder-slate-400 group-hover:border-emerald-300/50"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors duration-300"
            >
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-600 text-white font-black text-lg shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-4"
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-lg font-black">Memproses...</span>
            </>
          ) : (
            <>
              <span className="text-lg font-black">Masuk ke Dashboard</span>
              <CreditCard className="w-6 h-6" />
            </>
          )}
        </button>
      </form>

      <div className="flex items-center gap-6 my-9">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Atau Lanjutkan</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      <button
        type="button"
        onClick={() => { set("email", "admin@petcare.com"); set("password", "adminpass123"); }}
        className="w-full py-4 rounded-2xl bg-white border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 text-sm text-emerald-700 font-bold transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-4 group"
      >
        <span className="text-lg group-hover:scale-110 transition-transform duration-300">💳</span>
        <span className="text-base">Gunakan Akun Demo Admin</span>
      </button>

      <div className="mt-8 pt-8 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-500 font-medium">
          Belum punya akun?{" "}
          <Link to="/register" className="text-emerald-600 font-black hover:text-emerald-700 transition-colors hover:underline underline-offset-4">
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}