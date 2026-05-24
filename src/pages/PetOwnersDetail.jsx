import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaw,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import owners from "../data/PetOwners";

export default function PetOwnersDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const owner = owners.find((o) => o.id === Number(id));

  if (!owner) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-700">
          Owner Tidak Ditemukan
        </h1>

        <button
          onClick={() => navigate("/pet-owners")}
          className="mt-5 px-5 py-2 rounded-xl bg-emerald-500 text-white"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate("/pet-owners")}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Pet Owner Details
            </h1>

            <p className="text-sm text-gray-400">
              Informasi lengkap pemilik hewan
            </p>
          </div>

        </div>

        <div className="flex gap-2">

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm transition">
            <FaEdit />
            Edit
          </button>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm transition">
            <FaTrash />
            Hapus
          </button>

        </div>

      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-3 gap-6">

        {/* LEFT CARD */}
        <div className="col-span-1">

          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">

            {/* TOP */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-center">

              <div
                className={`w-32 h-32 mx-auto rounded-3xl flex items-center justify-center text-4xl font-bold shadow-lg bg-white ${owner.avatarBg}`}
              >
                {owner.avatar}
              </div>

              <h2 className="text-2xl font-bold text-white mt-5">
                {owner.name}
              </h2>

              <p className="text-emerald-100 text-sm mt-1">
                Pet Owner
              </p>

            </div>

            {/* BODY */}
            <div className="p-6 space-y-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FaPhone />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Nomor Telepon
                  </p>

                  <p className="font-semibold text-gray-800">
                    {owner.phone}
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FaEnvelope />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Email
                  </p>

                  <p className="font-semibold text-gray-800">
                    {owner.email}
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
                  <FaCalendarAlt />
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Bergabung
                  </p>

                  <p className="font-semibold text-gray-800">
                    {owner.since}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="col-span-2 space-y-6">

          {/* ADDRESS */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">

            <div className="flex items-center gap-2 mb-5">

              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FaMapMarkerAlt />
              </div>

              <div>
                <h3 className="font-bold text-gray-800">
                  Address Information
                </h3>

                <p className="text-xs text-gray-400">
                  Alamat lengkap pemilik
                </p>
              </div>

            </div>

            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="text-sm text-gray-700 leading-relaxed">
                {owner.address}
              </p>
            </div>

          </div>

          {/* PETS */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">

            <div className="flex items-center gap-2 mb-5">

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <FaPaw />
              </div>

              <div>
                <h3 className="font-bold text-gray-800">
                  Pets Information
                </h3>

                <p className="text-xs text-gray-400">
                  Daftar hewan peliharaan
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-4">

              {owner.pets.map((pet, index) => (

                <div
                  key={index}
                  className="bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 rounded-2xl p-4 transition"
                >

                  <div className="flex items-center justify-between mb-3">

                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-sm">
                      🐾
                    </div>

                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                      Active
                    </span>

                  </div>

                  <h4 className="font-bold text-gray-800">
                    {pet}
                  </h4>

                  <p className="text-xs text-gray-400 mt-1">
                    Registered Pet
                  </p>

                </div>

              ))}

            </div>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-4">

            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">

              <p className="text-xs text-gray-400 mb-2">
                Total Pets
              </p>

              <h2 className="text-3xl font-bold text-emerald-600">
                {owner.pets.length}
              </h2>

            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">

              <p className="text-xs text-gray-400 mb-2">
                Total Visits
              </p>

              <h2 className="text-3xl font-bold text-blue-600">
                {owner.totalVisits}
              </h2>

            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm">

              <p className="text-xs text-gray-400 mb-2">
                Member Since
              </p>

              <h2 className="text-2xl font-bold text-pink-600">
                {owner.since}
              </h2>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}