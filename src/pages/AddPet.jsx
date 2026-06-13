import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

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
  { value: "Male", emoji: "♂️ Jantan" },
  { value: "Female", emoji: "♀️ Betina" },
];

export default function AddPet() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    name: "", species: "", breed: "", gender: "",
    birthDate: "", weight: "", color: "", microchip: "",
    ownerName: "", ownerPhone: "", ownerEmail: "", ownerAddress: "",
    notes: "", allergies: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // Skip owner info step for customers
  const steps = profile?.role === "customer" 
    ? ["Info Pet", "Catatan Medis"] 
    : ["Info Pet", "Data Pemilik", "Catatan Medis"];

  const currentStepLabel = () => {
    if (profile?.role === "customer") {
      return step === 1 ? "Info Pet" : "Catatan Medis";
    }
    return step === 1 ? "Info Pet" : step === 2 ? "Data Pemilik" : "Catatan Medis";
  };

  const handleNext = () => {
    if (step === 1 && profile?.role === "customer") {
      setStep(3); // skip step 2
    } else if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step === 3 && profile?.role === "customer") {
      setStep(1); // skip step 2
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSavePet = async () => {
    if (!form.name || !form.species || !form.gender || !form.birthDate) {
      alert("Nama, jenis hewan, jenis kelamin, dan tanggal lahir wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      let ownerId = user?.id;

      // If admin/staff is adding, try to find the matching owner in public.users
      if (profile?.role !== "customer") {
        if (!form.ownerEmail) {
          alert("Email pemilik wajib diisi!");
          setSaving(false);
          return;
        }

        const { data: matchedOwner, error: matchError } = await supabase
          .from("users")
          .select("auth_user_id")
          .eq("email", form.ownerEmail)
          .maybeSingle();

        if (matchError) throw matchError;

        if (!matchedOwner) {
          alert(`Email pemilik "${form.ownerEmail}" tidak ditemukan di sistem! Silakan daftarkan pemilik tersebut terlebih dahulu di menu Customer CRM.`);
          setSaving(false);
          return;
        }

        ownerId = matchedOwner.auth_user_id;
      }

      const { error } = await supabase.from("pets").insert({
        owner_id: ownerId,
        name: form.name,
        type: form.species,
        breed: form.breed || null,
        gender: form.gender,
        birth_date: form.birthDate,
        weight: form.weight ? parseFloat(form.weight) : null,
        health_notes: `Alergi: ${form.allergies || "Tidak ada"}. Catatan: ${form.notes || "-"}`,
        photo_url: null
      });

      if (error) throw error;

      // Log activity
      try {
        await supabase.from("activity_logs").insert({
          user_id: user?.id,
          activity: "Customer Menambahkan Hewan",
          description: `Hewan peliharaan ${form.name} (${form.species}) berhasil didaftarkan.`
        });
      } catch (logErr) {
        console.error("Failed to log pet addition activity:", logErr);
      }

      navigate("/pets");
    } catch (err) {
      console.error("Error saving pet:", err);
      alert(err.message || "Gagal menyimpan data pet.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-left">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/pets")}
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition cursor-pointer"
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
        {steps.map((s, i) => {
          const isActive = currentStepLabel() === s;
          const isCompleted = steps.indexOf(currentStepLabel()) > i;
          
          return (
            <div key={s} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${isCompleted ? "bg-emerald-500 text-white" : isActive ? "bg-emerald-500 text-white ring-4 ring-emerald-100" : "bg-white border-2 border-gray-200 text-gray-400"}`}>
                  {isCompleted ? <FaCheck className="text-xs" /> : i + 1}
                </div>
                <p className={`text-[10px] mt-1 font-medium whitespace-nowrap ${isActive ? "text-emerald-600" : "text-gray-400"}`}>{s}</p>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mb-4 mx-2 transition ${isCompleted ? "bg-emerald-400" : "bg-gray-200"}`} />
              )}
            </div>
          );
        })}
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
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition cursor-pointer ${form.species === s.label ? "border-emerald-400 bg-emerald-50" : "border-gray-100 bg-gray-50 hover:border-gray-200"}`}
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
                  <input value={form.name} onChange={e => set("name", e.target.value)} type="text" placeholder="cth. Mochi" className="w-full px-3 py-2.5 rounded-xl border border-gray-250 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition bg-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">Ras / Breed</label>
                  <input value={form.breed} onChange={e => set("breed", e.target.value)} type="text" placeholder="cth. Persia" className="w-full px-3 py-2.5 rounded-xl border border-gray-255 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition bg-white" />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">Jenis Kelamin <span className="text-red-400">*</span></label>
                <div className="flex gap-3">
                  {genderOptions.map((g) => (
                    <button
                      key={g.value}
                      onClick={() => set("gender", g.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition cursor-pointer ${form.gender === g.value ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
                    >
                      {g.emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">Tanggal Lahir <span className="text-red-400">*</span></label>
                  <input value={form.birthDate} onChange={e => set("birthDate", e.target.value)} type="date" className="w-full px-3 py-2.5 rounded-xl border border-gray-250 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition bg-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">Berat (kg)</label>
                  <input value={form.weight} onChange={e => set("weight", e.target.value)} type="number" step="0.1" placeholder="cth. 4.2" className="w-full px-3 py-2.5 rounded-xl border border-gray-255 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition bg-white" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">Warna Bulu</label>
                  <input value={form.color} onChange={e => set("color", e.target.value)} type="text" placeholder="cth. Putih" className="w-full px-3 py-2.5 rounded-xl border border-gray-255 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition bg-white" />
                </div>
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
                <input value={form.ownerName} onChange={e => set("ownerName", e.target.value)} type="text" placeholder="cth. Budi Santoso" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition bg-white" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">No. Telepon <span className="text-red-400">*</span></label>
                <input value={form.ownerPhone} onChange={e => set("ownerPhone", e.target.value)} type="tel" placeholder="cth. 0812-3456-7890" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition bg-white" />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Email Owner</label>
              <input value={form.ownerEmail} onChange={e => set("ownerEmail", e.target.value)} type="email" placeholder="cth. budi@email.com" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition bg-white" />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-medium mb-1.5 block">Alamat</label>
              <textarea value={form.ownerAddress} onChange={e => set("ownerAddress", e.target.value)} rows={3} placeholder="cth. Jl. Sudirman No. 12" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition resize-none bg-white" />
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
                <input value={form.allergies} onChange={e => set("allergies", e.target.value)} type="text" placeholder="cth. Alergi antibiotik penisilin" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition bg-white" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">Catatan Tambahan</label>
                <textarea value={form.notes} onChange={e => set("notes", e.target.value)} rows={4} placeholder="Tuliskan riwayat atau kondisi khusus lainnya..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition resize-none bg-white" />
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
                  ["Tgl Lahir", form.birthDate || "-"],
                  ["Berat", form.weight ? `${form.weight} kg` : "-"],
                  ["Pemilik", profile?.role === "customer" ? profile?.full_name : (form.ownerName || "-")],
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
            onClick={handlePrev}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-600 hover:bg-gray-50 transition font-medium cursor-pointer"
          >
            {step === 1 ? "Batal" : "← Kembali"}
          </button>
          <button
            onClick={step === 3 ? handleSavePet : handleNext}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium shadow-md shadow-emerald-200 transition cursor-pointer"
          >
            {saving ? "Menyimpan..." : step === 3 ? "✓ Simpan Pet" : "Lanjut →"}
          </button>
        </div>
      </div>
    </div>
  );
}