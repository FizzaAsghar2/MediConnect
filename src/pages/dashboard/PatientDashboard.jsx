import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import useProfile from "../../hooks/useProfile";
import DashboardCard from "../../components/dashboard/DashboardCard";
import { supabase } from "../../lib/supabase";
import {
  FaCalendarCheck,
  FaUserMd,
  FaClock,
} from "react-icons/fa";

function PatientDashboard() {
  const { profile, loading } = useProfile("patient");

  const [appointments, setAppointments] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profile?.id) {
      fetchAppointments();
      fetchDoctors();
    }
  }, [profile]);

  async function fetchAppointments() {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("patient_id", profile.id);

    if (error) {
      console.error("Appointments error:", error);
      setError(error.message);
      return;
    }

    setAppointments(data || []);
  }

  async function fetchDoctors() {
    const { count, error } = await supabase
      .from("doctors")
      .select("*", {
        count: "exact",
        head: true,
      });

    if (error) {
      console.error("Doctors count error:", error);
      return;
    }

    setDoctorCount(count || 0);
  }

  if (loading) {
    return (
      <DashboardLayout>
        <h2>Loading patient dashboard...</h2>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <h2>Patient profile not found.</h2>
        <p>
          Your Supabase Auth account exists, but no matching
          record was found in the patients table.
        </p>
      </DashboardLayout>
    );
  }

  const pendingCount = appointments.filter(
    (item) => item.status === "Pending"
  ).length;

  return (
    <DashboardLayout>
      <h1>Welcome, {profile.full_name || "Patient"}</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <div className="dashboard-cards">
        <DashboardCard
          title="Appointments"
          value={appointments.length}
          icon={<FaCalendarCheck />}
        />

        <DashboardCard
          title="Doctors"
          value={doctorCount}
          icon={<FaUserMd />}
        />

        <DashboardCard
          title="Pending"
          value={pendingCount}
          icon={<FaClock />}
        />
      </div>

      <div className="profile-card">
        <p>
          <strong>Email:</strong>{" "}
          {profile.email || "Not available"}
        </p>

        <p>
          <strong>Age:</strong>{" "}
          {profile.age || "Not added"}
        </p>

        <p>
          <strong>Gender:</strong>{" "}
          {profile.gender || "Not added"}
        </p>
      </div>
    </DashboardLayout>
  );
}

export default PatientDashboard;