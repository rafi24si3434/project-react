import { useState, useEffect, useRef } from "react";
import {
  Calendar, Clock, Search, Plus, CheckCircle2, XCircle,
  ClipboardList, User, Stethoscope, Activity, PawPrint, CalendarCheck, Check
} from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import Modal from "../components/Modal";
import ToastNotification from "../components/ToastNotification";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export default function Appointments() {
  const { user, profile } = useAuth();
  
  const [appointments, setAppointments] = useState([]);
  const [myPets, setMyPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    petId: "",
    petNameManual: "", // for admin/staff
    ownerEmailManual: "", // for admin/staff to lookup user
    doctor: "dr. Sari",
    date: "",
    time: "",
    type: "Checkup",
    notes: ""
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  const petInputRef = useRef(null);
  const dateInputRef = useRef(null);

  // Fetch appointments from Supabase
  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      let { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          pets (name, type, breed),
          owner:users (full_name, email)
        `)
        .order("date", { ascending: false })
        .order("time", { ascending: false });

      // Fallback: If owner relation fails due to RLS/Foreign Key join mapping issues
      if (error && (error.message.includes("relationship") || error.message.includes("join") || error.message.includes("relation"))) {
        console.warn("[Appointments] Join query failed, using separate-query fallback...");
        const { data: flatData, error: flatError } = await supabase
          .from("appointments")
          .select(`
            *,
            pets (name, type, breed)
          `)
          .order("date", { ascending: false })
          .order("time", { ascending: false });

        if (flatError) throw flatError;

        const { data: usersData } = await supabase
          .from("users")
          .select("auth_user_id, full_name, email");

        const userMap = {};
        if (usersData) {
          usersData.forEach(u => {
            userMap[u.auth_user_id] = { full_name: u.full_name, email: u.email };
          });
        }

        data = (flatData || []).map(app => ({
          ...app,
          owner: userMap[app.owner_id] || { full_name: "Tidak Diketahui", email: "-" }
        }));
        error = null;
      }

      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      console.error("Error loading appointments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch customer's pets
  const fetchMyPets = async () => {
    if (profile?.role === "customer") {
      try {
        const { data } = await supabase
          .from("pets")
          .select("id, name, type")
          .eq("owner_id", user?.id);
        setMyPets(data || []);
        if (data && data.length > 0) {
          setFormData((f) => ({ ...f, petId: data[0].id }));
        }
      } catch (err) {
        console.error("Error loading my pets:", err);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchAppointments();
      fetchMyPets();
    }
  }, [user, profile, refreshCounter]);

  // Focus input
  useEffect(() => {
    if (isModalOpen && petInputRef.current) {
      setTimeout(() => petInputRef.current.focus(), 100);
    }
  }, [isModalOpen]);

  const filtered = appointments.filter((a) => {
    const keyword = search.toLowerCase();
    const petName = a.pets?.name || a.pet_id || "Hewan";
    const ownerName = a.owner?.full_name || "Owner";
    const doctor = a.doctor || "Dokter";
    return petName.toLowerCase().includes(keyword) ||
           ownerName.toLowerCase().includes(keyword) ||
           doctor.toLowerCase().includes(keyword);
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "Confirmed":
        return "bg-blue-150 text-blue-700 border border-blue-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 border border-amber-200 animate-pulse";
      case "Cancelled":
        return "bg-rose-100 text-rose-700 border border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const handleAddAppointment = async () => {
    const isCust = profile?.role === "customer";
    
    if (isCust && !formData.petId) {
      alert("Harap pilih hewan peliharaan Anda.");
      return;
    }
    if (!isCust && (!formData.petNameManual || !formData.ownerEmailManual)) {
      alert("Harap isi nama pasien dan email pemilik.");
      return;
    }
    if (!formData.date || !formData.time) {
      alert("Harap tentukan tanggal dan waktu janji temu.");
      return;
    }

    try {
      let ownerId = user?.id;
      let petId = isCust ? formData.petId : null;

      // Admin/staff adds appointment
      if (!isCust) {
        // Find owner by email
        const { data: matchedOwner } = await supabase
          .from("users")
          .select("auth_user_id")
          .eq("email", formData.ownerEmailManual)
          .maybeSingle();

        if (!matchedOwner) {
          alert("Email pemilik tidak terdaftar sebagai user customer klinik.");
          return;
        }
        ownerId = matchedOwner.auth_user_id;

        // Optionally lookup or create a pet, for now insert pet if needed or reference ownerId
        // Let's see if we can find a pet of this owner matching the name
        const { data: matchedPet } = await supabase
          .from("pets")
          .select("id")
          .eq("owner_id", ownerId)
          .eq("name", formData.petNameManual)
          .limit(1)
          .maybeSingle();

        if (matchedPet) {
          petId = matchedPet.id;
        } else {
          // Create pet for this owner
          const { data: newPet, error: petErr } = await supabase
            .from("pets")
            .insert({
              owner_id: ownerId,
              name: formData.petNameManual,
              type: "Lainnya",
              gender: "Jantan",
              birth_date: new Date().toISOString().slice(0, 10)
            })
            .select()
            .single();

          if (petErr) throw petErr;
          petId = newPet.id;
        }
      }

      const { error } = await supabase.from("appointments").insert({
        owner_id: ownerId,
        pet_id: petId,
        doctor: formData.doctor,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        notes: formData.notes || null,
        status: "Pending"
      });

      if (error) throw error;

      // Log activity
      try {
        await supabase.from("activity_logs").insert({
          user_id: user?.id,
          activity: "Customer Membuat Appointment",
          description: `Membuat janji temu untuk tanggal ${formData.date} pukul ${formData.time}.`
        });
      } catch (logErr) {
        console.error("Activity log failed:", logErr);
      }

      setToastMsg("Jadwal temu berhasil didaftarkan!");
      setToastType("success");
      setShowToast(true);
      setIsModalOpen(false);
      setRefreshCounter((prev) => prev + 1);

      // Reset form
      setFormData({
        petId: myPets[0]?.id || "",
        petNameManual: "",
        ownerEmailManual: "",
        doctor: "dr. Sari",
        date: "",
        time: "",
        type: "Checkup",
        notes: ""
      });

    } catch (err) {
      console.error("Error creating appointment:", err);
      alert(err.message || "Gagal membuat janji temu.");
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", appointmentId);

      if (error) throw error;

      // Log activity
      try {
        await supabase.from("activity_logs").insert({
          user_id: user?.id,
          activity: "Mengubah Status Appointment",
          description: `Mengubah status appointment ID ${appointmentId.slice(0, 8)} menjadi ${newStatus}.`
        });
      } catch (logErr) {
        console.error("Activity logging failed:", logErr);
      }

      setToastMsg(`Status janji temu diubah menjadi: ${newStatus}`);
      setToastType("success");
      setShowToast(true);
      setRefreshCounter((prev) => prev + 1);
    } catch (err) {
      console.error("Error updating appointment status:", err);
      alert(err.message || "Gagal memperbarui status.");
    }
  };

  const getPetEmoji = (type) => {
    switch (type?.toLowerCase()) {
      case "cat":
      case "kucing": return "🐱";
      case "dog":
      case "anjing": return "🐶";
      case "rabbit":
      case "kelinci": return "🐰";
      case "bird":
      case "burung": return "🦜";
      case "hamster": return "🐹";
      default: return "🐾";
    }
  };

  const translateType = (type) => {
    switch (type) {
      case "Checkup": return "Checkup Rutin";
      case "Vaccination": return "Vaksinasi";
      case "Grooming": return "Grooming";
      case "Surgery": return "Bedah / Operasi";
      case "Dental": return "Perawatan Gigi";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen p-1.5 opacity-100 transition-opacity duration-500 text-left">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-100">
            <Calendar className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">
              Manajemen Jadwal
            </h1>
            <p className="text-sm text-gray-400 font-medium mt-0.5">
              Atur dan pantau janji temu klinik Anda
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Appointment Baru
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Appointment */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-6 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Jadwal</p>
              <h1 className="text-3xl font-extrabold mt-2 text-gray-800 tracking-tight">{appointments.length}</h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-6 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Selesai</p>
              <h1 className="text-3xl font-extrabold mt-2 text-gray-800 tracking-tight">
                {appointments.filter((a) => a.status === "Completed").length}
              </h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-6 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Menunggu</p>
              <h1 className="text-3xl font-extrabold mt-2 text-gray-800 tracking-tight">
                {appointments.filter((a) => a.status === "Pending").length}
              </h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-inner">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Cancelled */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-6 transition-all duration-300 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Dibatalkan</p>
              <h1 className="text-3xl font-extrabold mt-2 text-gray-800 tracking-tight">
                {appointments.filter((a) => a.status === "Cancelled").length}
              </h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner">
              <XCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* APPOINTMENT LIST & SEARCH */}
      <div className="bg-white rounded-2xl border border-gray-150 p-6 shadow-sm">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-emerald-500" /> Daftar Jadwal Temu
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Cari pasien / dokter..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all bg-gray-50 hover:bg-white focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-50">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="hover:bg-transparent border-b-gray-100">
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider h-11">Pasien</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider h-11">Pemilik</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider h-11">Dokter</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider h-11">Jadwal</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider h-11">Tindakan</TableHead>
                <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider h-11">Status</TableHead>
                {profile?.role !== "customer" && (
                  <TableHead className="font-semibold text-gray-500 text-xs uppercase tracking-wider h-11 text-center">Verifikasi Admin</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? filtered.map((item) => (
                <TableRow key={item.id} className="hover:bg-emerald-50/30 transition-colors border-b-gray-50 group">
                  <TableCell className="font-medium py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">
                        {getPetEmoji(item.pets?.type)}
                      </span> 
                      <span className="text-gray-800">{item.pets?.name || "Hewan"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-650 text-sm font-medium">{item.owner?.full_name || "Pemilik"}</TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    <div className="flex items-center gap-1.5 pt-1">
                      <Stethoscope className="w-3.5 h-3.5 text-emerald-400" /> {item.doctor}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-700">{item.date}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {item.time}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    <span className="bg-gray-100 text-gray-650 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200">
                      {translateType(item.type)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  {profile?.role !== "customer" && (
                    <TableCell className="py-3">
                      <div className="flex justify-center gap-1.5">
                        {item.status === "Pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(item.id, "Confirmed")}
                              className="px-2.5 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-[10px] font-bold cursor-pointer transition"
                            >
                              Konfirmasi
                            </button>
                            <button
                              onClick={() => updateStatus(item.id, "Cancelled")}
                              className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded text-[10px] font-bold cursor-pointer transition"
                            >
                              Batal
                            </button>
                          </>
                        )}
                        {item.status === "Confirmed" && (
                          <>
                            <button
                              onClick={() => updateStatus(item.id, "Completed")}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[10px] font-bold cursor-pointer transition"
                            >
                              Selesai
                            </button>
                            <button
                              onClick={() => updateStatus(item.id, "Cancelled")}
                              className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded text-[10px] font-bold cursor-pointer transition"
                            >
                              Batal
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={profile?.role === "customer" ? 6 : 7} className="h-32 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-6 h-6 text-gray-300" />
                      <p>Tidak ada jadwal yang ditemukan.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ADD APPOINTMENT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddAppointment}
        title="Pendaftaran Jadwal Temu"
        confirmText="Simpan Jadwal"
      >
        <div className="space-y-4">
          
          {profile?.role === "customer" ? (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <PawPrint className="w-3.5 h-3.5" /> Pilih Hewan Peliharaan <span className="text-red-400">*</span>
              </label>
              <select
                value={formData.petId}
                onChange={(e) => setFormData({...formData, petId: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white cursor-pointer"
              >
                {myPets.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                ))}
                {myPets.length === 0 && (
                  <option value="">Belum ada pet terdaftar</option>
                )}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <PawPrint className="w-3.5 h-3.5" /> Nama Pasien <span className="text-red-400">*</span>
                </label>
                <input
                  ref={petInputRef}
                  type="text"
                  value={formData.petNameManual}
                  onChange={(e) => setFormData({...formData, petNameManual: e.target.value})}
                  placeholder="Misal: Mochi"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Email Pemilik <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.ownerEmailManual}
                  onChange={(e) => setFormData({...formData, ownerEmailManual: e.target.value})}
                  placeholder="Misal: budi@email.com"
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5" /> Dokter Penanggung Jawab
            </label>
            <select
              value={formData.doctor}
              onChange={(e) => setFormData({...formData, doctor: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white cursor-pointer"
            >
              <option value="drh. Nisa Putri">drh. Nisa Putri</option>
              <option value="drh. Aditya Ramadhan">drh. Aditya Ramadhan</option>
              <option value="drh. Citra Maharani">drh. Citra Maharani</option>
              <option value="drh. Farhan Akbar">drh. Farhan Akbar</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Tanggal <span className="text-red-400">*</span>
              </label>
              <input
                ref={dateInputRef}
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Waktu <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> Jenis Tindakan
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white cursor-pointer"
            >
              <option value="Checkup">Checkup Rutin</option>
              <option value="Vaccination">Vaksinasi</option>
              <option value="Grooming">Grooming</option>
              <option value="Surgery">Operasi / Bedah</option>
              <option value="Dental">Perawatan Gigi</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Keluhan / Catatan Medis Awal
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Tuliskan keluhan atau rincian janji temu..."
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white resize-none"
            />
          </div>
        </div>
      </Modal>

      <ToastNotification 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
        message={toastMsg} 
        type={toastType}
      />
    </div>
  );
}