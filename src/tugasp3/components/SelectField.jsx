export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  error,
  options = [],
}) {
  return (
    <div className="mb-4">

      {/* LABEL */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* INPUT / SELECT */}
      {options.length > 0 ? (
        <select
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition
          ${error
            ? "border-red-400 focus:ring-2 focus:ring-red-200"
            : "border-gray-300 focus:ring-2 focus:ring-gray-200"}
          `}
        >
          <option value="">-- Pilih --</option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition
          ${error
            ? "border-red-400 focus:ring-2 focus:ring-red-200"
            : "border-gray-300 focus:ring-2 focus:ring-gray-200"}
          `}
        />
      )}

      {/* ERROR */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}