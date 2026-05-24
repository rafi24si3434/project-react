import { FaBell, FaSearch } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";

export default function Header() {
  return (
    <div className="flex justify-between items-center bg-[#F8F9FB] px-6 py-4">
      {/* Search */}
      <div className="relative w-[420px]">
        <input
          type="text"
          placeholder="Search Here..."
          className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
        />
        <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <div className="relative bg-blue-100 p-2 rounded-xl cursor-pointer">
          <FaBell className="text-blue-600" />
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[10px] px-1.5 rounded-full">
            50
          </span>
        </div>

        {/* Chart */}
        <div className="bg-gray-100 p-2 rounded-xl cursor-pointer">
          <FcAreaChart />
        </div>

        {/* Settings */}
        <div className="bg-red-100 p-2 rounded-xl cursor-pointer">
          <SlSettings className="text-red-500" />
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3 ml-2">
          <span className="text-sm text-gray-600">
            Hello, <b className="text-gray-800">Muhammad Rafi</b>
          </span>
          <img
            src="/img/rafijelek.jpeg"
            className="w-11 h-12 rounded-full"
          />

          {/* More */}
          <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white cursor-pointer">
            ...
          </div>
        </div>
      </div>
    </div>
  );
}