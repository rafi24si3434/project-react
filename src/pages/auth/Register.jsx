import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaUser, FaClinicMedical, FaUserPlus } from "react-icons/fa";

const roles = [
  { value: "dokter", label: "Dokter Hewan", emoji: "🩺", desc: "Praktisi utama" },
  { value: "asisten", label: "Asisten", emoji: "💊", desc: "Tim pendukung" },
  { value: "admin", label: "Admin Klinik", emoji: "💼", desc: "Manajemen" },
  { value: "kasir", label: "Kasir", emoji: "💳", desc: "Pembayaran" },
];

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusField, setFocusField] = useState("");
  const [form, setForm] = useState({
    name: "", clinicName: "", role: "", email: "", password: "", confirm: "", agree: false,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const passwordStrength = () => {
    const l = form.password.length;
    if (l === 0) return { level: 0, label: "", color: "" };
    if (l < 4) return { level: 1, label: "Lemah", color: "bg-red-400" };
    if (l < 7) return { level: 2, label: "Cukup", color: "bg-amber-400" };
    if (l < 10) return { level: 3, label: "Kuat", color: "bg-emerald-400" };
    return { level: 4, label: "Sangat Kuat", color: "bg-emerald-500" };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.role) {
      setError("Semua field wajib diisi.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Password dan konfirmasi tidak cocok.");
      return;
    }
    if (!form.agree) {
      setError("Anda harus menyetujui syarat & ketentuan.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    navigate("/login");
  };

  const InputField = ({ icon: Icon, label, field, type = "text", placeholder, half = false, children }) => (
    <div className={half ? "" : ""}>
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
          onChange={(e) => set(field, e.target.value)}
          onFocus={() => setFocusField(field)}
          onBlur={() => setFocusField("")}
          placeholder={placeholder}
          className="w-full pl-13 pr-4 py-3 bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
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
        <p className="text-sm text-gray-500 mt-1.5 font-medium">Daftarkan klinik hewan Anda ke PetCare</p>
      </div>

      {error && (
        <div className="mb-5 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 text-red-600 text-sm px-5 py-3 rounded-2xl font-semibold flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0 text-xs">⚠️</div>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name + Clinic */}
        <div className="grid grid-cols-2 gap-3">
          <InputField icon={FaUser} label="Nama Lengkap" field="name" placeholder="Dr. Sari" />
          <InputField icon={FaClinicMedical} label="Nama Klinik" field="clinicName" placeholder="PetCare Jkt" />
        </div>

        {/* Role picker */}
        <div>
          <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2.5 block">Jabatan / Peran</label>
          <div className="grid grid-cols-4 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => set("role", r.value)}
                className={`relative flex flex-col items-center gap-1 py-3 rounded-2xl border-2 transition-all duration-300 ${
                  form.role === r.value
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100 scale-[1.02]"
                    : "border-gray-100 bg-white text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span className="text-xl">{r.emoji}</span>
                <span className="text-[10px] font-bold leading-tight text-center">{r.label}</span>
                {form.role === r.value && (
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 14 10">
                      <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Email */}
        <InputField icon={FaEnvelope} label="Email" field="email" type="email" placeholder="dokter@petcare.com" />

        {/* Password + Confirm */}
        <div className="grid grid-cols-2 gap-3">
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
                onChange={(e) => set("password", e.target.value)}
                onFocus={() => setFocusField("password")}
                onBlur={() => setFocusField("")}
                placeholder="••••••••"
                className="w-full pr-9 py-3 bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
                style={{ paddingLeft: "3rem" }}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 text-gray-400 hover:text-emerald-500 transition-colors">
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
                onChange={(e) => set("confirm", e.target.value)}
                onFocus={() => setFocusField("confirm")}
                onBlur={() => setFocusField("")}
                placeholder="••••••••"
                className="w-full pr-9 py-3 bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
                style={{ paddingLeft: "3rem" }}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 text-gray-400 hover:text-emerald-500 transition-colors">
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
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-500 to-teal-500 hover:from-emerald-600 hover:via-emerald-600 hover:to-teal-600 active:scale-[0.98] text-white font-bold text-[15px] shadow-[0_10px_30px_-8px_rgba(16,185,129,0.5)] hover:shadow-[0_14px_35px_-8px_rgba(16,185,129,0.6)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-1"
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