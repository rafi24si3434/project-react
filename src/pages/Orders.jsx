import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { 
  ClipboardList, Calendar, DollarSign, Clock, 
  ChevronDown, ChevronUp, Package, ShoppingCart 
} from "lucide-react";
import ToastNotification from "../components/ToastNotification";

export default function Orders() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  useEffect(() => {
    if (profile?.role === "customer") {
      navigate("/member");
    }
  }, [profile, navigate]);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // Notification toast
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch orders with nested items and product names
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            product_id,
            products (
              name,
              category
            )
          )
        `)
        .eq("customer_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setToastMsg("Gagal memuat riwayat pesanan.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-50 text-green-700 border border-green-200";
      case "Processing":
        return "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse";
      case "Paid":
        return "bg-indigo-50 text-indigo-700 border border-indigo-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border border-amber-200";
      case "Cancelled":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border border-gray-250";
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "Pending": return "Menunggu Verifikasi";
      case "Paid": return "Sudah Dibayar";
      case "Processing": return "Diproses Klinik";
      case "Completed": return "Selesai";
      case "Cancelled": return "Dibatalkan";
      default: return status;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-left">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
          <ClipboardList className="w-7 h-7 text-emerald-500" /> Riwayat Pesanan Saya
        </h1>
        <p className="text-sm text-gray-400 font-medium mt-1">
          Pantau status pemesanan produk dan obat untuk anabul Anda
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-150 rounded-2xl p-6 h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const dateString = new Date(order.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div 
                    key={order.id}
                    className="bg-white border border-gray-150 rounded-2xl shadow-sm hover:shadow-md transition duration-300 overflow-hidden"
                  >
                    {/* Order summary header card */}
                    <div 
                      onClick={() => toggleExpandOrder(order.id)}
                      className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-gray-50/50 transition duration-200"
                    >
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                          <p className="text-xs font-black text-emerald-600 mt-0.5">#{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tanggal Pemesanan</p>
                          <p className="text-xs font-bold text-gray-700 mt-0.5 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" /> {dateString}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Belanja</p>
                          <p className="text-xs font-extrabold text-gray-800 mt-0.5">
                            Rp {order.total_amount.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${getStatusStyle(order.status)}`}>
                          {translateStatus(order.status)}
                        </span>
                        
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Order Details Panel */}
                    {isExpanded && (
                      <div className="px-5 pb-5 border-t border-gray-100 bg-gray-50/30">
                        <div className="py-4">
                          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            <Package className="w-4 h-4 text-emerald-500" /> Rincian Produk
                          </h4>
                          
                          <div className="space-y-3">
                            {order.order_items?.map((item) => (
                              <div 
                                key={item.id}
                                className="flex justify-between items-center bg-white border border-gray-100 p-3.5 rounded-xl shadow-inner"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">
                                    {item.products?.category === "Obat" ? "💊" : item.products?.category === "Makanan" ? "🥫" : "🩺"}
                                  </span>
                                  <div>
                                    <h5 className="text-xs font-bold text-gray-800 leading-snug">{item.products?.name || "Produk Tidak Dikenal"}</h5>
                                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">
                                      Rp {item.price.toLocaleString("id-ID")} x {item.quantity}
                                    </p>
                                  </div>
                                </div>

                                <span className="text-xs font-black text-gray-800">
                                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-gray-150 rounded-[2.5rem] p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
              <span className="text-4xl block">📦</span>
              <h3 className="font-extrabold text-gray-800 text-base">Belum Ada Pemesanan</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Anda belum pernah melakukan pemesanan produk/obat. Silakan kunjungi Toko Online untuk membeli kebutuhan anabul Anda.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/10 transition duration-300 inline-flex items-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" /> Kunjungi Toko Online
              </button>
            </div>
          )}
        </>
      )}

      {/* Toast notifications */}
      <ToastNotification
        isVisible={showToast}
        onClose={() => setShowToast(false)}
        message={toastMsg}
        type={toastType}
      />
    </div>
  );
}
