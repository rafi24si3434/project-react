import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheck } from "react-icons/fa";

const speciesOptions = [
  { emoji: "🐱", label: "Kucing" },
  { emoji: "🐶", label: "Anjing" },
  { emoji: "🐰", label: "Kelinci" },
  { emoji: "🦜", label: "Burung" },
  { emoji: "🐹", label: "Hamster" },
  { emoji: "🐢", label: "Reptil" },
  { emoji: "🐟", label: "Ikan" },
  { emoji: "🐾", label: "Lainnya" },
];

const genderOptions = [
  { value: "Jantan", emoji: "♂️" },
  { value: "Betina", emoji: "♀️" },
];

export default function AddPet() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", species: "", breed: "", gender: "",
    age: "", weight: "", color: "", microchip: "",
    ownerName: "", ownerPhone: "", ownerEmail: "", ownerAddress: "",
    notes: "", allergies: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const steps = ["Info Pet", "Data Pemilik", "Catatan Medis"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/pets")}
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition"
        >
          <FaArrowLeft className="text-xs" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Tambah Pet Baru</h1>
          <p className="text-xs text-gray-400">Lengkapi data hewan peliharaan</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 mb-8 max-w-lg">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${step > i + 1 ? "bg-emerald-500 text-white" : step === i + 1 ? "bg-emerald-500 text-white ring-4 ring-emerald-100" : "bg-white border-2 border-gray-200 text-gray-400"}`}>
                {step > i + 1 ? <FaCheck className="text-xs" /> : i + 1}
              </div>
              <p className={`text-[10px] mt-1 font-medium whitespace-nowrap ${step === i + 1 ? "text-emerald-600" : "text-gray-400"}`}>{s}</p>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mb-4 mx-2 transition ${step > i + 1 ? "bg-emerald-400" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="max-w-2xl">

        {/* ── STEP 1: Info Pet ── */}
        {step === 1 && (
          <div className="space-y-5">
            {/* Species picker */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-sm font-semibold text-gray-700 mb-3">Pilih Jenis Hewan <span className="text-red-400">*</span></p>
              <div className="grid grid-cols-4 gap-2">
                {speciesOptions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => set("species", s.label)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition ${form.species === s.label ? "border-emerald-400 bg-emerald-50" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}
                  >
                    <span className="text-2xl">{s.emoji}</span>
                    <span className={`text-xs font-medium ${form.species === s.label ? "text-emerald-600" : "text-gray-500"}`}>{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Breed */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <p className="text-sm font-semibold text-gray-700">Detail Hewan</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">Nama Pet <span className="text-red-400">*</span></label>
                  <input value={form.name} onChange={e => set("name", e.target.value)} type="text" placeholder="cth. Mochi" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">Ras / Breed</label>
                  <input value={form.breed} onChange={e => set("breed", e.target.value)} type="text" placeholder="cth. Persia" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">Jenis Kelamin</label>
                <div className="flex gap-3">
                  {genderOptions.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => set("gender", g.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition ${form.gender === g.value ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                    >
                      {g.emoji} {g.value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">Umur</label>
                  <input value={form.age} onChange={e => set("age", e.target.value)} type="text" placeholder="cth. 2 tahun" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">Berat (kg)</label>
                  <input value={form.weight} onChange={e => set("weight", e.target.value)} type="number" placeholder="cth. 4.2" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">Warna Bulu</label>
                  <input value={form.color} onChange={e => set("color", e.target.value)} type="text" placeholder="cth. Putih" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">Nomor Microchip (opsional)</label>
                <input value={form.microchip} onChange={e => set("microchip", e.target.value)} type="text" placeholder="cth. 900182000012345" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Data Pemilik ── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-700">Data Pemilik Hewan</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">Nama Lengkap <span className="text-red-400">*</span></label>
                <input value={form.ownerName} onChange={e => set("ownerName", e.target.value)} type="text" placeholder="cth. Budi Santoso" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">No. Telepon <span className="text-red-400">*</span></label>
                <input value={form.ownerPhone} onChange={e => set("ownerPhone", e.target.value)} type="tel" placeholder="cth. 0812-3456-7890" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Email</label>
              <input value={form.ownerEmail} onChange={e => set("ownerEmail", e.target.value)} type="email" placeholder="cth. budi@email.com" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Alamat</label>
              <textarea value={form.ownerAddress} onChange={e => set("ownerAddress", e.target.value)} rows={3} placeholder="cth. Jl. Sudirman No. 12, Pekanbaru" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition resize-none" />
            </div>
          </div>
        )}

        {/* ── STEP 3: Catatan Medis ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <p className="text-sm font-semibold text-gray-700">Catatan Medis Awal</p>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">Alergi / Kondisi Khusus</label>
                <input value={form.allergies} onChange={e => set("allergies", e.target.value)} type="text" placeholder="cth. Alergi antibiotik penisilin" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">Catatan Tambahan</label>
                <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={4} placeholder="Tuliskan riwayat atau kondisi khusus lainnya..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition resize-none" />
              </div>
            </div>

            {/* Summary preview */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <p className="text-sm font-semibold text-emerald-700 mb-3">Ringkasan Data</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                {[
                  ["Nama Pet", form.name || "-"],
                  ["Jenis", form.species || "-"],
                  ["Ras", form.breed || "-"],
                  ["Umur", form.age || "-"],
                  ["Berat", form.weight ? `${form.weight} kg` : "-"],
                  ["Pemilik", form.ownerName || "-"],
                  ["Telepon", form.ownerPhone || "-"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-emerald-500">{k}</span>
                    <span className="font-semibold text-emerald-800">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate("/pets")}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition font-medium"
          >
            {step === 1 ? "Batal" : "← Kembali"}
          </button>
          <button
            onClick={() => step < 3 ? setStep(step + 1) : navigate("/pets")}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium shadow-md shadow-emerald-200 transition"
          >
            {step === 3 ? "✓ Simpan Pet" : "Lanjut →"}
          </button>
        </div>
      </div>
    </div>
  );
}