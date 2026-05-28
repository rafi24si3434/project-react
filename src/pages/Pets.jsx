import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import petsData from "../data/Pets";

export default function Pets() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");

  const filtered = petsData.filter((pet) =>
    pet.name.toLowerCase().includes(search.toLowerCase()) ||
    pet.owner.toLowerCase().includes(search.toLowerCase()) ||
    pet.type.toLowerCase().includes(search.toLowerCase())
  );

  const getPetEmoji = (type) => {
    switch (type) {
      case "Dog":
        return "🐶";
      case "Cat":
        return "🐱";
      case "Rabbit":
        return "🐰";
      case "Bird":
        return "🦜";
      case "Hamster":
        return "🐹";
      default:
        return "🐾";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🐾</span>

            <h1 className="text-xl font-bold text-gray-800">
              Pets Management
            </h1>
          </div>

          <p className="text-sm text-gray-400 pl-8">
            {petsData.length} pets terdaftar
          </p>
        </div>

        <button
          onClick={() => navigate("/pets/add")}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-md shadow-emerald-200 transition"
        >
          <FaPlus className="text-xs" />
          Tambah Pet
        </button>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🐾</span>

          <div>
            <p className="text-xl font-bold text-gray-800">
              {petsData.length}
            </p>

            <p className="text-xs text-gray-400">
              Total Pets
            </p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🐱</span>

          <div>
            <p className="text-xl font-bold text-emerald-700">
              {petsData.filter((p) => p.type === "Cat").length}
            </p>

            <p className="text-xs text-gray-400">
              Total Cats
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🐶</span>

          <div>
            <p className="text-xl font-bold text-blue-700">
              {petsData.filter((p) => p.type === "Dog").length}
            </p>

            <p className="text-xs text-gray-400">
              Total Dogs
            </p>
          </div>
        </div>

      </div>

      {/* TOOLBAR */}
      <div className="flex gap-3 mb-5">

        <div className="relative flex-1 max-w-sm">

          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Cari pet..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 transition"
          />

        </div>

        <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 ml-auto">

          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1.5 rounded-lg text-xs transition ${
              view === "grid"
                ? "bg-gray-100 text-gray-700"
                : "text-gray-400"
            }`}
          >
            Grid
          </button>

          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 rounded-lg text-xs transition ${
              view === "list"
                ? "bg-gray-100 text-gray-700"
                : "text-gray-400"
            }`}
          >
            List
          </button>

        </div>

      </div>

      {/* GRID VIEW */}
      {view === "grid" ? (

        <div className="grid grid-cols-4 gap-4">

          {filtered.map((pet) => (

            <div
              key={pet.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-lg hover:border-emerald-200 transition cursor-pointer"
            >

              {/* ICON */}
              <div className="flex justify-between items-start mb-4">

                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl">
                  {getPetEmoji(pet.type)}
                </div>

                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
                  {pet.gender}
                </span>

              </div>

              {/* PET NAME */}
              <h2
                onClick={() => navigate(`/pets/${pet.id}`)}
                className="font-bold text-gray-800 text-lg hover:text-emerald-600 transition cursor-pointer"
              >
                {pet.name}
              </h2>

              <p className="text-xs text-gray-400 mb-4">
                {pet.breed}
              </p>

              {/* DETAIL */}
              <div className="space-y-2 mb-4">

                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">
                    Type
                  </span>

                  <span className="font-medium text-gray-700">
                    {pet.type}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">
                    Age
                  </span>

                  <span className="font-medium text-gray-700">
                    {pet.age} Tahun
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">
                    Owner
                  </span>

                  <span className="font-medium text-gray-700">
                    {pet.owner}
                  </span>
                </div>

              </div>

              {/* ACTION */}
              <div className="border-t border-gray-100 pt-3 flex justify-end gap-2">
                
                <Dialog>
                  <DialogTrigger className="bg-emerald-500 text-white px-4 py-1.5 text-xs font-medium rounded-xl hover:bg-emerald-600 transition">
                    Detail Pet
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Detail Hewan</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 mt-4">
                      <p><strong>Nama :</strong> {pet.name}</p>
                      <p><strong>Jenis :</strong> {pet.type}</p>
                      <p><strong>Umur :</strong> {pet.age} Tahun</p>
                      <p><strong>Pemilik :</strong> {pet.owner}</p>
                    </div>
                  </DialogContent>
                </Dialog>

                <button className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-100 transition">
                  <FaEdit className="text-xs" />
                </button>

                <button className="w-8 h-8 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition">
                  <FaTrash className="text-xs" />
                </button>

              </div>

            </div>

          ))}

        </div>

      ) : (

        /* LIST VIEW */
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-gray-100 bg-gray-50">

                {[
                  "Pet",
                  "Type",
                  "Breed",
                  "Age",
                  "Owner",
                  "Aksi",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3"
                  >
                    {h}
                  </th>
                ))}

              </tr>

            </thead>

            <tbody>

              {filtered.map((pet) => (

                <tr
                  key={pet.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition"
                >

                  <td
                    onClick={() => navigate(`/pets/${pet.id}`)}
                    className="px-4 py-4 cursor-pointer"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl">
                        {getPetEmoji(pet.type)}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-800 hover:text-emerald-600 transition">
                          {pet.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {pet.gender}
                        </p>
                      </div>

                    </div>

                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {pet.type}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {pet.breed}
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {pet.age} Tahun
                  </td>

                  <td className="px-4 py-4 text-gray-600">
                    {pet.owner}
                  </td>

                  <td className="px-4 py-4">

                    <div className="flex gap-2 items-center">

                      <Dialog>
                        <DialogTrigger className="bg-emerald-500 text-white px-3 py-1.5 text-xs font-medium rounded-xl hover:bg-emerald-600 transition">
                          Detail Pet
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detail Hewan</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3 mt-4">
                            <p><strong>Nama :</strong> {pet.name}</p>
                            <p><strong>Jenis :</strong> {pet.type}</p>
                            <p><strong>Umur :</strong> {pet.age} Tahun</p>
                            <p><strong>Pemilik :</strong> {pet.owner}</p>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <button className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-100 transition">
                        <FaEdit className="text-xs" />
                      </button>

                      <button className="w-8 h-8 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition">
                        <FaTrash className="text-xs" />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}