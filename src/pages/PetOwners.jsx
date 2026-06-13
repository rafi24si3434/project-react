import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaPlus,
  FaPhone,
  FaEnvelope,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { supabase } from "../lib/supabase";

/* IMPORT DATA */

export default function PetOwners() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [view, setView] = useState("grid");
  const [selected, setSelected] = useState(null);

  const [ownerData, setOwnerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchOwnerData = async () => {
      setIsLoading(true);
      try {
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("*")
          .eq("role", "customer")
          .order("created_at", { ascending: false });

        if (usersError) throw usersError;

        const { data: petsData } = await supabase
          .from("pets")
          .select("id, owner_id, name");

        const { data: appData } = await supabase
          .from("appointments")
          .select("id, owner_id");

        const petsMap = {};
        if (petsData) {
          petsData.forEach((p) => {
            if (!petsMap[p.owner_id]) petsMap[p.owner_id] = [];
            petsMap[p.owner_id].push(p.name);
          });
        }

        const appMap = {};
        if (appData) {
          appData.forEach((a) => {
            appMap[a.owner_id] = (appMap[a.owner_id] || 0) + 1;
          });
        }

        const colors = [
          "bg-emerald-100 text-emerald-700",
          "bg-blue-100 text-blue-700",
          "bg-pink-100 text-pink-700",
          "bg-yellow-100 text-yellow-700",
          "bg-purple-100 text-purple-700",
          "bg-indigo-100 text-indigo-700",
          "bg-red-100 text-red-700",
          "bg-teal-100 text-teal-700",
          "bg-orange-100 text-orange-700",
          "bg-cyan-100 text-cyan-700",
        ];

        const getInitials = (name) => {
          if (!name) return "US";
          return name
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
        };

        const mapped = (usersData || []).map((u, index) => {
          const sinceDate = u.created_at
            ? new Date(u.created_at).toLocaleDateString("id-ID", { month: "short", year: "numeric" })
            : "Baru";
          
          return {
            id: u.id,
            auth_user_id: u.auth_user_id,
            name: u.full_name,
            phone: u.phone_number || "-",
            email: u.email,
            address: u.address || "Pekanbaru",
            pets: petsMap[u.auth_user_id] || [],
            totalVisits: appMap[u.auth_user_id] || 0,
            since: sinceDate,
            avatar: getInitials(u.full_name),
            avatarBg: colors[index % colors.length],
          };
        });

        setOwnerData(mapped);
      } catch (err) {
        console.error("Error loading owners from database:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOwnerData();
  }, []);

  useEffect(() => {
    if (ownerData.length > 0) {
      const totalPets = ownerData.reduce((a, o) => a + o.pets.length, 0);
      console.log("[useEffect] Sinkronisasi data owner & pet — Total owner:", ownerData.length, "| Total pet:", totalPets);
    }
  }, [ownerData]);

  useEffect(() => {
    if (!isLoading && searchRef.current) {
      searchRef.current.focus();
      console.log("[useRef] Auto-focus pada kolom pencarian owner");
    }
  }, [isLoading]);

  /* FILTER */
  const filtered = ownerData.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">👨‍👩‍👧</span>

            <h1 className="text-xl font-bold text-gray-800">
              Pet Owners
            </h1>
          </div>

          <p className="text-sm text-gray-400 pl-8">
            {ownerData.length} pemilik terdaftar ·{" "}
            {ownerData.reduce((a, o) => a + o.pets.length, 0)} hewan total
          </p>
        </div>

        <button
          onClick={() => navigate("/pet-owners/add")}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-md shadow-emerald-200 transition"
        >
          <FaPlus className="text-xs" />
          Tambah Pemilik
        </button>

      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-400">Memuat data pemilik...</p>
          </div>
        </div>
      ) : (
        <>
          {/* STATS */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3">

              <span className="text-2xl">👥</span>

              <div>
                <p className="text-xl font-bold text-gray-800">
                  {ownerData.length}
                </p>

                <p className="text-xs text-gray-400">
                  Total Pemilik
                </p>
              </div>

            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-center gap-3">

              <span className="text-2xl">🐾</span>

              <div>
                <p className="text-xl font-bold text-emerald-700">
                  {ownerData.reduce((a, o) => a + o.pets.length, 0)}
                </p>

                <p className="text-xs text-gray-400">
                  Total Hewan
                </p>
              </div>

            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 flex items-center gap-3">

              <span className="text-2xl">📊</span>

              <div>
                <p className="text-xl font-bold text-blue-700">
                  {ownerData.length > 0 ? Math.round(
                    ownerData.reduce((a, o) => a + o.totalVisits, 0) /
                      ownerData.length
                  ) : 0}
                </p>

                <p className="text-xs text-gray-400">
                  Rata-rata Kunjungan
                </p>
              </div>

            </div>

          </div>

          {/* TOOLBAR */}
          <div className="flex gap-3 mb-5">

            <div className="relative flex-1 max-w-sm">

              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />

              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Cari nama atau email..."
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

          {filtered.map((owner) => (

            <div
              key={owner.id}
              onClick={() =>
                setSelected(
                  selected?.id === owner.id ? null : owner
                )
              }
              className={`bg-white rounded-2xl border p-4 cursor-pointer hover:shadow-md transition ${
                selected?.id === owner.id
                  ? "border-emerald-300 ring-2 ring-emerald-100"
                  : "border-gray-100 hover:border-gray-200"
              }`}
            >

              {/* AVATAR */}
              <div className="flex justify-between items-start mb-3">

                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm ${owner.avatarBg}`}
                >
                  {owner.avatar}
                </div>

                <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  Sejak {owner.since}
                </span>

              </div>

              {/* NAME */}
              <h3
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/pet-owners/${owner.id}`);
                }}
                className="font-bold text-gray-800 text-sm mb-0.5 hover:text-emerald-600 transition cursor-pointer"
              >
                {owner.name}
              </h3>

              <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                <FaPhone className="text-[9px]" />
                {owner.phone}
              </p>

              {/* PETS */}
              <div className="flex flex-wrap gap-1 mb-3">

                {owner.pets.map((p, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {p}
                  </span>
                ))}

              </div>

              {/* FOOTER */}
              <div className="border-t border-gray-50 pt-2.5 flex justify-between items-center">

                <div>
                  <p className="text-[10px] text-gray-400">
                    Total Kunjungan
                  </p>

                  <p className="text-sm font-bold text-gray-700">
                    {owner.totalVisits}×
                  </p>
                </div>

                <div className="flex gap-1">

                  {/* DETAIL BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pet-owners/${owner.id}`);
                    }}
                    className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition"
                  >
                    <FaEye className="text-[9px]" />
                  </button>

                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-100 transition"
                  >
                    <FaEdit className="text-[9px]" />
                  </button>

                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="w-7 h-7 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition"
                  >
                    <FaTrash className="text-[9px]" />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      ) : (

        /* LIST VIEW */
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-gray-100">

                {[
                  "Pemilik",
                  "Kontak",
                  "Hewan Peliharaan",
                  "Kunjungan",
                  "Bergabung",
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

              {filtered.map((owner) => (

                <tr
                  key={owner.id}
                  className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition"
                >

                  <td className="px-4 py-3">

                    <div className="flex items-center gap-2">

                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${owner.avatarBg}`}
                      >
                        {owner.avatar}
                      </div>

                      <div>

                        {/* CLICK NAME */}
                        <p
                          onClick={() =>
                            navigate(`/pet-owners/${owner.id}`)
                          }
                          className="font-semibold text-gray-800 hover:text-emerald-600 transition cursor-pointer"
                        >
                          {owner.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {owner.address.substring(0, 30)}...
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-4 py-3">

                    <p className="text-xs text-gray-600 flex items-center gap-1">
                      <FaPhone className="text-[9px] text-gray-400" />
                      {owner.phone}
                    </p>

                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <FaEnvelope className="text-[9px]" />
                      {owner.email}
                    </p>

                  </td>

                  <td className="px-4 py-3">

                    <div className="flex flex-wrap gap-1">

                      {owner.pets.map((p, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {p}
                        </span>
                      ))}

                    </div>

                  </td>

                  <td className="px-4 py-3 font-bold text-gray-700">
                    {owner.totalVisits}×
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-400">
                    {owner.since}
                  </td>

                  <td className="px-4 py-3">

                    <div className="flex gap-1">

                      <button
                        onClick={() =>
                          navigate(`/pet-owners/${owner.id}`)
                        }
                        className="w-7 h-7 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition"
                      >
                        <FaEye className="text-xs" />
                      </button>

                      <button className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-100 transition">
                        <FaEdit className="text-xs" />
                      </button>

                      <button className="w-7 h-7 rounded-lg bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition">
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

      {/* DETAIL PANEL */}
      {selected && (

        <div className="fixed right-6 top-24 w-72 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/60 z-50 overflow-hidden">

          <div className="p-5 border-b border-gray-50">

            <div className="flex justify-between items-start mb-3">

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg ${selected.avatarBg}`}
              >
                {selected.avatar}
              </div>

              <button
                onClick={() => setSelected(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-light"
              >
                ×
              </button>

            </div>

            <h3 className="font-bold text-gray-800">
              {selected.name}
            </h3>

            <p className="text-xs text-gray-400">
              Member sejak {selected.since}
            </p>

          </div>

          <div className="p-5 space-y-3">

            <div>

              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">
                Kontak
              </p>

              <p className="text-xs text-gray-700 flex items-center gap-1.5">
                <FaPhone className="text-gray-400 text-[9px]" />
                {selected.phone}
              </p>

              <p className="text-xs text-gray-700 flex items-center gap-1.5 mt-1">
                <FaEnvelope className="text-gray-400 text-[9px]" />
                {selected.email}
              </p>

            </div>

            <div>

              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">
                Hewan Peliharaan
              </p>

              <div className="flex flex-wrap gap-1">

                {selected.pets.map((p, i) => (
                  <span
                    key={i}
                    className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full"
                  >
                    {p}
                  </span>
                ))}

              </div>

            </div>

            <div>

              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1">
                Alamat
              </p>

              <p className="text-xs text-gray-600 leading-relaxed">
                {selected.address}
              </p>

            </div>

          </div>

        </div>

      )}
        </>
      )}

    </div>
  );
}