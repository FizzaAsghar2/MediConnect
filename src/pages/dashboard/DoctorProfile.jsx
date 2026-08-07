import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
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
    availability: true,
    available_days: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        specialty: profile.specialty || "",
        experience: profile.experience || "",
        email: profile.email || "",
        availability:
          profile.availability === null
            ? true
            : profile.availability,
        available_days: profile.available_days || "",
        start_time: profile.start_time || "",
        end_time: profile.end_time || "",
      });
    }
  }, [profile]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    const { error } = await supabase
      .from("doctors")
      .update({
        full_name: formData.full_name,
        specialty: formData.specialty,
        experience: formData.experience,
        email: formData.email,
        availability: formData.availability,
        available_days: formData.available_days,
        start_time: formData.start_time,
        end_time: formData.end_time,
      })
      .eq("id", profile.id);

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile & Availability Updated Successfully!");
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
        <h3>Edit Profile</h3>

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

          <hr style={{ margin: "25px 0" }} />

          <h3>Availability Settings</h3>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
            />
            Available for Appointments
          </label>

          <input
            className="search-input"
            type="text"
            name="available_days"
            value={formData.available_days}
            onChange={handleChange}
            placeholder="Example: Monday,Tuesday,Wednesday"
          />

          <label>Start Time</label>

          <input
            className="search-input"
            type="time"
            name="start_time"
            value={formData.start_time}
            onChange={handleChange}
          />

          <label>End Time</label>

          <input
            className="search-input"
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleChange}
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