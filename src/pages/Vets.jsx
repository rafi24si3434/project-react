import { useState, useMemo } from "react";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaStethoscope,
  FaCheckCircle,
  FaTimesCircle,
  FaUserMd
} from "react-icons/fa";
import Modal from "../components/Modal";
import ToastNotification from "../components/ToastNotification";

const initialVets = [
  {
    id: "VET-001",
    name: "drh. Nisa Putri",
    specialization: "Dokter Hewan Umum",
    schedule: "Senin - Rabu (08:00 - 15:00)",
    status: "Aktif",
    phone: "0812-9988-7711",
    email: "nisa.putri@petcare.id",
    avatarBg: "bg-teal-50 text-teal-700",
    gender: "Perempuan",
  },
  {
    id: "VET-002",
    name: "drh. Aditya Ramadhan",
    specialization: "Spesialis Bedah",
    schedule: "Kamis - Sabtu (10:00 - 18:00)",
    status: "Aktif",
    phone: "0812-8877-6622",
    email: "aditya.r@petcare.id",
    avatarBg: "bg-blue-50 text-blue-700",
    gender: "Laki-laki",
  },
  {
    id: "VET-003",
    name: "drh. Citra Maharani",
    specialization: "Hewan Eksotis",
    schedule: "Senin - Jumat (09:00 - 16:00)",
    status: "Aktif",
    phone: "0812-7766-5533",
    email: "citra.m@petcare.id",
    avatarBg: "bg-pink-50 text-pink-700",
    gender: "Perempuan",
  },
  {
    id: "VET-004",
    name: "drh. Farhan Akbar",
    specialization: "Spesialis Gigi",
    schedule: "Selasa - Sabtu (11:00 - 19:00)",
    status: "Aktif",
    phone: "0812-6655-4422",
    email: "farhan.a@petcare.id",
    avatarBg: "bg-amber-50 text-amber-700",
    gender: "Laki-laki",
  },
  {
    id: "VET-005",
    name: "drh. Vania Lestari",
    specialization: "Perawatan Kulit & Bulu",
    schedule: "Rabu - Minggu (08:00 - 17:00)",
    status: "Cuti",
    phone: "0812-5544-3322",
    email: "vania.l@petcare.id",
    avatarBg: "bg-violet-50 text-violet-700",
    gender: "Perempuan",
  },
];

export default function Vets() {
  const [vets, setVets] = useState(initialVets);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Form Fields
  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("Dokter Hewan Umum");
  const [schedule, setSchedule] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("Aktif");
  const [gender, setGender] = useState("Laki-laki");

  const filtered = useMemo(() => {
    return vets.filter(
      (v) =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.specialization.toLowerCase().includes(search.toLowerCase())
    );
  }, [vets, search]);

  const triggerToast = (msg, type = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setShowToast(true);
  };

  const handleAddVet = () => {
    if (!name || !schedule || !phone || !email) {
      triggerToast("Harap isi semua kolom wajib!", "error");
      return;
    }

    const colorMap = {
      "Dokter Hewan Umum": "bg-teal-50 text-teal-700",
      "Spesialis Bedah": "bg-blue-50 text-blue-700",
      "Hewan Eksotis": "bg-pink-50 text-pink-700",
      "Spesialis Gigi": "bg-amber-50 text-amber-700",
      "Perawatan Kulit & Bulu": "bg-violet-50 text-violet-700",
    };

    const newVet = {
      id: `VET-${String(vets.length + 1).padStart(3, "0")}`,
      name,
      specialization,
      schedule,
      status,
      phone,
      email,
      avatarBg: colorMap[specialization] || "bg-gray-50 text-gray-700",
      gender,
    };

    setVets([...vets, newVet]);
    setIsModalOpen(false);

    // Reset Form
    setName("");
    setSchedule("");
    setPhone("");
    setEmail("");
    setStatus("Aktif");
    setGender("Laki-laki");

    triggerToast("Dokter/Staf baru berhasil ditambahkan!");
  };

  const handleDeleteVet = (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${name}?`)) {
      setVets(vets.filter((v) => v.id !== id));
      triggerToast(`Dokter ${name} berhasil dihapus dari sistem.`);
    }
  };

  const toggleVetStatus = (id, currentStatus, name) => {
    const nextStatus = currentStatus === "Aktif" ? "Cuti" : "Aktif";
    setVets(
      vets.map((v) => (v.id === id ? { ...v, status: nextStatus } : v))
    );
    triggerToast(`Status ${name} diubah menjadi ${nextStatus}.`);
  };

  const getInitials = (name) => {
    return name
      .replace("drh. ", "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🩺</span>
            <h1 className="text-xl font-bold text-gray-800">Dokter & Staf</h1>
          </div>
          <p className="text-sm text-gray-400 pl-8">
            {vets.length} dokter & staf medis terdaftar
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-md shadow-emerald-200 transition"
        >
          <FaPlus className="text-xs" />
          Tambah Dokter
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">👥</span>
          <div>
            <p className="text-xl font-bold text-gray-800">{vets.length}</p>
            <p className="text-xs text-gray-400">Total Dokter/Staf</p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">🩺</span>
          <div>
            <p className="text-xl font-bold text-emerald-700">
              {vets.filter((v) => v.status === "Aktif").length}
            </p>
            <p className="text-xs text-gray-400">Dokter Aktif Bertugas</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">✂️</span>
          <div>
            <p className="text-xl font-bold text-blue-700">
              {vets.filter((v) => v.specialization.includes("Bedah")).length}
            </p>
            <p className="text-xs text-gray-400">Dokter Spesialis Bedah</p>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Cari dokter atau spesialisasi..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
          />
        </div>

        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 ml-auto">
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              view === "grid" ? "bg-gray-100 text-gray-700" : "text-gray-400"
            }`}
          >
            Grid
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              view === "list" ? "bg-gray-100 text-gray-700" : "text-gray-400"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* GRID VIEW */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {filtered.map((vet) => (
            <div
              key={vet.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg hover:border-emerald-200 transition"
            >
              {/* Header Card */}
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner ${vet.avatarBg}`}
                >
                  {getInitials(vet.name)}
                </div>
                <span
                  onClick={() => toggleVetStatus(vet.id, vet.status, vet.name)}
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border cursor-pointer select-none transition ${
                    vet.status === "Aktif"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-amber-50 text-amber-600 border-amber-100"
                  }`}
                >
                  {vet.status}
                </span>
              </div>

              {/* Doctor Profile */}
              <h3 className="font-bold text-gray-800 text-sm mb-0.5">
                {vet.name}
              </h3>
              <p className="text-xs text-emerald-600 font-semibold mb-3">
                {vet.specialization}
              </p>

              {/* Practice details */}
              <div className="space-y-2 mb-4 border-t border-gray-50 pt-2.5 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-400 shrink-0" />
                  <span className="truncate">{vet.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-gray-400 shrink-0" />
                  <span>{vet.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-400 shrink-0" />
                  <span className="truncate">{vet.email}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-50 pt-3 flex justify-end gap-1.5">
                <button
                  onClick={() =>
                    toggleVetStatus(vet.id, vet.status, vet.name)
                  }
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    vet.status === "Aktif"
                      ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                      : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                  }`}
                >
                  {vet.status === "Aktif" ? "Cuti" : "Aktifkan"}
                </button>
                <button
                  onClick={() => handleDeleteVet(vet.id, vet.name)}
                  className="w-8 h-8 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  "Dokter / Staf",
                  "Spesialisasi",
                  "Jadwal Praktik",
                  "Kontak",
                  "Status",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((vet) => (
                <tr
                  key={vet.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >
                  {/* Photo & Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${vet.avatarBg}`}
                      >
                        {getInitials(vet.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{vet.name}</p>
                        <p className="text-[10px] text-gray-400">{vet.id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Specialization */}
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    {vet.specialization}
                  </td>

                  {/* Schedule */}
                  <td className="px-4 py-3 text-gray-600 text-xs">
                    {vet.schedule}
                  </td>

                  {/* Contact */}
                  <td className="px-4 py-3 text-xs space-y-0.5">
                    <p className="flex items-center gap-1.5 text-gray-700">
                      <FaPhone className="text-gray-400" />
                      {vet.phone}
                    </p>
                    <p className="flex items-center gap-1.5 text-gray-400">
                      <FaEnvelope />
                      {vet.email}
                    </p>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      onClick={() => toggleVetStatus(vet.id, vet.status, vet.name)}
                      className={`text-[9px] font-bold px-2.5 py-1 rounded-full border cursor-pointer select-none transition ${
                        vet.status === "Aktif"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                    >
                      {vet.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 items-center">
                      <button
                        onClick={() =>
                          toggleVetStatus(vet.id, vet.status, vet.name)
                        }
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                          vet.status === "Aktif"
                            ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {vet.status === "Aktif" ? "Cuti" : "Aktifkan"}
                      </button>
                      <button
                        onClick={() => handleDeleteVet(vet.id, vet.name)}
                        className="w-8 h-8 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition"
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
      )}

      {/* POPUP MODAL: TAMBAH DOKTER BARU */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddVet}
        title="Daftarkan Dokter / Staf Baru"
        confirmText="Tambah Dokter"
        confirmColor="bg-emerald-500"
      >
        <div className="space-y-4 text-left">
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">
              Nama Lengkap Dokter <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth. drh. Ahmad Basori"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-bold mb-1.5 block">
                Spesialisasi / Bidang
              </label>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition font-semibold"
              >
                <option value="Dokter Hewan Umum">Dokter Hewan Umum</option>
                <option value="Spesialis Bedah">Spesialis Bedah</option>
                <option value="Hewan Eksotis">Hewan Eksotis</option>
                <option value="Spesialis Gigi">Spesialis Gigi</option>
                <option value="Perawatan Kulit & Bulu">Perawatan Kulit & Bulu</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold mb-1.5 block">
                Jenis Kelamin
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition font-semibold"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">
              Jadwal Praktik (Hari & Jam) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="cth. Senin - Jumat (09:00 - 17:00)"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 font-bold mb-1.5 block">
                No. Telepon <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="cth. 0812-xxxx-xxxx"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition font-semibold"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 font-bold mb-1.5 block">
                Email Kerja <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cth. nama@petcare.id"
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">
              Status Dinas
            </label>
            <div className="flex gap-4">
              {["Aktif", "Cuti"].map((s) => (
                <label key={s} className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={status === s}
                    onChange={() => setStatus(s)}
                    className="accent-emerald-500 cursor-pointer"
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* TOAST FEEDBACK ALERT */}
      <ToastNotification
        isVisible={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
