import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import useProfile from "../../hooks/useProfile";

function DoctorProfile() {
  const { profile, loading } = useProfile("doctor");

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

    const { error } = await supabase
      .from("doctors")
      .update(formData)
      .eq("id", profile.id);

    if (error) {
      alert(error.message);
    } else {
      alert("Profile Updated Successfully!");
    }
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
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
          />

          <input
            className="search-input"
            type="text"
            name="specialty"
            placeholder="Specialty"
            value={formData.specialty}
            onChange={handleChange}
          />

          <input
            className="search-input"
            type="text"
            name="experience"
            placeholder="Experience"
            value={formData.experience}
            onChange={handleChange}
          />

          <input
            className="search-input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />

          <button className="book-btn" type="submit">
            Save Changes
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default DoctorProfile;