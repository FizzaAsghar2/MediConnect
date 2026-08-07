
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardCard from "../components/dashboard/DashboardCard";
import useProfile from "../hooks/useProfile";

import {
  FaCalendarCheck,
  FaUserInjured,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

function DoctorDashboard() {
  const { profile, loading } = useProfile("doctor");
  const navigate = useNavigate();

  const [appointmentCount, setAppointmentCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [patientCount, setPatientCount] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    if (profile) {
      fetchDashboard();
    }
  }, [profile]);

  async function fetchDashboard() {
    const today = new Date().toISOString().split("T")[0];

    const { count: appointments } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", profile.id);

    const { count: pending } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", profile.id)
      .eq("status", "Pending");

    const { count: approved } = await supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .eq("doctor_id", profile.id)
      .eq("status", "Approved");

    const { data: patients } = await supabase
      .from("appointments")
      .select("patient_id")
      .eq("doctor_id", profile.id);

    const { data: todayData } = await supabase
      .from("appointments")
      .select(`
        *,
        patients(full_name)
      `)
      .eq("doctor_id", profile.id)
      .eq("appointment_date", today)
      .order("appointment_time");

    if (patients) {
      const uniquePatients = [
        ...new Set(patients.map((p) => p.patient_id)),
      ];

      setPatientCount(uniquePatients.length);
    }

    setAppointmentCount(appointments || 0);
    setPendingCount(pending || 0);
    setApprovedCount(approved || 0);
    setTodayAppointments(todayData || []);
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
      <h2>Welcome, Dr. {profile?.full_name}</h2>

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

        <DashboardCard
          title="Approved"
          value={approvedCount}
          icon={<FaCheckCircle />}
        />
      </div>

      <div className="profile-card">
        <h3>Profile Information</h3>

        <p><strong>Name:</strong> {profile?.full_name}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Specialty:</strong> {profile?.specialty}</p>

        <p>
          <strong>Availability:</strong>{" "}
          {profile?.availability ? "Available" : "Unavailable"}
        </p>

        <button
          className="book-btn"
          onClick={() => navigate("/doctor/profile")}
        >
          Edit Profile
        </button>
      </div>

      <div className="profile-card">
        <h3>Today's Appointments</h3>

        {todayAppointments.length === 0 ? (
          <p>No appointments scheduled for today.</p>
        ) : (
          todayAppointments.map((appointment) => (
            <div
              key={appointment.id}
              style={{
                padding: "12px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <p>
                <strong>Patient:</strong>{" "}
                {appointment.patients?.full_name}
              </p>

              <p>
                <strong>Time:</strong>{" "}
                {appointment.appointment_time}
              </p>

              <span
                className={`status ${appointment.status.toLowerCase()}`}
              >
                {appointment.status}
              </span>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

export default DoctorDashboard;

