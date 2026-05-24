import React from "react";

export default function Alert({ title, message, type = "info" }) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  };

  return (
    <div className={`p-4 rounded-xl border ${styles[type]}`}>
      {title && <h4 className="text-sm font-bold mb-1">{title}</h4>}
      <p className="text-xs font-medium opacity-90">{message}</p>
    </div>
  );
}
