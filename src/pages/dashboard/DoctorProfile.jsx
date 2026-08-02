import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import useProfile from "../../hooks/useProfile";

function DoctorProfile() {
  const { profile, loading } = useProfile("doctor");

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    specialty: "",
    experience: "",
    email: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        specialty: profile.specialty || "",
        experience: profile.experience || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
  e.preventDefault();

  console.log("Profile:", profile);
  console.log("FormData:", formData);

  setSaving(true);

  const { data, error } = await supabase
    .from("doctors")
    .update({
      full_name: formData.full_name,
      specialty: formData.specialty,
      experience: formData.experience,
      email: formData.email,
    })
    .eq("id", profile.id)
    .select();

  setSaving(false);

  console.log("Updated Data:", data);
  console.log("Error:", error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Profile Updated Successfully!");
}

  if (loading) {
    return (
      <DashboardLayout>
        <h2>Loading...</h2>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="profile-card">
        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Full Name"
          />

          <input
            className="search-input"
            type="text"
            name="specialty"
            value={formData.specialty}
            onChange={handleChange}
            placeholder="Specialty"
          />

          <input
            className="search-input"
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Experience"
          />

          <input
            className="search-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />

          <button
            className="book-btn"
            type="submit"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default DoctorProfile;