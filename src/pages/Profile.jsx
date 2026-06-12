import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { FaUser, FaEnvelope, FaPhone, FaUserShield, FaSave, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function Profile() {
  const { profile, refreshProfile } = useAuth();
  
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhoneNumber(profile.phone_number || "");
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: fullName,
          phone_number: phoneNumber,
          updated_at: new Date().toISOString()
        })
        .eq("auth_user_id", profile.auth_user_id);

      if (updateError) throw updateError;

      await refreshProfile();
      setSuccess("Profil Anda berhasil diperbarui!");
      
      // Auto clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return (
      <div className="p-6 text-center text-gray-500 font-semibold">
        Memuat profil pengguna...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-3xl border border-gray-150 shadow-sm text-left">
      <div className="flex items-center gap-3 pb-6 border-b border-gray-100 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xl shadow-md shadow-emerald-500/20">
          👤
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Profil Saya</h2>
          <p className="text-xs text-gray-400 font-medium">Kelola informasi pribadi dan pengaturan akun Supabase Anda</p>
        </div>
      </div>

      {success && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-600 text-sm px-5 py-3.5 rounded-2xl font-semibold flex items-center gap-3">
          <FaCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-600 text-sm px-5 py-3.5 rounded-2xl font-semibold flex items-center gap-3">
          <FaExclamationCircle className="text-red-500 text-lg flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2 block">Nama Lengkap</label>
            <div className="relative flex items-center rounded-2xl border-2 border-gray-100 focus-within:border-emerald-500 transition-all duration-300 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center bg-gray-50 text-gray-400">
                <FaUser className="text-xs" />
              </div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Sari Putri"
                required
                className="w-full pl-14 pr-4 py-3 bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Email (Read only) */}
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email (Hanya Baca)</label>
            <div className="relative flex items-center rounded-2xl border-2 border-gray-100 bg-gray-50/50 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center bg-gray-50 text-gray-400">
                <FaEnvelope className="text-xs" />
              </div>
              <input
                type="email"
                value={profile.email}
                readOnly
                className="w-full pl-14 pr-4 py-3 bg-transparent text-sm text-gray-400 focus:outline-none font-medium cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="text-[11px] font-bold text-gray-600 uppercase tracking-widest mb-2 block">Nomor Telepon</label>
            <div className="relative flex items-center rounded-2xl border-2 border-gray-100 focus-within:border-emerald-500 transition-all duration-300 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center bg-gray-50 text-gray-400">
                <FaPhone className="text-xs" />
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                required
                className="w-full pl-14 pr-4 py-3 bg-transparent text-sm text-gray-800 focus:outline-none placeholder-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Role (Read only) */}
          <div>
            <label className="text-[11px] font-bold text-gray-450 uppercase tracking-widest mb-2 block">Hak Akses / Role</label>
            <div className="relative flex items-center rounded-2xl border-2 border-gray-100 bg-gray-50/50 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-11 flex items-center justify-center bg-gray-50 text-gray-400">
                <FaUserShield className="text-xs" />
              </div>
              <input
                type="text"
                value={profile.role.toUpperCase()}
                readOnly
                className="w-full pl-14 pr-4 py-3 bg-transparent text-sm text-gray-500 font-bold focus:outline-none cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-md shadow-emerald-500/20 transition-all duration-300 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <FaSave className="text-xs" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
