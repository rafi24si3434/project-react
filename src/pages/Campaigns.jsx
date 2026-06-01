import { useState, useMemo } from "react";
import {
  FaBullhorn,
  FaPaperPlane,
  FaUsers,
  FaPercentage,
  FaChartLine,
  FaPlus,
  FaEnvelope,
  FaComment,
  FaTrash,
  FaInfoCircle,
  FaCheckCircle,
  FaSpinner
} from "react-icons/fa";
import { crmCustomers } from "@/data/CustomerCrmData";
import Modal from "../components/Modal";
import ToastNotification from "../components/ToastNotification";

// Data Awal Campaign
const initialCampaigns = [
  {
    id: "CAMP-001",
    name: "PetCare Summer Festival",
    channel: "Instagram Ads",
    budget: 4500000,
    reach: 12000,
    conversion: 8.5,
    status: "Aktif",
    avatarBg: "bg-pink-50 text-pink-700",
  },
  {
    id: "CAMP-002",
    name: "Vaksinasi Gratis Rabies",
    channel: "WhatsApp Broadcast",
    budget: 2000000,
    reach: 5000,
    conversion: 18.2,
    status: "Aktif",
    avatarBg: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "CAMP-003",
    name: "Liburan Tenang Bersama PetCare",
    channel: "Instagram Ads",
    budget: 3500000,
    reach: 8500,
    conversion: 6.4,
    status: "Aktif",
    avatarBg: "bg-blue-50 text-blue-700",
  },
  {
    id: "CAMP-004",
    name: "Bulan Kesehatan Gigi Hewan",
    channel: "Email Newsletter",
    budget: 1500000,
    reach: 4000,
    conversion: 11.0,
    status: "Selesai",
    avatarBg: "bg-violet-50 text-violet-700",
  },
  {
    id: "CAMP-005",
    name: "Pekan Mainan Anabul",
    channel: "TikTok Ads",
    budget: 5000000,
    reach: 15000,
    conversion: 9.1,
    status: "Selesai",
    avatarBg: "bg-amber-50 text-amber-700",
  },
];

const templates = [
  {
    id: "tmpl-1",
    name: "Diskon Vaksin Tahunan",
    subject: "Kesehatan Anabul Prioritas Utama! 🐾",
    body: "Halo {nama},\n\nJangan lewatkan jadwal vaksin tahunan untuk anabul tercinta Anda. Khusus bulan ini, dapatkan potongan harga 15% untuk paket vaksin lengkap di PetCare. Hubungi kami sekarang untuk reservasi jadwal!",
  },
  {
    id: "tmpl-2",
    name: "Promo Grooming Gajian",
    subject: "Waktunya Anabul Tampil Cantik & Harum! ✨",
    body: "Halo {nama},\n\nSudah masuk masa gajian nih! Yuk manjakan anabul dengan paket Grooming Premium di PetCare. Tunjukkan pesan ini untuk klaim diskon 20% + gratis konsultasi kesehatan kulit ringan. Berlaku sampai akhir pekan ya!",
  },
  {
    id: "tmpl-3",
    name: "Undangan Event Anabul",
    subject: "Hadirilah PetCare Summer Festival! 🎉",
    body: "Halo {nama},\n\nKami mengundang Anda dan anabul untuk hadir di PetCare Summer Festival minggu depan! Akan ada talkshow gratis, pemeriksaan kesehatan gratis, dan kontes foto menarik. Dapatkan goodie bag spesial bagi 50 pendaftar pertama!",
  },
  {
    id: "tmpl-4",
    name: "Kupon Comeback (Dorman)",
    subject: "Kami Merindukan Anda & Anabul... ❤️",
    body: "Halo {nama},\n\nLama tidak berkunjung ke PetCare, semoga Anda dan anabul sehat selalu. Kami punya voucher diskon 25% khusus untuk kunjungan Anda berikutnya. Mari jadwalkan kontrol atau checkup pekan ini!",
  },
];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form states for new campaign
  const [newCampName, setNewCampName] = useState("");
  const [newCampChannel, setNewCampChannel] = useState("Instagram Ads");
  const [newCampBudget, setNewCampBudget] = useState("");

  // Broadcast states
  const [bcChannel, setBcChannel] = useState("WhatsApp");
  const [bcSegment, setBcSegment] = useState("all");
  const [bcTemplate, setBcTemplate] = useState("");
  const [bcMessage, setBcMessage] = useState("");
  const [bcSubject, setBcSubject] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendingProgress, setSendingProgress] = useState(0);
  const [showBcSuccess, setShowBcSuccess] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  // Format IDR helper
  const formatIDR = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Filter segment target customer
  const targetCustomers = useMemo(() => {
    return crmCustomers.filter((c) => {
      switch (bcSegment) {
        case "vip":
          return c.membership.status === "VIP";
        case "gold":
          return c.membership.level === "Gold";
        case "silver":
          return c.membership.level === "Silver";
        case "dorman":
          return !c.membership.isActive;
        case "wa":
          return c.marketing?.subscription?.includes("WhatsApp");
        case "email":
          return c.marketing?.subscription?.includes("Email");
        default:
          return true;
      }
    });
  }, [bcSegment]);

  // Apply template selection
  const handleSelectTemplate = (id) => {
    const tmpl = templates.find((t) => t.id === id);
    if (tmpl) {
      setBcTemplate(id);
      setBcSubject(tmpl.subject);
      const sampleName = targetCustomers[0]?.name || "Customer";
      const customizedBody = tmpl.body.replace("{nama}", sampleName);
      setBcMessage(customizedBody);
    }
  };

  // Handle Add Campaign
  const handleAddCampaign = () => {
    if (!newCampName || !newCampBudget) {
      setToastMessage("Harap isi semua kolom wajib!");
      setShowToast(true);
      return;
    }

    const colorMap = {
      "Instagram Ads": "bg-pink-50 text-pink-700",
      "TikTok Ads": "bg-amber-50 text-amber-700",
      "WhatsApp Broadcast": "bg-emerald-50 text-emerald-700",
      "Email Newsletter": "bg-violet-50 text-violet-700",
      "Google Ads": "bg-blue-50 text-blue-700",
    };

    const newCamp = {
      id: `CAMP-${String(campaigns.length + 1).padStart(3, "0")}`,
      name: newCampName,
      channel: newCampChannel,
      budget: parseFloat(newCampBudget),
      reach: Math.floor(parseFloat(newCampBudget) / 400 + Math.random() * 200),
      conversion: parseFloat((Math.random() * 12 + 5).toFixed(1)),
      status: "Aktif",
      avatarBg: colorMap[newCampChannel] || "bg-gray-50 text-gray-700",
    };

    setCampaigns([newCamp, ...campaigns]);
    setNewCampName("");
    setNewCampBudget("");
    setIsModalOpen(false);
    setToastMessage("Campaign baru berhasil ditambahkan!");
    setShowToast(true);
  };

  const handleDeleteCampaign = (id, name) => {
    if (window.confirm(`Hapus campaign ${name}?`)) {
      setCampaigns(campaigns.filter((c) => c.id !== id));
      setToastMessage(`Campaign ${name} dihapus.`);
      setShowToast(true);
    }
  };

  // Handle Send Broadcast
  const handleSendBroadcast = () => {
    if (!bcMessage) return;
    setIsSending(true);
    setSendingProgress(0);
    setSentCount(targetCustomers.length);

    const interval = setInterval(() => {
      setSendingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSending(false);
          setShowBcSuccess(true);
          setTimeout(() => setShowBcSuccess(false), 5000);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  // Stats calculation
  const totalBudget = useMemo(() => campaigns.reduce((sum, c) => sum + c.budget, 0), [campaigns]);
  const totalReach = useMemo(() => campaigns.reduce((sum, c) => sum + c.reach, 0), [campaigns]);
  const averageConversion = useMemo(() => {
    const sum = campaigns.reduce((acc, c) => acc + c.conversion, 0);
    return (sum / campaigns.length).toFixed(1);
  }, [campaigns]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">📢</span>
            <h1 className="text-xl font-bold text-gray-800">Campaigns Pemasaran</h1>
          </div>
          <p className="text-sm text-gray-400 pl-8">
            {campaigns.length} campaigns terdaftar · {campaigns.filter((c) => c.status === "Aktif").length} aktif
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-md shadow-emerald-200 transition"
        >
          <FaPlus className="text-xs" />
          Buat Campaign
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">📢</span>
          <div>
            <p className="text-xl font-bold text-gray-800">{campaigns.length}</p>
            <p className="text-xs text-gray-400">Total Campaigns</p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">💰</span>
          <div>
            <p className="text-md font-bold text-emerald-700 truncate">{formatIDR(totalBudget)}</p>
            <p className="text-xs text-gray-400">Total Anggaran</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">👥</span>
          <div>
            <p className="text-xl font-bold text-blue-700">{totalReach.toLocaleString("id-ID")}</p>
            <p className="text-xs text-gray-400">Jangkauan Iklan</p>
          </div>
        </div>

        <div className="bg-violet-50 border border-violet-100 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <span className="text-2xl">📈</span>
          <div>
            <p className="text-xl font-bold text-violet-700">{averageConversion}%</p>
            <p className="text-xs text-gray-400">Rasio Konversi</p>
          </div>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 items-start">
        {/* LEFT COLUMN: ACTIVE CAMPAIGNS & TARGET AUDIENCE */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm mb-4">Daftar Campaigns Berjalan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 transition-all hover:border-emerald-300 hover:shadow-sm"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                        {camp.channel}
                      </span>
                      <h4 className="font-bold text-gray-800 text-xs mt-0.5">{camp.name}</h4>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          camp.status === "Aktif"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {camp.status}
                      </span>
                      <button
                        onClick={() => handleDeleteCampaign(camp.id, camp.name)}
                        className="text-gray-300 hover:text-red-500 transition p-1"
                      >
                        <FaTrash className="text-[10px]" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3 text-[11px]">
                    <div className="bg-gray-50 p-2 rounded-xl">
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Budget</p>
                      <p className="font-bold text-gray-700 mt-0.5">{formatIDR(camp.budget)}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-xl">
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Reach</p>
                      <p className="font-bold text-gray-700 mt-0.5">
                        {camp.reach.toLocaleString("id-ID")} org
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-gray-400">
                      <span>Konversi</span>
                      <span className="font-bold text-emerald-600">{camp.conversion}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.min(100, camp.conversion * 5)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matches segment user preview */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Target Penerima Segmentasi</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Daftar customer aktif pada segmentasi filter:{" "}
                  <span className="font-bold text-emerald-600">{bcSegment.toUpperCase()}</span>
                </p>
              </div>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
                {targetCustomers.length} Customer
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[220px] overflow-y-auto pr-1">
              {targetCustomers.map((cust) => (
                <div
                  key={cust.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl hover:bg-emerald-50/50 transition cursor-pointer"
                >
                  <img
                    src={cust.avatar}
                    alt={cust.name}
                    className="h-7 w-7 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate">{cust.name}</p>
                    <p className="text-[9px] text-gray-400">{cust.membership.level}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: BROADCAST HUB */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="text-lg">✉️</span>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Broadcast Promo Hub</h3>
              <p className="text-[10px] text-gray-400">Kirim promosi tertarget bagi customer</p>
            </div>
          </div>

          {/* Success Info */}
          {showBcSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-900 rounded-xl p-3 text-xs flex items-start gap-2.5">
              <FaCheckCircle className="text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">Broadcast Berhasil Terkirim!</p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Sebanyak {sentCount} pesan telah disalurkan ke segmen via {bcChannel}.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-4 text-xs">
            {/* Channel options */}
            <div>
              <label className="text-xs text-gray-500 font-bold mb-1.5 block">Saluran Media</label>
              <div className="grid grid-cols-3 gap-2">
                {["WhatsApp", "Email", "SMS"].map((chan) => (
                  <button
                    key={chan}
                    type="button"
                    onClick={() => setBcChannel(chan)}
                    className={`py-2 rounded-xl border font-bold text-center transition ${
                      bcChannel === chan
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200"
                    }`}
                  >
                    {chan}
                  </button>
                ))}
              </div>
            </div>

            {/* Target segment */}
            <div>
              <label className="text-xs text-gray-500 font-bold mb-1.5 block">Target Segment</label>
              <select
                value={bcSegment}
                onChange={(e) => setBcSegment(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
              >
                <option value="all">Semua Customer ({crmCustomers.length})</option>
                <option value="vip">Hanya VIP Member</option>
                <option value="gold">Level Member Gold</option>
                <option value="silver">Level Member Silver</option>
                <option value="dorman">Customer Tidak Aktif / Dorman</option>
                <option value="wa">Subscribed via WhatsApp</option>
                <option value="email">Subscribed via Email</option>
              </select>
            </div>

            {/* Templates picker */}
            <div>
              <label className="text-xs text-gray-500 font-bold mb-1.5 block">Pilih Template Cepat</label>
              <div className="flex flex-wrap gap-1.5">
                {templates.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl.id)}
                    className={`px-3 py-1 rounded-full border text-[10px] font-bold transition ${
                      bcTemplate === tmpl.id
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-white text-gray-500 border-gray-250 hover:bg-gray-50"
                    }`}
                  >
                    {tmpl.name}
                  </button>
                ))}
              </div>
            </div>

            {bcChannel === "Email" && (
              <div>
                <label className="text-xs text-gray-500 font-bold mb-1.5 block">Subjek Email</label>
                <input
                  type="text"
                  value={bcSubject}
                  onChange={(e) => setBcSubject(e.target.value)}
                  placeholder="Masukkan subjek email"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
                />
              </div>
            )}

            <div>
              <label className="text-xs text-gray-500 font-bold mb-1.5 block">Isi Pesan Promosi</label>
              <textarea
                rows={5}
                value={bcMessage}
                onChange={(e) => setBcMessage(e.target.value)}
                placeholder="Tulis pesan Anda. Gunakan {nama} untuk nama customer..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-300 transition resize-none leading-relaxed"
              />
              <p className="text-[9px] text-gray-400 font-medium mt-1">
                * Variable <code className="text-emerald-600 font-bold">{`{nama}`}</code> otomatis disesuaikan dengan nama customer.
              </p>
            </div>
          </div>

          <button
            onClick={handleSendBroadcast}
            disabled={isSending || !bcMessage}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed hover:bg-emerald-600 text-white text-sm font-bold py-2.5 rounded-xl shadow-md transition"
          >
            {isSending ? (
              <>
                <FaSpinner className="animate-spin text-xs" />
                Mengirim ({sendingProgress}%)
              </>
            ) : (
              <>
                <FaPaperPlane className="text-xs" />
                Kirim Blast Promo ({targetCustomers.length} org)
              </>
            )}
          </button>
        </div>
      </div>

      {/* POPUP MODAL: BUAT CAMPAIGN */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddCampaign}
        title="Buat Campaign Pemasaran Baru"
        confirmText="Simpan Campaign"
        confirmColor="bg-emerald-500"
      >
        <div className="space-y-4 text-left">
          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">
              Nama Campaign / Promo <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={newCampName}
              onChange={(e) => setNewCampName(e.target.value)}
              placeholder="cth. Promo Vaksinasi Akbar"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition font-semibold"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">Saluran Media</label>
            <select
              value={newCampChannel}
              onChange={(e) => setNewCampChannel(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition font-semibold"
            >
              <option value="Instagram Ads">Instagram Ads</option>
              <option value="TikTok Ads">TikTok Ads</option>
              <option value="WhatsApp Broadcast">WhatsApp Broadcast</option>
              <option value="Email Newsletter">Email Newsletter</option>
              <option value="Google Ads">Google Ads</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 font-bold mb-1.5 block">
              Anggaran Kampanye (Rp) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={newCampBudget}
              onChange={(e) => setNewCampBudget(e.target.value)}
              placeholder="cth. 2500000"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition font-semibold"
            />
          </div>
        </div>
      </Modal>

      {/* TOAST FEEDBACK ALERT */}
      <ToastNotification
        isVisible={showToast}
        message={toastMessage}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
