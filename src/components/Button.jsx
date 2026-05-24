import React from "react";
import Spinner from "./Spinner";

export default function Button({ children, variant = "primary", isLoading = false, className = "", ...props }) {
  const baseStyle = "flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm hover:shadow-md",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} disabled={isLoading} {...props}>
      {isLoading && <Spinner className="w-4 h-4 text-current" />}
      {children}
    </button>
  );
}
