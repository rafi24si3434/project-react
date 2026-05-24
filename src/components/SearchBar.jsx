import { FiSearch } from "react-icons/fi";

export default function SearchBar({ placeholder, value, onChange }) {
  return (
    <div className="relative flex items-center">
      <FiSearch className="absolute left-3 text-gray-400" size={14} />
      <input
        type="text"
        placeholder={placeholder || "Cari data..."}
        value={value}
        onChange={onChange}
        className="pl-9 pr-4 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all w-48 focus:w-64 shadow-sm"
      />
    </div>
  );
}
