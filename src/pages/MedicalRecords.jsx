import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import ToastNotification from "../components/ToastNotification";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { ClipboardList, Stethoscope, ShieldAlert } from "lucide-react";

export default function MedicalRecords() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  
  const [records, setRecords] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    petId: "",
    diagnosa: "",
    treatment: "",
    date: new Date().toISOString().slice(0, 10),
    vetName: ""
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const fetchRecords = async () => {
    setLoading(true);
    try {
      let { data, error } = await supabase
        .from("medical_records")
        .select(`
          *,
          pets (name),
          owner:users (full_name)
        `)
        .order("date", { ascending: false });

      // Fallback: If owner relation fails due to RLS/Foreign Key join mapping issues
      if (error && (error.message.includes("relationship") || error.message.includes("join") || error.message.includes("relation"))) {
        console.warn("[MedicalRecords] Join query failed, using separate-query fallback...");
        const { data: flatData, error: flatError } = await supabase
          .from("medical_records")
          .select(`
            *,
            pets (name)
          `)
          .order("date", { ascending: false });

        if (flatError) throw flatError;

        const { data: usersData } = await supabase
          .from("users")
          .select("auth_user_id, full_name");

        const userMap = {};
        if (usersData) {
          usersData.forEach(u => {
            userMap[u.auth_user_id] = u.full_name;
          });
        }

        data = (flatData || []).map(rec => ({
          ...rec,
          owner: { full_name: userMap[rec.owner_id] || "Tidak Diketahui" }
        }));
        error = null;
      }

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error("Error fetching medical records:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPets = async () => {
    try {
      let petsQuery = supabase.from("pets").select("id, name, owner_id");
      if (profile?.role === "customer") {
        petsQuery = petsQuery.eq("owner_id", user?.id);
      }
      
      const { data: flatData, error: flatError } = await petsQuery.order("name");
      if (flatError) throw flatError;

      const { data: usersData } = await supabase
        .from("users")
        .select("auth_user_id, full_name");

      const userMap = {};
      if (usersData) {
        usersData.forEach(u => {
          userMap[u.auth_user_id] = u.full_name;
        });
      }

      const mappedPets = (flatData || []).map(pet => ({
        id: pet.id,
        name: pet.name,
        owner_id: pet.owner_id,
        owner: { full_name: userMap[pet.owner_id] || "Tidak Diketahui" }
      }));

      setPets(mappedPets);
      if (mappedPets.length > 0) {
        setFormData((f) => ({ ...f, petId: mappedPets[0].id }));
      }
    } catch (err) {
      console.error("Error fetching pets for form:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecords();
      fetchPets();
    }
  }, [user, profile, refreshCounter]);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const keyword = searchQuery.toLowerCase();
      const petName = r.pets?.name || "Hewan";
      const diagnosis = r.diagnosa || "";
      const id = r.id?.slice(0, 8) || "";
      return petName.toLowerCase().includes(keyword) ||
             id.toLowerCase().includes(keyword) ||
             diagnosis.toLowerCase().includes(keyword);
    });
  }, [records, searchQuery]);

  const handleSave = async () => {
    if (!formData.petId || !formData.diagnosa || !formData.vetName) {
      alert("Harap lengkapi semua kolom wajib (Pasien, Diagnosa, Nama Dokter).");
      return;
    }

    try {
      // Find owner_id of the selected pet
      const { data: selectedPet, error: petErr } = await supabase
        .from("pets")
        .select("owner_id")
        .eq("id", formData.petId)
        .single();

      if (petErr || !selectedPet) {
        throw new Error("Gagal mengambil data pemilik hewan.");
      }

      const { error } = await supabase.from("medical_records").insert({
        pet_id: formData.petId,
        owner_id: selectedPet.owner_id,
        diagnosa: formData.diagnosa,
        treatment: formData.treatment || null,
        date: formData.date,
        vet_name: formData.vetName
      });

      if (error) throw error;

      setToastMsg("Rekam medis berhasil ditambahkan!");
      setShowToast(true);
      setIsModalOpen(false);
      setRefreshCounter(prev => prev + 1);

      // Reset Form
      setFormData({
        petId: pets[0]?.id || "",
        diagnosa: "",
        treatment: "",
        date: new Date().toISOString().slice(0, 10),
        vetName: ""
      });

    } catch (err) {
      console.error("Error saving medical record:", err);
      alert(err.message || "Gagal menyimpan rekam medis.");
    }
  };

  const isStaffOrAdmin = profile?.role === "admin" || profile?.role === "staff";

  return (
    <div className="animate-fade-in p-6 text-left">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-emerald-500" /> Rekam Medis
          </h1>
          <p className="text-sm text-gray-500 mt-1">Kelola riwayat pemeriksaan dan diagnosis pasien.</p>
        </div>
        
        {isStaffOrAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl shadow-md hover:bg-emerald-600 transition-all hover:-translate-y-0.5 cursor-pointer"
          >
            + Tambah Rekam Medis
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari ID, Pasien, atau Diagnosis..." />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">ID Rekam</th>
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Tanggal</th>
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Pasien (Pemilik)</th>
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Diagnosis Utama</th>
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Dokter</th>
                <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r, i) => (
                <tr key={i} onClick={() => navigate(`/medical-records/${r.id}`)} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                  <td className="py-4 font-semibold text-emerald-600">RM-{r.id.slice(0, 5).toUpperCase()}</td>
                  <td className="py-4 text-gray-600">{r.date}</td>
                  <td className="py-4">
                    <p className="font-semibold text-gray-800">{r.pets?.name || "Hewan"}</p>
                    <p className="text-xs text-gray-400">{r.owner?.full_name || "Owner"}</p>
                  </td>
                  <td className="py-4 text-gray-700 font-medium">{r.diagnosa}</td>
                  <td className="py-4 text-gray-600">{r.vet_name}</td>
                  <td className="py-4"><StatusBadge status="Selesai" /></td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr><td colSpan="6" className="py-8 text-center text-gray-400">Data tidak ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleSave} title="Tambah Rekam Medis Baru">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Pilih Pasien <span className="text-red-400">*</span></label>
            <select 
              value={formData.petId}
              onChange={(e) => setFormData({...formData, petId: e.target.value})}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white cursor-pointer"
            >
              {pets.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.owner?.full_name || "Tanpa Owner"})</option>
              ))}
              {pets.length === 0 && (
                <option value="">Belum ada pet terdaftar</option>
              )}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Diagnosis <span className="text-red-400">*</span></label>
            <input 
              type="text" 
              value={formData.diagnosa}
              onChange={(e) => setFormData({...formData, diagnosa: e.target.value})}
              placeholder="Contoh: Flu kucing" 
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Tindakan / Terapi</label>
            <textarea 
              value={formData.treatment}
              onChange={(e) => setFormData({...formData, treatment: e.target.value})}
              placeholder="Contoh: Pemberian antibiotik dan multivitamin" 
              rows={3}
              className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white resize-none" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tanggal Pemeriksaan</label>
              <input 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Vet <span className="text-red-400">*</span></label>
              <input 
                type="text" 
                value={formData.vetName}
                onChange={(e) => setFormData({...formData, vetName: e.target.value})}
                placeholder="Contoh: drh. Nisa" 
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white" 
              />
            </div>
          </div>
        </div>
      </Modal>

      <ToastNotification isVisible={showToast} onClose={() => setShowToast(false)} message={toastMsg} />
    </div>
  );
}
