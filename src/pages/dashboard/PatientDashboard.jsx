import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import useProfile from "../../hooks/useProfile";
import { supabase } from "../../supabaseClient";

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
    const { data } = await supabase
      .from("appointments")
      .select(
        `
        *,
        doctors (
          full_name
        )
      `
      )
      .eq("patient_id", profile.id)
      .order("appointment_date", { ascending: true });

    if (data) {
      setAppointments(data);
    }
  }

  async function fetchDoctors() {
    const { count } = await supabase
      .from("doctors")
      .select("*", { count: "exact", head: true });

    setDoctorCount(count || 0);
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
          value={appointments.filter((a) => a.status === "Pending").length}
          icon={<FaClock />}
        />
      </div>

      <div className="profile-card">
        <h3>Profile Information</h3>

        <p><strong>Name:</strong> {profile?.full_name}</p>
        <p><strong>Email:</strong> {profile?.email}</p>
        <p><strong>Age:</strong> {profile?.age}</p>
        <p><strong>Gender:</strong> {profile?.gender}</p>
      </div>

      <div className="profile-card">
        <h3>My Appointments</h3>

        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table className="appointment-table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>
                    {appointment.doctors?.full_name || "Unknown Doctor"}
                  </td>

                  <td>{appointment.appointment_date}</td>

                  <td>{appointment.appointment_time}</td>

                  <td>
                    <span
                      className={`status ${appointment.status.toLowerCase()}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

export default PatientDashboard;