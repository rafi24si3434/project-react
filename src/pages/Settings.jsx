import React from "react";
import PageHeader from "../components/PageHeader";

export default function Settings() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Pengaturan" 
        subtitle="Kelola preferensi dan pengaturan akun Anda."
      />
      
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Profil Pengguna</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" defaultValue="dr. Sari Pratiwi, drh." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500" defaultValue="sari.pratiwi@petcare.com" />
          </div>
          <button className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition">
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}
