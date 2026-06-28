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
  MapPin,
  MessageSquare,
  HelpCircle,
  Gift,
  Copy
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
import FeedbackComplaintModal from "../components/member/FeedbackComplaintModal";

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
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [customerReviews, setCustomerReviews] = useState([]);
  const [customerComplaints, setCustomerComplaints] = useState([]);

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

      // 6. Fetch Customer Feedback
      const { data: fbData, error: fbError } = await supabase
        .from("feedback")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (!fbError) {
        setCustomerReviews(fbData || []);
      }

      // 7. Fetch Customer Complaints
      const { data: compData, error: compError } = await supabase
        .from("complaints")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (!compError) {
        setCustomerComplaints(compData || []);
      }

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

  const handleReviewSubmit = async (rating, reviewText) => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .insert({
          customer_id: user.id,
          rating,
          review_text: reviewText
        })
        .select();

      if (error) throw error;

      setToastMsg("Terima kasih atas ulasan berharga Anda!");
      setToastType("success");
      setShowToast(true);

      if (data && data.length > 0) {
        setCustomerReviews(prev => [data[0], ...prev]);
      }
      loadMemberData();
    } catch (err) {
      console.error("Error submitting review:", err);
      setToastMsg("Gagal mengirim ulasan.");
      setToastType("error");
      setShowToast(true);
    }
  };

  const handleComplaintSubmit = async (note) => {
    try {
      const { data, error } = await supabase
        .from("complaints")
        .insert({
          customer_id: user.id,
          note,
          status: "Pending"
        })
        .select();

      if (error) throw error;

      setToastMsg("Keluhan Anda telah dicatat, admin akan segera menanganinya!");
      setToastType("success");
      setShowToast(true);

      if (data && data.length > 0) {
        setCustomerComplaints(prev => [data[0], ...prev]);
      }
      loadMemberData();
    } catch (err) {
      console.error("Error submitting complaint:", err);
      setToastMsg("Gagal mengajukan tiket keluhan.");
      setToastType("error");
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/10 flex flex-col font-sans text-left">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Hero Welcome Banner */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 mb-8 text-white shadow-2xl shadow-emerald-500/20">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-400/20 rounded-full blur-2xl animate-pulse delay-500" />
            <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-cyan-400/10 rounded-full blur-xl" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                <span className="animate-bounce">🐾</span>
                <span>Portal Customer PetCare</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                Selamat Datang, {profile?.full_name?.split(" ")[0] || "Member"}! 👋
              </h1>
              <p className="text-emerald-100 text-sm max-w-lg font-medium leading-relaxed">
                Kelola rekam medis, riwayat transaksi belanja apotek, dan anabul kesayangan Anda dalam satu tempat.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/15 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
                <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">Anabul Saya</p>
                <p className="text-3xl font-black mt-1">{pets.length}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
                <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">Jadwal Aktif</p>
                <p className="text-3xl font-black mt-1">{appointments.filter(a => a.status !== "Completed" && a.status !== "Cancelled").length}</p>
              </div>
              <div className="bg-white/15 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20">
                <p className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">Poin Loyalitas</p>
                <p className="text-3xl font-black mt-1">{points.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── TAB BAR ── */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/50 p-2 rounded-[1.5rem] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 shadow-lg shadow-slate-200/50 mb-8 sticky top-20 z-20">
          {[
            { id: "overview", label: "Dashboard", icon: User, color: "emerald" },
            { id: "pets", label: "Hewan Saya", icon: PawPrint, color: "blue" },
            { id: "transactions", label: "Belanja", icon: Receipt, color: "amber" },
            { id: "appointments", label: "Jadwal", icon: CalendarCheck, color: "violet" },
            { id: "medical", label: "Rekam Medis", icon: ClipboardList, color: "rose" },
            { id: "feedback", label: "Bantuan", icon: MessageSquare, color: "indigo" }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const colorMap = {
              emerald: "from-emerald-500 to-teal-500 shadow-emerald-500/30",
              blue: "from-blue-500 to-cyan-500 shadow-blue-500/30",
              amber: "from-amber-500 to-orange-500 shadow-amber-500/30",
              violet: "from-violet-500 to-purple-500 shadow-violet-500/30",
              rose: "from-rose-500 to-pink-500 shadow-rose-500/30",
              indigo: "from-indigo-500 to-blue-500 shadow-indigo-500/30"
            };
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer justify-center group overflow-hidden ${
                  isActive
                    ? `bg-gradient-to-r ${colorMap[tab.color]} text-white shadow-lg`
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                {isActive && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* LOADING INDICATOR */}
        {loading ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/50 p-24 flex flex-col items-center justify-center shadow-2xl">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-sm text-slate-500 font-bold mt-6">Menyiapkan portal khusus Anda...</p>
            <p className="text-xs text-slate-400 mt-2">Mengambil data anabul & transaksi</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
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
                  
                  {/* Quick Actions Card */}
                  <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/50 p-6 shadow-lg">
                    <h4 className="font-extrabold text-slate-800 text-sm mb-4 flex items-center gap-2">
                      <span className="text-lg">⚡</span> Aksi Cepat
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setIsPetModalOpen(true)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                          <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Daftar Anabul</span>
                      </button>
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
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 hover:border-violet-300 hover:shadow-md transition-all duration-300 group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                          <CalendarCheck className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Buat Janji</span>
                      </button>
                      <button
                        onClick={() => setActiveTab("transactions")}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 hover:border-amber-300 hover:shadow-md transition-all duration-300 group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Belanja</span>
                      </button>
                      <button
                        onClick={() => setIsFeedbackModalOpen(true)}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 hover:border-emerald-300 hover:shadow-md transition-all duration-300 group cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">Ulasan</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Profile Detail Column */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Profile Info Card */}
                  <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[1.5rem] border border-slate-200/50 shadow-lg text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-emerald-100/50 to-teal-100/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/50">
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                            <User className="w-4 h-4" />
                          </div>
                          Informasi Akun & Alamat
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
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-600 text-xs font-bold hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 cursor-pointer"
                        >
                          Edit Profil
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-100 group hover:shadow-md transition-all duration-300">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">{profile?.full_name}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-100 group hover:shadow-md transition-all duration-300">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                            <Mail className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alamat Email</p>
                            <p className="text-sm font-bold text-slate-800 mt-1 truncate max-w-[200px]" title={profile?.email}>{profile?.email}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-100 group hover:shadow-md transition-all duration-300">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                            <Phone className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nomor HP</p>
                            <p className="text-sm font-bold text-slate-800 mt-1">{profile?.phone_number || "-"}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-100 group hover:shadow-md transition-all duration-300">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alamat Pengiriman</p>
                            <p className="text-sm font-bold text-slate-800 mt-1 leading-relaxed">{profile?.address || "-"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips Card */}
                  <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 backdrop-blur-xl border border-emerald-200/50 p-6 rounded-[1.5rem] shadow-lg flex items-start gap-4 relative overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-2xl shadow-lg shrink-0 group-hover:scale-110 transition-transform">
                      🛡️
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-extrabold text-slate-800 text-sm">Privasi & Keamanan Hewan</h4>
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                        Semua rekam medis anabul Anda dienkripsi secara aman. Hanya dokter hewan penanggung jawab yang dapat memodifikasi rekam medis demi kesehatan dan keselamatan anabul Anda.
                      </p>
                    </div>
                  </div>

                  {/* Ulasan & Bantuan Layanan Card */}
                  <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 p-6 rounded-[1.5rem] shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4 text-left relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-indigo-500/5 pointer-events-none" />
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-2xl shadow-lg shrink-0 group-hover:scale-110 transition-transform">
                        💬
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm">Ulasan & Bantuan Layanan</h4>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                          Beri ulasan klinik untuk meningkatkan pelayanan kami, atau laporkan kendala Anda kepada tim admin kami.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsFeedbackModalOpen(true)}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white text-xs font-bold shadow-lg shadow-violet-500/20 cursor-pointer transition-all duration-300 active:scale-[0.98] shrink-0 relative z-10"
                    >
                      Beri Masukan & Bantuan
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB CONTENT: PETS ── */}
            {activeTab === "pets" && (
              <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                        <PawPrint className="w-4 h-4" />
                      </div>
                      Daftar Anabul Kesayangan
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Kelola profil kesehatan hewan peliharaan Anda</p>
                  </div>
                  <button
                    onClick={() => setIsPetModalOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer transition-all duration-300 active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" /> Daftarkan Hewan Baru
                  </button>
                </div>

                {pets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/50 p-16 text-center shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg">
                        🐾
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-lg mb-2">Belum Ada Anabul Terdaftar</h4>
                      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                        Daftarkan hewan peliharaan Anda untuk mengakses rekam medis lengkap dan pengingat vaksinasi otomatis.
                      </p>
                      <button
                        onClick={() => setIsPetModalOpen(true)}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-500/20 cursor-pointer transition-all duration-300"
                      >
                        <Plus className="w-4 h-4" /> Mulai Daftarkan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB CONTENT: TRANSACTIONS ── */}
            {activeTab === "transactions" && (
              <div className="space-y-6">
                {/* Sub Tab Navigation inside Belanja Saya */}
                <div className="flex gap-4 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-200/50 shadow-lg">
                  <button
                    onClick={() => setSubTab("catalog")}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer ${
                      subTab === "catalog"
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-lg">💊</span>
                    Etalase Toko Obat
                  </button>
                  <button
                    onClick={() => setSubTab("history")}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer relative ${
                      subTab === "history"
                        ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/20"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-lg">📄</span>
                    Riwayat Belanja
                    {orders.length > 0 && (
                      <span className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                        subTab === "history"
                          ? "bg-white text-violet-600"
                          : "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                      } shadow-md`}>
                        {orders.length}
                      </span>
                    )}
                  </button>
                </div>

                {subTab === "catalog" ? (
                  <div className="space-y-6">
                    {/* Categories & Search */}
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                      <div className="flex gap-2 w-full lg:w-auto overflow-x-auto pb-2 scrollbar-none">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap cursor-pointer border ${
                              selectedCategory === cat
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 border-transparent text-white shadow-lg shadow-amber-500/20"
                                : "bg-white/80 backdrop-blur-xl border-slate-200/50 text-slate-600 hover:border-amber-300 hover:shadow-md"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>

                      <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Cari makanan, obat, alat medis..."
                          className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200/50 bg-white/80 backdrop-blur-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent transition-all shadow-lg"
                        />
                      </div>
                    </div>

                    {/* Products Grid */}
                    {filteredProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((p) => (
                          <ProductCard
                            key={p.id}
                            product={p}
                            addToCart={addToCart}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-[2.5rem] p-12 text-center max-w-md mx-auto space-y-4 shadow-xl">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-3xl mx-auto shadow-lg">
                          🔍
                        </div>
                        <h3 className="font-extrabold text-slate-800 text-base">Produk Tidak Ditemukan</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Kami tidak menemukan produk matching dengan kata kunci "{searchQuery}". Silakan coba kata kunci lain.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white">
                        <Receipt className="w-4 h-4" />
                      </div>
                      Invoice & Riwayat Belanja Apotek
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
                      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/50 p-16 text-center shadow-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-purple-50/50 pointer-events-none" />
                        <div className="relative z-10">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg">
                            🛒
                          </div>
                          <h4 className="font-extrabold text-slate-800 text-lg mb-2">Belum Ada Pembelian</h4>
                          <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                            Anda belum melakukan pembelian produk di apotek kami. Yuk mulai belanja!
                          </p>
                          <button
                            onClick={() => setSubTab("catalog")}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-violet-500/20 cursor-pointer transition-all duration-300"
                          >
                            <ShoppingBag className="w-4 h-4" /> Mulai Belanja
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── TAB CONTENT: APPOINTMENTS ── */}
            {activeTab === "appointments" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white">
                        <CalendarCheck className="w-4 h-4" />
                      </div>
                      Jadwal Pertemuan & Kunjungan
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Kelola janji temu dengan dokter hewan</p>
                  </div>
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
                    className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-lg shadow-violet-500/20 cursor-pointer transition-all duration-300 active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" /> Buat Janji Berobat
                  </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-20 h-20 bg-emerald-200/30 rounded-full blur-xl pointer-events-none" />
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Dikonfirmasi</p>
                    <p className="text-3xl font-black text-emerald-700 mt-2">{appointments.filter(a => a.status === "Confirmed").length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-20 h-20 bg-amber-200/30 rounded-full blur-xl pointer-events-none" />
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Menunggu</p>
                    <p className="text-3xl font-black text-amber-700 mt-2">{appointments.filter(a => a.status === "Pending").length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-gray-50 border border-slate-200/50 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-20 h-20 bg-slate-200/30 rounded-full blur-xl pointer-events-none" />
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Selesai</p>
                    <p className="text-3xl font-black text-slate-700 mt-2">{appointments.filter(a => a.status === "Completed").length}</p>
                  </div>
                </div>

                {appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((app) => (
                      <AppointmentCard
                        key={app.id}
                        app={app}
                        getPetEmoji={getPetEmoji}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/50 p-16 text-center shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 to-purple-50/50 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg">
                        📅
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-lg mb-2">Belum Ada Jadwal Janji Temu</h4>
                      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                        Jadwalkan kunjungan ke dokter hewan untuk pemeriksaan rutin atau vaksinasi anabul Anda.
                      </p>
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
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-violet-500/20 cursor-pointer transition-all duration-300"
                      >
                        <Plus className="w-4 h-4" /> Buat Janji Pertama
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB CONTENT: MEDICAL RECORDS ── */}
            {activeTab === "medical" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-800 mb-2 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    Histori Rekam Medis
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Riwayat diagnosa dan pengobatan anabul Anda</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200/50 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-20 h-20 bg-rose-200/30 rounded-full blur-xl pointer-events-none" />
                    <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Total Rekam</p>
                    <p className="text-3xl font-black text-rose-700 mt-2">{medicalRecords.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-20 h-20 bg-blue-200/30 rounded-full blur-xl pointer-events-none" />
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Hewan Terdaftar</p>
                    <p className="text-3xl font-black text-blue-700 mt-2">{pets.length}</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-2xl p-5 relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-20 h-20 bg-emerald-200/30 rounded-full blur-xl pointer-events-none" />
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Kunjungan Terakhir</p>
                    <p className="text-sm font-black text-emerald-700 mt-2">
                      {medicalRecords.length > 0 
                        ? new Date(medicalRecords[0].created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                        : "-"}
                    </p>
                  </div>
                </div>

                {medicalRecords.length > 0 ? (
                  <div className="space-y-4">
                    {medicalRecords.map((rec) => (
                      <MedicalRecordCard
                        key={rec.id}
                        rec={rec}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-200/50 p-16 text-center shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 to-pink-50/50 pointer-events-none" />
                    <div className="relative z-10">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg">
                        📋
                      </div>
                      <h4 className="font-extrabold text-slate-800 text-lg mb-2">Belum Ada Rekam Medis</h4>
                      <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
                        Rekam medis akan muncul setelah anabul Anda diperiksa oleh dokter hewan di klinik kami.
                      </p>
                      <button
                        onClick={() => setActiveTab("appointments")}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-rose-500/20 cursor-pointer transition-all duration-300"
                      >
                        <CalendarCheck className="w-4 h-4" /> Jadwalkan Kunjungan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB CONTENT: FEEDBACK & COMPLAINTS ── */}
            {activeTab === "feedback" && (
              <div className="space-y-8 animate-fade-in">
                {/* Hero Header */}
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-8 text-white shadow-2xl shadow-indigo-500/20">
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-violet-400/20 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-purple-400/10 rounded-full blur-xl" />
                  </div>
                  
                  <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-4">
                      <span>💬</span>
                      <span>Pusat Layanan Customer</span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight mb-3">Pusat Layanan & Masukan 🐾</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                      Kami berkomitmen untuk terus meningkatkan pelayanan kesehatan anabul kesayangan Anda. 
                      Silakan kirimkan kritik, saran, ulasan pengalaman Anda, atau laporkan kendala teknis.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setIsFeedbackModalOpen(true)}
                        className="px-5 py-3 bg-white text-indigo-600 hover:bg-slate-50 transition font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Tulis Ulasan Klinik
                      </button>
                      <button
                        onClick={() => setIsFeedbackModalOpen(true)}
                        className="px-5 py-3 bg-indigo-500/50 border border-indigo-400 hover:bg-indigo-500/70 transition font-extrabold rounded-xl text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Laporkan Masalah
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2-Column Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  
                  {/* Left Column: Tickets list */}
                  <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-[1.5rem] p-6 shadow-xl space-y-4 text-left">
                    <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-200/50 pb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-white">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      Status Keluhan & Tiket Bantuan ({customerComplaints.length})
                    </h4>
                    
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {customerComplaints.length > 0 ? (
                        customerComplaints.map((comp) => (
                          <div
                            key={comp.id}
                            className={`border rounded-2xl p-5 bg-gradient-to-br from-slate-50 to-gray-50 space-y-3 border-l-4 transition-all duration-300 hover:shadow-lg ${
                              comp.status === "Selesai" ? "border-l-emerald-500 border-slate-200" : "border-l-rose-500 border-slate-200"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-1 rounded-lg border border-slate-200">
                                ID: #{comp.id.slice(0, 8).toUpperCase()}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-3 py-1 rounded-full ${
                                  comp.status === "Selesai"
                                    ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200"
                                    : "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border border-rose-200 animate-pulse"
                                }`}
                              >
                                {comp.status === "Selesai" ? "✓ Teratasi" : "⏳ Diproses"}
                              </span>
                            </div>
                            
                            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-100">
                              "{comp.note}"
                            </p>

                            {/* Compensation Claim Card if solved & sent */}
                            {comp.status === "Selesai" && comp.compensation_sent && (
                              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div>
                                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                                    <Gift className="w-4 h-4 text-amber-500 animate-bounce" />
                                    Voucher Kompensasi 15% Aktif!
                                  </div>
                                  <p className="text-[10px] text-amber-600/90 font-medium mt-1">Voucher khusus diskon belanja obat/grooming.</p>
                                </div>
                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                  <code className="bg-white border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-black text-slate-700 tracking-wider shadow-sm">
                                    VCHR-{comp.id.slice(0, 5).toUpperCase()}
                                  </code>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(`VCHR-${comp.id.slice(0, 5).toUpperCase()}`);
                                      setToastMsg("Kode voucher disalin!");
                                      setToastType("success");
                                      setShowToast(true);
                                    }}
                                    className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white transition cursor-pointer shadow-md"
                                    title="Salin Voucher"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="py-12 text-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-3xl mx-auto mb-4">
                            ✅
                          </div>
                          <p className="text-sm text-slate-500 font-semibold">Belum ada keluhan yang dilaporkan</p>
                          <p className="text-xs text-slate-400 mt-1">Terima kasih atas kerja samanya!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Reviews list */}
                  <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-[1.5rem] p-6 shadow-xl space-y-4 text-left">
                    <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-200/50 pb-4">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      Riwayat Ulasan Saya ({customerReviews.length})
                    </h4>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {customerReviews.length > 0 ? (
                        customerReviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="border border-slate-200 rounded-2xl p-5 bg-gradient-to-br from-slate-50 to-gray-50 space-y-3 text-left hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-lg ${
                                      i < rev.rating ? "text-amber-400" : "text-slate-200"
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-[10px] text-slate-500 font-bold bg-white px-2 py-1 rounded-lg border border-slate-200">
                                {new Date(rev.created_at).toLocaleDateString("id-ID", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric"
                                })}
                              </span>
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-100">
                              "{rev.review_text}"
                            </p>

                            {/* Reply if answered */}
                            {rev.is_replied && rev.reply_text && (
                              <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-4 flex gap-3 ml-4">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-md">
                                  CS
                                </div>
                                <div className="text-xs leading-relaxed">
                                  <span className="font-extrabold text-violet-900 block mb-1">Tanggapan Klinik PetCare</span>
                                  <p className="text-slate-700 font-medium">{rev.reply_text}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="py-12 text-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-3xl mx-auto mb-4">
                            ⭐
                          </div>
                          <p className="text-sm text-slate-500 font-semibold">Belum ada ulasan yang dibuat</p>
                          <p className="text-xs text-slate-400 mt-1">Bagikan ulasan pertama Anda!</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="relative mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 py-12 text-center">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                <PawPrint className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                PetCare <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">CRM</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium">&copy; {new Date().getFullYear()} PetCare CRM. Hak Cipta Dilindungi.</p>
            <p className="text-slate-500 text-xs mt-2 font-medium">Collaborative Customer Portal Area &bull; Layanan Terintegrasi Klinik Hewan</p>
            
            <div className="flex justify-center gap-6 mt-6">
              <button onClick={() => setActiveTab("overview")} className="text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">Dashboard</button>
              <button onClick={() => setActiveTab("pets")} className="text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">Hewan Saya</button>
              <button onClick={() => setActiveTab("transactions")} className="text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">Belanja</button>
              <button onClick={() => setActiveTab("feedback")} className="text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer">Bantuan</button>
            </div>
          </div>
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
          className="fixed bottom-6 right-6 z-40 p-5 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer border-2 border-white/20 group"
          title="Buka Keranjang Saya"
        >
          <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[11px] w-7 h-7 rounded-full flex items-center justify-center font-black border-2 border-white animate-pulse shadow-lg">
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

      {/* ── FEEDBACK & COMPLAINT MODAL ── */}
      <FeedbackComplaintModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        onSubmitReview={handleReviewSubmit}
        onSubmitComplaint={handleComplaintSubmit}
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
