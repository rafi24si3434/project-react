import { initialCustomers } from "./CustomersData";

const cityOptions = [
  "Jakarta Selatan",
  "Bandung",
  "Surabaya",
  "Jakarta Barat",
  "Depok",
  "Tangerang",
  "Bekasi",
  "Bogor",
  "Semarang",
  "Yogyakarta",
];

const addressOptions = [
  "Jl. Melati No. 12, Pondok Indah",
  "Jl. Anggrek Raya No. 8, Dago",
  "Jl. Kencana Baru No. 21, Pakuwon",
  "Jl. Taman Puri No. 5, Kebon Jeruk",
  "Jl. Kenari Asri No. 17, Margonda",
  "Jl. Cempaka Wangi No. 9, Gading Serpong",
  "Jl. Bintaro Utama No. 14, Bekasi Timur",
  "Jl. Pahlawan No. 33, Baranangsiang",
  "Jl. Pandanaran No. 16, Candisari",
  "Jl. Kaliurang KM 7 No. 4, Sleman",
];

const reviewNotes = [
  "Pelayanan dokter jelas, pemilik merasa tenang saat konsultasi.",
  "Proses checkup rapi dan penjelasan obat mudah dipahami.",
  "Respon admin cepat saat menjadwalkan kunjungan ulang.",
  "Pemeriksaan menyeluruh, cocok untuk pasien yang perlu kontrol rutin.",
  "Owner puas karena jadwal vaksin berikutnya langsung diingatkan.",
];

const complaintNotes = [
  "Pernah komplain antrean kunjungan terlalu lama.",
  "Pernah meminta revisi invoice karena metode pembayaran belum tercatat.",
  "Pernah mengeluhkan perubahan jadwal dokter di hari yang sama.",
];

const doctorNames = [
  "drh. Nisa Putri",
  "drh. Aditya Ramadhan",
  "drh. Citra Maharani",
  "drh. Farhan Akbar",
  "drh. Vania Lestari",
];

function parseCurrency(value) {
  const amount = Number(String(value).replace(/[^\d]/g, ""));
  return Number.isNaN(amount) ? 0 : amount;
}

function slugifyName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/(^\.|\.$)/g, "");
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export const crmCustomers = initialCustomers.map((customer, index) => {
  const city = cityOptions[index % cityOptions.length];
  const address = `${addressOptions[index % addressOptions.length]}, ${city}`;
  const visitHistory = customer.transactions.history?.length
    ? customer.transactions.history.map((visit, visitIndex) => ({
        id: visit.id,
        date: visit.date,
        service: visit.product,
        doctor: doctorNames[(index + visitIndex) % doctorNames.length],
        paymentMethod: visit.method || "Tunai",
        total: visit.total,
      }))
    : [];

  const complaintHistory =
    customer.interactions.complaints > 0
      ? Array.from({ length: customer.interactions.complaints }, (_, complaintIndex) => ({
          id: `${customer.id}-CMP-${complaintIndex + 1}`,
          note: complaintNotes[(index + complaintIndex) % complaintNotes.length],
        }))
      : [];

  const feedbackCount = customer.interactions.feedback || 0;
  const rating =
    feedbackCount === 0 ? 0 : Math.min(5, Math.max(3, Math.ceil(feedbackCount / 3)));

  return {
    ...customer,
    phone: `08${String(1270 + index).padStart(4, "0")}-${String(4300 + index * 7).padStart(4, "0")}-${String(6100 + index * 9).padStart(4, "0")}`,
    email: `${slugifyName(customer.name)}@petowner.id`,
    address,
    city,
    memberStatus: customer.membership.isActive ? "Aktif" : "Tidak Aktif",
    feedbackSummary: `${feedbackCount} review masuk`,
    latestReview:
      feedbackCount === 0
        ? "Belum ada review dari pemilik."
        : reviewNotes[index % reviewNotes.length],
    rating,
    complaintHistory,
    complaintLabel:
      complaintHistory.length === 0
        ? "Tidak ada komplain"
        : `${complaintHistory.length} komplain tercatat`,
    visitHistory,
    visitCount: visitHistory.length,
    paymentMethods: [...new Set(visitHistory.map((visit) => visit.paymentMethod))],
    transactionTotalNumber: parseCurrency(customer.transactions.totalSpent),
    lastLoginLabel: customer.activity.lastLogin,
  };
});

export function getCustomerCrmById(id) {
  return crmCustomers.find((customer) => customer.id === id);
}
