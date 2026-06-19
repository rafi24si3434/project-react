import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import {
  User,
  ShoppingBag,
  Receipt,
  PawPrint,
  CalendarCheck,
  ClipboardList,
  Plus,
  LogOut,
  Heart,
  Award,
  Phone,
  MapPin,
  Mail,
  ChevronDown,
  ChevronUp,
  DollarSign,
  CheckCircle,
  Activity,
  Calendar,
  Clock,
  Eye,
  TrendingUp,
  Shield,
  Sparkles,
  FileText,
  Info,
  Search,
  ShoppingCart,
  Trash2,
  Minus,
  X,
  ArrowRight,
  Package,
  Tag,
  Check
} from "lucide-react";
import ToastNotification from "../components/ToastNotification";

export default function Member() {
  const { user, profile, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Active Tab: "overview" | "pets" | "transactions" | "medical"
  const [activeTab, setActiveTab] = useState("overview");

  // Data States
  const [pets, setPets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [submittingPet, setSubmittingPet] = useState(false);

  // Pet Form State
  const [petForm, setPetForm] = useState({
    name: "",
    type: "Kucing",
    breed: "",
    gender: "Jantan",
    birthDate: "",
    weight: "",
    healthNotes: ""
  });

  // Storefront States
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [subTab, setSubTab] = useState("catalog"); // "catalog" | "history"

  // Profile Edit Modal States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editProfileForm, setEditProfileForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: ""
  });
  const [submittingProfile, setSubmittingProfile] = useState(false);

  // Pet Details Modal States
  const [selectedPetForDetail, setSelectedPetForDetail] = useState(null);
  const [isPetDetailOpen, setIsPetDetailOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      navigate("/login");
    }
  };

  const loadMemberData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch Pets
      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (petsError) throw petsError;
      setPets(petsData || []);

      // 2. Fetch Orders
      const { data: ordersData, error: ordersError } = await supabase
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
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // 3. Fetch Appointments
      const { data: appData, error: appError } = await supabase
        .from("appointments")
        .select(`
          *,
          pets (name, type)
        `)
        .eq("owner_id", user.id)
        .order("date", { ascending: false })
        .order("time", { ascending: false });

      if (appError) {
        // Fallback flat query if join fails
        const { data: flatApp, error: flatAppError } = await supabase
          .from("appointments")
          .select("*")
          .eq("owner_id", user.id)
          .order("date", { ascending: false });

        if (flatAppError) throw flatAppError;
        
        const mappedApp = (flatApp || []).map(a => {
          const matchPet = (petsData || []).find(p => p.id === a.pet_id);
          return {
            ...a,
            pets: matchPet ? { name: matchPet.name, type: matchPet.type } : null
          };
        });
        setAppointments(mappedApp);
      } else {
        setAppointments(appData || []);
      }

      // 4. Fetch Medical Records
      const { data: mrData, error: mrError } = await supabase
        .from("medical_records")
        .select(`
          *,
          pets (name)
        `)
        .eq("owner_id", user.id)
        .order("date", { ascending: false });

      if (mrError) {
        const flatMr = (await supabase
          .from("medical_records")
          .select("*")
          .eq("owner_id", user.id)
          .order("date", { ascending: false })).data || [];

        const mappedMr = flatMr.map(r => {
          const matchPet = (petsData || []).find(p => p.id === r.pet_id);
          return {
            ...r,
            pets: matchPet ? { name: matchPet.name } : null
          };
        });
        setMedicalRecords(mappedMr);
      } else {
        setMedicalRecords(mrData || []);
      }

      // 5. Fetch Products Catalog
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("name", { ascending: true });

      if (productsError) throw productsError;
      setProducts(productsData || []);

    } catch (err) {
      console.error("Error loading member data:", err);
      setToastMsg("Gagal memuat data member.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemberData();
  }, [user]);

  // Storefront & Cart Helpers
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
      return prevCart
        .map((item) => {
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
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    setToastMsg("Produk dihapus dari keranjang.");
    setToastType("success");
    setShowToast(true);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);

    try {
      // 1. Verify latest stock
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
        const { error: itemError } = await supabase
          .from("order_items")
          .insert({
            order_id: order.id,
            product_id: item.product.id,
            quantity: item.quantity,
            price: item.product.price
          });

        if (itemError) throw itemError;

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

      setCart([]);
      setIsCartOpen(false);
      setToastMsg("Checkout berhasil! Pesanan Anda sedang diproses.");
      setToastType("success");
      setShowToast(true);

      loadMemberData();
    } catch (err) {
      console.error("Checkout failed:", err);
      setToastMsg(err.message || "Checkout gagal. Silakan coba lagi.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Handle Profile Update Submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!editProfileForm.fullName) return;
    setSubmittingProfile(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: editProfileForm.fullName,
          phone_number: editProfileForm.phoneNumber,
          address: editProfileForm.address,
          updated_at: new Date().toISOString()
        })
        .eq("auth_user_id", user.id);

      if (error) throw error;

      // Log activity
      try {
        await supabase.from("activity_logs").insert({
          user_id: user.id,
          activity: "Customer Mengubah Profil",
          description: `Customer ${editProfileForm.fullName} memperbarui informasi profilnya via portal.`
        });
      } catch (logErr) {
        console.error("Activity logging failed:", logErr);
      }

      await refreshProfile();
      setToastMsg("Profil Anda berhasil diperbarui!");
      setToastType("success");
      setShowToast(true);
      setIsProfileModalOpen(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setToastMsg("Gagal memperbarui profil.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setSubmittingProfile(false);
    }
  };

  const categories = ["Semua", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "Semua" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Loyalty calculations
  const totalSpent = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const points = Math.floor(totalSpent / 10000);

  let loyaltyTier = "Bronze";
  let tierColor = "from-amber-700 to-amber-900 border-amber-600/30 text-amber-100";
  let badgeStyle = "bg-amber-100/10 text-amber-300 border-amber-500/20";
  let progressPercentage = Math.min((totalSpent / 500000) * 100, 100);
  let nextTier = "Silver";
  let targetSpent = 500000;

  if (totalSpent >= 2000000) {
    loyaltyTier = "Gold";
    tierColor = "from-yellow-500 via-amber-600 to-amber-850 border-yellow-400/30 text-yellow-50";
    badgeStyle = "bg-yellow-450/15 text-yellow-300 border-yellow-300/30";
    progressPercentage = 100;
    nextTier = "Max Tier";
    targetSpent = 2000000;
  } else if (totalSpent >= 500000) {
    loyaltyTier = "Silver";
    tierColor = "from-slate-500 via-slate-600 to-slate-800 border-slate-400/30 text-slate-100";
    badgeStyle = "bg-slate-200/10 text-slate-300 border-slate-350/20";
    progressPercentage = Math.min(((totalSpent - 500000) / (2000000 - 500000)) * 100, 100);
    nextTier = "Gold";
    targetSpent = 2000000;
  }

  // Pet Type Emojis
  const getPetEmoji = (type) => {
    switch (type?.toLowerCase()) {
      case "anjing":
      case "dog":
        return "🐶";
      case "kucing":
      case "cat":
        return "🐱";
      case "kelinci":
      case "rabbit":
        return "🐰";
      case "burung":
      case "bird":
        return "🐦";
      case "hamster":
        return "🐹";
      default:
        return "🐾";
    }
  };

  const getPetGradient = (type) => {
    switch (type?.toLowerCase()) {
      case "anjing":
      case "dog":
        return "from-sky-50 to-blue-50 border-sky-100";
      case "kucing":
      case "cat":
        return "from-emerald-50 to-teal-50 border-emerald-100";
      case "kelinci":
      case "rabbit":
        return "from-purple-50 to-indigo-50 border-purple-100";
      default:
        return "from-slate-50 to-gray-50 border-slate-100";
    }
  };

  // Submit Pet Form
  const handlePetFormSubmit = async (e) => {
    e.preventDefault();
    if (!petForm.name) return;
    setSubmittingPet(true);
    try {
      const { error } = await supabase
        .from("pets")
        .insert({
          owner_id: user.id,
          name: petForm.name,
          type: petForm.type,
          breed: petForm.breed || "Campuran",
          gender: petForm.gender,
          birth_date: petForm.birthDate || null,
          weight: petForm.weight ? parseFloat(petForm.weight) : null,
          health_notes: petForm.healthNotes || null
        });

      if (error) throw error;

      setToastMsg(`Hewan "${petForm.name}" berhasil didaftarkan!`);
      setToastType("success");
      setShowToast(true);
      
      setPetForm({
        name: "",
        type: "Kucing",
        breed: "",
        gender: "Jantan",
        birthDate: "",
        weight: "",
        healthNotes: ""
      });
      setIsPetModalOpen(false);
      loadMemberData();
    } catch (err) {
      console.error("Error adding pet:", err);
      setToastMsg("Gagal mendaftarkan hewan.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setSubmittingPet(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-left">
      {/* ── TOP NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.015)] px-6 py-4.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-500/10">
              <PawPrint className="w-5.5 h-5.5" />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              PetCare <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Portal</span>
            </h1>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <button onClick={() => navigate("/")} className="hover:text-emerald-500 transition-colors cursor-pointer">Beranda</button>
            <button onClick={() => { setActiveTab("transactions"); setSubTab("catalog"); }} className="hover:text-emerald-500 transition-colors cursor-pointer flex items-center gap-2"><ShoppingBag className="w-4 h-4" /> Toko Obat</button>
            <button onClick={() => { setActiveTab("transactions"); setSubTab("history"); }} className="hover:text-emerald-500 transition-colors cursor-pointer flex items-center gap-2"><Receipt className="w-4 h-4" /> Pesanan Saya</button>
            <button onClick={() => { setActiveTab("overview"); }} className="hover:text-emerald-500 transition-colors cursor-pointer flex items-center gap-2"><User className="w-4 h-4" /> Profil</button>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4.5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-800 leading-none">{profile?.full_name}</p>
              <span className={`inline-block text-[9px] font-black uppercase px-2.5 py-0.5 mt-1.5 rounded-full bg-gradient-to-r ${tierColor} border border-white/5`}>
                {loyaltyTier} Member
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 transition cursor-pointer border border-red-100/30"
              title="Keluar dari Akun"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* ── CONTENT CONTAINER ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        
        {/* Profile Summary & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8.5">
          <div>
            <h1 className="text-2xl font-black text-slate-850 tracking-tight flex items-center gap-2">
              <span>Halo, {profile?.full_name?.split(" ")[0] || "Member"}!</span>
              <span className="animate-bounce">👋</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Kelola rekam medis, riwayat transaksi belanja apotek, dan anabul kesayangan Anda.</p>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <div className="bg-white px-5 py-3.5 rounded-[1.5rem] border border-slate-100 flex items-center gap-4 shadow-sm flex-1 min-w-[130px] hover:-translate-y-0.5 transition duration-300">
              <span className="text-2xl">🐱</span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Anabul Saya</p>
                <p className="text-xl font-black text-slate-800 mt-1">{pets.length} Ekor</p>
              </div>
            </div>
            <div className="bg-white px-5 py-3.5 rounded-[1.5rem] border border-slate-100 flex items-center gap-4 shadow-sm flex-1 min-w-[130px] hover:-translate-y-0.5 transition duration-300">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Janji Temu</p>
                <p className="text-xl font-black text-slate-800 mt-1">{appointments.length} Kali</p>
              </div>
            </div>
            <div className="bg-white px-5 py-3.5 rounded-[1.5rem] border border-slate-100 flex items-center gap-4 shadow-sm flex-1 min-w-[130px] hover:-translate-y-0.5 transition duration-300">
              <span className="text-2xl">💎</span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Poin Loyalitas</p>
                <p className="text-xl font-black text-emerald-600 mt-1">{points} Pts</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div className="bg-white border border-slate-200 p-1.5 rounded-2xl flex flex-wrap gap-1 shadow-sm mb-8 max-w-lg">
          {[
            { id: "overview", label: "Dashboard", icon: User },
            { id: "pets", label: "Hewan Saya", icon: PawPrint },
            { id: "transactions", label: "Belanja Saya", icon: Receipt },
            { id: "medical", label: "Rekam Medis", icon: ClipboardList }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex-1 justify-center sm:flex-initial ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/10"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* LOADING INDICATOR */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-24 flex flex-col items-center justify-center shadow-sm">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm text-slate-400 font-bold">Menyiapkan portal khusus Anda...</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            
            {/* ── TAB CONTENT: OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Loyalty Card Column */}
                <div className="lg:col-span-1 space-y-6">
                  {/* Premium Credit Card Style Loyalty Card */}
                  <div className={`p-6 rounded-[2.2rem] bg-gradient-to-br ${tierColor} shadow-xl relative overflow-hidden border flex flex-col justify-between h-56 group hover:shadow-emerald-500/10 transition-all duration-500`}>
                    {/* Futuristic Chip Graphics */}
                    <div className="absolute right-0 bottom-0 w-36 h-36 bg-white/5 rounded-full translate-x-12 translate-y-12 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-24 h-24 bg-white/5 rounded-full -translate-x-12"></div>
                    
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Loyalty Card</p>
                        <h3 className="text-lg font-black tracking-tight mt-0.5">PetCare Club</h3>
                      </div>
                      <div className="w-10 h-8 rounded-md bg-white/10 border border-white/20 backdrop-blur-md flex flex-col justify-center items-center shadow-inner">
                        <Award className="w-5 h-5 text-yellow-300" />
                      </div>
                    </div>

                    <div className="relative z-10 pt-2 text-left">
                      <div className="w-9 h-7 rounded-md bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-80 mb-2 relative overflow-hidden">
                        <div className="absolute inset-0 bg-slate-900/10 grid grid-cols-3 divide-x divide-slate-800/20">
                          <div></div><div></div><div></div>
                        </div>
                      </div>
                      <p className="text-xs opacity-75 font-mono">MEMBER - {profile?.id ? profile.id.slice(0, 4).toUpperCase() : "8293"} - {profile?.id ? profile.id.slice(24, 28).toUpperCase() : "9201"}</p>
                      <h4 className="text-base font-black truncate mt-1">{profile?.full_name}</h4>
                    </div>

                    <div className="flex justify-between items-end relative z-10 pt-2.5 border-t border-white/10">
                      <div>
                        <p className="text-[8px] uppercase opacity-60 font-bold tracking-wider">Level Tier</p>
                        <p className="text-xs font-black uppercase tracking-wider">{loyaltyTier} Member</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[8px] uppercase opacity-60 font-bold tracking-wider">Poin</p>
                        <p className="text-xs font-black tracking-wider">{points} Pts</p>
                      </div>
                    </div>
                  </div>

                  {/* Loyalty Progress Tracker */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-500" /> Progress Tingkat Member
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-xs font-semibold text-slate-600">
                        <span>Tier: <b>{loyaltyTier}</b></span>
                        {nextTier !== "Max Tier" ? (
                          <span>Target: <b>{nextTier}</b></span>
                        ) : (
                          <span className="text-emerald-600 font-bold">Tier Tertinggi! 👑</span>
                        )}
                      </div>

                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>

                      {nextTier !== "Max Tier" && (
                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                          Belanja <b>Rp {(targetSpent - totalSpent).toLocaleString("id-ID")}</b> lagi untuk naik ke level <b>{nextTier} Member</b>.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Detail Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Profile Info Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-500" /> Informasi Akun & Alamat
                      </h3>
                      <button
                        onClick={() => {
                          setEditProfileForm({
                            fullName: profile?.full_name || "",
                            phoneNumber: profile?.phone_number || "",
                            address: profile?.address || ""
                          });
                          setIsProfileModalOpen(true);
                        }}
                        className="text-xs text-emerald-650 hover:text-emerald-700 font-bold transition cursor-pointer"
                      >
                        Edit Profil
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Nama Lengkap</p>
                          <p className="text-sm font-bold text-slate-800 mt-1">{profile?.full_name}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Alamat Email</p>
                          <p className="text-sm font-bold text-slate-800 mt-1 truncate max-w-[200px]" title={profile?.email}>{profile?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Nomor HP</p>
                          <p className="text-sm font-bold text-slate-800 mt-1">{profile?.phone_number || "-"}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Alamat Pengiriman</p>
                          <p className="text-sm font-bold text-slate-800 mt-1 leading-relaxed">{profile?.address || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips Card */}
                  <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border border-emerald-100/80 p-6 rounded-3xl shadow-sm flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-2xl shadow-sm shrink-0">
                      🛡️
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">Privasi & Keamanan Hewan</h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-semibold">
                        Semua rekam medis anabul Anda dienkripsi secara aman. Hanya dokter hewan penanggung jawab yang dapat memodifikasi rekam medis demi kesehatan dan keselamatan anabul Anda.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB CONTENT: PETS ── */}
            {activeTab === "pets" && (
              <div>
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <PawPrint className="w-4 h-4 text-emerald-500" /> Daftar Anabul Kesayangan
                  </h3>
                  <button
                    onClick={() => setIsPetModalOpen(true)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold px-4.5 py-3 rounded-2xl shadow-sm cursor-pointer transition active:scale-[0.98]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Daftarkan Hewan Baru
                  </button>
                </div>

                {pets.length > 0 ? (
                  /* Spacious 2-Column Grid Layout for Large Cards */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {pets.map((pet) => {
                      let age = "-";
                      if (pet.birth_date) {
                        const birthYear = new Date(pet.birth_date).getFullYear();
                        const currentYear = new Date().getFullYear();
                        age = `${currentYear - birthYear} Tahun`;
                      }

                      // Find latest medical diagnosis for this pet
                      const lastRecord = medicalRecords.find(r => r.pet_id === pet.id);
                      
                      // Find if they have active appointments
                      const activeApp = appointments.find(a => a.pet_id === pet.id && a.status !== "Completed" && a.status !== "Cancelled");

                      return (
                        <div
                          key={pet.id} 
                          className="bg-white rounded-[2rem] border border-slate-200/80 p-6.5 shadow-sm hover:shadow-md hover:border-emerald-200/50 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div>
                            {/* Card Top Block */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-4.5">
                                {/* Large Avatar */}
                                <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${getPetGradient(pet.type)} flex items-center justify-center text-4xl shadow-sm shrink-0 border`}>
                                  {getPetEmoji(pet.type)}
                                </div>
                                <div className="text-left">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-lg font-black text-slate-800 tracking-tight">{pet.name}</h4>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                      pet.gender === "Jantan"
                                        ? "bg-blue-50 text-blue-600 border border-blue-100"
                                        : "bg-pink-50 text-pink-600 border border-pink-100"
                                    }`}>
                                      {pet.gender}
                                    </span>
                                  </div>
                                  <p className="text-xs text-slate-400 mt-1 font-bold">{pet.type} &bull; Ras {pet.breed}</p>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                                activeApp 
                                  ? "bg-blue-50 text-blue-600 border-blue-100" 
                                  : "bg-emerald-50 text-emerald-600 border-emerald-100"
                              }`}>
                                {activeApp ? "Ada Jadwal" : "Kondisi Baik"}
                              </span>
                            </div>

                            {/* Pet Metrics Grid */}
                            <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-100 text-xs text-slate-600">
                              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Perkiraan Umur</p>
                                <p className="text-sm font-black text-slate-850 mt-1">{age}</p>
                              </div>
                              <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Berat Badan</p>
                                <p className="text-sm font-black text-slate-850 mt-1">{pet.weight ? `${pet.weight} Kg` : "-"}</p>
                              </div>
                            </div>

                            {/* Last Diagnostic Info box */}
                            <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-left">
                              {lastRecord ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 font-bold text-slate-500">
                                    <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Rekam Medis Terakhir ({lastRecord.date})</span>
                                  </div>
                                  <p className="font-extrabold text-slate-800 leading-snug">{lastRecord.diagnosa}</p>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-slate-400 font-bold">
                                  <Info className="w-4 h-4" />
                                  <span>Belum ada histori rekam medis klinis</span>
                                </div>
                              )}
                            </div>

                            {pet.health_notes && (
                              <p className="text-[11px] text-slate-450 italic mt-3 bg-yellow-50/20 border border-yellow-250/20 px-3 py-2 rounded-xl">
                                Catatan alergi/kesehatan: "{pet.health_notes}"
                              </p>
                            )}
                          </div>

                          {/* Detail Button */}
                          <div className="mt-6 pt-4 border-t border-slate-100">
                             <button
                              onClick={() => {
                                setSelectedPetForDetail(pet);
                                setIsPetDetailOpen(true);
                              }}
                              className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-100/30 rounded-2xl text-xs font-bold transition duration-200 cursor-pointer text-center flex items-center justify-center gap-1.5"
                            >
                              <Eye className="w-4 h-4" /> Lihat Histori Lengkap & Vaksin
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400 font-semibold shadow-sm">
                    <p className="mb-4">Anda belum mendaftarkan anabul peliharaan Anda.</p>
                    <button
                      onClick={() => setIsPetModalOpen(true)}
                      className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold px-4.5 py-3 rounded-xl cursor-pointer transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Mulai Daftarkan
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB CONTENT: TRANSACTIONS ── */}
            {activeTab === "transactions" && (
              <div>
                {/* Sub Tab Navigation inside Belanja Saya */}
                <div className="flex border-b border-slate-200 mb-6 gap-6">
                  <button
                    onClick={() => setSubTab("catalog")}
                    className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer ${
                      subTab === "catalog"
                        ? "border-emerald-500 text-emerald-650 font-extrabold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    💊 Etalase Toko Obat
                  </button>
                  <button
                    onClick={() => setSubTab("history")}
                    className={`pb-3 text-sm font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                      subTab === "history"
                        ? "border-emerald-500 text-emerald-650 font-extrabold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    📄 Riwayat Belanja
                    {orders.length > 0 && (
                      <span className="bg-slate-100 text-slate-655 px-2 py-0.5 rounded-full text-[10px] font-black">
                        {orders.length}
                      </span>
                    )}
                  </button>
                </div>

                {subTab === "catalog" ? (
                  <div>
                    {/* Categories & Search */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                      <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 scrollbar-none">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer border ${
                              selectedCategory === cat
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500 border-transparent text-white shadow-md shadow-emerald-500/10"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <div className="relative w-full md:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Cari makanan, obat, alat medis..."
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all bg-white"
                        />
                      </div>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((p) => (
                          <div 
                            key={p.id}
                            className="bg-white border border-slate-200 rounded-[2rem] p-5 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 group"
                          >
                            <div className="space-y-4">
                              <div className="w-full h-40 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-2xl border border-slate-100 flex items-center justify-center text-4xl relative overflow-hidden group-hover:scale-[1.02] transition duration-300">
                                <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-slate-100 text-[10px] font-bold text-slate-500">
                                  {p.category}
                                </div>
                                {p.category === "Obat" ? "💊" : p.category === "Makanan" ? "🥫" : "🩺"}
                              </div>

                              <div className="space-y-1 text-left">
                                <h3 className="font-extrabold text-slate-800 text-sm tracking-tight leading-snug group-hover:text-emerald-600 transition">
                                  {p.name}
                                </h3>
                                <p className="text-[11px] text-slate-450 font-medium line-clamp-2">
                                  {p.description || "Tidak ada deskripsi produk."}
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 space-y-3">
                              <div className="flex justify-between items-baseline">
                                <span className="text-base font-black text-slate-800">
                                  Rp {p.price.toLocaleString("id-ID")}
                                </span>
                                <span className={`text-[10px] font-bold ${p.stock > 10 ? "text-emerald-600" : p.stock > 0 ? "text-amber-500" : "text-rose-500"}`}>
                                  {p.stock > 0 ? `Sisa: ${p.stock} ${p.unit}` : "Habis"}
                                </span>
                              </div>

                              <button
                                onClick={() => addToCart(p)}
                                disabled={p.stock <= 0}
                                className="w-full py-2.5 rounded-xl bg-slate-50 group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-500 text-slate-700 group-hover:text-white font-bold text-xs shadow-sm group-hover:shadow-md group-hover:shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:scale-100 cursor-pointer flex items-center justify-center gap-1.5 border border-slate-200 group-hover:border-transparent"
                              >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Beli Sekarang
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white border border-slate-200 rounded-[2rem] p-12 text-center max-w-md mx-auto space-y-4 shadow-sm animate-in fade-in duration-300">
                        <span className="text-4xl block">🔍</span>
                        <h3 className="font-extrabold text-slate-800 text-base">Produk Tidak Ditemukan</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Kami tidak menemukan produk matching dengan kata kunci "{searchQuery}". Silakan coba kata kunci lain.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-emerald-500" /> Invoice & Riwayat Belanja Apotek
                    </h3>

                    {orders.length > 0 ? (
                      <div className="space-y-6 max-w-4xl mx-auto">
                        {orders.map((order) => {
                          const isExpanded = expandedOrderId === order.id;
                          return (
                            <div key={order.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition">
                              
                              {/* Invoice Slip Style Header */}
                              <div
                                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 cursor-pointer hover:bg-slate-50/30 transition text-left"
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
                                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shadow-inner">
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                  </div>
                                </div>
                              </div>

                              {/* Paper-edge serrated detail layout */}
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
                                          <p className="text-slate-500 font-semibold">{item.quantity} Pcs &times; Rp {Number(item.price).toLocaleString("id-ID")}</p>
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
                        })}
                      </div>
                    ) : (
                      <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center text-slate-400 font-semibold shadow-sm animate-in fade-in duration-300">
                        <p className="mb-4">Anda belum melakukan pembelian produk apa pun di apotek.</p>
                        <button
                          onClick={() => setSubTab("catalog")}
                          className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Mulai Belanja
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB CONTENT: MEDICAL RECORDS ── */}
            {activeTab === "medical" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Panel: Appointments */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-emerald-500" /> Jadwal Pertemuan & Kunjungan
                  </h3>

                  {appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.map((app) => (
                        <div key={app.id} className="bg-white p-5.5 rounded-3xl border border-slate-150 shadow-sm flex items-start gap-4 hover:border-slate-300 transition duration-300">
                          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-lg shadow-sm shrink-0">
                            {getPetEmoji(app.pets?.type)}
                          </div>
                          <div className="space-y-1.5 w-full text-left">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-sm font-black text-slate-800">{app.pets?.name || "Anabul"}</h4>
                              <span className={`inline-flex text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                app.status === "Completed"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                  : app.status === "Confirmed"
                                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                                  : app.status === "Cancelled"
                                  ? "bg-rose-50 text-rose-500 border border-rose-100"
                                  : "bg-amber-50 text-amber-600 border border-amber-100"
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-650">Dokter Penanggung Jawab: <b>{app.doctor}</b></p>
                            <p className="text-xs text-slate-400 flex items-center gap-1.5 font-bold">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" /> {app.date} &bull; <Clock className="w-3.5 h-3.5 text-slate-400" /> {app.time} WIB
                            </p>
                            {app.notes && (
                              <div className="mt-2.5 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-500 italic">
                                Keluhan Pasien: "{app.notes}"
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 font-semibold shadow-sm">
                      Belum ada jadwal janji temu terdaftar.
                    </div>
                  )}
                </div>

                {/* Right Panel: Medical Records */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-emerald-500" /> Histori Rekam Medis
                  </h3>

                  {medicalRecords.length > 0 ? (
                    <div className="space-y-4">
                      {medicalRecords.map((rec) => (
                        <div key={rec.id} className="bg-white p-5.5 rounded-3xl border border-slate-150 shadow-sm flex items-start gap-4 hover:border-emerald-100/50 transition duration-300 text-left">
                          <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 text-lg shadow-sm shrink-0">
                            🩺
                          </div>
                          <div className="space-y-2 w-full">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-sm font-black text-slate-800">{rec.pets?.name || "Anabul"}</h4>
                              <span className="text-[10px] text-slate-400 font-bold">{rec.date}</span>
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase">Diagnosa Penyakit</p>
                              <p className="text-xs text-slate-800 bg-slate-50 p-3 rounded-2xl border border-slate-100 leading-relaxed font-semibold mt-1">{rec.diagnosa}</p>
                            </div>
                            {rec.treatment && (
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Tindakan / Terapi</p>
                                <p className="text-xs text-slate-650 leading-relaxed font-semibold mt-1">{rec.treatment}</p>
                              </div>
                            )}
                            <p className="text-[10px] text-slate-400 pt-2 border-t border-slate-100 mt-3 font-semibold">Dokter Hewan: <b>{rec.vet_name}</b></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 font-semibold shadow-sm">
                      Belum ada catatan diagnosa rekam medis.
                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-center text-xs text-slate-400 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <p className="font-semibold">&copy; {new Date().getFullYear()} PetCare CRM. Hak Cipta Dilindungi.</p>
          <p className="mt-1 font-semibold">Collaborative Customer Portal Area &bull; Layanan Terintegrasi Klinik Adudu Apps</p>
        </div>
      </footer>

      {/* ── DAFTAR PET MODAL ── */}
      {isPetModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in text-left">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-850 text-base flex items-center gap-2">
                <span>🐱 Daftarkan Hewan Peliharaan Baru</span>
              </h3>
              <button
                onClick={() => setIsPetModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-150 flex items-center justify-center text-slate-450 transition cursor-pointer font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handlePetFormSubmit} className="p-6 space-y-4">
              {/* Pet Name */}
              <div>
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Nama Peliharaan <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={petForm.name}
                  onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                  placeholder="Milo / Whiskers"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Pet Type */}
                <div>
                  <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Jenis Hewan <span className="text-red-400">*</span></label>
                  <select
                    value={petForm.type}
                    onChange={(e) => setPetForm({ ...petForm, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white cursor-pointer font-semibold text-slate-750"
                  >
                    {["Kucing", "Anjing", "Kelinci", "Burung", "Hamster", "Lainnya"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Pet Gender */}
                <div>
                  <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Jenis Kelamin</label>
                  <select
                    value={petForm.gender}
                    onChange={(e) => setPetForm({ ...petForm, gender: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-white cursor-pointer font-semibold text-slate-755"
                  >
                    <option value="Jantan">Jantan</option>
                    <option value="Betina">Betina</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Breed */}
                <div>
                  <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Ras / Keturunan</label>
                  <input
                    type="text"
                    value={petForm.breed}
                    onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })}
                    placeholder="Persia / Anggora"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Berat Badan (Kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={petForm.weight}
                    onChange={(e) => setPetForm({ ...petForm, weight: e.target.value })}
                    placeholder="4.5"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
                  />
                </div>
              </div>

              {/* Birth date */}
              <div>
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Tanggal Lahir</label>
                <input
                  type="date"
                  value={petForm.birthDate}
                  onChange={(e) => setPetForm({ ...petForm, birthDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-semibold text-slate-755 cursor-pointer"
                />
              </div>

              {/* Health Notes */}
              <div>
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Catatan Medis / Alergi</label>
                <textarea
                  rows="2"
                  value={petForm.healthNotes}
                  onChange={(e) => setPetForm({ ...petForm, healthNotes: e.target.value })}
                  placeholder="Alergi obat, manja, lemas..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
                ></textarea>
              </div>

              {/* Form Buttons */}
              <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPetModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingPet}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/10 cursor-pointer transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingPet ? "Menyimpan..." : "Daftarkan Hewan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── FLOATING CART BUTTON ── */}
      {cartItemsCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-350 flex items-center justify-center cursor-pointer border border-white/10 group"
          title="Buka Keranjang Saya"
        >
          <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />
          <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] w-6.5 h-6.5 rounded-full flex items-center justify-center font-black border-2 border-white animate-pulse">
            {cartItemsCount}
          </span>
        </button>
      )}

      {/* ── CART DRAWER OVERLAY ── */}
      {isCartOpen && (
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
                className="w-8 h-8 rounded-full bg-white border border-slate-205 flex items-center justify-center hover:bg-slate-50 text-slate-500 cursor-pointer shadow-sm font-bold text-lg"
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
                            className="w-5 h-5 rounded flex items-center justify-center text-slate-500 hover:bg-slate-550 cursor-pointer font-bold"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-xs font-bold text-slate-700 min-w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-5 h-5 rounded flex items-center justify-center text-slate-550 hover:bg-slate-50 cursor-pointer font-bold"
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
      )}

      {/* ── EDIT PROFILE MODAL ── */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in text-left">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-850 text-base flex items-center gap-2">
                <span>👤 Edit Profil Saya</span>
              </h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-150 flex items-center justify-center text-slate-450 transition cursor-pointer font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Nama Lengkap <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  required
                  value={editProfileForm.fullName}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Nomor HP</label>
                <input
                  type="text"
                  value={editProfileForm.phoneNumber}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, phoneNumber: e.target.value })}
                  placeholder="0812xxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-555 uppercase tracking-wider mb-1.5 block">Alamat Pengiriman</label>
                <textarea
                  rows="3"
                  value={editProfileForm.address}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, address: e.target.value })}
                  placeholder="Jl. Anggrek No. 12..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
                ></textarea>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submittingProfile}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/10 cursor-pointer transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {submittingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PET DETAILS & HISTORY MODAL ── */}
      {isPetDetailOpen && selectedPetForDetail && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl w-full max-w-2xl overflow-hidden animate-fade-in text-left flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getPetEmoji(selectedPetForDetail.type)}</span>
                <div>
                  <h3 className="font-black text-slate-850 text-base">{selectedPetForDetail.name}</h3>
                  <p className="text-[10px] text-slate-400 font-bold">{selectedPetForDetail.type} &bull; Ras {selectedPetForDetail.breed}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsPetDetailOpen(false);
                  setSelectedPetForDetail(null);
                }}
                className="w-8 h-8 rounded-lg hover:bg-slate-150 flex items-center justify-center text-slate-450 transition cursor-pointer font-bold text-lg"
              >
                &times;
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Pet Details Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Jenis Kelamin</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">{selectedPetForDetail.gender}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Berat Badan</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">{selectedPetForDetail.weight ? `${selectedPetForDetail.weight} Kg` : "-"}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Perkiraan Umur</p>
                  <p className="font-extrabold text-slate-800 mt-0.5">
                    {selectedPetForDetail.birth_date 
                      ? `${new Date().getFullYear() - new Date(selectedPetForDetail.birth_date).getFullYear()} Tahun` 
                      : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">Status Vaksinasi</p>
                  <p className="font-extrabold text-emerald-600 mt-0.5 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Lengkap
                  </p>
                </div>
              </div>

              {selectedPetForDetail.health_notes && (
                <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl text-xs text-amber-800">
                  <p className="font-bold">Catatan Kesehatan / Alergi:</p>
                  <p className="mt-1 font-medium italic">"{selectedPetForDetail.health_notes}"</p>
                </div>
              )}

              {/* Individual Medical Records */}
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-emerald-500" /> Riwayat Rekam Medis Klinis
                </h4>
                
                {medicalRecords.filter(r => r.pet_id === selectedPetForDetail.id).length > 0 ? (
                  <div className="space-y-3">
                    {medicalRecords
                      .filter(r => r.pet_id === selectedPetForDetail.id)
                      .map(rec => (
                        <div key={rec.id} className="p-4 bg-white border border-slate-150 rounded-2xl shadow-sm text-xs leading-relaxed">
                          <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2 font-bold text-slate-400">
                            <span>Tanggal: {rec.date}</span>
                            <span>Dokter: {rec.vet_name}</span>
                          </div>
                          <div>
                            <span className="font-bold text-slate-550 block">Diagnosa:</span>
                            <p className="font-extrabold text-slate-800 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 mt-1">{rec.diagnosa}</p>
                          </div>
                          {rec.treatment && (
                            <div className="mt-2">
                              <span className="font-bold text-slate-555 block">Tindakan / Terapi:</span>
                              <p className="font-bold text-slate-650 mt-0.5">{rec.treatment}</p>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs font-semibold">
                    Tidak ada catatan diagnosa rekam medis untuk anabul ini.
                  </div>
                )}
              </div>

              {/* Individual Appointments */}
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-500" /> Janji Temu & Kunjungan
                </h4>
                
                {appointments.filter(a => a.pet_id === selectedPetForDetail.id).length > 0 ? (
                  <div className="space-y-3">
                    {appointments
                      .filter(a => a.pet_id === selectedPetForDetail.id)
                      .map(app => (
                        <div key={app.id} className="p-4 bg-white border border-slate-150 rounded-2xl shadow-sm flex justify-between items-center text-xs">
                          <div>
                            <p className="font-extrabold text-slate-800">Dokter {app.doctor}</p>
                            <p className="text-[10px] text-slate-450 font-bold mt-1">{app.date} &bull; {app.time} WIB</p>
                          </div>
                          <span className={`inline-flex text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            app.status === "Completed"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : app.status === "Confirmed"
                              ? "bg-blue-50 text-blue-600 border border-blue-100"
                              : app.status === "Cancelled"
                              ? "bg-rose-50 text-rose-500 border border-rose-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs font-semibold">
                    Tidak ada jadwal kunjungan terdaftar untuk anabul ini.
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4.5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsPetDetailOpen(false);
                  setSelectedPetForDetail(null);
                }}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 cursor-pointer transition shadow-md shadow-slate-900/10"
              >
                Tutup Histori
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Toast notifications */}
      {showToast && (
        <ToastNotification
          message={toastMsg}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
