import React from "react";
import { ChevronUp, ChevronDown, FileText, ShoppingBag, CheckCircle, XCircle, Clock, Sparkles } from "lucide-react";

export default function InvoiceCard({ order, isExpanded, setExpandedOrderId }) {
  const statusConfig = {
    Paid: { icon: CheckCircle, color: "from-emerald-500 to-teal-500", bg: "from-emerald-50 to-teal-50", border: "border-emerald-200", text: "text-emerald-600", label: "Lunas" },
    Completed: { icon: CheckCircle, color: "from-emerald-500 to-teal-500", bg: "from-emerald-50 to-teal-50", border: "border-emerald-200", text: "text-emerald-600", label: "Selesai" },
    Processing: { icon: Clock, color: "from-blue-500 to-cyan-500", bg: "from-blue-50 to-cyan-50", border: "border-blue-200", text: "text-blue-600", label: "Diproses" },
    Pending: { icon: Clock, color: "from-amber-500 to-orange-500", bg: "from-amber-50 to-orange-50", border: "border-amber-200", text: "text-amber-600", label: "Menunggu" },
    Cancelled: { icon: XCircle, color: "from-rose-500 to-pink-500", bg: "from-rose-50 to-pink-50", border: "border-rose-200", text: "text-rose-600", label: "Dibatalkan" }
  };

  const config = statusConfig[order.status] || statusConfig.Pending;
  const StatusIcon = config.icon;
  const pointsEarned = Math.floor(Number(order.total_amount) / 10000);

  return (
    <div className="group bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/50 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 text-left">
      {/* Invoice Header */}
      <div
        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
        className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 cursor-pointer hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-gray-50/50 transition-all duration-300 relative overflow-hidden"
      >
        {/* Background Accent */}
        <div className={`absolute inset-0 bg-gradient-to-r ${config.bg} opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none`} />
        
        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-4">
            {/* Invoice Badge */}
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${config.color} text-white flex items-center justify-center shadow-lg`}>
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">No. Invoice:</span>
                <span className="text-xs font-black text-slate-800 font-mono tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                  #{order.id.slice(0, 8).toUpperCase()}-PET
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1 rounded-full bg-gradient-to-r ${config.color} text-white shadow-md`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {config.label}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium pl-16">
            📅 {new Date(order.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })} WIB
          </p>
        </div>

        <div className="flex items-center gap-5 self-end sm:self-center relative z-10">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Belanja</p>
            <p className="text-xl font-black text-slate-800 mt-1">Rp {Number(order.total_amount).toLocaleString("id-ID")}</p>
          </div>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.bg} border ${config.border} flex items-center justify-center ${config.text} shadow-md group-hover:scale-110 transition-transform duration-300`}>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="bg-gradient-to-b from-slate-50/80 to-gray-50/80 px-6 py-6 border-t border-slate-200/50 space-y-5 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>📦 Rincian Item</span>
            <span>Subtotal</span>
          </div>
          
          <div className="divide-y divide-slate-100 bg-white rounded-2xl overflow-hidden shadow-md border border-slate-200">
            {order.order_items?.map((item, idx) => (
              <div key={item.id} className="p-4 flex items-center justify-between text-sm group/item hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-indigo-100 border border-violet-200 rounded-xl flex items-center justify-center text-lg font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-slate-800 font-bold">{item.products?.name || "Produk Klinik"}</p>
                    <span className="text-[11px] text-slate-500 font-medium">{item.products?.category || "Kategori"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 font-medium text-xs">{item.quantity} {item.products?.unit || "pcs"} × Rp {Number(item.price).toLocaleString("id-ID")}</p>
                  <p className="text-slate-800 font-black mt-0.5">Rp {(item.quantity * Number(item.price)).toLocaleString("id-ID")}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Points Earned */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm text-slate-600 font-bold">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <span>Poin yang didapat</span>
            </div>
            <span className="text-base font-black text-amber-600 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-1.5 rounded-xl border border-amber-200">
              +{pointsEarned} Poin
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
