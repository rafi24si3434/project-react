import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { 
  PawPrint, ArrowRight, ShieldCheck, CalendarCheck, 
  Megaphone, Star, ClipboardList, Users, 
  TrendingUp, Sparkles, Clock, CheckCircle2, Heart, 
  Activity, Info, ShoppingBag, Plus, Minus, Check, AlertCircle, Calendar, User, Mail, Phone
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // --- New Booking & Quick Shop States ---
  const [activeTab, setActiveTab] = useState("booking"); // "booking" | "shop"
  const [products, setProducts] = useState([]);
  const [myPets, setMyPets] = useState([]);
  
  // Owner info for guest
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  
  // Pet info
  const [selectedPetId, setSelectedPetId] = useState("new"); // "new" or uuid
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("Kucing");
  const [petBreed, setPetBreed] = useState("");
  const [petGender, setPetGender] = useState("Jantan");
  
  // Appointment info
  const [bookingType, setBookingType] = useState("Grooming");
  const [bookingDoctor, setBookingDoctor] = useState("drh. Nisa Putri");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("09:00");
  const [bookingNotes, setBookingNotes] = useState("");
  
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState("");
  const [bookingErrorMsg, setBookingErrorMsg] = useState("");

  // Quick Shop Cart state
  const [selectedProduct, setSelectedProduct] = useState(null); // product object for checkout modal
  const [purchaseQty, setPurchaseQty] = useState(1);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccessMsg, setCheckoutSuccessMsg] = useState("");
  const [checkoutErrorMsg, setCheckoutErrorMsg] = useState("");

  // Fetch products and user's pets
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchMyPets = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from("pets")
            .select("*")
            .eq("owner_id", user.id);
          if (error) throw error;
          setMyPets(data || []);
          if (data && data.length > 0) {
            setSelectedPetId(data[0].id);
          } else {
            setSelectedPetId("new");
          }
        } catch (err) {
          console.error("Error fetching pets:", err);
        }
      } else {
        setMyPets([]);
        setSelectedPetId("new");
      }
    };
    fetchMyPets();
  }, [user]);

  // Handler: Pendaftaran & Booking
  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingErrorMsg("");
    setBookingSuccessMsg("");

    if (!user) {
      if (!ownerName || !ownerEmail || !ownerPhone) {
        setBookingErrorMsg("Harap isi semua informasi pemilik!");
        return;
      }
    }

    if (selectedPetId === "new" && !petName) {
      setBookingErrorMsg("Harap isi nama hewan peliharaan Anda!");
      return;
    }

    if (!bookingDate || !bookingTime) {
      setBookingErrorMsg("Harap tentukan tanggal dan jam janji temu!");
      return;
    }

    setBookingLoading(true);

    try {
      let activeUserId = user?.id;
      let isNewUserCreated = false;

      // 1. Register user if not authenticated
      if (!user) {
        const dummyPassword = "PetCare123!";
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: ownerEmail,
          password: dummyPassword,
        });

        if (authError) throw authError;

        if (!authData?.user) {
          throw new Error("Pendaftaran akun gagal. Silakan coba lagi.");
        }

        activeUserId = authData.user.id;
        isNewUserCreated = true;

        // Create public profile record (use upsert to link pre-existing profiles)
        const { error: profileError } = await supabase.from("users").upsert({
          auth_user_id: activeUserId,
          full_name: ownerName,
          email: ownerEmail,
          phone_number: ownerPhone,
          role: "customer"
        }, { onConflict: "email" });

        if (profileError) throw profileError;

        // Log registration
        await supabase.from("activity_logs").insert({
          user_id: activeUserId,
          activity: "Customer Baru Terdaftar",
          description: `Customer baru dengan nama ${ownerName} (${ownerEmail}) mendaftar via formulir Landing Page.`
        });
      }

      // 2. Add/Select Pet
      let petUuid = selectedPetId;

      if (selectedPetId === "new") {
        const { data: petData, error: petError } = await supabase
          .from("pets")
          .insert({
            owner_id: activeUserId,
            name: petName,
            type: petType,
            breed: petBreed || "Campuran",
            gender: petGender,
          })
          .select()
          .single();

        if (petError) throw petError;
        petUuid = petData.id;

        // Log pet registration
        await supabase.from("activity_logs").insert({
          user_id: activeUserId,
          activity: "Customer Menambahkan Hewan",
          description: `Mendaftarkan hewan peliharaan baru: ${petName} (${petType}).`
        });
      }

      // 3. Insert Appointment
      const { error: appError } = await supabase.from("appointments").insert({
        owner_id: activeUserId,
        pet_id: petUuid,
        doctor: bookingDoctor,
        date: bookingDate,
        time: bookingTime,
        type: bookingType,
        notes: bookingNotes,
        status: "Pending"
      });

      if (appError) throw appError;

      // Log appointment
      await supabase.from("activity_logs").insert({
        user_id: activeUserId,
        activity: "Customer Membuat Janji Temu",
        description: `Membuat janji temu ${bookingType} pada ${bookingDate} pukul ${bookingTime}.`
      });

      // Show success
      if (isNewUserCreated) {
        setBookingSuccessMsg(`Pendaftaran & Booking Berhasil! Akun Anda telah dibuat dengan password default 'PetCare123!'. Silakan login di PetCare.`);
      } else {
        setBookingSuccessMsg(`Booking Berhasil! Jadwal janji temu Anda telah terdaftar.`);
      }

      // Reset
      if (selectedPetId === "new") {
        setPetName("");
        setPetBreed("");
      }
      setBookingDate("");
      setBookingNotes("");

      if (user) {
        // Refresh local pets list
        const { data: updatedPets } = await supabase
          .from("pets")
          .select("*")
          .eq("owner_id", user.id);
        setMyPets(updatedPets || []);
      }

    } catch (err) {
      console.error("Booking error details:", err);
      setBookingErrorMsg(err.message || "Gagal memproses booking pendaftaran.");
    } finally {
      setBookingLoading(false);
    }
  };

  // Handler: Quick Pharmacy Checkout
  const handleQuickCheckout = async (e) => {
    e.preventDefault();
    setCheckoutErrorMsg("");
    setCheckoutSuccessMsg("");

    if (!selectedProduct) return;

    if (!user) {
      if (!ownerName || !ownerEmail || !ownerPhone) {
        setCheckoutErrorMsg("Harap lengkapi semua informasi pembeli!");
        return;
      }
    }

    if (purchaseQty <= 0) {
      setCheckoutErrorMsg("Kuantitas produk minimal 1!");
      return;
    }

    if (purchaseQty > selectedProduct.stock) {
      setCheckoutErrorMsg(`Stok produk tidak mencukupi! Hanya tersedia ${selectedProduct.stock} unit.`);
      return;
    }

    setCheckoutLoading(true);

    try {
      let activeUserId = user?.id;
      let isNewUserCreated = false;

      // 1. Auto register guest if needed
      if (!user) {
        const dummyPassword = "PetCare123!";
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: ownerEmail,
          password: dummyPassword,
        });

        if (authError) throw authError;

        if (!authData?.user) {
          throw new Error("Gagal mendaftarkan akun baru.");
        }

        activeUserId = authData.user.id;
        isNewUserCreated = true;

        // Create user profile (use upsert to link pre-existing profiles)
        const { error: profileError } = await supabase.from("users").upsert({
          auth_user_id: activeUserId,
          full_name: ownerName,
          email: ownerEmail,
          phone_number: ownerPhone,
          role: "customer"
        }, { onConflict: "email" });

        if (profileError) throw profileError;

        // Log registration
        await supabase.from("activity_logs").insert({
          user_id: activeUserId,
          activity: "Customer Baru Terdaftar",
          description: `Customer baru dengan nama ${ownerName} mendaftar dari formulir Toko Obat Landing Page.`
        });
      }

      // 2. Verify stock
      const { data: latestProduct, error: prodErr } = await supabase
        .from("products")
        .select("stock")
        .eq("id", selectedProduct.id)
        .single();

      if (prodErr) throw prodErr;
      if (latestProduct.stock < purchaseQty) {
        throw new Error(`Stok produk tidak mencukupi! Hanya tersedia ${latestProduct.stock} unit.`);
      }

      const totalAmount = selectedProduct.price * purchaseQty;

      // 3. Insert into orders
      const { data: orderData, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_id: activeUserId,
          total_amount: totalAmount,
          status: "Pending",
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 4. Insert into order_items
      const { error: itemErr } = await supabase.from("order_items").insert({
        order_id: orderData.id,
        product_id: selectedProduct.id,
        quantity: purchaseQty,
        price: selectedProduct.price,
      });

      if (itemErr) throw itemErr;

      // 5. Update product stock
      const { error: stockErr } = await supabase
        .from("products")
        .update({ stock: latestProduct.stock - purchaseQty })
        .eq("id", selectedProduct.id);

      if (stockErr) throw stockErr;

      // 6. Log transaction activity
      await supabase.from("activity_logs").insert({
        user_id: activeUserId,
        activity: "Customer Membeli Produk",
        description: `Membeli ${selectedProduct.name} sebanyak ${purchaseQty} unit senilai Rp ${totalAmount.toLocaleString("id-ID")}.`
      });

      // Show success
      if (isNewUserCreated) {
        setCheckoutSuccessMsg(`Pembelian Berhasil! Akun Anda telah dibuat dengan password default 'PetCare123!'. Silakan gunakan email Anda untuk login di PetCare.`);
      } else {
        setCheckoutSuccessMsg(`Pembelian Berhasil! Pesanan Anda telah dibuat dan sedang diproses.`);
      }

      // Refresh products list
      const { data: updatedProducts } = await supabase.from("products").select("*");
      setProducts(updatedProducts || []);

      // Reset qty and selected product after delay
      setPurchaseQty(1);
      setTimeout(() => {
        setSelectedProduct(null);
        setCheckoutSuccessMsg("");
      }, 5000);

    } catch (err) {
      console.error("Checkout error details:", err);
      setCheckoutErrorMsg(err.message || "Gagal memproses pembelian produk.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // --- Treatment Simulator & CRM Discount States ---
  const [selectedPet, setSelectedPet] = useState("cat"); // "cat" | "dog" | "rabbit"
  const [selectedTreatment, setSelectedTreatment] = useState("grooming"); // "grooming" | "vaccine" | "surgery" | "consultation"
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const handleCTA = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };

  // --- Helper Functions for Calculator ---
  const getBasePrice = (treatment) => {
    switch (treatment) {
      case "grooming": return 150000;
      case "vaccine": return 250000;
      case "surgery": return 800000;
      case "consultation": return 120000;
      default: return 0;
    }
  };

  const getTreatmentLabel = (t) => {
    switch (t) {
      case "grooming": return "Grooming Sehat & Kutu";
      case "vaccine": return "Vaksinasi Lengkap (F3/F4)";
      case "surgery": return "Operasi Sterilisasi Bedah";
      case "consultation": return "Konsultasi Dokter Hewan";
      default: return "";
    }
  };

  const applyPromoCode = (e) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponError("Kode kupon tidak boleh kosong");
      return;
    }

    if (code === "PAWSOME20") {
      setAppliedCoupon(code);
      setCouponSuccess("Kupon hemat 20% berhasil diterapkan!");
    } else if (code === "VAKSIN10" && selectedTreatment === "vaccine") {
      setAppliedCoupon(code);
      setCouponSuccess("Kupon hemat 10% untuk Vaksin berhasil diterapkan!");
    } else if (code === "VAKSIN10") {
      setCouponError("Kupon VAKSIN10 hanya berlaku untuk jenis perawatan Vaksinasi");
    } else if (code === "GROOMINGFREE" && selectedTreatment === "grooming") {
      setAppliedCoupon(code);
      setCouponSuccess("Potongan flat Rp 50.000 untuk Grooming berhasil diterapkan!");
    } else if (code === "GROOMINGFREE") {
      setCouponError("Kupon GROOMINGFREE hanya berlaku untuk perawatan Grooming");
    } else if (code === "FIRSTNEW") {
      setAppliedCoupon(code);
      setCouponSuccess("Diskon pengguna baru 15% berhasil diterapkan!");
    } else {
      setCouponError("Kode kupon tidak valid. Coba PAWSOME20 atau FIRSTNEW!");
    }
  };

  const calculatedValues = useMemo(() => {
    const base = getBasePrice(selectedTreatment);
    let discount = 0;
    
    if (appliedCoupon === "PAWSOME20") {
      discount = base * 0.20;
    } else if (appliedCoupon === "VAKSIN10" && selectedTreatment === "vaccine") {
      discount = base * 0.10;
    } else if (appliedCoupon === "GROOMINGFREE" && selectedTreatment === "grooming") {
      discount = 50000;
    } else if (appliedCoupon === "FIRSTNEW") {
      discount = base * 0.15;
    }

    return {
      basePrice: base,
      discount: discount,
      finalPrice: base - discount
    };
  }, [selectedTreatment, appliedCoupon]);

  // --- Step-by-Step Treatment Care descriptions ---
  const getTreatmentSteps = (treatment) => {
    switch (treatment) {
      case "grooming":
        return [
          { step: "Langkah 1", title: "Deteksi Kutu & Penimbangan", desc: "Pengecekan kulit menyeluruh oleh staf untuk mendeteksi jamur/kutu sebelum mandi." },
          { step: "Langkah 2", title: "Mandi Terapi Khusus", desc: "Pembersihan menggunakan air hangat dan sampo antikutu atau obat jamur sesuai kondisi kulit." },
          { step: "Langkah 3", title: "Blowing & Perapian Kuku", desc: "Bulu dikeringkan steril menggunakan blower berisik rendah agar anabul tidak stres, dilanjutkan potong kuku." },
          { step: "Langkah 4", title: "Disinfeksi & Parfum", desc: "Pembersihan rongga telinga dengan ear cleaner dan semprotan parfum organik wangi segar." }
        ];
      case "vaccine":
        return [
          { step: "Langkah 1", title: "Skrining Suhu Tubuh", desc: "Pengecekan suhu rektal anabul wajib di bawah 39.2°C untuk menjamin kondisi fit." },
          { step: "Langkah 2", title: "Auskultasi Jantung & Paru", desc: "Dokter memeriksa detak jantung dan pernapasan untuk memastikan tidak ada infeksi aktif." },
          { step: "Langkah 3", title: "Penyuntikan Vaksin Steril", desc: "Injeksi subkutan vaksin (Rabies/F3/F4) menggunakan spuit sekali pakai yang dijamin steril." },
          { step: "Langkah 4", title: "Catatan Buku Vaksin Digital", desc: "Pencatatan batch vaksin ke rekam medis Supabase dan penempelan stiker di buku vaksin cetak." }
        ];
      case "surgery":
        return [
          { step: "Langkah 1", title: "Pemeriksaan Darah Lengkap", desc: "Tes kimia darah sebelum operasi untuk mengecek kesiapan organ ginjal & hati menerima anestesi." },
          { step: "Langkah 2", title: "Pembiusan & Premedikasi", desc: "Pemberian penenang (sedasi) dilanjutkan anestesi gas inhalasi yang aman dan minim risiko." },
          { step: "Langkah 3", title: "Tindakan Sterilisasi/Operasi", desc: "Operasi bedah dilakukan di ruang steril dengan monitoring ketat detak jantung dan saturasi oksigen." },
          { step: "Langkah 4", title: "Pemulihan Inkubator Hangat", desc: "Anabul diistirahatkan di kandang inkubator berpenghangat pasca-operasi untuk memulihkan suhu tubuh." }
        ];
      case "consultation":
        return [
          { step: "Langkah 1", title: "Wawancara Anamnesis", desc: "Tanya jawab dokter dengan pemilik mengenai keluhan nafsu makan, keaktifan, dan pencernaan." },
          { step: "Langkah 2", title: "Pemeriksaan Fisik Palpasi", desc: "Dokter meraba area abdomen, mengecek kelembapan gusi, warna konjungtiva mata, dan hidung." },
          { step: "Langkah 3", title: "Rekomendasi Diagnosis Penunjang", desc: "Saran tes laboratorium, rontgen, atau USG jika ditemukan indikasi klinis penyakit dalam." },
          { step: "Langkah 4", title: "Resep & Konseling Obat", desc: "Pemberian obat terapi beserta petunjuk dosis makan yang dimasukkan dalam rekam medis CRM." }
        ];
      default:
        return [];
    }
  };

  const treatmentSteps = getTreatmentSteps(selectedTreatment);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 text-left overflow-x-hidden">
      
      {/* ─── HEADER / NAVBAR ─── */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <PawPrint className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-800 tracking-tight">
              PetCare <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">CRM</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-650">
            <a href="#fitur" className="hover:text-emerald-600 transition-colors">Fitur Utama</a>
            <a href="#simulator" className="hover:text-emerald-600 transition-colors">Simulator Klinik & Diskon</a>
            <a href="#crm" className="hover:text-emerald-600 transition-colors">Fungsi CRM</a>
            <a href="#statistik" className="hover:text-emerald-600 transition-colors">Performa</a>
            <a href="#testimoni" className="hover:text-emerald-600 transition-colors">Testimoni</a>
          </nav>

          {/* Header Action Button */}
          <div>
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold px-5.5 py-2.5 rounded-xl shadow-md shadow-emerald-500/15 active:scale-[0.98] transition-all"
              >
                <span>Masuk Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-xs font-bold text-gray-650 hover:text-emerald-600 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold px-5.5 py-2.5 rounded-xl shadow-md shadow-emerald-500/15 active:scale-[0.98] transition-all"
                >
                  Daftar Gratis
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-white">
        {/* Glow patterns */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-6 lg:pr-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Solusi CRM & Klinik Hewan Profesional
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.08] tracking-tight">
              Tingkatkan Loyalitas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500">
                Pet Owners
              </span> <br />
              Dengan CRM Cerdas.
            </h1>
            
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-xl">
              Kelola rekam medis, otomatisasi janji temu, dan dorong promosi strategis untuk anabul kesayangan pelanggan Anda dalam satu sistem CRM Klinik Hewan yang modern dan intuitif.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleCTA}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-emerald-500 to-teal-500 hover:from-emerald-600 hover:via-emerald-600 hover:to-teal-600 text-white font-bold text-sm px-7 py-4 rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                {user ? "Masuk ke Dashboard Saya" : "Mulai Percobaan Gratis"}
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#fitur"
                className="flex items-center justify-center border-2 border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 font-bold text-sm px-6 py-3.5 rounded-2xl transition"
              >
                Pelajari Fitur
              </a>
            </div>

            {/* Micro proof check */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-100 max-w-md">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> Tanpa Kartu Kredit
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" /> Akun Demo Siap Pakai
              </div>
            </div>
          </div>

          {/* Right UI Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-slate-900 rounded-[2.5rem] p-6 shadow-2xl border border-slate-800/80 max-w-md mx-auto overflow-hidden">
              <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-emerald-500/20 rounded-full blur-[60px]" />
              
              <div className="flex gap-1.5 mb-6 relative z-10">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>

              <div className="space-y-4 relative z-10 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>🐾</span> PetCare Dashboard
                  </div>
                  <div className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black">LIVE</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 flex justify-between items-center text-white">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Transaksi CRM</p>
                    <p className="text-xl font-black mt-1 text-emerald-400">Rp 48,250,000</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 text-white space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <span className="font-extrabold text-[11px] text-slate-350">AI Sentiment Customer Feedback</span>
                    <span className="text-[9px] font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">94.2% Positif</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-2 rounded bg-emerald-500" title="94% Senang" />
                    <div className="w-3 h-2 rounded bg-amber-500" title="4% Netral" />
                    <div className="w-2.5 h-2 rounded bg-red-500" title="2% Komplain" />
                  </div>
                  
                  <div className="white/5 p-2.5 rounded-xl text-[10px] text-slate-450 border border-slate-800/60 italic">
                    "drh. Nisa melayani Mochi dengan sangat sabar. Sukses selalu untuk klinik PetCare!"
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 text-white space-y-2.5">
                  <span className="font-extrabold text-[11px] text-slate-355 block text-left">Antrean Poli Aktif</span>
                  
                  <div className="flex items-center justify-between text-[10px] bg-slate-900/40 p-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🐱</span>
                      <div>
                        <p className="font-bold">Mochi</p>
                        <p className="text-[9px] text-slate-500">Booster Vaksin</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded animate-pulse">AKTIF</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] bg-slate-900/40 p-2 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🐶</span>
                      <div>
                        <p className="font-bold">Rex</p>
                        <p className="text-[9px] text-slate-500">Dermatologi</p>
                      </div>
                    </div>
                    <span className="text-[8px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">ANTRI</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white border border-gray-150 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce duration-1000 max-w-[170px] text-xs">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                <Heart className="w-4 h-4 fill-current animate-pulse" />
              </div>
              <div>
                <p className="font-bold text-gray-850 text-[10px]">10,000+</p>
                <p className="text-[9px] text-gray-400 font-bold leading-tight">Anabul Terlayani</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="fitur" className="py-20 bg-slate-50 border-t border-gray-150 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Fitur Platform
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Satu Sistem Untuk Semua Kebutuhan Klinik
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-semibold">
              Klinik tidak lagi kesulitan mengintegrasikan data rekam medis dengan komunikasi pelanggan. Semuanya tersambung otomatis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur 1 */}
            <div className="bg-white border border-gray-150 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">E-Medical Records</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Catatan rekam medis terstruktur, riwayat alergi, diagnosis penyakit, dan daftar obat. Aman dan tersinkronisasi.
              </p>
            </div>

            {/* Fitur 2 */}
            <div className="bg-white border border-gray-150 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Janji Temu Online</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Sistem penjadwalan online tanpa repot. Customer dapat memilih tanggal, hewan peliharaan, dan dokter yang diinginkan.
              </p>
            </div>

            {/* Fitur 3 */}
            <div className="bg-white border border-gray-150 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Keamanan Supabase</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                Otentikasi terenkripsi Supabase Auth dan Row Level Security (RLS). Menjamin hak privasi data rekam medis pasien aman.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="simulator" className="py-20 bg-white border-t border-gray-150 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Layanan Mandiri Pelanggan
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pendaftaran, Jadwal Temu & Beli Obat
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-semibold">
              Gunakan formulir interaktif di bawah ini untuk mendaftarkan hewan peliharaan Anda, menjadwalkan pemeriksaan, atau membeli obat dan makanan anabul secara langsung.
            </p>

            {/* Tab switcher */}
            <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-gray-200 mt-6 shadow-sm">
              <button
                onClick={() => setActiveTab("booking")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "booking"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                Pendaftaran & Booking Jadwal
              </button>
              <button
                onClick={() => setActiveTab("shop")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "shop"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Toko Obat & Apotek Cepat
              </button>
            </div>
          </div>

          {/* TAB 1: BOOKING & REGISTRATION */}
          {activeTab === "booking" && (
            <div className="max-w-4xl mx-auto bg-white border border-gray-150 rounded-[2.5rem] p-6 md:p-10 shadow-xl relative overflow-hidden animate-in fade-in duration-300">
              <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[80px]" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-800">Formulir Booking & Pendaftaran Hewan</h3>
                    <p className="text-xs text-slate-400 font-medium">Isi detail lengkap di bawah untuk mengajukan antrean klinik</p>
                  </div>
                </div>

                {bookingSuccessMsg && (
                  <div className="mb-6 bg-emerald-50 border border-emerald-250 text-emerald-700 text-xs px-5 py-4 rounded-2xl font-bold flex items-start gap-3">
                    <span className="text-base">✅</span>
                    <p className="text-left leading-relaxed">{bookingSuccessMsg}</p>
                  </div>
                )}

                {bookingErrorMsg && (
                  <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-xs px-5 py-4 rounded-2xl font-bold flex items-start gap-3">
                    <span className="text-base">⚠️</span>
                    <p className="text-left leading-relaxed">{bookingErrorMsg}</p>
                  </div>
                )}

                <form onSubmit={handleBooking} className="space-y-8 text-left">
                  
                  {/* SECTION A: OWNER INFO (GUEST ONLY) */}
                  {!user && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <span>1.</span> Informasi Pemilik (Registrasi Otomatis)
                      </h4>
                      <div className="bg-emerald-50/45 border border-emerald-100 rounded-2xl p-4 mb-4 text-[11px] text-emerald-800 font-semibold leading-relaxed">
                        💡 Anda belum masuk ke sistem. Mengisi form ini akan otomatis mendaftarkan akun PetCare Anda secara gratis menggunakan email & nomor telepon Anda dengan password default <strong>PetCare123!</strong>.
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Nama Lengkap</label>
                          <div className="relative flex items-center rounded-xl border border-gray-200 bg-white focus-within:border-emerald-500 overflow-hidden transition">
                            <span className="absolute left-3 text-gray-400 text-xs"><User className="w-3.5 h-3.5" /></span>
                            <input
                              type="text"
                              value={ownerName}
                              onChange={(e) => setOwnerName(e.target.value)}
                              placeholder="cth. John Doe"
                              className="w-full pl-9 pr-3 py-2.5 text-xs focus:outline-none font-bold text-slate-800"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Email Aktif</label>
                          <div className="relative flex items-center rounded-xl border border-gray-200 bg-white focus-within:border-emerald-500 overflow-hidden transition">
                            <span className="absolute left-3 text-gray-400 text-xs"><Mail className="w-3.5 h-3.5" /></span>
                            <input
                              type="email"
                              value={ownerEmail}
                              onChange={(e) => setOwnerEmail(e.target.value)}
                              placeholder="john@example.com"
                              className="w-full pl-9 pr-3 py-2.5 text-xs focus:outline-none font-bold text-slate-800"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">No. Telepon / WhatsApp</label>
                          <div className="relative flex items-center rounded-xl border border-gray-200 bg-white focus-within:border-emerald-500 overflow-hidden transition">
                            <span className="absolute left-3 text-gray-400 text-xs"><Phone className="w-3.5 h-3.5" /></span>
                            <input
                              type="tel"
                              value={ownerPhone}
                              onChange={(e) => setOwnerPhone(e.target.value)}
                              placeholder="0812-xxxx-xxxx"
                              className="w-full pl-9 pr-3 py-2.5 text-xs focus:outline-none font-bold text-slate-800"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SECTION B: PET INFO */}
                  <div className="space-y-4 pt-4 border-t border-dashed border-gray-150">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <span>{user ? "1." : "2."}</span> Informasi Hewan Peliharaan
                    </h4>
                    
                    {user && myPets.length > 0 && (
                      <div className="mb-4">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Pilih Hewan Peliharaan Anda</label>
                        <select
                          value={selectedPetId}
                          onChange={(e) => setSelectedPetId(e.target.value)}
                          className="w-full md:w-80 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-bold text-xs cursor-pointer"
                        >
                          {myPets.map((pet) => (
                            <option key={pet.id} value={pet.id}>🐾 {pet.name} ({pet.type})</option>
                          ))}
                          <option value="new">➕ Daftarkan Hewan Baru</option>
                        </select>
                      </div>
                    )}

                    {(selectedPetId === "new" || !user) && (
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-slate-50 border border-gray-200/70 rounded-2xl">
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Nama Hewan <span className="text-rose-500">*</span></label>
                          <input
                            type="text"
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                            placeholder="cth. Mochi, Rex"
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-bold text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Jenis Hewan</label>
                          <select
                            value={petType}
                            onChange={(e) => setPetType(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-bold text-xs cursor-pointer"
                          >
                            <option value="Kucing">🐱 Kucing</option>
                            <option value="Anjing">🐶 Anjing</option>
                            <option value="Kelinci">🐰 Kelinci</option>
                            <option value="Lainnya">🐾 Lainnya</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Ras / Breed</label>
                          <input
                            type="text"
                            value={petBreed}
                            onChange={(e) => setPetBreed(e.target.value)}
                            placeholder="Persia, Kampung, dll"
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-bold text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Jenis Kelamin</label>
                          <select
                            value={petGender}
                            onChange={(e) => setPetGender(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-bold text-xs cursor-pointer"
                          >
                            <option value="Jantan">Jantan</option>
                            <option value="Betina">Betina</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* SECTION C: APPOINTMENT INFO */}
                  <div className="space-y-4 pt-4 border-t border-dashed border-gray-150">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <span>{user ? "2." : "3."}</span> Informasi Jadwal Temu / Layanan
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Jenis Perawatan</label>
                        <select
                          value={bookingType}
                          onChange={(e) => setBookingType(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-bold text-xs cursor-pointer"
                        >
                          <option value="Grooming">🧴 Grooming</option>
                          <option value="Vaksinasi">💉 Vaksinasi</option>
                          <option value="Sakit / Konsultasi">🩺 Sakit / Konsultasi</option>
                          <option value="Sterilisasi">✂️ Operasi / Sterilisasi</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Dokter Pilihan</label>
                        <select
                          value={bookingDoctor}
                          onChange={(e) => setBookingDoctor(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-bold text-xs cursor-pointer"
                        >
                          <option value="drh. Nisa Putri">drh. Nisa Putri</option>
                          <option value="drh. Aditya Ramadhan">drh. Aditya Ramadhan</option>
                          <option value="drh. Sari Putri">drh. Sari Putri</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Pilih Tanggal</label>
                        <input
                          type="date"
                          value={bookingDate}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-bold text-xs cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Pilih Jam</label>
                        <select
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-bold text-xs cursor-pointer"
                        >
                          <option value="09:00">09:00 WIB</option>
                          <option value="10:00">10:00 WIB</option>
                          <option value="11:00">11:00 WIB</option>
                          <option value="13:00">13:00 WIB</option>
                          <option value="14:00">14:00 WIB</option>
                          <option value="15:00">15:00 WIB</option>
                          <option value="16:00">16:00 WIB</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Keluhan atau Catatan Tambahan</label>
                      <textarea
                        rows={3}
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        placeholder="Tulis keluhan atau kebutuhan khusus anabul Anda di sini..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-semibold text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      disabled={bookingLoading}
                      className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs px-8 py-4 rounded-xl shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
                    >
                      {bookingLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Memproses pendaftaran...</span>
                        </>
                      ) : (
                        <>
                          <span>Kirim Pendaftaran & Booking</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

          {/* TAB 2: TOKO OBAT & APOTEK CEPAT */}
          {activeTab === "shop" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-slate-50 border border-gray-200 rounded-3xl p-5 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-5 mb-6 text-left">
                  <div>
                    <h3 className="font-extrabold text-base text-gray-800">Apotek & Toko Obat PetCare</h3>
                    <p className="text-xs text-gray-400 font-medium">Beli obat cacing, vitamin, makanan medis, atau vaksin untuk anabul langsung di sini.</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 border border-emerald-250 px-3 py-1 rounded-full">
                    ⚡ Instant Checkout
                  </span>
                </div>

                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition duration-300 text-left"
                      >
                        <div>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            product.category === 'Obat' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            product.category === 'Makanan' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {product.category}
                          </span>
                          <h4 className="font-extrabold text-sm text-gray-850 mt-3.5 leading-tight">{product.name}</h4>
                          <p className="text-[10px] text-gray-400 mt-1 font-semibold line-clamp-2 leading-relaxed min-h-[30px]">{product.description}</p>
                          
                          <div className="my-3 border-t border-dashed border-gray-100" />
                          
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-gray-400">Stok: <strong className="text-gray-750">{product.stock} {product.unit}</strong></span>
                            <span className="font-black text-emerald-600 text-sm">Rp {product.price.toLocaleString("id-ID")}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setPurchaseQty(1);
                            setCheckoutErrorMsg("");
                            setCheckoutSuccessMsg("");
                          }}
                          disabled={product.stock <= 0}
                          className={`w-full mt-4 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                            product.stock <= 0
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                              : "bg-emerald-500 hover:bg-emerald-600 text-white"
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          {product.stock <= 0 ? "Stok Habis" : "Beli Sekarang"}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center text-gray-400 bg-white border border-gray-200 rounded-2xl">
                    <ShoppingBag className="mx-auto w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-xs font-semibold">Produk tidak tersedia dalam database.</p>
                  </div>
                )}
              </div>

              {/* QUICK CHECKOUT PANEL */}
              {selectedProduct && (
                <div className="bg-white border border-emerald-300 rounded-[2rem] p-6 md:p-8 max-w-2xl mx-auto shadow-lg text-left relative overflow-hidden animate-in slide-in-from-bottom duration-300">
                  <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-emerald-500/5 rounded-full blur-[80px]" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                        <span>🛍️</span> Konfirmasi Pembelian Cepat
                      </h4>
                      <button
                        onClick={() => setSelectedProduct(null)}
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-gray-500 font-bold transition cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-slate-50 border border-gray-200/70 rounded-2xl text-xs">
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-xl shadow-sm shrink-0">
                        {selectedProduct.category === 'Obat' ? '💊' : selectedProduct.category === 'Makanan' ? '🥫' : '💉'}
                      </div>
                      <div>
                        <h5 className="font-extrabold text-gray-800 text-xs">{selectedProduct.name}</h5>
                        <p className="text-[10px] text-gray-450 mt-0.5">{selectedProduct.category} · Harga Satuan: <strong className="text-emerald-600 font-extrabold">Rp {selectedProduct.price.toLocaleString("id-ID")}</strong></p>
                        <p className="text-[10px] text-gray-450 mt-0.5">Stok Tersedia: {selectedProduct.stock} {selectedProduct.unit}</p>
                      </div>
                    </div>

                    {checkoutSuccessMsg && (
                      <div className="bg-emerald-50 border border-emerald-250 text-emerald-750 text-xs px-4 py-3.5 rounded-xl font-bold flex items-start gap-2.5">
                        <span>✅</span>
                        <p className="leading-relaxed">{checkoutSuccessMsg}</p>
                      </div>
                    )}

                    {checkoutErrorMsg && (
                      <div className="bg-red-50 border border-red-200 text-red-750 text-xs px-4 py-3.5 rounded-xl font-bold flex items-start gap-2.5">
                        <span>⚠️</span>
                        <p className="leading-relaxed">{checkoutErrorMsg}</p>
                      </div>
                    )}

                    <form onSubmit={handleQuickCheckout} className="space-y-6">
                      
                      {/* Guest credentials */}
                      {!user && (
                        <div className="space-y-3 p-4 border border-dashed border-gray-200 rounded-2xl bg-slate-50/50">
                          <span className="text-[10px] font-black uppercase text-gray-450 tracking-wider">Lengkapi Informasi Anda</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                            <input
                              type="text"
                              value={ownerName}
                              onChange={(e) => setOwnerName(e.target.value)}
                              placeholder="Nama Pembeli"
                              required
                              className="px-3 py-2 rounded-lg border border-gray-200 text-[11px] focus:outline-none font-bold text-slate-800 bg-white"
                            />
                            <input
                              type="email"
                              value={ownerEmail}
                              onChange={(e) => setOwnerEmail(e.target.value)}
                              placeholder="Email Aktif"
                              required
                              className="px-3 py-2 rounded-lg border border-gray-200 text-[11px] focus:outline-none font-bold text-slate-800 bg-white"
                            />
                            <input
                              type="tel"
                              value={ownerPhone}
                              onChange={(e) => setOwnerPhone(e.target.value)}
                              placeholder="No. WhatsApp"
                              required
                              className="px-3 py-2 rounded-lg border border-gray-200 text-[11px] focus:outline-none font-bold text-slate-800 bg-white"
                            />
                          </div>
                        </div>
                      )}

                      {/* Qty & Totals */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 text-white p-5 rounded-2xl shadow-inner text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-300">Jumlah Unit:</span>
                          <div className="flex items-center rounded-xl bg-slate-800 p-1 border border-slate-700">
                            <button
                              type="button"
                              onClick={() => setPurchaseQty(prev => Math.max(1, prev - 1))}
                              className="w-7 h-7 flex items-center justify-center hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center font-extrabold text-sm">{purchaseQty}</span>
                            <button
                              type="button"
                              onClick={() => setPurchaseQty(prev => Math.min(selectedProduct.stock, prev + 1))}
                              className="w-7 h-7 flex items-center justify-center hover:bg-slate-700 rounded-lg text-slate-300 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
                          <p className="text-lg font-black text-emerald-400 mt-1">Rp {(selectedProduct.price * purchaseQty).toLocaleString("id-ID")}</p>
                        </div>
                      </div>

                      {/* Checkout Submit */}
                      <div className="flex justify-end gap-2.5">
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(null)}
                          className="px-5 py-3 rounded-xl border border-gray-200 text-xs font-extrabold text-gray-500 hover:bg-gray-50 cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={checkoutLoading}
                          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs px-7 py-3 rounded-xl shadow-md shadow-emerald-500/20 transition cursor-pointer disabled:opacity-60"
                        >
                          {checkoutLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Memproses checkout...</span>
                            </>
                          ) : (
                            <>
                              <span>Checkout Sekarang</span>
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>

                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* ─── CRM FUNCTIONS SECTION ─── */}
      <section id="crm" className="py-20 bg-slate-50 border-t border-gray-150 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Graphics representation */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 shadow-inner">
                <div className="flex justify-between items-center border-b border-emerald-200/50 pb-4 mb-4">
                  <h4 className="font-extrabold text-xs text-emerald-800 flex items-center gap-1.5">
                    📢 Peta Kampanye CRM
                  </h4>
                  <span className="text-[9px] bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded-full">3 Kampanye Aktif</span>
                </div>

                <div className="space-y-4">
                  {/* Campaign item 1 */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between text-xs shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">💉</span>
                      <div>
                        <p className="font-bold text-gray-800">Booster Vaksin Kucing</p>
                        <p className="text-[9px] text-gray-400 font-semibold">Terkirim ke 124 Pemilik</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Sukses</span>
                  </div>

                  {/* Campaign item 2 */}
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between text-xs shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🧴</span>
                      <div>
                        <p className="font-bold text-gray-800">Grooming Hemat Weekend</p>
                        <p className="text-[9px] text-gray-400 font-semibold">Diskon 15% · Pemasaran</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Sukses</span>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-2xl bg-emerald-600 text-white shadow-lg text-xs space-y-1">
                  <p className="font-extrabold flex items-center gap-1.5">💡 Insight Kampanye</p>
                  <p className="text-[10px] text-emerald-100 font-medium leading-relaxed">
                    Kampanye Booster Vaksin meningkatkan tingkat kedatangan janji temu hingga 42% pada minggu ini.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Otomatisasi Hubungan Pelanggan
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Hubungkan Klinik dan Pemilik Hewan Tanpa Jeda
              </h2>
              <p className="text-slate-500 text-sm md:text-base font-semibold">
                Sistem CRM (Customer Relationship Management) terintegrasi kami membantu klinik hewan memperluas jangkauan komunikasi mereka:
              </p>

              <div className="space-y-4 text-xs font-semibold">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Kampanye Promosi Otomatis</h4>
                    <p className="text-slate-500 font-medium leading-relaxed mt-1">Buat, kelola, dan sebarkan pesan promosi layanan grooming, paket check-up, atau produk baru langsung ke semua pemilik hewan terdaftar.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Feedback & Analisis Keluhan</h4>
                    <p className="text-slate-500 font-medium leading-relaxed mt-1">Evaluasi kualitas pelayanan klinik berdasarkan ulasan bintang dan catat keluhan internal untuk ditindaklanjuti secara cepat demi kepuasan pelanggan.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Manajemen Customer CRM</h4>
                    <p className="text-slate-500 font-medium leading-relaxed mt-1">Kelompokkan riwayat interaksi, feedback, keluhan, dan biodata setiap pemilik anabul di satu tab detail customer terpusat.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── CLINIC METRICS SECTION ─── */}
      <section id="statistik" className="py-20 bg-slate-950 text-white relative overflow-hidden">
        {/* Glow patterns */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-400 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-400 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-16">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest border border-emerald-400/30 px-3 py-1 rounded-full bg-emerald-450/10">
              Metrik Keberhasilan
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Klinik Lebih Produktif Bersama Kami</h2>
            <p className="text-slate-400 text-xs sm:text-sm font-semibold">Membantu mempercepat administrasi klinis dan mengotomatisasi retensi kedatangan pemilik hewan secara efektif.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <h3 className="text-4xl md:text-5xl font-black text-emerald-400">10k+</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pasien Anabul</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl md:text-5xl font-black text-emerald-400">94.2%</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Kepuasan CRM</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl md:text-5xl font-black text-emerald-400">99.9%</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Uptime Sistem</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl md:text-5xl font-black text-emerald-400">42%</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Kenaikan Retensi</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ─── */}
      <section id="testimoni" className="py-20 bg-slate-50 border-t border-gray-150">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Testimoni Pengguna
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Apa Kata Mereka?</h2>
            <p className="text-slate-500 text-sm font-semibold">Telah dipercaya oleh dokter hewan klinik profesional dan ribuan pemilik anabul.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimoni 1 */}
            <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm text-left space-y-4">
              <div className="flex text-amber-400 text-xs">
                {[1,2,3,4,5].map((s) => <Star key={s} className="fill-current w-3.5 h-3.5" />)}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                "Sebelum pakai PetCare CRM, kami sering lupa mengabari pemilik kucing untuk jadwal vaksinasi booster. Sekarang semuanya terjadwal otomatis, loyalitas pelanggan kami meningkat drastis!"
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs">
                  DN
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-800">drh. Nisa Putri</h4>
                  <p className="text-[9px] text-gray-400 font-bold">Klinik Paws & Care</p>
                </div>
              </div>
            </div>

            {/* Testimoni 2 */}
            <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm text-left space-y-4">
              <div className="flex text-amber-400 text-xs">
                {[1,2,3,4,5].map((s) => <Star key={s} className="fill-current w-3.5 h-3.5" />)}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                "Sebagai customer, saya suka sekali dengan dashboard-nya. Saya bisa melihat rekam medis Mochi langsung di HP dan tinggal klak-klik untuk buat janji temu konsultasi dokter gigi."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                  BS
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-800">Budi Santoso</h4>
                  <p className="text-[9px] text-gray-400 font-bold">Pemilik Anabul (Customer)</p>
                </div>
              </div>
            </div>

            {/* Testimoni 3 */}
            <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-sm text-left space-y-4">
              <div className="flex text-amber-400 text-xs">
                {[1,2,3,4,5].map((s) => <Star key={s} className="fill-current w-3.5 h-3.5" />)}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                "Keamanan datanya luar biasa. Modul RLS Supabase memastikan data medis rekam penyakit hanya bisa diakses oleh dokter yang bertugas dan pemilik hewan bersangkutan secara aman."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                  AH
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-gray-800">drh. Aditya Ramadhan</h4>
                  <p className="text-[9px] text-gray-400 font-bold">Klinik Happy Pets</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION SECTION ─── */}
      <section className="py-20 bg-white border-t border-gray-150 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Siap Mengoptimalkan Manajemen <br />
            Klinik Hewan Anda?
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto font-semibold">
            Dapatkan akses penuh ke fitur E-Medical Records, Janji Temu Online, dan CRM Pemasaran Cerdas dengan pendaftaran gratis 5 menit.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={handleCTA}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm px-8 py-4 rounded-2xl shadow-lg shadow-emerald-500/15 transition active:scale-[0.98] cursor-pointer"
            >
              {user ? "Masuk ke Dashboard" : "Daftar Akun Sekarang"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-950 text-slate-450 border-t border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs font-semibold">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white shadow-md">
                <PawPrint className="w-5 h-5" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">PetCare CRM</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">Sistem CRM & manajemen klinis terpadu terbaik untuk kesehatan anabul pelanggan Anda.</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Navigasi</h4>
            <ul className="space-y-2.5">
              <li><a href="#fitur" className="hover:text-emerald-500 transition">Fitur Utama</a></li>
              <li><a href="#simulator" className="hover:text-emerald-500 transition">Simulator Klinik</a></li>
              <li><a href="#crm" className="hover:text-emerald-500 transition">Otomatisasi CRM</a></li>
              <li><a href="#statistik" className="hover:text-emerald-500 transition">Statistik</a></li>
              <li><a href="#testimoni" className="hover:text-emerald-500 transition">Testimoni Pengguna</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Kontak</h4>
            <ul className="space-y-2 text-slate-450">
              <li>Klinik Pusat PetCare CRM</li>
              <li>Jl. Anabul Bahagia No. 12</li>
              <li>Jakarta, Indonesia</li>
              <li className="pt-2 text-white">support@petcarecrm.com</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-emerald-500 transition">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-emerald-500 transition">Keamanan Data</a></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500">
          <p>© 2026 PetCare CRM. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0 font-bold">
            <a href="#" className="hover:text-white transition">Instagram</a>
            <a href="#" className="hover:text-white transition">Facebook</a>
            <a href="#" className="hover:text-white transition">Twitter</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
