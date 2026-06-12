import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const getFallbackProfile = (u) => {
    if (!u) return null;
    const email = u.email || "";
    let role = "customer";
    if (email === "admin@petcare.com") role = "admin";
    else if (email.endsWith("@petcare.com")) role = "staff";

    return {
      auth_user_id: u.id,
      full_name: email.split("@")[0].toUpperCase(),
      email: email,
      phone_number: "",
      role: role
    };
  };

  const fetchProfile = async (userId, currentUser) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user profile:", error);
        setProfile(getFallbackProfile(currentUser));
      } else if (!data) {
        console.warn("No profile record found in public.users. Using email-based fallback.");
        setProfile(getFallbackProfile(currentUser));
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error("Fetch profile failed:", err);
      setProfile(getFallbackProfile(currentUser));
    }
  };

  useEffect(() => {
    // 1. Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Get session failed:", err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 2. Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change event:", event);
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id, session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    if (error) throw error;
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        logout,
        refreshProfile,
        isAdmin: profile?.role === "admin",
        isStaff: profile?.role === "staff",
        isCustomer: profile?.role === "customer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
