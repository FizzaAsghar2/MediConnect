
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import useProfile from "../../hooks/useProfile";
import { supabase } from "../../lib/supabase";

import {
  FaCalendarCheck,
  FaUserMd,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

function PatientDashboard() {
  const { profile, loading } = useProfile("patient");

  const [appointments, setAppointments] = useState([]);
  const [doctorCount, setDoctorCount] = useState(0);
  const [nextAppointment, setNextAppointment] = useState(null);

  useEffect(() => {
    if (profile) {
      fetchAppointments();
      fetchDoctors();
    }
  }, [profile]);

  async function fetchAppointments() {
    const { data } = await supabase
      .from("appointments")
      .select(`
        *,
        doctors(
          full_name,
          specialty
        )
      `)
      .eq("patient_id", profile.id)
      .order("appointment_date", { ascending: true });

    if (data) {
      setAppointments(data);

      const upcoming = data.find(
        (item) =>
          item.status !== "Cancelled"
      );

      setNextAppointment(upcoming || null);
    }
  }

  async function fetchDoctors() {
    const { count } = await supabase
      .from("doctors")
      .select("*", {
        count: "exact",
        head: true,
      });

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
      <h2>
        Welcome, {profile?.full_name}
      </h2>

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
          value={
            appointments.filter(
              (a) => a.status === "Pending"
            ).length
          }
          icon={<FaClock />}
        />

        <DashboardCard
          title="Approved"
          value={
            appointments.filter(
              (a) => a.status === "Approved"
            ).length
          }
          icon={<FaCheckCircle />}
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
        <h3>Next Appointment</h3>

        {nextAppointment ? (
          <>
            <p>
              <strong>Doctor:</strong>{" "}
              {nextAppointment.doctors?.full_name}
            </p>

            <p>
              <strong>Specialty:</strong>{" "}
              {nextAppointment.doctors?.specialty}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {nextAppointment.appointment_date}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {nextAppointment.appointment_time}
            </p>

            <span
              className={`status ${nextAppointment.status.toLowerCase()}`}
            >
              {nextAppointment.status}
            </span>
          </>
        ) : (
          <p>No upcoming appointments.</p>
        )}
      </div>

      <div className="profile-card">
        <h3>Recent Appointments</h3>

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
                    {appointment.doctors?.full_name}
                  </td>

                  <td>
                    {appointment.appointment_date}
                  </td>

                  <td>
                    {appointment.appointment_time}
                  </td>

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
