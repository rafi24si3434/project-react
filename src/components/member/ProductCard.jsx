import React from "react";
import { ShoppingCart, Package, AlertCircle } from "lucide-react";

export default function ProductCard({ product, addToCart }) {
  const categoryIcons = {
    "Obat": "💊",
    "Makanan": "🥫",
    "Vitamin": "💉",
    "Alat Medis": "🩺",
    "Aksesoris": "🎾",
    "default": "📦"
  };

  const categoryColors = {
    "Obat": "from-blue-50 to-cyan-50 border-blue-200",
    "Makanan": "from-amber-50 to-orange-50 border-amber-200",
    "Vitamin": "from-emerald-50 to-teal-50 border-emerald-200",
    "Alat Medis": "from-violet-50 to-purple-50 border-violet-200",
    "Aksesoris": "from-rose-50 to-pink-50 border-rose-200"
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-[1.5rem] p-5 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 text-left relative overflow-hidden">
      {/* Background Accent on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/0 group-hover:from-amber-500/5 group-hover:to-orange-500/5 transition-all duration-500 pointer-events-none" />
      
      <div className="space-y-4 relative z-10">
        {/* Product Image Placeholder */}
        <div className={`w-full h-36 bg-gradient-to-br ${categoryColors[product.category] || "from-slate-50 to-gray-50 border-slate-200"} rounded-2xl border flex items-center justify-center text-5xl relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300`}>
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-bold text-slate-600 shadow-sm">
              {product.category}
            </span>
            {isLowStock && (
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-full text-[9px] font-black flex items-center gap-1 shadow-md">
                <AlertCircle className="w-3 h-3" /> Stok Terbatas
              </span>
            )}
          </div>
          {isOutOfStock && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
              <span className="text-white font-black text-sm bg-slate-900/80 px-4 py-2 rounded-xl">HABIS</span>
            </div>
          )}
          <span className="group-hover:scale-110 transition-transform duration-300">
            {categoryIcons[product.category] || categoryIcons.default}
          </span>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-800 text-sm tracking-tight leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed">
            {product.description || "Produk berkualitas untuk anabul kesayangan Anda."}
          </p>
        </div>
      </div>

      {/* Price & Action */}
      <div className="mt-5 space-y-4 relative z-10">
        <div className="flex justify-between items-baseline">
          <div>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Harga</p>
            <span className="text-lg font-black text-slate-800">
              Rp {product.price.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="text-right">
            <p className="text-[9px] text-slate-400 font-bold uppercase">Stok</p>
            <span className={`text-xs font-bold ${isOutOfStock ? "text-rose-500" : isLowStock ? "text-amber-500" : "text-emerald-600"}`}>
              {isOutOfStock ? "Habis" : `${product.stock} ${product.unit}`}
            </span>
          </div>
        </div>

        <button
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 group-hover:from-amber-500 group-hover:to-orange-500 text-slate-700 group-hover:text-white font-bold text-xs shadow-md group-hover:shadow-lg group-hover:shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 border border-slate-200 group-hover:border-transparent"
        >
          <ShoppingCart className="w-4 h-4" />
          {isOutOfStock ? "Stok Habis" : "Tambah ke Keranjang"}
        </button>
      </div>
    </div>
  );
}
