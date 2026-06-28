import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirm: "",
    role: "customer",
    agree: false,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const passwordStrength = () => {
    const l = form.password.length;
    if (l === 0) return { level: 0, label: "", color: "" };
    if (l < 4) return { level: 1, label: "Lemah", color: "bg-red-400" };
    if (l < 8) return { level: 2, label: "Cukup", color: "bg-amber-400" };
    if (l < 10) return { level: 3, label: "Kuat", color: "bg-emerald-400" };
    return { level: 4, label: "Sangat Kuat", color: "bg-emerald-500" };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.fullName || !form.email || !form.phoneNumber || !form.password || !form.confirm) {
      setError("Semua field wajib diisi.");
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Format email tidak valid.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Password dan konfirmasi password harus sama.");
      return;
    }

    if (!form.agree) {
      setError("Anda harus menyetujui syarat & ketentuan.");
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;

      const authUser = authData?.user;
      if (!authUser) {
        throw new Error("Pendaftaran gagal. Silakan coba lagi.");
      }

      const { error: profileError } = await supabase.from("users").upsert({
        auth_user_id: authUser.id,
        full_name: form.fullName,
        email: form.email,
        phone_number: form.phoneNumber,
        role: form.role
      }, { onConflict: "email" });

      if (profileError) {
        throw profileError;
      }

      try {
        await supabase.from("activity_logs").insert({
          user_id: authUser.id,
          activity: "Customer Baru Terdaftar",
          description: `Customer baru dengan nama ${form.fullName} (${form.email}) telah terdaftar.`
        });
      } catch (logErr) {
        console.error("Failed to log activity:", logErr);
      }

      setSuccess("Akun berhasil dibuat. Redirect...");
      
      setForm({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirm: "",
        role: "customer",
        agree: false,
      });

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      setError(err.message || "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-500 text-white shadow-2xl shadow-emerald-500/30 mb-6 animate-pulse-slow">
          <UserPlus className="w-10 h-10" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Buat Akun Baru</h2>
        <p className="text-slate-500 font-medium text-lg">Daftar sebagai customer di PetCare CRM</p>
      </div>

      {success && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500/30 text-emerald-700 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-emerald-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-emerald-900">{success}</p>
            <p className="text-xs text-emerald-600/80">Sedang mengarahkan ke halaman login...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-red-500/10 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <p className="font-black text-red-900">{error}</p>
            <p className="text-xs text-red-600/80">Mohon periksa kembali data Anda</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Nama Lengkap</label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-300" />
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => set("fullName", e.target.value)}
              placeholder="Dr. Sari Putri"
              className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-6 focus:ring-emerald-500/10 bg-slate-50 focus:bg-white transition-all duration-300 font-medium text-slate-800 placeholder-slate-400 group-hover:border-emerald-300/50"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Email</label>
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
          <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Nomor Telepon</label>
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-300" />
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => set("phoneNumber", e.target.value)}
              placeholder="0812-xxxx-xxxx"
              className="w-full pl-12 pr-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-6 focus:ring-emerald-500/10 bg-slate-50 focus:bg-white transition-all duration-300 font-medium text-slate-800 placeholder-slate-400 group-hover:border-emerald-300/50"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Hak Akses / Role</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔑</div>
            <select
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="w-full pl-11 pr-5 py-4 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-6 focus:ring-emerald-500/10 bg-slate-50 focus:bg-white transition-all duration-300 font-medium text-slate-800 cursor-pointer group-hover:border-emerald-300/50"
            >
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Password</label>
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
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">Konfirmasi</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-red-500 transition-colors duration-300" />
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-4 rounded-2xl border-2 transition-all duration-300 font-medium text-slate-800 placeholder-slate-400 group-hover:border-red-300/50 ${
                  form.confirm && form.confirm !== form.password
                    ? "border-red-300 focus:border-red-500 focus:ring-6 focus:ring-red-500/10 bg-red-50/50"
                    : "border-slate-200 focus:border-emerald-500 focus:ring-6 focus:ring-emerald-500/10 bg-slate-50 focus:bg-white"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors duration-300"
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {form.confirm && form.confirm !== form.password && (
              <p className="text-[10px] text-red-500 font-bold ml-1">Password tidak cocok</p>
            )}
          </div>
        </div>

        {form.password && (
          <div>
            <div className="flex gap-2 mb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                  strength.level >= i ? strength.color : "bg-slate-100"
                }`} />
              ))}
            </div>
            <p className="text-[10px] font-bold text-slate-500 ml-1">
              Kekuatan: <span className={strength.level >= 3 ? "text-emerald-600" : strength.level >= 2 ? "text-amber-600" : "text-red-500"}>{strength.label}</span>
            </p>
          </div>
        )}

        <div className="flex items-start gap-4 group">
          <label className="flex items-start gap-4 cursor-pointer select-none mt-1">
            <div className="relative">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => set("agree", e.target.checked)}
                className="peer sr-only"
              />
              <div className={`w-6 h-6 rounded-md border-2 transition-all duration-300 ${
                form.agree
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-slate-200 group-hover:border-emerald-300"
              }`}>
                {form.agree && <svg className="w-3.5 h-3.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" fill="none" viewBox="0 0 14 10"><path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
            </div>
            <span className="text-sm text-slate-500 leading-relaxed">
              Saya menyetujui <span className="text-emerald-600 font-bold hover:underline underline-offset-2">Syarat & Ketentuan</span>
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-600 text-white font-black text-lg shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/40 hover:-translate-y-1 active:scale-[0.98] active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-4"
        >
          {loading ? (
            <>
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="text-lg font-black">Mendaftarkan...</span>
            </>
          ) : (
            <>
              <span className="text-lg font-black">Buat Akun Sekarang</span>
              <UserPlus className="w-6 h-6" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-slate-100 text-center">
        <p className="text-sm text-slate-500 font-medium">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-emerald-600 font-black hover:text-emerald-700 transition-colors hover:underline underline-offset-4">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}