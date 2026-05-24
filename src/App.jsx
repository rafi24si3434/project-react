import "./assets/tailwind.css";
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import Loading from "./components/Loading";

const MainLayout = lazy(() => import("./layouts/MainLayout"));
const AuthLayout = lazy(() => import("./layouts/AuthLayout"));

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Forgot = lazy(() => import("./pages/auth/Forgot"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));

const Pets = lazy(() => import("./pages/Pets"));
const AddPet = lazy(() => import("./pages/AddPet"));
const PetsDetail = lazy(() => import("./pages/PetsDetail"));

const Appointments = lazy(() => import("./pages/Appointments"));

const PetOwners = lazy(() => import("./pages/PetOwners"));
const PetOwnersDetail = lazy(() => import("./pages/PetOwnersDetail"));

const MedicalRecords = lazy(() => import("./pages/MedicalRecords"));
const Vaccinations = lazy(() => import("./pages/Vaccinations"));
const Inventory = lazy(() => import("./pages/Inventory"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* ── Auth ── */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        {/* ── Main ── */}
        <Route element={<MainLayout />}>

          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Pets */}
          <Route path="/pets" element={<Pets />} />
          <Route path="/pets/add" element={<AddPet />} />
          <Route path="/pets/:id" element={<PetsDetail />} />

          {/* Appointments */}
          <Route path="/appointments" element={<Appointments />} />

          {/* Pet Owners */}
          <Route path="/pet-owners" element={<PetOwners />} />
          <Route path="/pet-owners/:id" element={<PetOwnersDetail />} />

          {/* Klinik & Inventori */}
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/vaccinations" element={<Vaccinations />} />
          <Route path="/inventory" element={<Inventory />} />

          {/* Error Pages */}
          <Route path="/400" element={<ErrorPage code="400" />} />
          <Route path="/401" element={<ErrorPage code="401" />} />
          <Route path="/403" element={<ErrorPage code="403" />} />
          <Route path="*" element={<ErrorPage code="404" />} />

        </Route>

      </Routes>
    </Suspense>
  );
}

export default App;