import Sidebar from "../layouts/Sidebar";
import Header from "../layouts/Header";
import PageHeader from "../components/PageHeader";
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";

function Card({ icon, value, label, bg }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4">
      <div className={`w-12 h-12 flex items-center justify-center rounded-full ${bg} text-white text-lg`}>
        {icon}
      </div>

      <div>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
        <p className="text-sm text-gray-400">{label}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="flex bg-[#F3F4F6] min-h-screen">
      <Sidebar />

      <div className="flex-1">
        <Header />

        <div className="px-6 py-5">
          <PageHeader />

          <div className="grid grid-cols-4 gap-5 mt-4">
            <Card
              icon={<FaShoppingCart />}
              value="75"
              label="Total Orders"
              bg="bg-green-500"
            />

            <Card
              icon={<FaTruck />}
              value="175"
              label="Total Delivered"
              bg="bg-blue-500"
            />

            <Card
              icon={<FaBan />}
              value="40"
              label="Total Canceled"
              bg="bg-red-500"
            />

            <Card
              icon={<FaDollarSign />}
              value="Rp.128"
              label="Total Revenue"
              bg="bg-yellow-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
