import { FaThLarge, FaList, FaHeadphones } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#F8F9FB] flex flex-col justify-between px-6 py-6">
      {/* Logo */}
      <div>
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-800">
            Sedap<span className="text-green-500">.</span>
          </h1>
          <p className="text-sm text-gray-400">Modern Admin Dashboard</p>
        </div>

        {/* Menu */}
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-center gap-3 bg-white shadow-sm px-4 py-3 rounded-xl font-medium">
            <FaThLarge className="text-gray-500" />
            Dashboard
          </li>

          <li className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer">
            <FaList className="text-gray-400" />
            Orders
          </li>

          <li className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white hover:shadow-sm cursor-pointer">
            <FaHeadphones className="text-gray-400" />
            Customers
          </li>
        </ul>
      </div>

      {/* Footer */}
      <div>
        <div className="bg-green-500 rounded-2xl p-4 text-white flex justify-between items-center">
          <div>
            <p className="text-sm leading-tight">
              Please organize your menus through button below!
            </p>
            <button className="mt-3 bg-white text-green-600 text-sm px-3 py-1 rounded-lg">
              + Add Menus
            </button>
          </div>
          <img
            src="/img/cs2.png"
            className="w-18 h-18 rounded-full"
          />
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Sedap Restaurant Admin Dashboard
        </p>
        <p className="text-xs text-gray-300">© 2025 All Right Reserved</p>
      </div>
    </div>
  );
}