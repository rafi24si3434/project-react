import React from "react";

export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-xs font-semibold text-gray-700">{label}</label>}
      <input 
        className={`w-full px-3 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 transition-shadow ${
          error 
            ? "border-red-300 focus:ring-red-500/20 focus:border-red-500" 
            : "border-gray-200 focus:ring-emerald-500/20 focus:border-emerald-500"
        }`}
        {...props}
      />
      {error && <span className="text-[10px] text-red-500 font-medium mt-0.5">{error}</span>}
    </div>
  );
}
