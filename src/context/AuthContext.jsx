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
    console.log("[AuthContext] fetchProfile start:", { userId, email: currentUser?.email });
    try {
      // 1. Try querying by auth_user_id
      let { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("auth_user_id", userId)
        .maybeSingle();

      console.log("[AuthContext] fetchProfile by auth_user_id result:", { data, error });

      // 2. Fallback: Query by email if auth_user_id didn't yield a record
      if (!data && currentUser?.email) {
        console.log("[AuthContext] Profile not found by auth_user_id. Trying email fallback...");
        const { data: emailData, error: emailError } = await supabase
          .from("users")
          .select("*")
          .eq("email", currentUser.email)
          .maybeSingle();

        console.log("[AuthContext] fetchProfile by email result:", { data: emailData, error: emailError });

        if (emailData) {
          data = emailData;
          // Attempt to update and link the auth_user_id
          console.log("[AuthContext] Found profile by email. Linking auth_user_id in DB...");
          const { error: updateError } = await supabase
            .from("users")
            .update({ auth_user_id: userId })
            .eq("id", data.id);

          if (updateError) {
            console.warn("[AuthContext] Failed to link auth_user_id in DB (likely RLS restriction):", updateError.message);
          } else {
            console.log("[AuthContext] Successfully linked auth_user_id in DB.");
            data.auth_user_id = userId;
          }
        }
      }

      if (error) {
        console.error("[AuthContext] Error fetching user profile:", error);
        const fallback = getFallbackProfile(currentUser);
        console.log("[AuthContext] fetchProfile error fallback:", fallback);
        setProfile(fallback);
      } else if (!data) {
        console.warn("[AuthContext] No profile record found in public.users. Auto-creating profile...");
        const fallback = getFallbackProfile(currentUser);
        try {
          const { data: newProfile, error: insertError } = await supabase
            .from("users")
            .upsert({
              auth_user_id: userId,
              full_name: fallback.full_name,
              email: fallback.email,
              phone_number: fallback.phone_number,
              role: fallback.role
            }, { onConflict: "email" })
            .select()
            .maybeSingle();

          if (insertError) {
            console.error("[AuthContext] Failed to auto-create profile in database:", insertError.message);
            setProfile(fallback);
          } else {
            console.log("[AuthContext] Auto-created profile successfully:", newProfile);
            setProfile(newProfile || fallback);
          }
        } catch (dbErr) {
          console.error("[AuthContext] Database exception during profile auto-create:", dbErr);
          setProfile(fallback);
        }
      } else {
        console.log("[AuthContext] fetchProfile success:", data);
        setProfile(data);
      }
    } catch (err) {
      console.error("[AuthContext] Fetch profile failed with exception:", err);
      const fallback = getFallbackProfile(currentUser);
      console.log("[AuthContext] fetchProfile exception fallback:", fallback);
      setProfile(fallback);
    }
  };

  useEffect(() => {
    // 1. Get initial session
    const getInitialSession = async () => {
      setLoading(true);
      console.log("[AuthContext] Checking initial session...");
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("[AuthContext] Initial session retrieved:", session ? "Session exists" : "No session");
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id, session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("[AuthContext] Get session failed:", err);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 2. Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[AuthContext] Auth state change event:", event, "User ID:", session?.user?.id);
      setLoading(true);
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
    console.log("[AuthContext] login requested for:", email);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error("[AuthContext] signInWithPassword failed:", error.message);
        throw error;
      }
      console.log("[AuthContext] signInWithPassword succeeded. User:", data?.user?.id);
      if (data?.user) {
        setUser(data.user);
        await fetchProfile(data.user.id, data.user);
      }
      return data;
    } catch (err) {
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    console.log("[AuthContext] logout requested");
    const { error } = await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    if (error) {
      console.error("[AuthContext] signOut failed:", error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      console.log("[AuthContext] refreshProfile requested for:", user.id);
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
