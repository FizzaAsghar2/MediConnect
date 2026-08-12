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

  useEffect(() => {
    if (profile) {
      fetchAppointments();
      fetchDoctors();
    }
  }, [profile]);

  async function fetchAppointments() {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("patient_id", profile.id);

    if (!error) {
      setAppointments(data);
    }
  }

  async function fetchDoctors() {
    const { count } = await supabase
      .from("doctors")
      .select("*", { count: "exact", head: true });

    setDoctorCount(count || 0);
  }

  const pendingCount = appointments.filter(
    (item) => item.status === "Pending"
  ).length;

  if (loading) return <h2>Loading...</h2>;

  return (
    <DashboardLayout>
      <h1>Welcome, {profile?.full_name}</h1>

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
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Age:</strong> {profile?.age}</p>
        <p><strong>Gender:</strong> {profile?.gender}</p>
      </div>
    </DashboardLayout>
  );
}

export default PatientDashboard;