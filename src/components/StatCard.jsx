export default function StatCard({ emoji, value, label, badge, badgeBg, badgeText, accentColor }) {
  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group cursor-pointer">
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-2xl transition-all duration-300 group-hover:w-1.5"
        style={{ background: accentColor }}
      />
      <div className="text-2xl mb-2 transition-transform duration-300 group-hover:scale-110 origin-left">{emoji}</div>
      <p className="text-2xl font-semibold text-gray-800 leading-none">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
      {badge && (
        <span
          className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: badgeBg, color: badgeText }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}
