export default function PageHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      {/* Left */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard
        </h1>

        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
          <span className="text-gray-500">Dashboard</span>
          <span>/</span>
          <span className="text-gray-400">Order List</span>
        </div>
      </div>

      {/* Right Button */}
      <button className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-xl shadow-sm">
        + Add Button
      </button>
    </div>
  );
}