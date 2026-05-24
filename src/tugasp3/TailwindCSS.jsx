import UserForm from "./UserForm";

export default function TailwindCSS() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-6">

      <div className="w-full max-w-lg">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-wide">
            Formulir Data Pengguna
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Silakan isi informasi dengan benar dan lengkap
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">

          <UserForm />

        </div>

        {/* FOOTER */}
        <div className="text-center mt-6 text-xs text-gray-400">
          © 2026 Muhammad Rafi. All rights reserved.
        </div>

      </div>

    </div>
  );
}