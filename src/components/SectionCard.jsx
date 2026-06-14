import React from "react";

export default function SectionCard({ icon: Icon, title, subtitle, iconClassName = "", children, className = "" }) {
  return (
    <section className={`rounded-3xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="mb-5 flex items-center gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-50 transition-colors duration-300 ${iconClassName}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-800 tracking-tight">{title}</h2>
          <p className="text-xs text-gray-400 font-medium">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
