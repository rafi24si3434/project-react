import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaUser, FaPhone, FaUserPlus } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [focusField, setFocusField] = useState("");
  
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

    // 1. Validasi
    if (!form.fullName || !form.email || !form.phoneNumber || !form.password || !form.confirm) {
      setError("Semua field wajib diisi.");
      return;
    }
    
    // Email regex validation
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
      // 2. Buat akun pada Supabase Authentication
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;

      const authUser = authData?.user;
      if (!authUser) {
        throw new Error("Pendaftaran gagal. Silakan coba lagi.");
      }

      // 3. Simpan data profil ke tabel users
      const { error: profileError } = await supabase.from("users").insert({
        auth_user_id: authUser.id,
        full_name: form.fullName,
        email: form.email,
        phone_number: form.phoneNumber,
        role: form.role
      });

      if (profileError) {
        throw profileError;
      }

      setSuccess("Akun berhasil dibuat. Silakan login menggunakan akun Anda.");
      
      // Reset form
      setForm({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirm: "",
        role: "customer",
        agree: false,
      });

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      setError(err.message || "Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, label, field, type = "text", placeholder, children }) => (
    <div>
      <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2 block">{label}</label>
      <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        focusField === field
          ? "border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
          : "border-gray-100 hover:border-gray-200"
      }`}>
        <div className={`absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center transition-colors duration-300 ${
          focusField === field ? "bg-emerald-50 text-emerald-500" : "bg-gray-50 text-gray-400"
        }`}>
          <Icon className="text-xs" />
        </div>
        <input
          type={type}
          value={form[field]}
          required
          onChange={(e) => set(field, e.target.value)}
          onFocus={() => setFocusField(field)}
          onBlur={() => setFocusField("")}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
          style={{ paddingLeft: "3rem" }}
        />
        {children}
      </div>
    </div>
  );

  return (
    <div>
      {/* Heading */}
      <div className="flex justify-center mb-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/25">
          <FaUserPlus className="text-white text-xl" />
        </div>
      </div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Buat Akun Baru</h2>
        <p className="text-sm text-gray-500 mt-1.5 font-medium">Daftar sebagai customer di PetCare CRM</p>
      </div>

      {success && (
        <div className="mb-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-250 text-emerald-600 text-sm px-5 py-3 rounded-2xl font-semibold flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 text-xs">✅</div>
          <span className="text-left">{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 text-red-650 text-sm px-5 py-3 rounded-2xl font-semibold flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 text-xs">⚠️</div>
          <span className="text-left">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Name */}
        <InputField icon={FaUser} label="Nama Lengkap" field="fullName" placeholder="Dr. Sari Putri" />

        {/* Email */}
        <InputField icon={FaEnvelope} label="Email" field="email" type="email" placeholder="dokter@petcare.com" />

        {/* Phone Number */}
        <InputField icon={FaPhone} label="Nomor Telepon" field="phoneNumber" type="tel" placeholder="0812-xxxx-xxxx" />

        {/* Role Selection */}
        <div>
          <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2 block">Hak Akses / Role</label>
          <div className="relative flex items-center rounded-2xl border-2 border-gray-100 focus-within:border-emerald-500 transition-all duration-300 overflow-hidden bg-white">
            <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center bg-gray-50 text-gray-400">
              <span className="text-xs">🔑</span>
            </div>
            <select
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-semibold cursor-pointer"
              style={{ paddingLeft: "3rem" }}
            >
              <option value="customer">Customer</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Password + Confirm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2 block">Password</label>
            <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
              focusField === "password"
                ? "border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
                : "border-gray-100 hover:border-gray-200"
            }`}>
              <div className={`absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center transition-colors duration-300 ${
                focusField === "password" ? "bg-emerald-50 text-emerald-500" : "bg-gray-50 text-gray-400"
              }`}>
                <FaLock className="text-xs" />
              </div>
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                required
                onChange={(e) => set("password", e.target.value)}
                onFocus={() => setFocusField("password")}
                onBlur={() => setFocusField("")}
                placeholder="••••••••"
                className="w-full pr-9 py-3 bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
                style={{ paddingLeft: "3rem" }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 text-gray-400 hover:text-emerald-500 transition-colors cursor-pointer">
                {showPass ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2 block">Konfirmasi</label>
            <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
              form.confirm && form.confirm !== form.password
                ? "border-red-400 shadow-[0_0_0_4px_rgba(239,68,68,0.06)]"
                : focusField === "confirm"
                  ? "border-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]"
                  : "border-gray-100 hover:border-gray-200"
            }`}>
              <div className={`absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center transition-colors duration-300 ${
                form.confirm && form.confirm !== form.password ? "bg-red-50 text-red-400" :
                focusField === "confirm" ? "bg-emerald-50 text-emerald-500" : "bg-gray-50 text-gray-400"
              }`}>
                <FaLock className="text-xs" />
              </div>
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirm}
                required
                onChange={(e) => set("confirm", e.target.value)}
                onFocus={() => setFocusField("confirm")}
                onBlur={() => setFocusField("")}
                placeholder="••••••••"
                className="w-full pr-9 py-3 bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
                style={{ paddingLeft: "3rem" }}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 text-gray-400 hover:text-emerald-500 transition-colors cursor-pointer">
                {showConfirm ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
              </button>
            </div>
            {form.confirm && form.confirm !== form.password && (
              <p className="text-[10px] text-red-500 font-semibold mt-1.5 ml-1">Password tidak cocok</p>
            )}
          </div>
        </div>

        {/* Password strength */}
        {form.password && (
          <div>
            <div className="flex gap-1.5 mb-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  strength.level >= i ? strength.color : "bg-gray-100"
                }`} />
              ))}
            </div>
            <p className="text-[10px] font-bold text-gray-500 tracking-wide">
              Kekuatan: <span className={`${strength.level >= 3 ? "text-emerald-600" : strength.level >= 2 ? "text-amber-600" : "text-red-500"}`}>{strength.label}</span>
            </p>
          </div>
        )}

        {/* Agree */}
        <div className="flex items-start gap-3 pt-1">
          <label className="flex items-start gap-3 cursor-pointer select-none group">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => set("agree", e.target.checked)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded-md border-2 border-gray-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-500 transition-all group-hover:border-gray-300"></div>
              <svg className="absolute w-3 h-3 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 14 10">
                <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-xs font-medium text-gray-500 leading-relaxed">
              Saya menyetujui{" "}
              <span className="text-emerald-600 font-bold hover:underline">Syarat & Ketentuan</span> dan{" "}
              <span className="text-emerald-600 font-bold hover:underline">Kebijakan Privasi</span> PetCare
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-500 to-teal-500 hover:from-emerald-600 hover:via-emerald-600 hover:to-teal-600 active:scale-[0.98] text-white font-bold text-[15px] shadow-[0_10px_30px_-8px_rgba(16,185,129,0.5)] hover:shadow-[0_14px_35px_-8px_rgba(16,185,129,0.6)] transition-all duration-300 disabled:opacity-60 cursor-pointer flex items-center justify-center gap-3 mt-1"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Mendaftarkan...</span>
            </>
          ) : (
            <>
              Buat Akun Sekarang
              <span className="text-lg">🐾</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm font-medium text-gray-500 mt-6">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-emerald-600 font-extrabold hover:text-emerald-700 transition-colors underline underline-offset-2 decoration-emerald-300 hover:decoration-emerald-500">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}