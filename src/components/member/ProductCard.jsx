import React from "react";
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product, addToCart }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] p-5 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group text-left">
      <div className="space-y-4">
        <div className="w-full h-40 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-slate-100 flex items-center justify-center text-4xl relative overflow-hidden group-hover:scale-[1.02] transition duration-300">
          <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-slate-100 text-[10px] font-bold text-slate-500">
            {product.category}
          </div>
          {product.category === "Obat" ? "💊" : product.category === "Makanan" ? "🥫" : "🩺"}
        </div>

        <div className="space-y-1">
          <h3 className="font-extrabold text-slate-800 text-sm tracking-tight leading-snug group-hover:text-emerald-600 transition">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-450 font-medium line-clamp-2">
            {product.description || "Tidak ada deskripsi produk."}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="flex justify-between items-baseline">
          <span className="text-base font-black text-slate-800">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
          <span className={`text-[10px] font-bold ${product.stock > 10 ? "text-emerald-600" : product.stock > 0 ? "text-amber-500" : "text-rose-500"}`}>
            {product.stock > 0 ? `Sisa: ${product.stock} ${product.unit}` : "Habis"}
          </span>
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock <= 0}
          className="w-full py-2.5 rounded-xl bg-slate-50 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-500 text-slate-700 group-hover:text-white font-bold text-xs shadow-sm group-hover:shadow-md group-hover:shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:scale-100 cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200 group-hover:border-transparent"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Beli Sekarang
        </button>
      </div>
    </div>
  );
}
