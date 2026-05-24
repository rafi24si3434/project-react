import { useState } from "react";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";

export default function UserForm() {
  const [form, setForm] = useState({
    nama: "",
    email: "",
    umur: "",
    pekerjaan: "",
    status: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const validate = () => {
    let err = {};

    if (!form.nama) err.nama = "Nama wajib diisi";
    else if (!isNaN(form.nama)) err.nama = "Tidak boleh angka";
    else if (form.nama.length < 3) err.nama = "Minimal 3 karakter";

    if (!form.email) err.email = "Email wajib";
    else if (!form.email.includes("@")) err.email = "Format salah";
    else if (form.email.length < 5) err.email = "Terlalu pendek";

    if (!form.umur) err.umur = "Umur wajib";
    else if (isNaN(form.umur)) err.umur = "Harus angka";
    else if (form.umur < 18) err.umur = "Minimal 18";

    if (!form.pekerjaan) err.pekerjaan = "Pilih pekerjaan";
    if (!form.status) err.status = "Pilih status";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      {/* TITLE */}
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
        Formulir Data Pengguna
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Nama Lengkap"
          type="text"
          value={form.nama}
          onChange={(e) => handleChange("nama", e.target.value)}
          error={errors.nama}
        />

        <InputField
          label="Alamat Email"
          type="text"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
        />

        <InputField
          label="Usia"
          type="text"
          value={form.umur}
          onChange={(e) => handleChange("umur", e.target.value)}
          error={errors.umur}
        />

        <SelectField
          label="Pekerjaan"
          value={form.pekerjaan}
          onChange={(e) => handleChange("pekerjaan", e.target.value)}
          options={["Programmer", "Designer", "Manager"]}
          error={errors.pekerjaan}
        />

        <SelectField
          label="Status Pernikahan"
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
          options={["Single", "Menikah"]}
          error={errors.status}
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full py-2.5 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-900 transition duration-200"
        >
          Simpan Data
        </button>
      </form>

      {/* HASIL */}
      {submitted && (
        <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-2">
            Data Berhasil Disimpan
          </h3>
          <p className="text-sm text-gray-600">Nama: {form.nama}</p>
          <p className="text-sm text-gray-600">Email: {form.email}</p>
          <p className="text-sm text-gray-600">Umur: {form.umur}</p>
          <p className="text-sm text-gray-600">Pekerjaan: {form.pekerjaan}</p>
          <p className="text-sm text-gray-600">Status: {form.status}</p>
        </div>
      )}
    </div>
  );
}
