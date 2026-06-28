import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import LandingClinicJourney from "../components/LandingClinicJourney";
import LandingPhotoHero from "../components/LandingPhotoHero";
import LandingSymptomChecker from "../components/LandingSymptomChecker";
import LandingVetSpotlight from "../components/LandingVetSpotlight";
import LandingVisualShowcase from "../components/LandingVisualShowcase";
import { 
  PawPrint, ArrowRight, ShieldCheck, CalendarCheck, 
  Megaphone, Star, ClipboardList, Users, 
  TrendingUp, Sparkles, Clock, CheckCircle2, Heart, 
  Activity, Info, ShoppingBag, Plus, Minus, Check, AlertCircle, Calendar, User, Mail, Phone,
  ChevronDown, ChevronUp, Layers, HelpCircle, Laptop, Cpu, Link2
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // --- New Booking & Quick Shop States ---
  const [activeTab, setActiveTab] = useState("booking"); // "booking" | "shop"
  const [products, setProducts] = useState([]);
  const [myPets, setMyPets] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeFeatureTab, setActiveFeatureTab] = useState("operational"); // "operational" | "analytical" | "collaborative" | "strategic"
  
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
      if (profile?.role === "customer") {
        navigate("/member");
      } else {
        navigate("/dashboard");
      }
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 font-sans text-slate-800 text-left overflow-x-hidden">
      
      {/* ─── HEADER / NAVBAR ─── */}
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-gray-100 z-50 transition-all duration-300 shadow-sm">
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
            <a href="#simulator" className="hover:text-emerald-600 transition-colors">Simulator Klinik</a>
            <a href="#crm" className="hover:text-emerald-600 transition-colors">Otomatisasi CRM</a>
            <a href="#alur" className="hover:text-emerald-600 transition-colors">Alur Kerja</a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
            <a href="#testimoni" className="hover:text-emerald-600 transition-colors">Testimoni</a>
          </nav>

          {/* Header Action Button */}
          <div>
            {user ? (
              <Link
                to={profile?.role === "customer" ? "/member" : "/dashboard"}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs font-bold px-5.5 py-2.5 rounded-xl shadow-md shadow-emerald-500/15 active:scale-[0.98] transition-all"
              >
                <span>{profile?.role === "customer" ? "Area Member" : "Masuk Dashboard"}</span>
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

      <LandingPhotoHero user={user} onPrimaryAction={handleCTA} />

      {/* ─── HERO SECTION ─── */}
      <section aria-hidden="true" className="hidden relative pt-36 pb-20 lg:pt-44 lg:pb-32 overflow-hidden bg-gradient-to-br from-white to-emerald-50/20">
        {/* Glow patterns */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/15 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px] animate-pulse" />
          <div className="absolute top-[20%] left-[30%] w-[30%] h-[30%] rounded-full bg-indigo-500/5 blur-[80px] animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-8 lg:pr-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-black uppercase tracking-wider shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-4 h-4" /> Solusi CRM & Klinik Hewan Profesional
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Tingkatkan Loyalitas <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500">
                Pet Owners
              </span> <br />
              Dengan CRM Cerdas.
            </h1>
            
            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-xl">
              Kelola rekam medis, otomatisasi janji temu, dan dorong promosi strategis untuk anabul kesayangan pelanggan Anda dalam satu sistem CRM Klinik Hewan yang modern dan intuitif.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={handleCTA}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 hover:from-emerald-600 hover:via-emerald-700 hover:to-teal-600 text-white font-black text-sm px-9 py-5 rounded-2xl shadow-xl shadow-emerald-500/25 active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                {user ? "Masuk ke Dashboard Saya" : "Mulai Percobaan Gratis"}
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#fitur"
                className="flex items-center justify-center border-2 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-700 font-black text-sm px-8 py-4.5 rounded-2xl transition-all duration-300"
              >
                Pelajari Fitur
              </a>
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-gray-100/60 max-w-md">
              {[
                { icon: CheckCircle2, text: "Tanpa Kartu Kredit" },
                { icon: CheckCircle2, text: "Akun Demo Siap Pakai" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                  <item.icon className="w-5 h-5 text-emerald-500" /> {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right UI Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-white rounded-[2.5rem] p-6 shadow-2xl border border-slate-100 max-w-md mx-auto overflow-hidden animate-float duration-1000">
              <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-emerald-500/20 rounded-full blur-[60px]" />
              
              <div className="flex gap-2 mb-6 relative z-10">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>

              <div className="space-y-4 relative z-10 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>🐾</span> PetCare Dashboard
                  </div>
                  <div className="text-[10px] bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2.5 py-1 rounded-lg font-black shadow-sm animate-pulse">LIVE</div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-5 flex justify-between items-center text-white shadow-lg">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Total Transaksi CRM</p>
                    <p className="text-xl font-black mt-1 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Rp 48,250,000</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-5 text-white space-y-4 shadow-lg">
                  <div className="flex justify-between items-center border-b border-slate-700/50 pb-3">
                    <span className="font-black text-[11px] text-slate-350">AI Sentiment Customer Feedback</span>
                    <span className="text-[9px] font-black text-purple-400 bg-gradient-to-r from-purple-500 to-indigo-500 px-3 py-1 rounded-lg shadow-sm">94.2% Positif</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" title="94% Senang" />
                    <div className="w-4 h-2.5 rounded-full bg-amber-500/50" title="4% Netral" />
                    <div className="w-3 h-2.5 rounded-full bg-red-500/50" title="2% Komplain" />
                  </div>
                  
                  <div className="bg-slate-900/60 p-3 rounded-xl text-[10px] text-slate-450 border border-slate-800/60 italic leading-relaxed">
                    "drh. Nisa melayani Mochi dengan sangat sabar. Sukses selalu untuk klinik PetCare!"
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl p-5 text-white space-y-3 shadow-lg">
                  <span className="font-black text-[11px] text-slate-355 block text-left">Antrean Poli Aktif</span>
                  
                  {[
                    { pet: "🐱", name: "Mochi", service: "Booster Vaksin", status: "AKTIF", color: "bg-emerald-500" },
                    { pet: "🐶", name: "Rex", service: "Dermatologi", status: "ANTRI", color: "bg-blue-500" }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[10px] bg-slate-900/40 p-2.5 rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.pet}</span>
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-[9px] text-slate-500">{item.service}</p>
                        </div>
                      </div>
                      <span className={`text-[8px] font-black uppercase text-white px-2.5 py-1 rounded-lg ${item.color}`}>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white border border-gray-150 p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce duration-1000 max-w-[180px] text-xs">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 text-white flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 fill-current animate-pulse" />
              </div>
              <div>
                <p className="font-black text-gray-850 text-[10px]">10,000+</p>
                <p className="text-[9px] text-gray-500 font-bold leading-tight">Anabul Terlayani</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF SECTION ─── */}
      <section className="bg-white/80 border-y border-gray-100 py-12 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around items-center gap-6 text-center">
          <div className="space-y-2">
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">12K+</div>
            <p className="uppercase tracking-widest text-[9px] font-extrabold text-slate-400">Pemilik Hewan Terdaftar</p>
          </div>
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent hidden md:block" />
          <div className="space-y-2">
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">18.5K+</div>
            <p className="uppercase tracking-widest text-[9px] font-extrabold text-slate-400">Anabul Sehat Terawat</p>
          </div>
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent hidden md:block" />
          <div className="space-y-2">
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">25K+</div>
            <p className="uppercase tracking-widest text-[9px] font-extrabold text-slate-400">Kunjungan Berhasil</p>
          </div>
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent hidden md:block" />
          <div className="space-y-2">
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">450+</div>
            <p className="uppercase tracking-widest text-[9px] font-extrabold text-slate-400">Klinik SaaS Partner</p>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM SECTION ─── */}
      <LandingVisualShowcase />
      <LandingSymptomChecker />
      <LandingClinicJourney />
      <LandingVetSpotlight />

      <section className="py-24 bg-white/50 relative text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-4 py-2 rounded-full shadow-sm">
              Kendala Operasional Klinik
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Mengapa Manajemen Klinik Hewan Tradisional Sangat Melelahkan?
            </h2>
            <p className="text-slate-500 text-sm font-semibold">
              Klinik hewan tanpa sistem CRM terpusat sering menghadapi kendala berulang yang mengikis loyalitas pelanggan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: "🗂️", title: "Data Pasien Tersebar", desc: "Catatan riwayat medis kertas yang terpisah, mudah terselip, dan sulit dicari dengan cepat saat kondisi darurat." },
              { icon: "🗓️", title: "Jadwal Antrean Kacau", desc: "Pemesanan manual via telepon sering bertabrakan dengan jadwal praktek dokter, memicu antrean menumpuk." },
              { icon: "📉", title: "Kehilangan Retensi Pelanggan", desc: "Tidak adanya otomatisasi pengingat booster vaksin berkala, menyebabkan pemilik hewan lupa kembali berkunjung." },
              { icon: "📊", title: "Buta Performa Finansial", desc: "Kesulitan menganalisis omset kasir, transaksi obat apotek, dan tingkat kepuasan pelanggan secara real-time." }
            ].map((item, idx) => (
              <div key={idx} className="p-6 bg-white border border-gray-200/80 rounded-3xl space-y-4 shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 group">
                <span className="text-4xl block group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                <h4 className="font-extrabold text-slate-800 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SOLUTION SECTION ─── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white/50 border-t border-gray-100 relative text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full shadow-sm">
              Solusi PetCare CRM
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Sistem SaaS Klinik Hewan Modern & CRM Terpadu
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Kami menyatukan kebutuhan medis klinis dan strategi pemasaran relasional di satu platform yang aman.
            </p>
            
            <div className="space-y-4 text-sm">
              {[
                { icon: "✅", title: "Database Relasional Cepat", desc: "Mengintegrasikan pemilik, profil anabul, janji temu, dan diagnosa klinis aman dalam skema PostgreSQL." },
                { icon: "✅", title: "Otomatisasi Pengingat", desc: "Menghubungi customer otomatis via WhatsApp & Email untuk check-up berkala." },
                { icon: "✅", title: "Portal Mandiri Customer", desc: "Area member khusus tempat pemilik anabul berbelanja apotek, booking jadwal, dan klaim kompensasi kupon." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                  <span className="text-2xl shrink-0 mt-1">{item.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200/80 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-sm">
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-[100px]" />
            <h4 className="font-black text-slate-800 border-b border-gray-200 pb-4 mb-6">🏆 PetCare CRM Value Proposal</h4>
            <div className="space-y-6 font-medium text-gray-600">
              {[
                { label: "Efisiensi Waktu Administrasi", value: "Hemat 70%", width: "70%" },
                { label: "Peningkatan Retensi Kunjungan", value: "Naik 42%", width: "42%" },
                { label: "Keamanan Data Medis (RLS)", value: "100% Secure", width: "100%" }
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between">
                    <span>{item.label}</span>
                    <span className="text-emerald-600 font-black">{item.value}</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                    <div className={`h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000`} style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-5 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl shadow-lg">
              <p className="font-bold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Mengapa Memilih PetCare CRM?
              </p>
              <p className="text-xs text-emerald-50/90 mt-2 leading-relaxed">
                Dukungan teknis 24/7, integrasi WhatsApp otomatis, dan dashboard analitik real-time untuk pengambilan keputusan bisnis yang lebih baik.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CRM WORKFLOW SECTION ─── */}
      <section id="alur" className="py-24 bg-white relative text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full shadow-sm">
              Customer Journey
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Siklus Hidup Hubungan Pelanggan (Customer Lifecycle)
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Bagaimana sistem mendampingi anabul dan pemilik dari kunjungan pertama hingga keanggotaan setia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", icon: "🤝", title: "Registrasi & Booking", desc: "Pemilik mendaftarkan diri & anabul secara instan lewat widget simulator atau booking form online." },
              { step: "2", icon: "🩺", title: "Pemeriksaan & Diagnosa", desc: "Dokter meng-input hasil rekam medis anabul yang tersimpan secara permanen & aman di database." },
              { step: "3", icon: "🔔", title: "WhatsApp Reminder", desc: "Sistem mengirim notifikasi jadwal pengingat vaksin booster otomatis saat masa aktif vaksin anabul mendekati limit." },
              { step: "4", icon: "🏆", title: "Loyalty & Voucher", desc: "Customer mengumpulkan poin belanja apotek obat untuk naik ke tingkat keanggotaan VIP & klaim kupon diskon." }
            ].map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -top-3 right-4">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-emerald-500/20">
                    {item.step}
                  </span>
                </div>
                <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 group-hover:-translate-y-1">
                  <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                  <h4 className="font-black text-slate-800 text-sm mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100/60 rounded-2xl text-center">
            <p className="text-xs text-emerald-700 font-bold">
              💡 Dengan sistem ini, retensi pelanggan meningkat hingga 42% dan tingkat kepuasan customer mencapai 94.2%
            </p>
          </div>
        </div>
      </section>

      {/* ─── FEATURE GRID SECTION ─── */}
      <section id="fitur" className="py-24 bg-gradient-to-b from-slate-50 to-white border-t border-gray-100 relative text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full shadow-sm">
              4 Pilar Fitur CRM
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Segregasi Strategis Layanan PetCare CRM
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Platform komprehensif yang dirancang untuk mendukung operasional klinik, pemasaran taktis, kolaborasi tim, dan keputusan strategis bisnis.
            </p>

            {/* Feature Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {[
                { id: "operational", label: "Operational CRM", icon: "⚡" },
                { id: "analytical", label: "Analytical CRM", icon: "📊" },
                { id: "collaborative", label: "Collaborative CRM", icon: "🤝" },
                { id: "strategic", label: "Strategic CRM", icon: "💎" }
              ].map((ft) => (
                <button
                  key={ft.id}
                  onClick={() => setActiveFeatureTab(ft.id)}
                  className={`px-6 py-4 rounded-2xl text-xs font-black transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    activeFeatureTab === ft.id
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                      : "bg-white border border-gray-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">{ft.icon} {ft.label}</span>
                  {activeFeatureTab === ft.id && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto bg-white border border-gray-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative min-h-[320px]">
            {activeFeatureTab === "operational" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-in fade-in duration-500">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">
                      Memperlancar Operasional Harian Klinik
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Operational CRM membantu dokter dan staf mengotomatisasi pekerjaan administratif sehingga bisa fokus sepenuhnya merawat hewan pasien:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Pendaftaran data anabul & rekam medis digital instan",
                      "Penjadwalan janji temu tanpa tabrakan antrean",
                      "Pengurangan stok inventori apotek obat terpotong otomatis"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-5 rounded-2xl text-white shadow-lg">
                    <p className="font-bold text-sm flex items-center gap-2 mb-3">
                      <Activity className="w-4 h-4" />
                      Key Metrics Operational CRM
                    </p>
                    <div className="space-y-3">
                      {[
                        { label: "Pendaftaran Hewan", value: "Instant", sub: "3 detik/rata-rata" },
                        { label: "Jadwal Temu", value: "Auto-Sorted", sub: "Tanpa duplikasi" },
                        { label: "Notifikasi WhatsApp", value: "Connected", sub: "98% delivered" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="opacity-90">{item.label}</span>
                          <div className="text-right">
                            <span className="font-black block">{item.value}</span>
                            <span className="opacity-75">{item.sub}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === "analytical" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-in fade-in duration-500">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">
                      Mengambil Keputusan Cerdas Berbasis Data
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Analytical CRM mengolah tumpukan data transaksi kasir dan rekam medis anabul menjadi grafik visual yang mudah dipahami pemilik bisnis:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Laporan omset pendapatan klinik berkala",
                      "Segmentasi tingkat loyalitas belanja customer",
                      "Analitik jenis diagnosis penyakit anabul terpopuler"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-5 rounded-2xl text-white shadow-lg">
                    <p className="font-bold text-sm flex items-center gap-2 mb-3">
                      <Activity className="w-4 h-4" />
                      Key Metrics Analytical CRM
                    </p>
                    <div className="space-y-3">
                      {[
                        { label: "Index Kepuasan (CSAT)", value: "94.2%" },
                        { label: "Peningkatan Omset", value: "+35% YoY" },
                        { label: "Pelanggan Aktif", value: "88%" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="opacity-90">{item.label}</span>
                          <span className="font-black">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === "collaborative" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-in fade-in duration-500">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Megaphone className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">
                      Mempererat Komunikasi Antara Klinik & Pemilik
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Collaborative CRM menyambungkan kendala layanan yang dilaporkan pemilik dengan penyelesaian responsif oleh tim admin secara langsung:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Portal ulasan kritik/saran interaktif",
                      "Resolusi tiket keluhan internal dan manual log",
                      "Pemberian kompensasi diskon belanja secara tertutup"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-5 rounded-2xl text-white shadow-lg">
                    <p className="font-bold text-sm flex items-center gap-2 mb-3">
                      <Activity className="w-4 h-4" />
                      Key Metrics Collaborative CRM
                    </p>
                    <div className="space-y-3">
                      {[
                        { label: "Resolusi Tiket Komplain", value: "< 1 Jam" },
                        { label: "Klaim Voucher Diskon", value: "Otomatis" },
                        { label: "Rating Google Maps", value: "4.8/5.0" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="opacity-90">{item.label}</span>
                          <span className="font-black">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === "strategic" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center animate-in fade-in duration-500">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">
                      Menghargai Loyalitas Pemilik Anabul Terpilih
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    Strategic CRM menyusun sistem retensi terpadu melalui insentif potongan harga dan tingkat membership:
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Kenaikan membership Bronze, Silver, Gold berdasarkan total belanja",
                      "Pengiriman kampanye promosi berperingkat",
                      "Akses khusus VIP check-up dan antrean cepat"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-5 rounded-2xl text-white shadow-lg">
                    <p className="font-bold text-sm flex items-center gap-2 mb-3">
                      <Activity className="w-4 h-4" />
                      Key Metrics Strategic CRM
                    </p>
                    <div className="space-y-3">
                      {[
                        { label: "Tingkat Keanggotaan", value: "Bronze/Silver/Gold" },
                        { label: "Potongan Harga Maksimal", value: "Up to 25% OFF" },
                        { label: "Keanggotaan VIP Aktif", value: "24% Member" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs">
                          <span className="opacity-90">{item.label}</span>
                          <span className="font-black">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── SIMULATOR SECTION (CUSTOMER JOURNEY & QUICK SHOP) ─── */}
      <section id="simulator" className="py-24 bg-white relative text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full shadow-sm">
              Layanan Mandiri Pelanggan
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Pendaftaran, Jadwal Temu & Beli Obat
            </h2>
            <p className="text-slate-500 text-sm md:text-base font-medium">
              Gunakan widget interaktif di bawah untuk mendaftarkan hewan peliharaan, menjadwalkan pemeriksaan, atau membeli obat anabul secara instan.
            </p>

            {/* Tab switcher */}
            <div className="inline-flex p-1.5 bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl border border-slate-200 mt-8 shadow-inner">
              {[
                { id: "booking", label: "Pendaftaran & Booking", icon: CalendarCheck },
                { id: "shop", label: "Toko Obat & Apotek", icon: ShoppingBag }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-7 py-4 rounded-xl text-xs font-black transition-all duration-300 ${
                      isActive
                        ? "bg-white text-emerald-600 shadow-md"
                        : "text-slate-500 hover:text-emerald-500"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "animate-bounce" : ""}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: BOOKING & REGISTRATION */}
          {activeTab === "booking" && (
            <div className="max-w-4xl mx-auto bg-white border border-gray-200/80 rounded-[2.5rem] p-6 md:p-12 shadow-2xl relative overflow-hidden animate-in fade-in duration-500">
              <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-[100px]" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-800">Formulir Booking & Pendaftaran Hewan</h3>
                    <p className="text-xs text-slate-500 font-medium">Isi detail lengkap di bawah untuk mengajukan antrean klinik</p>
                  </div>
                </div>

                  {bookingSuccessMsg && (
                    <div className="mb-8 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-700 text-xs px-6 py-5 rounded-2xl font-bold flex items-start gap-4 shadow-sm">
                      <span className="text-xl">✅</span>
                      <p className="text-left leading-relaxed">{bookingSuccessMsg}</p>
                    </div>
                  )}

                  {bookingErrorMsg && (
                    <div className="mb-8 bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 text-red-600 text-xs px-6 py-5 rounded-2xl font-bold flex items-start gap-4 shadow-sm">
                      <span className="text-xl">⚠️</span>
                      <p className="text-left leading-relaxed">{bookingErrorMsg}</p>
                    </div>
                  )}

                <form onSubmit={handleBooking} className="space-y-8 text-left">
                  
                  {/* SECTION A: OWNER INFO (GUEST ONLY) */}
                  {!user && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px]">1</span> Informasi Pemilik (Registrasi Otomatis)
                      </h4>
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 mb-4 text-xs text-emerald-800 font-medium leading-relaxed shadow-sm">
                        <span className="font-bold">💡</span> Anda belum masuk ke sistem. Mengisi form ini akan otomatis mendaftarkan akun PetCare Anda secara gratis menggunakan email & nomor telepon Anda dengan password default <strong className="font-black">PetCare123!</strong>.
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { label: "Nama Lengkap", icon: User, field: ownerName, set: setOwnerName, placeholder: "cth. John Doe" },
                          { label: "Email Aktif", icon: Mail, field: ownerEmail, set: setOwnerEmail, placeholder: "john@example.com" },
                          { label: "No. Telepon / WhatsApp", icon: Phone, field: ownerPhone, set: setOwnerPhone, placeholder: "0812-xxxx-xxxx" }
                        ].map((item, idx) => (
                          <div key={idx}>
                            <label className="text-[10px] font-black uppercase tracking-widest block mb-1.5 text-slate-500">{item.label}</label>
                            <div className="relative flex items-center rounded-xl border border-gray-200 bg-white focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100 overflow-hidden transition-all">
                              <span className="absolute left-3 text-gray-400 text-xs"><item.icon className="w-4 h-4" /></span>
                              <input
                                type={item.field === ownerEmail ? "email" : item.field === ownerPhone ? "tel" : "text"}
                                value={item.field}
                                onChange={(e) => item.set(e.target.value)}
                                placeholder={item.placeholder}
                                className="w-full pl-9 pr-3 py-2.5 text-xs focus:outline-none font-semibold text-slate-800 bg-transparent"
                              />
                            </div>
                          </div>
                        ))}
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
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-gradient-to-br from-slate-50 to-white border border-gray-200 rounded-2xl shadow-sm">
                        {[
                          { label: "Nama Hewan", type: "text", value: petName, onChange: setPetName, placeholder: "cth. Mochi, Rex", req: true },
                          { label: "Jenis Hewan", type: "select", value: petType, onChange: setPetType, options: [{v:"Kucing", l:"🐱 Kucing"}, {v:"Anjing", l:"🐶 Anjing"}, {v:"Kelinci", l:"🐰 Kelinci"}, {v:"Lainnya", l:"🐾 Lainnya"}] },
                          { label: "Ras / Breed", type: "text", value: petBreed, onChange: setPetBreed, placeholder: "Persia, Kampung, dll" },
                          { label: "Jenis Kelamin", type: "select", value: petGender, onChange: setPetGender, options: [{v:"Jantan", l:"Jantan"}, {v:"Betina", l:"Betina"}] }
                        ].map((item, idx) => (
                          <div key={idx}>
                            <label className="text-[10px] font-black uppercase tracking-widest block mb-1.5 text-slate-500">
                              {item.label} {item.req && <span className="text-rose-500">*</span>}
                            </label>
                            {item.type === "select" ? (
                              <select
                                value={item.value}
                                onChange={(e) => item.onChange(e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-semibold text-xs cursor-pointer"
                              >
                                {item.options.map((opt, oidx) => (
                                  <option key={oidx} value={opt.v}>{opt.l}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={item.value}
                                onChange={(e) => item.onChange(e.target.value)}
                                placeholder={item.placeholder}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-semibold text-xs"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTION C: APPOINTMENT INFO */}
                  <div className="space-y-4 pt-4 border-t border-dashed border-gray-150">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <span>{user ? "2." : "3."}</span> Informasi Jadwal Temu / Layanan
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: "Jenis Perawatan", value: bookingType, onChange: setBookingType, options: [{v:"Grooming", l:"🧴 Grooming"}, {v:"Vaksinasi", l:"💉 Vaksinasi"}, {v:"Sakit / Konsultasi", l:"🩺 Sakit / Konsultasi"}, {v:"Sterilisasi", l:"✂️ Operasi / Sterilisasi"}] },
                        { label: "Dokter Pilihan", value: bookingDoctor, onChange: setBookingDoctor, options: [{v:"drh. Nisa Putri", l:"drh. Nisa Putri"}, {v:"drh. Aditya Ramadhan", l:"drh. Aditya Ramadhan"}, {v:"drh. Sari Putri", l:"drh. Sari Putri"}] },
                        { label: "Pilih Tanggal", type: "date", value: bookingDate, onChange: setBookingDate },
                        { label: "Pilih Jam", value: bookingTime, onChange: setBookingTime, options: [{v:"09:00", l:"09:00 WIB"}, {v:"10:00", l:"10:00 WIB"}, {v:"11:00", l:"11:00 WIB"}, {v:"13:00", l:"13:00 WIB"}, {v:"14:00", l:"14:00 WIB"}, {v:"15:00", l:"15:00 WIB"}, {v:"16:00", l:"16:00 WIB"}] }
                      ].map((item, idx) => (
                        <div key={idx}>
                          <label className="text-[10px] font-black uppercase tracking-widest block mb-1.5 text-slate-500">{item.label}</label>
                          {item.type === "select" ? (
                            <select
                              value={item.value}
                              onChange={(e) => item.onChange(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-semibold text-xs cursor-pointer"
                            >
                              {item.options.map((opt, oidx) => (
                                <option key={oidx} value={opt.v}>{opt.l}</option>
                              ))}
                            </select>
                          ) : item.type === "date" ? (
                            <input
                              type="date"
                              value={item.value}
                              onChange={(e) => item.onChange(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-semibold text-xs cursor-pointer"
                            />
                          ) : (
                            <select
                              value={item.value}
                              onChange={(e) => item.onChange(e.target.value)}
                              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-semibold text-xs cursor-pointer"
                            >
                              {item.options.map((opt, oidx) => (
                                <option key={oidx} value={opt.v}>{opt.l}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      ))}
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
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="bg-white border border-gray-200 rounded-[2.5rem] p-6 md:p-10 shadow-xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-6 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">💊</span>
                      <h3 className="font-black text-lg text-slate-800">Apotek & Toko Obat PetCare</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">Beli obat cacing, vitamin, makanan medis, atau vaksin untuk anabul langsung di sini.</p>
                  </div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-full">
                    ⚡ Instant Checkout
                  </span>
                </div>

                {products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="group bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left"
                      >
                        <div>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-sm ${
                            product.category === 'Obat' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                            product.category === 'Makanan' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                            'bg-blue-50 text-blue-600 border border-blue-100'
                          }`}>
                            {product.category}
                          </span>
                          <h4 className="font-black text-sm text-slate-800 mt-4 leading-tight group-hover:text-emerald-600 transition-colors">{product.name}</h4>
                          <p className="text-xs text-slate-500 mt-2 font-medium line-clamp-2 leading-relaxed min-h-[32px]">{product.description}</p>
                          
                          <div className="my-3 border-t border-dashed border-gray-100" />
                          
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-600">Stok: <strong className="text-emerald-600">{product.stock} {product.unit}</strong></span>
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
                          className={`w-full mt-5 py-3 rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer ${
                            product.stock <= 0
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                              : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30"
                          }`}
                        >
                          <span className="flex items-center justify-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5" />
                            {product.stock <= 0 ? "Stok Habis" : "Beli Sekarang"}
                          </span>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center text-slate-500 bg-white border border-gray-200 rounded-2xl">
                    <ShoppingBag className="mx-auto w-10 h-10 text-slate-300 mb-3" />
                    <p className="text-xs font-semibold">Produk tidak tersedia dalam database.</p>
                  </div>
                )}
              </div>

              {/* QUICK CHECKOUT PANEL */}
              {selectedProduct && (
                <div className="bg-white border border-emerald-200 rounded-[2.5rem] p-8 md:p-12 max-w-2xl mx-auto shadow-2xl text-left relative overflow-hidden animate-in slide-in-from-bottom duration-500">
                  <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-[100px]" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <h4 className="font-black text-lg text-slate-800 flex items-center gap-2">
                        <span>🛍️</span> Konfirmasi Pembelian Cepat
                      </h4>
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(null)}
                        className="text-[10px] bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl text-gray-600 font-bold transition cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>

                    <div className="flex items-start gap-5 p-5 bg-gradient-to-br from-slate-50 to-white border border-gray-200 rounded-2xl text-xs shadow-sm">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
                        {selectedProduct.category === 'Obat' ? '💊' : selectedProduct.category === 'Makanan' ? '🥫' : '💉'}
                      </div>
                      <div>
                        <h5 className="font-black text-slate-800 text-xs">{selectedProduct.name}</h5>
                        <p className="text-xs text-slate-500 mt-1">{selectedProduct.category} · Harga Satuan: <strong className="text-emerald-600 font-black">Rp {selectedProduct.price.toLocaleString("id-ID")}</strong></p>
                        <p className="text-xs text-slate-500 mt-1">Stok Tersedia: <span className="text-emerald-600 font-bold">{selectedProduct.stock}</span> {selectedProduct.unit}</p>
                      </div>
                    </div>

                    {checkoutSuccessMsg && (
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 text-emerald-700 text-xs px-6 py-5 rounded-2xl font-bold flex items-start gap-4 shadow-sm">
                        <span className="text-xl">✅</span>
                        <p className="leading-relaxed">{checkoutSuccessMsg}</p>
                      </div>
                    )}

                    {checkoutErrorMsg && (
                      <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 text-red-600 text-xs px-6 py-5 rounded-2xl font-bold flex items-start gap-4 shadow-sm">
                        <span className="text-xl">⚠️</span>
                        <p className="leading-relaxed">{checkoutErrorMsg}</p>
                      </div>
                    )}

                    <form onSubmit={handleQuickCheckout} className="space-y-6">
                      
                      {!user && (
                        <div className="space-y-3 p-5 bg-gradient-to-br from-slate-50 to-white border border-dashed border-gray-300 rounded-2xl">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Lengkapi Informasi Anda</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                            {[
                              { label: "Nama Pembeli", field: ownerName, set: setOwnerName, placeholder: "John Doe" },
                              { label: "Email Aktif", field: ownerEmail, set: setOwnerEmail, type: "email", placeholder: "john@example.com" },
                              { label: "No. WhatsApp", field: ownerPhone, set: setOwnerPhone, type: "tel", placeholder: "0812-xxxx-xxxx" }
                            ].map((item, idx) => (
                              <div key={idx}>
                                <label className="text-[10px] font-bold text-slate-500 block mb-1.5">{item.label}</label>
                                <input
                                  type={item.type || "text"}
                                  value={item.field}
                                  onChange={(e) => item.set(e.target.value)}
                                  placeholder={item.placeholder}
                                  required
                                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none font-semibold text-slate-800 bg-white"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-inner text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-300">Jumlah Unit:</span>
                          <div className="flex items-center rounded-xl bg-slate-700/50 p-1 border border-slate-600">
                            <button
                              type="button"
                              onClick={() => setPurchaseQty(prev => Math.max(1, prev - 1))}
                              className="w-8 h-8 flex items-center justify-center hover:bg-slate-600 rounded-lg text-slate-300 cursor-pointer transition"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-black text-sm">{purchaseQty}</span>
                            <button
                              type="button"
                              onClick={() => setPurchaseQty(prev => Math.min(selectedProduct.stock, prev + 1))}
                              className="w-8 h-8 flex items-center justify-center hover:bg-slate-600 rounded-lg text-slate-300 cursor-pointer transition"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Pembayaran</p>
                          <p className="text-2xl font-black text-emerald-400 mt-1">Rp {(selectedProduct.price * purchaseQty).toLocaleString("id-ID")}</p>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedProduct(null)}
                          className="px-6 py-3.5 rounded-xl border border-gray-200 text-xs font-black text-slate-600 hover:bg-gray-50 cursor-pointer transition"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={checkoutLoading}
                          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xs px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {checkoutLoading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
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

      {/* ─── INTEGRATIONS SECTION ─── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white border-t border-gray-100 relative text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full shadow-sm">
              Konektivitas Tanpa Batas
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Tersambung dengan Layanan & Platform Favorit Anda
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              PetCare CRM berintegrasi secara mulus dengan berbagai teknologi global untuk mendukung efisiensi klinik:
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-700">
              {[
                { icon: "⚡", label: "Supabase Backend" },
                { icon: "💬", label: "WhatsApp API" },
                { icon: "📅", label: "Google Calendar" },
                { icon: "💳", label: "Midtrans Gateway" }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 group">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span> {item.label}
                </div>
              ))}
            </div>
          </div>

          <div className="relative p-8 bg-white border border-gray-200/80 flex flex-wrap justify-center gap-4 shadow-2xl rounded-[2.5rem]">
            <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-black text-white shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 animate-bounce"><span className="text-xl">⚡</span> Supabase</div>
            <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-black text-white shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 animate-bounce delay-75"><span className="text-xl">💬</span> WhatsApp SMS</div>
            <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-black text-white shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 animate-bounce delay-150"><span className="text-xl">📧</span> Twilio Mailer</div>
            <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-black text-white shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 animate-bounce delay-200"><span className="text-xl">📅</span> Google Calendar</div>
            <div className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-xs font-black text-white shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 animate-bounce delay-300"><span className="text-xl">💳</span> Payment Midtrans</div>
          </div>
        </div>
      </section>

      {/* ─── CRM FUNCTIONS SECTION (PREMIUM MARKETING DASHBOARD) ─── */}
      <section id="crm" className="py-20 bg-white border-t border-gray-150 relative text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Graphics representation */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative bg-white rounded-[2.5rem] p-8 border border-gray-200/80 shadow-2xl">
                <div className="flex justify-between items-center border-b border-gray-100 pb-5 mb-6">
                  <h4 className="font-black text-lg text-slate-800 flex items-center gap-2">
                    <Link2 className="w-5 h-5 text-emerald-500" /> Peta Kampanye Pemasaran CRM
                  </h4>
                  <span className="text-[10px] bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black px-3 py-1.5 rounded-full shadow-sm">3 Kampanye Aktif</span>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: "💉", title: "Booster Vaksin Kucing", desc: "Terkirim ke 124 Pemilik", status: "Sukses" },
                    { icon: "🧴", title: "Grooming Hemat Weekend", desc: "Diskon 15% · Pemasaran", status: "Sukses" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-slate-50 to-white p-4 rounded-2xl border border-gray-200 flex items-center justify-between text-xs shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="font-bold text-slate-800">{item.title}</p>
                          <p className="text-[9px] text-slate-500 font-medium">{item.desc}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-emerald-650 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg shadow-sm">Sukses</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 text-xs space-y-2">
                  <p className="font-black flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-pulse" /> Insight Kampanye CRM
                  </p>
                  <p className="text-emerald-50/90 font-medium leading-relaxed">
                    Kampanye otomatis Booster Vaksinasi meningkatkan tingkat kedatangan janji temu hingga 42% pada bulan ini.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Text Content */}
            <div className="lg:col-span-7 space-y-8">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full shadow-sm">
                Otomatisasi Hubungan Pelanggan
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Hubungkan Komunikasi Staf Klinik & Pemilik Anabul Tanpa Batas
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                Sistem CRM (Customer Relationship Management) terintegrasi kami membantu klinik hewan memperluas jangkauan komunikasi mereka secara otomatis:
              </p>

              <div className="space-y-6">
                {[
                  { icon: Megaphone, title: "Kampanye Promosi Terarah", desc: "Buat, kelola, dan sebarkan pesan promosi layanan grooming, paket check-up, atau produk baru langsung ke pemilik hewan terdaftar sesuai tingkatan member.", color: "bg-emerald-50 text-emerald-600" },
                  { icon: Star, title: "Feedback & Tiket Keluhan Instan", desc: "Evaluasi kualitas pelayanan klinik berdasarkan ulasan bintang dan catat keluhan internal untuk diselesaikan secara responsif demi kepuasan pelanggan.", color: "bg-blue-50 text-blue-600" },
                  { icon: Users, title: "Manajemen Customer CRM 360°", desc: "Kelompokkan riwayat interaksi, feedback, keluhan, dan biodata setiap pemilik anabul di satu tab detail customer terpusat untuk penanganan khusus.", color: "bg-purple-50 text-purple-600" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-5 p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm mb-2">{item.title}</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ─── */}
      <section id="testimoni" className="py-24 bg-white relative text-left">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full shadow-sm">
              Testimoni Pengguna
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Apa Kata Pemilik Klinik & Pemilik Anabul?</h2>
            <p className="text-slate-500 text-sm font-medium">Telah dipercaya oleh dokter hewan klinik profesional dan ribuan pemilik anabul di Indonesia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { rating: 5, text: "Sebelum menggunakan PetCare CRM, kami sering lupa mengabari pemilik kucing untuk jadwal vaksinasi booster. Sekarang semuanya terjadwal otomatis, retensi kunjungan klinik kami meningkat drastis!", name: "drh. Nisa Putri", role: "Klinik Paws & Care", gradient: "from-emerald-400 to-teal-500", initials: "DN" },
              { rating: 5, text: "Sebagai customer, saya suka sekali dengan portal member-nya. Saya bisa melihat rekam medis Mochi langsung di HP dan tinggal klak-klik untuk buat janji temu konsultasi dokter gigi.", name: "Budi Santoso", role: "Pemilik Anabul", gradient: "from-blue-400 to-indigo-500", initials: "BS" },
              { rating: 5, text: "Keamanan datanya luar biasa. Modul RLS Supabase memastikan data medis penyakit hanya bisa diakses oleh dokter yang bertugas dan pemilik hewan bersangkutan secara aman dan rahasia.", name: "drh. Aditya Ramadhan", role: "Klinik Happy Pets", gradient: "from-purple-400 to-pink-500", initials: "AH" }
            ].map((item, idx) => (
              <div key={idx} className="group bg-white border border-gray-200 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 text-left">
                <div className="flex text-amber-400 text-xs mb-3">
                  {[...Array(item.rating)].map((_, s) => <Star key={s} className="fill-current w-3.5 h-3.5" />)}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">"{item.text}"</p>
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">{item.name}</h4>
                    <p className="text-[9px] text-slate-500 font-semibold">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section id="faq" className="py-24 bg-gradient-to-b from-slate-50 to-white border-t border-gray-100 relative text-left">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-20">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full shadow-sm">
              Pertanyaan Umum
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Ada Pertanyaan Mengenai PetCare CRM?
            </h2>
            <p className="text-slate-500 text-sm font-medium">Kami telah mengumpulkan jawaban atas kendala teknis dan cara penggunaan platform.</p>
          </div>

          <div className="space-y-3">
            {[
              { q: "Apakah ada masa uji coba gratis?", a: "Ya, kami menyediakan masa uji coba gratis selama 14 hari penuh dengan akses ke semua fitur tanpa perlu memasukkan informasi kartu kredit." },
              { q: "Bagaimana data rekam medis anabul diamankan?", a: "Seluruh data medis dan profil personal dilindungi oleh modul Row Level Security (RLS) Supabase dan enkripsi data end-to-end, memastikan hanya dokter yang bertugas dan pemilik hewan bersangkutan yang dapat melihat data tersebut." },
              { q: "Apakah pendaftaran anabul otomatis terintegrasi saat booking?", a: "Ya, sistem kami memiliki alur autopilot. Saat pengunjung guest mengisi form booking janji temu atau membeli obat di landing page, sistem akan mendaftarkan akun secara otomatis dengan kata sandi bawaan 'PetCare123!'." },
              { q: "Apakah ada pengingat otomatis untuk vaksinasi?", a: "Ya, PetCare CRM terintegrasi dengan WhatsApp Gateway dan Email Engine untuk mengirimkan notifikasi pengingat jadwal booster vaksinasi anabul secara berkala kepada pemilik." },
              { q: "Bagaimana sistem loyalitas membership bekerja?", a: "Sistem menghitung total transaksi belanja obat/grooming pemilik secara akumulatif. Anggota akan otomatis naik tingkatan dari Bronze, Silver, hingga Gold dengan persentase potongan harga belanja obat." },
              { q: "Apakah saya bisa mengekspor data medis pasien?", a: "Ya, dokter hewan atau pemilik hewan dapat mengunduh riwayat rekam medis lengkap dalam format dokumen PDF atau Excel dalam satu klik dari portal masing-masing." },
              { q: "Apakah sistem kasir apotek tersambung dengan stok?", a: "Ya, modul apotek cepat kami otomatis mengurangi stok obat-obatan di gudang inventori utama setiap kali customer melakukan checkout pesanan obat." },
              { q: "Bagaimana jika anabul memiliki banyak pemilik?", a: "Satu anabul terikat pada satu email utama pemilik. Namun, detail catatan medis dapat dibagikan atau dicetak oleh pemilik utama untuk diserahkan ke pihak keluarga lainnya." },
              { q: "Apakah ada biaya tambahan tersembunyi?", a: "Tidak ada biaya tersembunyi. Biaya langganan bulanan SaaS kami transparan sesuai pilihan paket operasional klinik Anda." },
              { q: "Bagaimana cara menjadwalkan demo gratis dengan tim PetCare?", a: "Anda cukup mengeklik tombol 'Mulai Uji Coba' atau menghubungi layanan pelanggan kami via email/WhatsApp untuk menjadwalkan demo virtual via Zoom." }
            ].map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex justify-between items-center font-bold text-sm text-slate-800 hover:bg-slate-50 transition cursor-pointer text-left"
                  >
                    <span>{item.q}</span>
                    <div className={`flex items-center transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                      <ChevronDown className={`w-5 h-5 ${isOpen ? "text-emerald-600" : "text-slate-400"} shrink-0`} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 pt-1 text-sm text-slate-500 leading-relaxed font-medium border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CALL TO ACTION SECTION ─── */}
      <section className="py-24 bg-gradient-to-br from-emerald-500 to-teal-600 text-center relative overflow-hidden text-left">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] bg-[size:20px_20px] opacity-10 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 space-y-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Siap Mengoptimalkan Manajemen <br />
            Klinik Hewan Anda?
          </h2>
          <p className="text-emerald-50/90 text-sm md:text-lg max-w-xl mx-auto font-medium">
            Dapatkan akses penuh ke fitur E-Medical Records, Janji Temu Online, dan CRM Pemasaran Cerdas dengan pendaftaran gratis 5 menit.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <button
              onClick={handleCTA}
              className="flex items-center gap-2 bg-white text-emerald-600 hover:bg-emerald-50 font-black text-sm px-9 py-5 rounded-2xl shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] cursor-pointer"
            >
              {user ? "Masuk ke Dashboard Saya" : "Daftar Akun Sekarang"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-16 text-left">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <PawPrint className="w-6 h-6" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">PetCare CRM</span>
            </div>
            <p className="text-slate-400 leading-relaxed">Sistem CRM & manajemen klinis terpadu terbaik untuk kesehatan anabul pelanggan Anda.</p>
            <div className="flex gap-3">
              {["Instagram", "Facebook", "Twitter"].map((social) => (
                <a key={social} href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-bold hover:bg-emerald-500 hover:text-white transition-colors">
                  {social[0]}
                </a>
              ))}
            </div>
          </div>

          {[
            { title: "Navigasi", links: [{h:"Fitur Utama", t:"#fitur"}, {h:"Simulator Klinik", t:"#simulator"}, {h:"Otomatisasi CRM", t:"#crm"}, {h:"Alur Kerja", t:"#alur"}, {h:"FAQ", t:"#faq"}, {h:"Testimoni", t:"#testimoni"}] },
            { title: "Kontak", links: ["Klinik Pusat PetCare CRM", "Jl. Anabul Bahagia No. 12", "Jakarta, Indonesia", "support@petcarecrm.com"] },
            { title: "Legal", links: [{h:"Kebijakan Privasi", t:"#"}, {h:"Syarat & Ketentuan", t:"#"}, {h:"Keamanan Data", t:"#"}] }
          ].map((section, idx) => (
            <div key={idx}>
              <h4 className="text-sm font-black text-white mb-5">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((item, lidx) => {
                  if (typeof item === "string") {
                    return <li key={lidx} className="hover:text-emerald-400 transition-colors">{item}</li>;
                  }
                  return (
                    <li key={lidx}>
                      <a href={item.t} className="hover:text-emerald-400 transition-colors">{item.h}</a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-14 mt-14 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500">
          <p>© 2026 PetCare CRM. All rights reserved.</p>
          <div className="flex gap-6 font-bold">
            <a href="#" className="hover:text-emerald-400 transition-colors">Instagram</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Facebook</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
