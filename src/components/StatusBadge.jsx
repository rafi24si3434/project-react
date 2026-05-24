export default function StatusBadge({ status }) {
  const styles = {
    Selesai: "bg-green-100 text-green-800 border-green-200",
    Proses: "bg-blue-100 text-blue-800 border-blue-200",
    Antri: "bg-amber-100 text-amber-800 border-amber-200",
  };
  return (
    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}
