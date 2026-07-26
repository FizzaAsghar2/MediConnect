import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

function Appointments() {
  const { user } = useAuth();

  const [appointments, setAppointments] =
    useState([]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  async function fetchAppointments() {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("patient_id", user.id);

    if (!error) {
      setAppointments(data);
    }
  }

  return (
    <DashboardLayout>
      <h2>My Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments booked.</p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="profile-card"
          >
            <p>
              <strong>Date:</strong>{" "}
              {appointment.appointment_date}
            </p>

            <p>
              <strong>Time:</strong>{" "}
              {appointment.appointment_time}
            </p>

  <p>
  <strong>Status:</strong>{" "}
  <span
    className={`status ${appointment.status.toLowerCase()}`}
  >
    {appointment.status}
  </span>
</p>
          </div>
        ))
      )}
    </DashboardLayout>
  );
}

export default Appointments;