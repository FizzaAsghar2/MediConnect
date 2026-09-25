import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (currentUser) => {
    if (!currentUser) {
      setProfile(null);
      setRole(null);
      return null;
    }

    const { data: doctor } = await supabase
      .from("doctors")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (doctor) {
      setProfile(doctor);
      setRole("doctor");

      return {
        profile: doctor,
        role: "doctor",
      };
    }

    const { data: patient } = await supabase
      .from("patients")
      .select("*")
      .eq("id", currentUser.id)
      .maybeSingle();

    if (patient) {
      setProfile(patient);
      setRole("patient");

      return {
        profile: patient,
        role: "patient",
      };
    }

    // Recover profiles for accounts created before the database trigger was applied.
    const metadataRole = currentUser.user_metadata?.role;
    const profileTable = metadataRole === "doctor" ? "doctors" : "patients";
    const profileValues = metadataRole === "doctor"
      ? {
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || "",
          email: currentUser.email || "",
          specialty: currentUser.user_metadata?.specialty || "General Physician",
        }
      : {
          id: currentUser.id,
          full_name: currentUser.user_metadata?.full_name || "",
          email: currentUser.email || "",
        };

    const { data: recoveredProfile, error: recoveryError } = await supabase
      .from(profileTable)
      .upsert(profileValues, { onConflict: "id" })
      .select()
      .single();

    if (!recoveryError && recoveredProfile) {
      setProfile(recoveredProfile);
      setRole(profileTable === "doctors" ? "doctor" : "patient");

      return {
        profile: recoveredProfile,
        role: profileTable === "doctors" ? "doctor" : "patient",
      };
    }

    setProfile(null);
    setRole(null);

    return null;
  };

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        await fetchUserProfile(currentUser);
      }

      setLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        (async () => {
          await fetchUserProfile(currentUser);
          setLoading(false);
        })();
      } else {
        setProfile(null);
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role,
        loading,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
