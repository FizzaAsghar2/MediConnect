import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import useProfile from "../../hooks/useProfile";

import {
  FaCalendarCheck,
  FaUserInjured,
  FaClock,
} from "react-icons/fa";

function DoctorDashboard() {
  const { profile, loading } = useProfile("doctor");

  const [appointmentCount, setAppointmentCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);

  useEffect(() => {
    if (profile) {
      fetchCounts();
    }
  }, [profile]);

  async function fetchCounts() {
    // Total appointments
    const { count: appointments } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", profile.id);

    // Pending appointments
    const { count: pending } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", profile.id)
      .eq("status", "Pending");

    // Unique patients
    const { data: patientData } = await supabase
      .from("appointments")
      .select("patient_id")
      .eq("doctor_id", profile.id);

    if (patientData) {
      const uniquePatients = [
        ...new Set(patientData.map((item) => item.patient_id)),
      ];

      setPatientCount(uniquePatients.length);
    }

    setAppointmentCount(appointments || 0);
    setPendingCount(pending || 0);
  }

  if (loading) {
    return (
      <DashboardLayout>
        <h2>Loading Dashboard...</h2>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1>Welcome, Dr. {profile?.full_name}</h1>

      <div className="dashboard-cards">
        <DashboardCard
          title="Appointments"
          value={appointmentCount}
          icon={<FaCalendarCheck />}
        />

        <DashboardCard
          title="Patients"
          value={patientCount}
          icon={<FaUserInjured />}
        />

        <DashboardCard
          title="Pending"
          value={pendingCount}
          icon={<FaClock />}
        />
      </div>

      <div className="profile-card">
        <h3>Profile Information</h3>

        <p><strong>Name:</strong> {profile?.full_name}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Specialty:</strong> {profile?.specialty}</p>
      </div>
    </DashboardLayout>
  );
}

export default DoctorDashboard;