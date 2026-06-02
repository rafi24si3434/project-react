import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  Clock,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  ClipboardList,
  User,
  Stethoscope,
  Activity,
  PawPrint,
  CalendarCheck
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "../components/Modal";
import ToastNotification from "../components/ToastNotification";

const initialData = [
  {
    id: 1,
    pet: "Mochi",
    owner: "Budi Santoso",
    doctor: "dr. Sari",
    date: "2026-05-12",
    time: "09:00",
    type: "Vaccination",
    status: "Completed",
    emoji: "🐱",
  },
  {
    id: 2,
    pet: "Rocky",
    owner: "Dewi Lestari",
    doctor: "dr. Kevin",
    date: "2026-05-12",
    time: "10:30",
    type: "Checkup",
    status: "Pending",
    emoji: "🐶",
  },
  {
    id: 3,
    pet: "Bella",
    owner: "Andi Saputra",
    doctor: "dr. Sari",
    date: "2026-05-13",
    time: "13:00",
    type: "Surgery",
    status: "Cancelled",
    emoji: "🐰",
  },
  {
    id: 4,
    pet: "Leo",
    owner: "Nabila Putri",
    doctor: "dr. Amanda",
    date: "2026-05-14",
    time: "15:00",
    type: "Grooming",
    status: "Completed",
    emoji: "🐶",
  },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [search, setSearch] = useState("");
  
  // Modal & Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    pet: "",
    owner: "",
    doctor: "dr. Sari",
    date: "",
    time: "",
    type: "Checkup",
    emoji: "🐾"
  });

  // Refs implementation according to p12.md
  const petInputRef = useRef(null);
  const dateInputRef = useRef(null);

  // useEffect: Mengambil daftar appointment secara asinkron saat dibuka
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setAppointments(initialData);
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [refreshCounter]);

  // useEffect: Focus form appointment input nama pet saat modal dibuka
  useEffect(() => {
    if (isModalOpen && petInputRef.current) {
      const timer = setTimeout(() => {
        petInputRef.current.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  const filtered = appointments.filter(
    (a) =>
      a.pet.toLowerCase().includes(search.toLowerCase()) ||
      a.owner.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 border border-amber-200 animate-pulse";
      case "Cancelled":
        return "bg-rose-100 text-rose-700 border border-rose-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const handleAddAppointment = () => {
    if (!formData.pet || !formData.owner || !formData.date || !formData.time) {
      alert("Harap lengkapi semua data wajib (Pasien, Pemilik, Tanggal, Waktu).");
      return;
    }
    
    const newAppointment = {
      id: initialData.length + 1,
      ...formData,
      status: "Pending",
    };
    
    initialData.unshift(newAppointment);
    setRefreshCounter(prev => prev + 1);
    setIsModalOpen(false);
    setShowToast(true);
    setFormData({
      pet: "",
      owner: "",
      doctor: "dr. Sari",
      date: "",
      time: "",
      type: "Checkup",
      emoji: "🐾"
    });
  };

  return (
    <div className="min-h-screen p-1.5 opacity-100 transition-opacity duration-500">

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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Appointment Baru
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Total Appointment */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-150 p-6 transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Jadwal</p>
              <h1 className="text-3xl font-extrabold mt-2 text-gray-800 tracking-tight">{appointments.length}</h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-150 p-6 transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Selesai</p>
              <h1 className="text-3xl font-extrabold mt-2 text-gray-800 tracking-tight">
                {appointments.filter((a) => a.status === "Completed").length}
              </h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-150 p-6 transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Menunggu</p>
              <h1 className="text-3xl font-extrabold mt-2 text-gray-800 tracking-tight">
                {appointments.filter((a) => a.status === "Pending").length}
              </h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-inner group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
              <Clock className="w-6 h-6 animate-pulse-slow" />
            </div>
          </div>
        </div>

        {/* Cancelled */}
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 border border-gray-150 p-6 transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-110 opacity-60" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">Dibatalkan</p>
              <h1 className="text-3xl font-extrabold mt-2 text-gray-800 tracking-tight">
                {appointments.filter((a) => a.status === "Cancelled").length}
              </h1>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? filtered.map((item) => (
                <TableRow key={item.id} className="hover:bg-emerald-50/30 transition-colors border-b-gray-50 group">
                  <TableCell className="font-medium py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">
                        {item.emoji}
                      </span> 
                      <span className="text-gray-800">{item.pet}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm font-medium">{item.owner}</TableCell>
                  <TableCell className="text-gray-600 text-sm flex items-center gap-1.5 pt-4">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-400" /> {item.doctor}
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-700">{item.date}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3"/> {item.time}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 text-sm">
                    <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200">
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-gray-400">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <PawPrint className="w-3.5 h-3.5" /> Nama Pasien
              </label>
              <input
                ref={petInputRef}
                type="text"
                value={formData.pet}
                onChange={(e) => setFormData({...formData, pet: e.target.value})}
                placeholder="Misal: Mochi"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> Nama Pemilik
              </label>
              <input
                type="text"
                value={formData.owner}
                onChange={(e) => setFormData({...formData, owner: e.target.value})}
                placeholder="Misal: Budi Santoso"
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5" /> Dokter Penanggung Jawab
            </label>
            <select
              value={formData.doctor}
              onChange={(e) => setFormData({...formData, doctor: e.target.value})}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
            >
              <option value="dr. Sari">dr. Sari</option>
              <option value="dr. Kevin">dr. Kevin</option>
              <option value="dr. Amanda">dr. Amanda</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Tanggal
              </label>
              <input
                ref={dateInputRef}
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Waktu
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
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
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white"
            >
              <option value="Checkup">Checkup Rutin</option>
              <option value="Vaccination">Vaksinasi</option>
              <option value="Grooming">Grooming</option>
              <option value="Surgery">Operasi / Bedah</option>
              <option value="Dental">Perawatan Gigi</option>
            </select>
          </div>
        </div>
      </Modal>

      <ToastNotification 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
        message="Jadwal temu berhasil ditambahkan!" 
        type="success"
      />
    </div>
  );
}