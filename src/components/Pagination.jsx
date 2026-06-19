import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ currentPage, totalPages, onPageChange, totalEntries, entriesPerPage = 10, label = "data" }) {
  if (totalPages <= 1) return null; // hide pagination if only 1 page

  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  const getPageNumbers = () => {
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const pages = [];
    pages.push(1);
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    if (start > 2) {
      pages.push("...");
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (end < totalPages - 1) {
      pages.push("...");
    }
    
    pages.push(totalPages);
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-150 p-4 rounded-3xl shadow-sm mt-6 animate-in fade-in duration-300">
      {totalEntries !== undefined && (
        <div className="text-xs text-gray-500 font-medium text-left">
          Menampilkan <span className="font-bold text-gray-700">{startEntry}</span> -{" "}
          <span className="font-bold text-gray-700">{endEntry}</span> dari{" "}
          <span className="font-bold text-gray-700">{totalEntries}</span> {label}
        </div>
      )}
      
      <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          title="Halaman Sebelumnya"
        >
          <FaChevronLeft className="text-[10px]" />
        </button>

        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`dots-${index}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-xs font-bold">
                ...
              </span>
            );
          }
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                currentPage === page
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                  : "bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-500 disabled:hover:border-gray-200 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          title="Halaman Selanjutnya"
        >
          <FaChevronRight className="text-[10px]" />
        </button>
      </div>
    </div>
  );
}
