import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

export default function ProtectedRoute({ allowedRoles }) {
  const { user, profile, loading } = useAuth();

  console.log("[ProtectedRoute] Check:", {
    pathname: window.location.pathname,
    allowedRoles,
    loading,
    userExists: !!user,
    userId: user?.id,
    profileExists: !!profile,
    profileRole: profile?.role,
    profileEmail: profile?.email
  });

  if (loading) {
    console.log("[ProtectedRoute] Loading is active, rendering Loading screen...");
    return <Loading />;
  }

  if (!user) {
    console.log("[ProtectedRoute] No authenticated user found, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!profile || !allowedRoles.includes(profile.role))) {
    console.warn(
      `[ProtectedRoute] Forbidden: User role "${profile?.role}" is not authorized. Allowed roles: ${JSON.stringify(
        allowedRoles
      )}. Redirecting to /403`
    );
    return <Navigate to="/403" replace />;
  }

  console.log("[ProtectedRoute] Access granted to route.");
  return <Outlet />;
}
