import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

function Appointments() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  async function fetchAppointments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("appointments")
      .select(
        `
        *,
        doctors(
          full_name,
          specialty
        )
      `
      )
      .eq("patient_id", user.id)
      .order("appointment_date", { ascending: true });

    if (!error) {
      setAppointments(data || []);
    }

    setLoading(false);
  }

  async function cancelAppointment(id) {
    const confirmCancel = window.confirm(
      "Cancel this appointment?"
    );

    if (!confirmCancel) return;

    const { error } = await supabase
      .from("appointments")
      .update({
        status: "Cancelled",
      })
      .eq("id", id);

    if (!error) {
      fetchAppointments();
    }
  }

  return (
    <DashboardLayout>
      <h2>My Appointments</h2>

      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments booked.</p>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="profile-card"
          >
            <h3>
              {appointment.doctors?.full_name ||
                "Doctor"}
            </h3>

            <p>
              <strong>Specialty:</strong>{" "}
              {appointment.doctors?.specialty ||
                "Not Added"}
            </p>

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

            {appointment.status === "Pending" && (
              <button
                className="book-btn"
                style={{
                  background: "#dc3545",
                  marginTop: "15px",
                }}
                onClick={() =>
                  cancelAppointment(
                    appointment.id
                  )
                }
              >
                Cancel Appointment
              </button>
            )}
          </div>
        ))
      )}
    </DashboardLayout>
  );
}

export default Appointments;