import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

function useProfile(role) {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [user, role]);

  async function fetchProfile() {
    setLoading(true);

    const table = role === "doctor" ? "doctors" : "patients";

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Profile fetch error:", error);
      setProfile(null);
    } else {
      setProfile(data);
    }

    setLoading(false);
  }

  return {
    profile,
    loading,
    refreshProfile: fetchProfile,
  };
}

export default useProfile;