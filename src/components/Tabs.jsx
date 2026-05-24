import React from "react";

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="inline-flex bg-gray-100 p-1 rounded-xl">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-white text-emerald-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
