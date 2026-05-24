import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-gray-500 mt-2">
        Halaman yang kamu cari tidak ditemukan
      </p>

      <Link
        to="/"
        className="mt-6 bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition"
      >
        Kembali ke Dashboard
      </Link>
    </div>
  );
}