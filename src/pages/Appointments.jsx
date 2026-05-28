import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaSearch,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const appointmentData = [
  {
    id: 1,
    pet: "Mochi",
    owner: "Budi Santoso",
    doctor: "Dr. Amanda",
    date: "12 Mei 2026",
    time: "09:00",
    type: "Vaccination",
    status: "Completed",
    emoji: "🐱",
  },
  {
    id: 2,
    pet: "Rocky",
    owner: "Dewi Lestari",
    doctor: "Dr. Kevin",
    date: "12 Mei 2026",
    time: "10:30",
    type: "Checkup",
    status: "Pending",
    emoji: "🐶",
  },
  {
    id: 3,
    pet: "Bella",
    owner: "Andi Saputra",
    doctor: "Dr. Sarah",
    date: "13 Mei 2026",
    time: "13:00",
    type: "Surgery",
    status: "Cancelled",
    emoji: "🐰",
  },
  {
    id: 4,
    pet: "Leo",
    owner: "Nabila Putri",
    doctor: "Dr. Amanda",
    date: "14 Mei 2026",
    time: "15:00",
    type: "Grooming",
    status: "Completed",
    emoji: "🐶",
  },
];

export default function Appointments() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const filtered = appointmentData.filter(
    (a) =>
      a.pet.toLowerCase().includes(search.toLowerCase()) ||
      a.owner.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📅</span>

              <h1 className="text-2xl font-bold text-gray-800">
                Appointments
              </h1>
            </div>

            <p className="text-sm text-gray-400">
              Kelola jadwal pemeriksaan hewan
            </p>
          </div>

          <button
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium shadow-lg shadow-emerald-200 transition"
          >
            <FaPlus className="text-xs" />
            Tambah Appointment
          </button>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">

            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">📋</span>

              <div className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center">
                <FaCalendarAlt className="text-gray-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              {appointmentData.length}
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Total Appointment
            </p>

          </div>

          <div className="bg-white rounded-3xl border border-emerald-100 p-5 shadow-sm">

            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">✅</span>

              <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center">
                <FaCheckCircle className="text-emerald-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-emerald-600">
              {
                appointmentData.filter(
                  (a) => a.status === "Completed"
                ).length
              }
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Completed
            </p>

          </div>

          <div className="bg-white rounded-3xl border border-amber-100 p-5 shadow-sm">

            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">⏳</span>

              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
                <FaClock className="text-amber-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-amber-600">
              {
                appointmentData.filter(
                  (a) => a.status === "Pending"
                ).length
              }
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Pending
            </p>

          </div>

          <div className="bg-white rounded-3xl border border-red-100 p-5 shadow-sm">

            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">❌</span>

              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
                <FaTimesCircle className="text-red-600" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-red-600">
              {
                appointmentData.filter(
                  (a) => a.status === "Cancelled"
                ).length
              }
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Cancelled
            </p>

          </div>

        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-3xl border border-gray-100 p-5 mb-6 shadow-sm">

          <div className="relative max-w-md">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Cari appointment..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
            />

          </div>

        </div>

        {/* APPOINTMENT LIST */}
        <div className="bg-white rounded-3xl border border-gray-100 p-1 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pasien</TableHead>
                <TableHead>Pemilik</TableHead>
                <TableHead>Dokter</TableHead>
                <TableHead>Jadwal</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{item.emoji}</span> {item.pet}
                    </div>
                  </TableCell>
                  <TableCell>{item.owner}</TableCell>
                  <TableCell>{item.doctor}</TableCell>
                  <TableCell>{item.date} · {item.time}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      </div>

    </div>
  );
}