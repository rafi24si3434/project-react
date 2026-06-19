import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { 
  Search, ShoppingCart, Trash2, Plus, Minus, 
  Package, Tag, Check, ShoppingBag, ArrowRight, X 
} from "lucide-react";
import ToastNotification from "../components/ToastNotification";

export default function Shop() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (profile?.role === "customer") {
      navigate("/member");
    }
  }, [profile, navigate]);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  
  // Cart state: array of { product, quantity }
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setToastMsg("Gagal mengambil data produk.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const list = ["Semua"];
    products.forEach((p) => {
      if (!list.includes(p.category)) {
        list.push(p.category);
      }
    });
    return list;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                            p.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCategory === "Semua" || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, search, selectedCategory]);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      setToastMsg("Stok produk habis!");
      setToastType("error");
      setShowToast(true);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          setToastMsg(`Stok tidak mencukupi (Maksimal ${product.stock} ${product.unit}).`);
          setToastType("error");
          setShowToast(true);
          return prevCart;
        }
        return prevCart.map((item) => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      setToastMsg(`${product.name} ditambahkan ke keranjang.`);
      setToastType("success");
      setShowToast(true);
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, amount) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + amount;
          if (newQty <= 0) return null;
          if (newQty > item.product.stock) {
            setToastMsg(`Stok tidak mencukupi.`);
            setToastType("error");
            setShowToast(true);
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    setToastMsg("Produk dihapus dari keranjang.");
    setToastType("success");
    setShowToast(true);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const cartItemsCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);

    try {
      // 1. Verify latest stock for each item in Supabase
      for (const item of cart) {
        const { data: latestProduct, error: pError } = await supabase
          .from("products")
          .select("stock, name")
          .eq("id", item.product.id)
          .single();

        if (pError || !latestProduct) {
          throw new Error(`Gagal memverifikasi stok untuk ${item.product.name}`);
        }

        if (latestProduct.stock < item.quantity) {
          throw new Error(`Stok untuk ${item.product.name} telah habis atau berkurang (Sisa: ${latestProduct.stock}). Silakan sesuaikan keranjang Anda.`);
        }
      }

      // 2. Create Order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: user.id,
          total_amount: cartTotal,
          status: "Pending"
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Create Order Items & Decrement Stock
      for (const item of cart) {
        // Insert order item
        const { error: itemError } = await supabase
          .from("order_items")
          .insert({
            order_id: order.id,
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          });

        if (itemError) throw itemError;

        // Update product stock
        const { error: stockError } = await supabase
          .from("products")
          .update({ stock: item.product.stock - item.quantity })
          .eq("id", item.product.id);

        if (stockError) throw stockError;
      }

      // 4. Log Activity
      try {
        await supabase.from("activity_logs").insert({
          user_id: user.id,
          activity: "Customer Membeli Produk",
          description: `Melakukan checkout order ID ${order.id.slice(0, 8)} dengan total Rp ${cartTotal.toLocaleString("id-ID")}`
        });
      } catch (logErr) {
        console.error("Activity logging failed:", logErr);
      }

      // Success
      setCart([]);
      setIsCartOpen(false);
      setToastMsg("Checkout berhasil! Pesanan Anda sedang diproses.");
      setToastType("success");
      setShowToast(true);

      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        navigate("/orders");
      }, 2000);

    } catch (err) {
      console.error("Checkout failed:", err);
      setToastMsg(err.message || "Checkout gagal. Silakan coba lagi.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-left relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-emerald-500" /> Toko Obat & Produk Hewan
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Belanja obat, makanan premium, dan peralatan medis anabul Anda
          </p>
        </div>
        
        {/* Cart Toggle Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-md hover:shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition duration-300 flex items-center gap-2 group cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4 group-hover:animate-bounce" />
          Keranjang Saya
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-black border-2 border-white animate-pulse">
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>

      {/* Categories & Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10"
                  : "bg-white border-gray-150 text-gray-650 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari makanan, obat, alat medis..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-155 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all bg-white"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-3xl p-5 space-y-4 animate-pulse">
              <div className="w-full h-40 bg-gray-100 rounded-2xl" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-155 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => (
                <div 
                  key={p.id}
                  className="bg-white border border-gray-150 rounded-3xl p-5 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    {/* Placeholder image or product type icon */}
                    <div className="w-full h-40 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-gray-100 flex items-center justify-center text-4xl relative overflow-hidden group-hover:scale-[1.02] transition duration-300">
                      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-gray-100 text-[10px] font-bold text-gray-500">
                        {p.category}
                      </div>
                      {p.category === "Obat" ? "💊" : p.category === "Makanan" ? "🥫" : "🩺"}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-extrabold text-gray-800 text-sm tracking-tight leading-snug group-hover:text-emerald-600 transition">
                        {p.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-medium line-clamp-2">
                        {p.description || "Tidak ada deskripsi produk."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-base font-black text-gray-800">
                        Rp {p.price.toLocaleString("id-ID")}
                      </span>
                      <span className={`text-[10px] font-bold ${p.stock > 10 ? "text-emerald-600" : p.stock > 0 ? "text-amber-500" : "text-rose-500"}`}>
                        {p.stock > 0 ? `Sisa: ${p.stock} ${p.unit}` : "Habis"}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(p)}
                      disabled={p.stock <= 0}
                      className="w-full py-2.5 rounded-xl bg-gray-50 group-hover:bg-emerald-500 text-gray-700 group-hover:text-white font-bold text-xs shadow-sm group-hover:shadow-md group-hover:shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:scale-100 cursor-pointer flex items-center justify-center gap-1.5 border border-gray-150 group-hover:border-transparent"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Beli Sekarang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-150 rounded-[2rem] p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
              <span className="text-4xl block">🔍</span>
              <h3 className="font-extrabold text-gray-800 text-base">Produk Tidak Ditemukan</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Kami tidak menemukan produk matching dengan kata kunci "{search}". Silakan coba kata kunci lain.
              </p>
            </div>
          )}
        </>
      )}

      {/* Cart Drawer Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-in relative">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-5 h-5 text-emerald-500" />
                <h2 className="font-black text-gray-800 text-lg">Keranjang Belanja</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center hover:bg-gray-100 text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Body (Items) */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-3 rounded-2xl border border-gray-100 bg-gray-50/50">
                    <div className="w-16 h-16 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-2xl flex-shrink-0 shadow-sm">
                      {item.product.category === "Obat" ? "💊" : item.product.category === "Makanan" ? "🥫" : "🩺"}
                    </div>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-bold text-gray-800 text-xs truncate leading-snug">{item.product.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-rose-500 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs font-black text-gray-800">
                          Rp {(item.product.price * item.quantity).toLocaleString("id-ID")}
                        </span>

                        <div className="flex items-center gap-2 bg-white border border-gray-150 rounded-lg p-0.5 shadow-sm">
                          <button 
                            onClick={() => updateQuantity(item.product.id, -1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-gray-700 min-w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-gray-500 hover:bg-gray-100 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center space-y-3">
                  <span className="text-4xl block">🛒</span>
                  <h4 className="font-bold text-gray-700 text-sm">Keranjang Anda Kosong</h4>
                  <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
                    Masukkan produk premium pilihan ke keranjang belanja Anda.
                  </p>
                </div>
              )}
            </div>

            {/* Drawer Footer (Summary & Checkout) */}
            <div className="p-6 border-t border-gray-100 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Subtotal:</span>
                <span className="text-2xl font-black text-gray-800">
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
      )}

      {/* Success/Error Toast */}
      <ToastNotification
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        message={toastMsg}
        type={toastType}
      />
    </div>
  );
}
