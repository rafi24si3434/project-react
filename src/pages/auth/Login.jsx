import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPaw } from "react-icons/fa";

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
  const [focusField, setFocusField] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email dan Password wajib diisi");
      return;
    }

    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Welcome Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-[1.2rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/25">
          <FaPaw className="text-white text-2xl" />
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8 text-center">
        <h2 className="text-[1.7rem] font-extrabold text-gray-900 tracking-tight leading-tight">
          Selamat Datang
        </h2>
        <p className="text-gray-500 text-sm mt-2 font-medium">
          Masuk ke platform CRM PetCare Anda
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 text-red-650 text-sm px-5 py-3.5 rounded-2xl font-semibold flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
            <span className="text-sm">⚠️</span>
          </div>
          <span className="text-left">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        {/* Username/Email */}
        <div>
          <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2.5 block">
            Email Pengguna
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
              required
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              onFocus={() => setFocusField("email")}
              onBlur={() => setFocusField("")}
              placeholder="contoh@email.com"
              className="w-full pl-14 pr-4 py-3.5 bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">Password</label>
            <Link
              to="/forgot"
              className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold transition-colors"
            >
              Lupa Password?
            </Link>
          </div>
          <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
            focusField === "password"
              ? "border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
              : "border-gray-100 hover:border-gray-200"
          }`}>
            <div className={`absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center transition-colors duration-300 ${
              focusField === "password" ? "bg-emerald-50 text-emerald-500" : "bg-gray-50 text-gray-400"
            }`}>
              <FaLock className="text-sm" />
            </div>
            <input
              type={showPass ? "text" : "password"}
              required
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              onFocus={() => setFocusField("password")}
              onBlur={() => setFocusField("")}
              placeholder="••••••••"
              className="w-full pl-14 pr-12 py-3.5 bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 text-gray-400 hover:text-emerald-500 transition-colors cursor-pointer"
            >
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <div className="relative">
              <input type="checkbox" id="remember" className="peer sr-only" />
              <div className="w-5 h-5 rounded-md border-2 border-gray-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 transition-all group-hover:border-gray-300"></div>
              <svg className="absolute w-3 h-3 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 14 10">
                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-600">Ingat saya</span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-500 to-teal-500 hover:from-emerald-600 hover:via-emerald-600 hover:to-teal-600 active:scale-[0.98] text-white font-bold text-[15px] shadow-[0_10px_30px_-8px_rgba(16,185,129,0.5)] hover:shadow-[0_14px_35px_-8px_rgba(16,185,129,0.6)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 mt-2 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Memproses...</span>
            </>
          ) : (
            <>
              Masuk ke Dashboard
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-7">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Atau</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Demo login */}
      <button
        type="button"
        onClick={() => { set("email", "admin@petcare.com"); set("password", "adminpass123"); }}
        className="w-full py-3.5 rounded-2xl border-2 border-dashed border-emerald-250 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-350 text-sm text-emerald-700 font-bold transition-all flex items-center justify-center gap-3 group cursor-pointer"
      >
        <span className="text-lg group-hover:animate-bounce">🐾</span> Gunakan Akun Demo Admin
      </button>

      {/* Register link */}
      <p className="text-center text-sm font-medium text-gray-500 mt-8">
        Belum punya akun?{" "}
        <Link to="/register" className="text-emerald-600 font-extrabold hover:text-emerald-700 transition-colors underline underline-offset-2 decoration-emerald-300 hover:decoration-emerald-500">
          Daftar Sekarang
        </Link>
      </p>
    </div>
  );
}