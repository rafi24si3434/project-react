import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaUser,
  FaPaw,
  FaBirthdayCake,
  FaVenusMars,
  FaShieldAlt,
} from "react-icons/fa";

import petsData from "../data/Pets";

export default function PetsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const pet = petsData.find((p) => p.id === Number(id));

  if (!pet) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-gray-700">
          Pet Tidak Ditemukan
        </h1>

        <button
          onClick={() => navigate("/pets")}
          className="mt-5 px-5 py-2 rounded-xl bg-emerald-500 text-white"
        >
          Kembali
        </button>
      </div>
    );
  }

  const petEmoji =
    pet.type === "Dog"
      ? "🐶"
      : pet.type === "Cat"
      ? "🐱"
      : pet.type === "Rabbit"
      ? "🐰"
      : pet.type === "Bird"
      ? "🦜"
      : pet.type === "Hamster"
      ? "🐹"
      : "🐾";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-4">

          <button
            onClick={() => navigate("/pets")}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Pet Details
            </h1>

            <p className="text-sm text-gray-400">
              Detail informasi hewan peliharaan
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

      {/* MAIN CARD */}
      <div className="grid grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="col-span-1">

          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">

            {/* TOP */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-8 text-center">

              <div className="w-32 h-32 mx-auto rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center text-6xl shadow-lg">
                {petEmoji}
              </div>

              <h2 className="text-2xl font-bold text-white mt-5">
                {pet.name}
              </h2>

              <p className="text-emerald-100 text-sm mt-1">
                {pet.breed}
              </p>

            </div>

            {/* BODY */}
            <div className="p-6">

              <div className="space-y-4">

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <FaPaw />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Jenis Hewan
                    </p>

                    <p className="font-semibold text-gray-800">
                      {pet.type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FaBirthdayCake />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Umur
                    </p>

                    <p className="font-semibold text-gray-800">
                      {pet.age} Tahun
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center">
                    <FaVenusMars />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Gender
                    </p>

                    <p className="font-semibold text-gray-800">
                      {pet.gender}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <FaShieldAlt />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Status
                    </p>

                    <p className="font-semibold text-gray-800">
                      Healthy
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="col-span-2 space-y-6">

          {/* OWNER CARD */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">

            <div className="flex items-center gap-2 mb-5">

              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FaUser />
              </div>

              <div>
                <h3 className="font-bold text-gray-800">
                  Owner Information
                </h3>

                <p className="text-xs text-gray-400">
                  Informasi pemilik hewan
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-5">

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">
                  Nama Pemilik
                </p>

                <p className="font-semibold text-gray-800">
                  {pet.owner}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-xs text-gray-400 mb-1">
                  ID Pet
                </p>

                <p className="font-semibold text-gray-800">
                  #{pet.id}
                </p>
              </div>

            </div>

          </div>

          {/* MEDICAL CARD */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">

            <div className="flex items-center gap-2 mb-5">

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                🩺
              </div>

              <div>
                <h3 className="font-bold text-gray-800">
                  Medical Record
                </h3>

                <p className="text-xs text-gray-400">
                  Riwayat kesehatan hewan
                </p>
              </div>

            </div>

            <div className="space-y-4">

              <div className="flex justify-between items-center bg-emerald-50 border border-emerald-100 rounded-2xl p-4">

                <div>
                  <p className="font-semibold text-emerald-700">
                    Vaccination
                  </p>

                  <p className="text-xs text-gray-500">
                    Vaccine completed
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                  Completed
                </span>

              </div>

              <div className="flex justify-between items-center bg-amber-50 border border-amber-100 rounded-2xl p-4">

                <div>
                  <p className="font-semibold text-amber-700">
                    Regular Checkup
                  </p>

                  <p className="text-xs text-gray-500">
                    Last check 2 weeks ago
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                  Pending
                </span>

              </div>

              <div className="flex justify-between items-center bg-blue-50 border border-blue-100 rounded-2xl p-4">

                <div>
                  <p className="font-semibold text-blue-700">
                    Grooming
                  </p>

                  <p className="text-xs text-gray-500">
                    Monthly grooming schedule
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                  Active
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}