import React from "react";
import { ShoppingCart, X, Trash2, Minus, Plus, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

export default function CartDrawer({ isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity, cartTotal, handleCheckout, checkoutLoading }) {
  if (!isCartOpen) return null;

  const categoryIcons = {
    "Obat": "💊",
    "Makanan": "🥫",
    "Vitamin": "💉",
    "Alat Medis": "🩺",
    "Aksesoris": "🎾",
    "default": "📦"
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pointsEarned = Math.floor(cartTotal / 10000);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-md flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-gradient-to-b from-white via-slate-50/30 to-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 relative text-left">
        
        {/* Drawer Header */}
        <div className="relative overflow-hidden p-6 border-b border-slate-200/50 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/5 rounded-full blur-xl" />
          </div>
          <div className="relative z-10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-black text-white text-lg">Keranjang</h2>
                <p className="text-emerald-100 text-xs font-medium">{totalItems} item</p>
              </div>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all duration-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body (Items) */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.product.id} className="group flex gap-4 p-4 rounded-2xl border border-slate-200/50 bg-white shadow-md hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-50 to-gray-100 border border-slate-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                  {categoryIcons[item.product.category] || categoryIcons.default}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm truncate leading-snug">{item.product.name}</h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{item.product.category}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm font-black text-slate-800">
                      Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
                    </span>

                    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 shadow-inner">
                      <button 
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-800 cursor-pointer font-bold transition-all shadow-sm"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold text-slate-800 min-w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:text-slate-800 cursor-pointer font-bold transition-all shadow-sm"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-4 py-12">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-gray-100 flex items-center justify-center text-4xl shadow-lg">
                <ShoppingBag className="w-10 h-10 text-slate-300" />
              </div>
              <div>
                <h4 className="font-bold text-slate-700 text-base">Keranjang Kosong</h4>
                <p className="text-sm text-slate-400 max-w-[200px] leading-relaxed font-medium mt-2">
                  Yuk mulai belanja produk untuk anabul kesayangan Anda!
                </p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold shadow-lg cursor-pointer"
              >
                Mulai Belanja
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer (Summary & Checkout) */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-200/50 space-y-4 bg-white/90 backdrop-blur-xl">
            {/* Points Earned */}
            <div className="flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="text-xs font-bold text-amber-700">Poin yang didapat</span>
              </div>
              <span className="text-sm font-black text-amber-600">+{pointsEarned} Poin</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pembayaran</span>
              <span className="text-2xl font-black text-slate-800">
                Rp {cartTotal.toLocaleString("id-ID")}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:scale-100 cursor-pointer flex items-center justify-center gap-2"
            >
              {checkoutLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Memproses Transaksi...</span>
                </>
              ) : (
                <>
                  Checkout Sekarang <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
