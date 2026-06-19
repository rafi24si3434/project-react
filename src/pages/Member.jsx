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
  Search,
  ShoppingCart,
  Mail,
  Phone,
  MapPin
} from "lucide-react";
import ToastNotification from "../components/ToastNotification";

// Import modular components
import MemberNavbar from "../components/member/MemberNavbar";
import MemberStats from "../components/member/MemberStats";
import LoyaltyCard from "../components/member/LoyaltyCard";
import PetCard from "../components/member/PetCard";
import ProductCard from "../components/member/ProductCard";
import InvoiceCard from "../components/member/InvoiceCard";
import AppointmentCard from "../components/member/AppointmentCard";
import MedicalRecordCard from "../components/member/MedicalRecordCard";
import CartDrawer from "../components/member/CartDrawer";
import BookingModal from "../components/member/BookingModal";
import PetFormModal from "../components/member/PetFormModal";
import ProfileModal from "../components/member/ProfileModal";
import PetDetailModal from "../components/member/PetDetailModal";

export default function Member() {
  const { user, profile, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // Active Tab: "overview" | "pets" | "transactions" | "appointments" | "medical"
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

  // Appointment Booking Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    petId: "",
    type: "Pemeriksaan Umum",
    doctor: "drh. Nisa Putri",
    date: "",
    time: "09:00",
    notes: ""
  });
  const [submittingBooking, setSubmittingBooking] = useState(false);

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

  // Handle Appointment Booking Submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.petId || !bookingForm.date) {
      setToastMsg("Harap pilih hewan dan tanggal kunjungan.");
      setToastType("error");
      setShowToast(true);
      return;
    }

    setSubmittingBooking(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .insert({
          owner_id: user.id,
          pet_id: bookingForm.petId,
          doctor: bookingForm.doctor,
          date: bookingForm.date,
          time: bookingForm.time,
          type: bookingForm.type,
          notes: bookingForm.notes || null,
          status: "Pending"
        });

      if (error) throw error;

      // Log activity
      try {
        await supabase.from("activity_logs").insert({
          user_id: user.id,
          activity: "Customer Membuat Janji Temu",
          description: `Membuat janji temu berobat untuk anabul pada tanggal ${bookingForm.date} pukul ${bookingForm.time} WIB.`
        });
      } catch (logErr) {
        console.error("Activity logging failed:", logErr);
      }

      setToastMsg("Janji berobat berhasil diajukan!");
      setToastType("success");
      setShowToast(true);
      setIsBookingModalOpen(false);

      // Reload appointments
      loadMemberData();
    } catch (err) {
      console.error("Error creating appointment:", err);
      setToastMsg("Gagal mengajukan janji berobat.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setSubmittingBooking(false);
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
  let progressPercentage = Math.min((totalSpent / 500000) * 100, 100);
  let nextTier = "Silver";
  let targetSpent = 500000;

  if (totalSpent >= 2000000) {
    loyaltyTier = "Gold";
    tierColor = "from-yellow-500 via-amber-600 to-amber-850 border-yellow-400/30 text-yellow-50";
    progressPercentage = 100;
    nextTier = "Max Tier";
    targetSpent = 2000000;
  } else if (totalSpent >= 500000) {
    loyaltyTier = "Silver";
    tierColor = "from-slate-500 via-slate-600 to-slate-800 border-slate-400/30 text-slate-100";
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
      <MemberNavbar
        profile={profile}
        tierColor={tierColor}
        loyaltyTier={loyaltyTier}
        handleLogout={handleLogout}
        setActiveTab={setActiveTab}
        setSubTab={setSubTab}
        navigate={navigate}
      />

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
          <MemberStats
            petsCount={pets.length}
            appointmentsCount={appointments.length}
            points={points}
          />
        </div>

        {/* ── TAB BAR ── */}
        <div className="bg-white border border-slate-200 p-1.5 rounded-2xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 shadow-sm mb-8">
          {[
            { id: "overview", label: "Dashboard", icon: User },
            { id: "pets", label: "Hewan Saya", icon: PawPrint },
            { id: "transactions", label: "Belanja Saya", icon: Receipt },
            { id: "appointments", label: "Jadwal Kunjungan", icon: CalendarCheck },
            { id: "medical", label: "Rekam Medis", icon: ClipboardList }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer justify-center ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/10"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
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
                  <LoyaltyCard
                    profile={profile}
                    tierColor={tierColor}
                    loyaltyTier={loyaltyTier}
                    points={points}
                    progressPercentage={progressPercentage}
                    nextTier={nextTier}
                    targetSpent={targetSpent}
                    totalSpent={totalSpent}
                  />
                </div>

                {/* Profile Detail Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Profile Info Card */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <h4 className="font-extrabold text-slate-850 text-sm">Privasi & Keamanan Hewan</h4>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {pets.map((pet) => {
                      let age = "-";
                      if (pet.birth_date) {
                        const birthYear = new Date(pet.birth_date).getFullYear();
                        const currentYear = new Date().getFullYear();
                        age = `${currentYear - birthYear} Tahun`;
                      }

                      const lastRecord = medicalRecords.find(r => r.pet_id === pet.id);
                      const activeApp = appointments.find(a => a.pet_id === pet.id && a.status !== "Completed" && a.status !== "Cancelled");

                      return (
                        <PetCard
                          key={pet.id}
                          pet={pet}
                          getPetEmoji={getPetEmoji}
                          getPetGradient={getPetGradient}
                          age={age}
                          lastRecord={lastRecord}
                          activeApp={activeApp}
                          setSelectedPetForDetail={setSelectedPetForDetail}
                          setIsPetDetailOpen={setIsPetDetailOpen}
                        />
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
                          <ProductCard
                            key={p.id}
                            product={p}
                            addToCart={addToCart}
                          />
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
                        {orders.map((order) => (
                          <InvoiceCard
                            key={order.id}
                            order={order}
                            isExpanded={expandedOrderId === order.id}
                            setExpandedOrderId={setExpandedOrderId}
                          />
                        ))}
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

            {/* ── TAB CONTENT: APPOINTMENTS ── */}
            {activeTab === "appointments" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-emerald-500" /> Jadwal Pertemuan & Kunjungan
                  </h3>
                  <button
                    onClick={() => {
                      if (pets.length === 0) {
                        setToastMsg("Silakan daftarkan hewan peliharaan Anda terlebih dahulu.");
                        setToastType("error");
                        setShowToast(true);
                        return;
                      }
                      setBookingForm({
                        petId: pets[0]?.id || "",
                        type: "Pemeriksaan Umum",
                        doctor: "drh. Nisa Putri",
                        date: "",
                        time: "09:00",
                        notes: ""
                      });
                      setIsBookingModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-[11px] font-bold px-3.5 py-2 rounded-xl shadow-sm cursor-pointer transition active:scale-[0.98]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Buat Janji Berobat
                  </button>
                </div>

                {appointments.length > 0 ? (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {appointments.map((app) => (
                      <AppointmentCard
                        key={app.id}
                        app={app}
                        getPetEmoji={getPetEmoji}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 font-semibold shadow-sm">
                    Belum ada jadwal janji temu terdaftar.
                  </div>
                )}
              </div>
            )}

            {/* ── TAB CONTENT: MEDICAL RECORDS ── */}
            {activeTab === "medical" && (
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-emerald-500" /> Histori Rekam Medis
                </h3>

                {medicalRecords.length > 0 ? (
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {medicalRecords.map((rec) => (
                      <MedicalRecordCard
                        key={rec.id}
                        rec={rec}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 font-semibold shadow-sm">
                    Belum ada catatan diagnosa rekam medis.
                  </div>
                )}
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

      {/* ── PET FORM MODAL ── */}
      <PetFormModal
        isPetModalOpen={isPetModalOpen}
        setIsPetModalOpen={setIsPetModalOpen}
        petForm={petForm}
        setPetForm={setPetForm}
        handlePetFormSubmit={handlePetFormSubmit}
        submittingPet={submittingPet}
      />

      {/* ── FLOATING CART BUTTON ── */}
      {cartItemsCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-355 flex items-center justify-center cursor-pointer border border-white/10 group"
          title="Buka Keranjang Saya"
        >
          <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />
          <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] w-6.5 h-6.5 rounded-full flex items-center justify-center font-black border-2 border-white animate-pulse">
            {cartItemsCount}
          </span>
        </button>
      )}

      {/* ── CART DRAWER OVERLAY ── */}
      <CartDrawer
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        cartTotal={cartTotal}
        handleCheckout={handleCheckout}
        checkoutLoading={checkoutLoading}
      />

      {/* ── EDIT PROFILE MODAL ── */}
      <ProfileModal
        isProfileModalOpen={isProfileModalOpen}
        setIsProfileModalOpen={setIsProfileModalOpen}
        editProfileForm={editProfileForm}
        setEditProfileForm={setEditProfileForm}
        handleProfileSubmit={handleProfileSubmit}
        submittingProfile={submittingProfile}
      />

      {/* ── PET DETAILS & HISTORY MODAL ── */}
      <PetDetailModal
        isPetDetailOpen={isPetDetailOpen}
        setIsPetDetailOpen={setIsPetDetailOpen}
        selectedPetForDetail={selectedPetForDetail}
        setSelectedPetForDetail={setSelectedPetForDetail}
        medicalRecords={medicalRecords}
        appointments={appointments}
        getPetEmoji={getPetEmoji}
      />

      {/* ── BOOKING APPOINTMENT MODAL ── */}
      <BookingModal
        isBookingModalOpen={isBookingModalOpen}
        setIsBookingModalOpen={setIsBookingModalOpen}
        bookingForm={bookingForm}
        setBookingForm={setBookingForm}
        pets={pets}
        handleBookingSubmit={handleBookingSubmit}
        submittingBooking={submittingBooking}
      />

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
