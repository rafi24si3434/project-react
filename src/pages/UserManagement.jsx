import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaCheck, FaTimes, FaSpinner, FaUserShield, FaListUl, FaThLarge } from "react-icons/fa";
import Pagination from "../components/Pagination";

// Secondary client to prevent signing out the current admin session during sign up
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("viewMode_user_management") || "list");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  useEffect(() => {
    localStorage.setItem("viewMode_user_management", viewMode);
  }, [viewMode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create"); // "create" | "edit"
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "customer"
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err) {
      setError(err.message || "Gagal mengambil data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenCreateModal = () => {
    setForm({
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      role: "customer"
    });
    setModalType("create");
    setSelectedUser(null);
    setError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setForm({
      fullName: user.full_name,
      email: user.email,
      phoneNumber: user.phone_number || "",
      password: "", // password remains empty on edit unless creating new
      role: user.role
    });
    setModalType("edit");
    setSelectedUser(user);
    setError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setError("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      if (modalType === "create") {
        if (!form.password || form.password.length < 8) {
          throw new Error("Password wajib diisi dan minimal 8 karakter");
        }

        // 1. Create Supabase Auth user via temp client
        const { data: authData, error: authError } = await tempClient.auth.signUp({
          email: form.email,
          password: form.password
        });

        if (authError) throw authError;

        const authUser = authData?.user;
        if (!authUser) throw new Error("Gagal membuat user di Supabase Auth");

        // 2. Insert user profile into public.users table using main client (use upsert to link pre-existing profiles)
        const { error: profileError } = await supabase.from("users").upsert({
          auth_user_id: authUser.id,
          full_name: form.fullName,
          email: form.email,
          phone_number: form.phoneNumber,
          role: form.role
        }, { onConflict: "email" });

        if (profileError) {
          // Cleanup auth user? Supabase auth doesn't easily allow rollback on client, 
          // but our profile insertion should succeed if RLS allow insert.
          throw profileError;
        }

        setSuccess("User baru berhasil ditambahkan!");
      } else {
        // Edit mode
        const { error: updateError } = await supabase
          .from("users")
          .update({
            full_name: form.fullName,
            phone_number: form.phoneNumber,
            role: form.role,
            updated_at: new Date().toISOString()
          })
          .eq("id", selectedUser.id);

        if (updateError) throw updateError;
        setSuccess("Informasi user berhasil diperbarui!");
      }

      handleCloseModal();
      fetchUsers();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memproses data");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus user "${user.full_name}"?`);
    if (!confirmDelete) return;

    setActionLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", user.id);

      if (deleteError) throw deleteError;

      setSuccess(`User "${user.full_name}" berhasil dihapus.`);
      fetchUsers();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Gagal menghapus user");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.full_name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone_number && u.phone_number.includes(q)) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">👥</span>
            <h1 className="text-xl font-bold text-gray-800">Manajemen User</h1>
          </div>
          <p className="text-sm text-gray-400 pl-8">
            Kelola hak akses pengguna, tambah, edit, dan hapus user terdaftar Supabase
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          {/* View Toggle */}
          <div className="bg-white border border-gray-150 p-1 rounded-2xl flex items-center shadow-sm">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/10"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <FaListUl className="text-xs" />
              List
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "card"
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/10"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <FaThLarge className="text-xs" />
              Card
            </button>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-md shadow-emerald-500/20 transition-all duration-300 cursor-pointer"
          >
            <FaUserPlus className="text-xs" />
            Tambah User Baru
          </button>
        </div>
      </div>

      {success && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-250 text-emerald-700 text-sm px-5 py-3.5 rounded-2xl font-semibold flex items-center gap-3">
          <span className="text-lg">✅</span>
          {success}
        </div>
      )}

      {error && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-650 text-sm px-5 py-3.5 rounded-2xl font-semibold flex items-center gap-3">
          <span className="text-lg">⚠️</span>
          {error}
        </div>
      )}

      {/* Toolbar */}
      <div className="bg-white border border-gray-150 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari user berdasarkan nama, email, telepon..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
          />
        </div>
        <div className="text-xs text-gray-400 font-bold uppercase tracking-wider">
          Menampilkan {filteredUsers.length} dari {users.length} User
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-150 rounded-3xl">
          <FaSpinner className="text-3xl text-emerald-500 animate-spin mb-3" />
          <p className="text-sm text-gray-400 font-semibold">Memuat daftar user dari Supabase...</p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <>
          {viewMode === "list" ? (
          <div className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-sm animate-in fade-in duration-200">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Nama Lengkap</th>
                  <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Email</th>
                  <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Nomor Telepon</th>
                  <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Role</th>
                  <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4">Dibuat Pada</th>
                  <th className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((u) => (
                  <tr key={u.id} className="border-b border-gray-100 last:border-none hover:bg-gray-50/30 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{u.full_name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{u.email}</td>
                    <td className="px-6 py-4 text-gray-500 font-semibold">{u.phone_number || "-"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                        u.role === "admin" 
                          ? "bg-red-50 text-red-600 border border-red-100" 
                          : u.role === "staff"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        <FaUserShield className="text-[9px]" />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 font-semibold">
                      {new Date(u.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition cursor-pointer"
                          title="Edit User"
                        >
                          <FaEdit className="text-xs" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-550 flex items-center justify-center transition cursor-pointer"
                          title="Hapus User"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-205">
            {paginatedUsers.map((u) => (
              <div key={u.id} className="bg-white rounded-3xl border border-gray-150 p-6 shadow-sm hover:shadow-md transition-all duration-300 relative group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-extrabold text-emerald-600 text-base shadow-sm">
                        {u.full_name ? u.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-800 text-sm leading-snug">{u.full_name}</h4>
                        <span className={`inline-flex items-center gap-1 mt-1.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          u.role === "admin" 
                            ? "bg-red-50 text-red-600 border border-red-100" 
                            : u.role === "staff"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}>
                          <FaUserShield className="text-[8px]" />
                          {u.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 my-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2.5 text-xs text-gray-500">
                      <span className="text-gray-400">📧</span>
                      <span className="font-medium truncate" title={u.email}>{u.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-500">
                      <span className="text-gray-400">📞</span>
                      <span className="font-semibold">{u.phone_number || "-"}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-400">
                      <span className="text-gray-400">📅</span>
                      <span>Terdaftar: {new Date(u.created_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                      })}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2.5 mt-4 pt-3 border-t border-gray-100 justify-end">
                  <button
                    onClick={() => handleOpenEditModal(u)}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold transition cursor-pointer"
                  >
                    <FaEdit className="text-[10px]" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u)}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-550 text-xs font-bold transition cursor-pointer"
                  >
                    <FaTrash className="text-[10px]" />
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
          )}
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalEntries={filteredUsers.length}
            entriesPerPage={ITEMS_PER_PAGE}
            label="user"
          />
        </>
      ) : (
        <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center text-gray-400 font-semibold">
          User tidak ditemukan.
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
                <span>{modalType === "create" ? "Tambah User Baru" : "Edit Informasi User"}</span>
              </h3>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-lg hover:bg-gray-150 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Dr. Sari Putri"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Email</label>
                <input
                  type="email"
                  required
                  disabled={modalType === "edit"}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="dokter@petcare.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium ${
                    modalType === "edit" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Nomor Telepon</label>
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
                />
              </div>

              {/* Password (only on Create) */}
              {modalType === "create" && (
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Password</label>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Minimal 8 karakter"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
                  />
                </div>
              )}

              {/* Role */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Hak Akses / Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-semibold cursor-pointer"
                >
                  <option value="customer">Customer</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-150 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-emerald-500/20 transition cursor-pointer"
                >
                  {actionLoading ? (
                    <>
                      <FaSpinner className="animate-spin text-xs" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    <>
                      <FaCheck className="text-xs" />
                      <span>{modalType === "create" ? "Simpan User" : "Perbarui Info"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
