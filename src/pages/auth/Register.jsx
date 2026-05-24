import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaUser, FaClinicMedical } from "react-icons/fa";

const roles = [
  { value: "dokter", label: "Dokter Hewan", emoji: "👩‍⚕️" },
  { value: "asisten", label: "Asisten Dokter", emoji: "🩺" },
  { value: "admin", label: "Admin Klinik", emoji: "💼" },
  { value: "kasir", label: "Kasir", emoji: "💳" },
];

export default function Register() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "", clinicName: "", role: "", email: "", password: "", confirm: "", agree: false,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

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

  return (
    <div>
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Buat Akun Baru ✨</h2>
        <p className="text-sm text-gray-400">Daftarkan klinik hewan Anda ke PetCare</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name + Clinic */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nama Lengkap</label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="dr. Sari Pratiwi"
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition placeholder-gray-300"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Nama Klinik</label>
            <div className="relative">
              <FaClinicMedical className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
              <input
                type="text"
                value={form.clinicName}
                onChange={(e) => set("clinicName", e.target.value)}
                placeholder="PetCare Pekanbaru"
                className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition placeholder-gray-300"
              />
            </div>
          </div>
        </div>

        {/* Role picker */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Jabatan / Peran</label>
          <div className="grid grid-cols-4 gap-2">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => set("role", r.value)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border-2 text-xs font-medium transition ${
                  form.role === r.value
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                }`}
              >
                <span className="text-lg">{r.emoji}</span>
                <span className="leading-tight text-center text-[10px]">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="dokter@petcare.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition placeholder-gray-300"
            />
          </div>
        </div>

        {/* Password + Confirm */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Password</label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
              <input
                type={showPass ? "text" : "password"}
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition placeholder-gray-300"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition">
                {showPass ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Konfirmasi</label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-9 pr-9 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition placeholder-gray-300 ${
                  form.confirm && form.confirm !== form.password
                    ? "border-red-300 focus:ring-red-200 bg-red-50"
                    : "border-gray-200 focus:ring-emerald-300 bg-white"
                }`}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition">
                {showConfirm ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
              </button>
            </div>
            {form.confirm && form.confirm !== form.password && (
              <p className="text-[10px] text-red-400 mt-1">Password tidak cocok</p>
            )}
          </div>
        </div>

        {/* Password strength */}
        {form.password && (
          <div>
            <div className="flex gap-1 mb-1">
              {[1,2,3,4].map((i) => (
                <div key={i} className={`flex-1 h-1 rounded-full transition ${
                  form.password.length >= i * 3
                    ? i <= 1 ? "bg-red-400" : i <= 2 ? "bg-amber-400" : i <= 3 ? "bg-emerald-300" : "bg-emerald-500"
                    : "bg-gray-100"
                }`} />
              ))}
            </div>
            <p className="text-[10px] text-gray-400">
              {form.password.length < 4 ? "Terlalu lemah" : form.password.length < 7 ? "Cukup" : form.password.length < 10 ? "Kuat" : "Sangat kuat ✓"}
            </p>
          </div>
        )}

        {/* Agree */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="agree"
            checked={form.agree}
            onChange={(e) => set("agree", e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded accent-emerald-500 flex-shrink-0"
          />
          <label htmlFor="agree" className="text-xs text-gray-400 leading-relaxed">
            Saya menyetujui{" "}
            <span className="text-emerald-500 font-medium cursor-pointer hover:underline">Syarat & Ketentuan</span>{" "}
            dan{" "}
            <span className="text-emerald-500 font-medium cursor-pointer hover:underline">Kebijakan Privasi</span>{" "}
            PetCare
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-semibold text-sm shadow-md shadow-emerald-200 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              Mendaftarkan...
            </>
          ) : "Buat Akun Sekarang 🐾"}
        </button>

      </form>

      <p className="text-center text-xs text-gray-400 mt-5">
        Sudah punya akun?{" "}
        <Link to="/login" className="text-emerald-500 font-semibold hover:text-emerald-600 transition">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}