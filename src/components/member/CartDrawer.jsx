import React from "react";
import { ShoppingCart, X, Trash2, Minus, Plus, ArrowRight } from "lucide-react";

export default function CartDrawer({ isCartOpen, setIsCartOpen, cart, removeFromCart, updateQuantity, cartTotal, handleCheckout, checkoutLoading }) {
  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-in relative text-left">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <ShoppingCart className="w-5 h-5 text-emerald-500" />
            <h2 className="font-black text-slate-800 text-lg">Keranjang Belanja</h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-500 cursor-pointer shadow-sm font-bold text-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body (Items) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-3.5 rounded-2xl border border-slate-150 bg-slate-50/50">
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                  {item.product.category === "Obat" ? "💊" : item.product.category === "Makanan" ? "🥫" : "🩺"}
                </div>
                
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-1">
                    <h4 className="font-bold text-slate-800 text-xs truncate leading-snug">{item.product.name}</h4>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-500 p-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-black text-slate-800">
                      Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
                    </span>

                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                      <button 
                        onClick={() => updateQuantity(item.product.id, -1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer font-bold"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-xs font-bold text-slate-700 min-w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer font-bold"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col justify-center items-center text-center space-y-3">
              <span className="text-4xl block">🛒</span>
              <h4 className="font-bold text-slate-700 text-sm">Keranjang Anda Kosong</h4>
              <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed font-semibold">
                Masukkan produk pilihan ke keranjang belanja Anda.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer (Summary & Checkout) */}
        <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/50">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subtotal:</span>
            <span className="text-xl font-black text-slate-800">
              Rp {cartTotal.toLocaleString("id-ID")}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || checkoutLoading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-md hover:shadow-lg shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99] transition duration-300 disabled:opacity-50 disabled:scale-100 cursor-pointer flex items-center justify-center gap-2"
          >
            {checkoutLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Memproses Transaksi...</span>
              </>
            ) : (
              <>
                Checkout Sekarang <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
