import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#F3F4F6]">

      {/* SIDEBAR */}
      <aside className="fixed top-0 left-0 w-64 h-screen bg-white border-r border-gray-200 z-40">
        <Sidebar />
      </aside>

      {/* CONTENT */}
      <div className="ml-64 min-h-screen flex flex-col">

        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <Header />
        </header>

        {/* PAGE */}
        <main className="flex-1 w-full overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            <Outlet />
          </div>
        </main>

      </div>

    </div>
  );
}