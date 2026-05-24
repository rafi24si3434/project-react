export default function InputField({ label, type, value, onChange, error }) {
  return (
    <div className="mb-4">
      
      {/* LABEL */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* INPUT */}
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2.5 text-sm border rounded-lg transition duration-200 outline-none
        ${error 
          ? "border-red-400 focus:ring-2 focus:ring-red-200" 
          : "border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"}
        `}
      />

      {/* ERROR */}
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}