import React from "react";
import { ChevronUp, ChevronDown, FileText } from "lucide-react";

export default function InvoiceCard({ order, isExpanded, setExpandedOrderId }) {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition text-left">
      {/* Invoice Slip Style Header */}
      <div
        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
        className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 cursor-pointer hover:bg-slate-50/30 transition"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm shadow-sm font-extrabold shrink-0">
              INV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">No. Invoice:</span>
                <span className="text-xs font-black text-slate-850 font-mono tracking-wider">{order.id.slice(0, 8).toUpperCase()}-PET</span>
                <span className={`inline-flex text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  order.status === "Paid" || order.status === "Completed"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : order.status === "Cancelled"
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-amber-50 text-amber-600 border border-amber-100"
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold pl-11">
            Tanggal Beli: {new Date(order.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })} WIB
          </p>
        </div>

        <div className="flex items-center gap-4 self-end sm:self-center">
          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-400 uppercase leading-none">Jumlah Belanja</p>
            <p className="text-base font-black text-slate-850 mt-1">Rp {Number(order.total_amount).toLocaleString("id-ID")}</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-450 shadow-inner">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* serrated details */}
      {isExpanded && (
        <div className="bg-slate-50/60 px-6 py-6 border-t border-dashed border-slate-200 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Rincian Item</span>
            <span>Subtotal</span>
          </div>
          
          <div className="divide-y divide-slate-150 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {order.order_items?.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-base">
                    💊
                  </div>
                  <div>
                    <p className="text-slate-800 font-extrabold">{item.products?.name || "Obat Klinik"}</p>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{item.products?.category || "Medikasi"}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-slate-550 font-semibold">{item.quantity} Pcs &times; Rp {Number(item.price).toLocaleString("id-ID")}</p>
                  <p className="text-slate-850 font-black mt-0.5">Rp {(item.quantity * Number(item.price)).toLocaleString("id-ID")}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary footer for slip */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200 text-xs">
            <span className="font-extrabold text-slate-500 flex items-center gap-1.5"><FileText className="w-4 h-4" /> Poin didapat</span>
            <span className="font-black text-emerald-600">+{Math.floor(Number(order.total_amount) / 10000)} Poin</span>
          </div>
        </div>
      )}
    </div>
  );
}
