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
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);

      if (currentUser) {
        await fetchUserProfile(currentUser);
      } else {
        setProfile(null);
        setRole(null);
      }

      setLoading(false);
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