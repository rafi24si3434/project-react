import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Tambahkan Link
import axios from "axios";
// Import semua ikon yang dibutuhkan
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; 

export default function Login() {
  const navigate = useNavigate();

  // Ubah dataForm menjadi form agar sesuai dengan JSX
  const [form, setForm] = useState({
    email: "emilys",
    password: "emilyspass",
  });

  const [showPass, setShowPass] = useState(false); // Tambahkan state showPass
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fungsi helper set untuk mempermudah update state (sesuai JSX Anda)
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://dummyjson.com/user/login",
        {
          username: form.email, // Ambil dari form.email
          password: form.password, // Ambil dari form.password
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");

    } catch (err) {
      setError(
        err.response?.data?.message || "Username atau password salah"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Selamat datang! 👋</h2>
        <p className="text-sm text-gray-400">Masuk ke panel admin PetCare Anda</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Email */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email / Username</label>
          <div className="relative">
            <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
            <input
              type="text" // DummyJSON API menggunakan text (username), bukan strict email format
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="dokter@petcare.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition placeholder-gray-300"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-xs font-semibold text-gray-600">Password</label>
            <Link to="/forgot" className="text-xs text-emerald-500 hover:text-emerald-600 font-medium transition">
              Lupa password?
            </Link>
          </div>
          <div className="relative">
            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition placeholder-gray-300"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
            >
              {showPass ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="remember" className="w-4 h-4 rounded accent-emerald-500" />
          <label htmlFor="remember" className="text-xs text-gray-500">Ingat saya selama 30 hari</label>
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
              Masuk...
            </>
          ) : "Masuk ke Dashboard"}
        </button>

      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-300">atau</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Demo login */}
      <button
        onClick={() => { set("email","emilys"); set("password","emilyspass"); }}
        className="w-full py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm text-gray-600 font-medium transition flex items-center justify-center gap-2"
      >
        <span>🐾</span> Gunakan Akun Demo
      </button>

      {/* Register link */}
      <p className="text-center text-xs text-gray-400 mt-6">
        Belum punya akun?{" "}
        <Link to="/register" className="text-emerald-500 font-semibold hover:text-emerald-600 transition">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}