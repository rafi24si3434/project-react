import "./assets/tailwind.css";
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loading from "./components/Loading";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Forgot from "./pages/auth/Forgot";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

const Pets = lazy(() => import("./pages/Pets"));
const AddPet = lazy(() => import("./pages/AddPet"));
const PetsDetail = lazy(() => import("./pages/PetsDetail"));

const Appointments = lazy(() => import("./pages/Appointments"));

const PetOwners = lazy(() => import("./pages/PetOwners"));
const PetOwnersDetail = lazy(() => import("./pages/PetOwnersDetail"));
const CustomerCrm = lazy(() => import("./pages/CustomerCrm"));
const CustomerCrmDetail = lazy(() => import("./pages/CustomerCrmDetail"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Vets = lazy(() => import("./pages/Vets"));

const MedicalRecords = lazy(() => import("./pages/MedicalRecords"));
const MedicalRecordsDetail = lazy(() => import("./pages/MedicalRecordsDetail"));
const Vaccinations = lazy(() => import("./pages/Vaccinations"));
const VaccinationsDetail = lazy(() => import("./pages/VaccinationsDetail"));
const Inventory = lazy(() => import("./pages/Inventory"));
const InventoryDetail = lazy(() => import("./pages/InventoryDetail"));
const Settings = lazy(() => import("./pages/Settings"));

// New pages
const UserManagement = lazy(() => import("./pages/UserManagement"));
const Profile = lazy(() => import("./pages/Profile"));
const Shop = lazy(() => import("./pages/Shop"));
const Orders = lazy(() => import("./pages/Orders"));
const Member = lazy(() => import("./pages/Member"));

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* ── Public Landing Page ── */}
            <Route path="/" element={<LandingPage />} />

            {/* ── Auth ── */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot" element={<Forgot />} />
            </Route>

            {/* ── Main (Authenticated) ── */}
            <Route element={<ProtectedRoute />}>
              
              {/* Member Portal (No Sidebar Layout) */}
              <Route element={<ProtectedRoute allowedRoles={["customer"]} />}>
                <Route path="/member" element={<Member />} />
              </Route>

              <Route element={<MainLayout />}>

                {/* Dashboard & Profile */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/orders" element={<Orders />} />

                {/* Pets & Appointments (All roles) */}
                <Route path="/pets" element={<Pets />} />
                <Route path="/pets/add" element={<AddPet />} />
                <Route path="/pets/:id" element={<PetsDetail />} />
                <Route path="/appointments" element={<Appointments />} />
                <Route path="/pet-owners" element={<PetOwners />} />
                <Route path="/pet-owners/:id" element={<PetOwnersDetail />} />
                
                {/* Medical & Vaccinations (All roles) */}
                <Route path="/medical-records" element={<MedicalRecords />} />
                <Route path="/medical-records/:id" element={<MedicalRecordsDetail />} />
                <Route path="/vaccinations" element={<Vaccinations />} />
                <Route path="/vaccinations/:id" element={<VaccinationsDetail />} />

                {/* Admin & Staff Only */}
                <Route element={<ProtectedRoute allowedRoles={["admin", "staff"]} />}>
                  <Route path="/customers" element={<CustomerCrm />} />
                  <Route path="/customers/:id" element={<CustomerCrmDetail />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/feedback" element={<Feedback />} />
                  <Route path="/vets" element={<Vets />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/inventory/:id" element={<InventoryDetail />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Admin Only */}
                <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                  <Route path="/users" element={<UserManagement />} />
                </Route>

                {/* Error Pages */}
                <Route path="/400" element={<ErrorPage code="400" />} />
                <Route path="/401" element={<ErrorPage code="401" />} />
                <Route path="/403" element={<ErrorPage code="403" />} />
                <Route path="*" element={<ErrorPage code="404" />} />

              </Route>
            </Route>

          </Routes>
        </Suspense>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
